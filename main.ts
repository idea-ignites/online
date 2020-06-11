import { HeartbeatsDataCollectorServer } from "./heartbeats/heartbeatsDataCollectorServer";
import { IdentitiesLogsDataCollectorServer } from "./identities/identitiesLogsDataCollectorServer";
import { OnlinesInfoServer } from "./data/onlinesInfoServer";

class OnlineServices {

    public start() {
        let heartbeats = new HeartbeatsDataCollectorServer();
        let identities = new IdentitiesLogsDataCollectorServer();
        let onlinesInfo = new OnlinesInfoServer();
        let socketsDirectory = __dirname + "/sockets";

        heartbeats.listen(socketsDirectory+"/heartbeats.socket");
        identities.listen(socketsDirectory+"/identities.socket");
        onlinesInfo.listen(socketsDirectory+"/onlinesInfo.socket");
    }
}

let services = new OnlineServices();
services.start();