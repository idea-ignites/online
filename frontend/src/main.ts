import { Heartbeats } from "./heartbeats";
import { Identities } from "./identities";

class OnlineServicesFrontendEntry {
    onLoaded(event) {
        let identitiesHandler = new Identities();
        let heartbeatsHandler = new Heartbeats();
    
        identitiesHandler.identityCheck();
        heartbeatsHandler.transmittingHeartbeats();
    }
}

let entry = new OnlineServicesFrontendEntry();
window.addEventListener("load", event => entry.onLoaded(event));