import { HeartbeatsDataCollectorServer } from "./collectors/heartbeatsDataCollectorServer";
import { IdentitiesLogsDataCollectorServer } from "./collectors/identitiesLogsDataCollectorServer";
import { OnlinesInfoServer } from "./analytics/onlinesInfoServer";

class OnlineServices {

    private backends: Array<any>;

    constructor() {
        this.instantiate();
    }

    private instantiate() {
        this.backends = [
            new HeartbeatsDataCollectorServer(),
            // new IdentitiesLogsDataCollectorServer(),
            // new OnlinesInfoServer()
        ];
    }

    private getBackends() {
        return this.backends;
    }

    private async launchBackends() {

        let backends = this.getBackends();

        for (let backend of backends) {
            let name = backend.getName();
            console.log(`Starting service: ${name}`);
            let result = await backend.start();
            if (! result) {
                console.log(`service: ${name} failed to start, exitting now...`);
                process.exit(1);
            }
            console.log(`service: ${name} is started.`);
        }
    }

    public async start() {
        console.log('Starting backends...');
        await this.launchBackends();
        console.log('All backends started.');
    }
}

let services = new OnlineServices();
services.start();   
   
   
       
    
  
    
 
    
    
