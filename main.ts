import { HeartbeatsDataCollectorServer } from "./servers/collectors";
import { IdentitiesLogsDataCollectorServer } from "./servers/collectors";
import { OnlinesInfoServer } from "./servers/onlinesInfoServer";
    
let heartbeats = new HeartbeatsDataCollectorServer();
let identities = new IdentitiesLogsDataCollectorServer();
let onlines = new OnlinesInfoServer();

heartbeats.listen(3386);
identities.listen(3387);
onlines.listen(3388);
