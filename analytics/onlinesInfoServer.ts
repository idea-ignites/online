import { StatsAggregator } from "./statsAggregator";

const express = require('express');
const bodyParser = require('body-parser');

export class OnlinesInfoServer {

    private app: any;

    constructor () {
        const app = express();
        this.registerRoutes(app);
        this.app = app;
    }

    public getName() {
        return "onlinesInfo";
    }

    public listen(path) {
        this.app.listen(path, () => this.onServerStarted(path));
    }

    private onServerStarted(path) {
        console.log(`${this.getName()} started at ${path}`);
    }

    private registerRoutes(app: any) {

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
