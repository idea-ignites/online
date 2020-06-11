const fs = require('fs');
const { spawn } = require('child_process');
import axios from "axios";

export class CaddyConfigure {

    private localCaddyConfigure = null;
    private addReverseProxyRuleIsOccupied = false;
    private caddyAPIEndPoint = "http://127.0.0.1:2019";
    private synchronizingPeriod = 10;

    constructor() {
        this.ifCaddyisNotStartedYetThenTryStartIt();
        this.synchronizeLocalConfigureToCaddy(this.synchronizingPeriod);
    }

    public caddyStart() {
        let caddyProcess = spawn('caddy', ['start'], {'detached': true, 'stdio': 'ignore'});
    }

    public caddyStop() {
        let caddyProcess = spawn('caddy', ['stop'], {'detached': true, 'stdio': 'ignore'});
    }

    private setConfigureSynchronizingPeriod(seconds: number) {
        this.synchronizingPeriod = seconds;
    }

    private synchronizeLocalConfigureToCaddy(periodSeconds: number) {
        return this.waitingPromise(periodSeconds).then(resolvedAt => {
            console.log("Start synchronizing configures...");
            this.uploadLocalConfigureToCaddy().catch(error => console.log(error));
            this.synchronizeLocalConfigureToCaddy(periodSeconds);
        });
    }

    private waitingPromise(seconds: number) {
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => resolve(Date.now()), seconds*1000);
            }
        );
    }

    public async isCaddyStarted() {
        /**
         * we can also infer this from processes list,
         * but the http way is less coherent to operating system
         */
        let instance = this.getAxiosInstance();
        let response = await instance.get("/config/").then(response => {
            return (response.status >= 100 && response.status < 300);
        }).catch(error => false);
        return response;
    }

    public async ifCaddyisNotStartedYetThenTryStartIt() {
        let isCaddyStarted = await this.isCaddyStarted();
        if (isCaddyStarted) {
            console.log("Caddy is started.");
        }
        else {
            console.log("Seems that caddy is not started yet, so we are trying to start it...");
            this.caddyStart();

            let justNow = Date.now();
            let timeToWait = 4000;
            while (Date.now() < (justNow + timeToWait)) {
                // wait
            }

            this.ifCaddyisNotStartedYetThenTryStartIt();
        }
    }

    public setCaddyApiEndPoint(apiEndPoint: string) {
        this.caddyAPIEndPoint = apiEndPoint;
    }

    private getAxiosInstance() {
        let instance = axios.create({
            "baseURL": this.caddyAPIEndPoint,
            "headers": { "Content-Type": "application/json" }
        });

        return instance;
    }

    public async uploadLocalConfigureToCaddy() {
        let instance = this.getAxiosInstance();
        let response = await instance.post("/load", this.getLocalConfigure());
        return response;
    }

    public async downloadCaddyConfigureToLocal() {
        let instance = this.getAxiosInstance();
        let response = await instance.get("/config/").then(caddyResponse => {
            this.loadConfigureFromDisk = caddyResponse.data;
            return caddyResponse.data;
        });
        return response;
    }

    public getLocalConfigure() {
        if (! this.localCaddyConfigure) {
            this.localCaddyConfigure = this.loadConfigureFromDisk("default");
        }

        return this.localCaddyConfigure;
    }

    private getTemplate(templateName: string) {
        try {
            const data = fs.readFileSync(__dirname + "/caddyConfigureTemplates" + "/" + templateName + ".json", "utf8");
            return JSON.parse(data);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    private loadConfigureFromDisk(templateName: string) {
        return this.getTemplate(templateName);
    }

    public async addReverseProxyRule(from: Array<string>, to: string) {
        console.log(`Try to add route ${from} => ${to} ...`);

        let routeObject = this.reverseProxyRoute(from, to);

        let localCaddyConfigure = this.getLocalConfigure();
        localCaddyConfigure.apps.http.servers.onlineServices.routes.push(routeObject);
        this.localCaddyConfigure = localCaddyConfigure;

        console.log("Route added.");
    }

    private reverseProxyRoute(from: Array<string>, to: string) {
        let routeTemplate = this.loadConfigureFromDisk("reverseProxyRoute");
        if (! routeTemplate) {
            return;
        }

        routeTemplate.match = from.map(
            sourceItem => {
                return {"path": [sourceItem]}
            }
        );

        routeTemplate.handle[0].upstreams[0].dial = to;

        return routeTemplate;
    }
}
