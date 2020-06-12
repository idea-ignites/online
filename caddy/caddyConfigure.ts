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
        this.configureHTTPS();
    }

    private configureHTTPS() {
        let onlineServicesServerName = process.env.ONLINE_SERVICES_SERVER_NAME || '';
        if (onlineServicesServerName) {
            console.log(`Found server name: ${onlineServicesServerName}, enabling https...`);
            let configure = this.getLocalConfigure();
            configure.apps.http.servers.onlineServices.listen.push(":443");
            configure.apps.http.servers.onlineServices.routes[0].match = [{"host":[onlineServicesServerName]}];
            let webRoot = process.env.ONLINE_SERVICES_SERVER_WEBROOT || __dirname + "/../frontend/";
            configure.apps.http.servers.onlineServices.routes[0].handle[0].root = webRoot;

            this.setLocalConfigure(configure);
        }
    }

    private registerEventHandlers() {
        let eventEmitter = new EventEmitter();
        this.eventEmitter = eventEmitter;
        this.eventEmitter.on('localConfiguresUpdated', () => this.onLocalConfiguresUpdated());
    }

    private onLocalConfiguresUpdated() {
        console.log("Noticed that local configures were updated, so upload it to caddy server...");
        this.uploadLocalConfigureToCaddy();
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
        let config = this.getLocalConfigure();
        console.log(`Posting configure: ${JSON.stringify(config)}`);
        let response = await instance.post("/load", this.getLocalConfigure()).catch(error => console.log(error));
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
        console.log('Configures updated.');
        this.emitEventWithGuarantee('localConfiguresUpdated', 4);
    }

    private emitEvent(event: string) {
        return new Promise((resolve, reject) => {
            console.log(`Emitting event: ${event}`);
            let result = this.eventEmitter.emit(event);
            if (result) { 
                resolve(result);
                console.log(`${event}: emitted.`);
            }
            else {
                reject(result);
                console.log(`${event}: no event handler found, will try later.`);
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
