const fs = require('fs');
const { spawn } = require('child_process');
const EventEmitter = require('events');
import axios from "axios";

export class CaddyConfigure {

    private localCaddyConfigure = null;
    private caddyAPIEndPoint = "http://127.0.0.1:2019";
    private eventEmitter: any;

    constructor() {
        this.registerEventHandlers();
        this.ifCaddyisNotStartedYetThenTryStartIt();
    }

    private registerEventHandlers() {
        let eventEmitter = new EventEmitter();
        this.eventEmitter = eventEmitter;
        eventEmitter.on('caddyStarted', () => this.onCaddyStarted());
    }

    private onCaddyStarted() {
        console.log('Caddy is started.');
        this.eventEmitter.on('localConfiguresUpdated', () => this.onLocalConfiguresUpdated());
    }

    private onLocalConfiguresUpdated() {
        console.log("Noticed that local configures were updated, so upload it to caddy server...");
        this.uploadLocalConfigureToCaddy();
    }

    public caddyStart() {
        let caddyProcess = spawn('caddy', ['start'], {'detached': true, 'stdio': 'ignore'});
    }

    public caddyStop() {
        let caddyProcess = spawn('caddy', ['stop'], {'detached': true, 'stdio': 'ignore'});
    }

    public async isCaddyStarted() {
        /**
         * we can also infer this from processes list,
         * but the http way is less coherent to operating system
         */
        let instance = this.getAxiosInstance();
        let response = await instance.get("/config/").then(response => {
            let isStarted = (response.status >= 100 && response.status < 300); 
            if (isStarted) {
                return true;
            }
            else {
                return Promise.reject(false);
            }
        }).catch(error => false);
        return response;
    }

    public async ifCaddyisNotStartedYetThenTryStartIt() {
        this.isCaddyStarted().then(isStarted => {
            this.emitEventWithGuarantee('caddyStarted', 4000);
        }).catch(notStartedYet => {
            this.caddyStart();
            this.ifCaddyisNotStartedYetThenTryStartIt();
        });
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
            this.setLocalConfigure(this.loadConfigureFromDisk("default"));
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
        this.setLocalConfigure(localCaddyConfigure);

        console.log("Route added.");
    }

    private setLocalConfigure(configure: any) {
        this.localCaddyConfigure = configure;
        this.emitEventWithGuarantee('localConfiguresUpdated', 4000);
    }

    private emitEvent(event: string) {
        return new Promise((resolve, reject) => {
            let result = this.eventEmitter.emit(event);
            if (result) {
                resolve(result);
            }
            else {
                reject(result);
            }
        })
    }

    private emitEventWithGuarantee(event: string, retryAfterSeconds: number) {
        this.emitEvent(event).catch(rejected => {
            setTimeout(
                () => this.emitEventWithGuarantee(event, retryAfterSeconds), 
                retryAfterSeconds*1000
            );
        });
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
