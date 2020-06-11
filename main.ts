import { HeartbeatsDataCollectorServer } from "./heartbeats/heartbeatsDataCollectorServer";
import { IdentitiesLogsDataCollectorServer } from "./identities/identitiesLogsDataCollectorServer";
import { OnlinesInfoServer } from "./data/onlinesInfoServer";
import { CaddyConfigure } from "./caddy/caddyConfigure";

class OnlineServices {

    private routingTable: any;

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
        let caddyConfigurer = new CaddyConfigure();
        let table = this.routingTable;
        for (let item of table) {
            caddyConfigurer.addReverseProxyRule(item.from, item.to);
        }
    }

    private launchBackends() {
        let socketsDirectory = __dirname + "/sockets";

        let backends = this.backends();
        for (let backend of backends) {
            let name = backend.getName();
            let listenPath = socketsDirectory + "/" + name + ".socket";
            backend.listen(listenPath);

            this.routingTable.push({
                "from": backend.resourcesClaim(),
                "to": listenPath
            });
        }
    }

    public start() {
        this.launchBackends();
        this.configureCaddy();
    }
}

let services = new OnlineServices();
services.start();