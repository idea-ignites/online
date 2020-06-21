import { StatsAggregator } from "../analytics/statsAggregator";
import { CollectorServer } from "./collectors";

export class OnlinesInfoServer extends CollectorServer {

    public getName() {
        return "onlinesInfo";
    }

    public registerRoutes(app: any) {
        app.get('/onlinesInfo', (req, res) => this.onlinesInfoHandler(req, res));
    }

    private async onlinesInfoHandler(req, res) {
        console.log("received incoming request for /onlinesInfo ");
        let statsAggregator = new StatsAggregator();
        console.log("waiting");
        let data = await statsAggregator.getData();
        console.log("computed");
        console.log(data);
        res.json(data);
    }
    
}
