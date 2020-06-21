import { StatsAggregator } from "../analytics/statsAggregator";
import { CollectorServer } from "./collectors";
const bodyParser = require('body-parser');

export class OnlinesInfoServer extends CollectorServer {

    public getName() {
        return "onlinesInfo";
    }

    public registerRoutes(app: any) {

        app.use(
            bodyParser.json({
                type: "application/json"
            })
        );

        app.get('/onlinesInfo', (req, res) => this.onlinesInfoHandler(req, res));
    }

    private async onlinesInfoHandler(req, res) {
        let statsAggregator = new StatsAggregator();
        let data = await statsAggregator.getData();
        res.json(data);
    }
    
}
