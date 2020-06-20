import { HeartbeatsDataCollectorServer } from "./servers/collectors";
import { IdentitiesLogsDataCollectorServer } from "./servers/collectors";
import { OnlinesInfoServer } from "./servers/onlinesInfoServer";
    
let heartbeats = new HeartbeatsDataCollectorServer();
let identities = new IdentitiesLogsDataCollectorServer();
let onlines = new OnlinesInfoServer();

let socketDir = "sockets/";
let socketPathPrefix = __dirname + "/" + socketDir;

heartbeats.listen(`${socketPathPrefix}${heartbeats.getName}.socket`);
identities.listen(`${socketPathPrefix}${identities.getName}.socket`);
onlines.listen(`${socketPathPrefix}${onlines.getName}.socket`);
