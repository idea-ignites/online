import { HeartbeatsDataCollectorServer } from "./heartbeats/heartbeatsDataCollectorServer";
import { IdentitiesLogsDataCollectorServer } from "./identities/identitiesLogsDataCollectorServer";

class OnlineServices {

    public start() {
        let heartbeats = new HeartbeatsDataCollectorServer();
        let identities = new IdentitiesLogsDataCollectorServer();
        let socketsDirectory = __dirname + "/sockets";

        heartbeats.listen(socketsDirectory+"/heartbeats.socket");
        identities.listen(socketsDirectory+"/identities.socket");
    }
}

let services = new OnlineServices();
services.start();