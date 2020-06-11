const fs = require('fs');
import axios from "axios";

export class CaddyConfigure {

    private localCaddyConfigure: any;

    private getAxiosInstance() {
        let instance = axios.create({
            "baseURL": "http://localhost:2019",
            "headers": { "Content-Type": "application/json" }
        });

        return axios;
    }

    public async uploadLocalConfigureToCaddy() {
        let instance = this.getAxiosInstance();
        let response = await instance.post("/load", this.localCaddyConfigure);
        return response;
    }

    public async downloadCaddyConfigureToLocal() {
        let instance = this.getAxiosInstance();
        let response = await instance.get("/config").then(caddyResponse => {
            this.loadConfigureFromDisk = caddyResponse.data;
            return caddyResponse.data;
        });
        return response;
    }

    public getLocalConfigure() {
        return this.localCaddyConfigure();
    }

    private getTemplate(templateName: string) {
        try {
            const data = fs.readFileSync(__dirname + "/caddyConfigureTemplates" + "/" + templateName + ".json", "utf8");
            return JSON.parse(data);
        } catch (err) {
            console.log(err);
        }
    }

    private loadConfigureFromDisk(templateName: string) {
        this.localCaddyConfigure = this.getTemplate(templateName);
    }

    public addReverseProxyRule(ruleItem) {
        let from = ruleItem.from;
        let to = ruleItem.to;
    }

    private reverseProxyRoute(from: Array<string>, to: string) {
        // let caddyTemplate = this.getCaddyTemplate();
        // let routeTemplate = caddyTemplate.apps.http.servers[0].routes[0];

        // routeTemplate.match = from.map(
            // sourceItem => {
                // return {"path": [sourceItem]}
            // }
        // );

        // routeTemplate.handle[0].upstreams[0].dial = to;

        // return routeTemplate;
    }
}

// let caddyConfigurer = new CaddyConfigure();
// console.log(JSON.stringify(caddyConfigurer.getCaddyTemplate()));