import { HeartbeatsDataCollectorServer } from "./heartbeats/heartbeatsDataCollectorServer";
import { IdentitiesLogsDataCollectorServer } from "./identities/identitiesLogsDataCollectorServer";

class OnlineServices {

    public start() {
        let heartbeats = new HeartbeatsDataCollectorServer();
        let identities = new IdentitiesLogsDataCollectorServer();

        
    }
}