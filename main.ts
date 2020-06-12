import { HeartbeatsDataCollectorServer } from "./heartbeats/heartbeatsDataCollectorServer";
import { IdentitiesLogsDataCollectorServer } from "./identities/identitiesLogsDataCollectorServer";
import { OnlinesInfoServer } from "./data/onlinesInfoServer";
import { CaddyConfigure } from "./caddy/caddyConfigure";
const fs = require("fs");

class OnlineServices {

    private routingTable: Array<any>;

    constructor() {
        this.routingTable = [];
    }

    private backends() {
        let heartbeats = new HeartbeatsDataCollectorServer();
        let identities = new IdentitiesLogsDataCollectorServer();
        let onlinesInfo = new OnlinesInfoServer();

        return [
            heartbeats,
            identities,
            onlinesInfo
        ];
    }

    private configureCaddy() {
        console.log("Starting to configure caddy...");
        let caddyConfigurer = new CaddyConfigure();
        let table = this.routingTable;
        for (let item of table) {
            console.log(`Append route: from ${item.from} to ${item.to}`);
            caddyConfigurer.addReverseProxyRule(item.from, item.to);
        }
        console.log("Caddy is now configured.");
    }

    private launchBackends() {
        console.log("Start launching backends...");
        let socketsDirectory = __dirname + "/sockets";
        console.log(`Set sockets directory ${socketsDirectory}`);

        let fileNames = [];
        try {
            fileNames = fs.readdirSync(socketsDirectory, {encoding: "utf8"});
        }
        catch (err) {
            console.log(err);
        }

        let backends = this.backends();
        for (let backend of backends) {
            let name = backend.getName();

            console.log(`Appending backend: ${name}`);

            let listenPath = socketsDirectory + "/" + name + ".socket";
            if (fileNames.indexOf(name + ".socket") !== -1) {
                console.log(`deleting ${listenPath}`);
                fs.unlinkSync(listenPath);
            }

            backend.listen(listenPath);

            this.routingTable.push({
                "from": backend.resourcesClaim(),
                "to": "unix/" + listenPath
            });
        }

        console.log("Backends are all successfully launched.");
        console.log(`Routing table ${JSON.stringify(this.routingTable)}`);
    }

    public start() {
        console.log("Starting...");
        this.launchBackends();
        this.configureCaddy();
    }
}

let services = new OnlineServices();
services.start();