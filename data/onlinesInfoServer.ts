import { OnlinesStats } from "./onlinesInfoStats";

const express = require('express');
const bodyParser = require('body-parser');

export class OnlinesInfoServer {

    private app: any;
    private resources: any;

    constructor () {
        this.initialize();
    }

    public getName() {
        return "onlinesInfo";
    }

    public resourcesClaim() {
        return this.resources;
    }

    private initialize() {
        const app = express();
        this.useMiddlewares(app);
        this.registerRoutes(app);
        this.app = app;
    }
    
    private useMiddlewares(app: any) {
        app.use(
            bodyParser.json({
                type: "application/json"
            })
        );
    }

    public listen(path) {
        console.log(`listen ${path}`);
        this.app.listen(path, () => this.onServerStarted(path));
    }

    private onServerStarted(path) {
        console.log(`Server started at ${path}`);
    }

    private registerRoutes(app: any) {
        this.resources = ["/onlinesInfo"];

        app.get('/onlinesInfo', (req, res) => this.onlinesInfoHandler(req, res));
        this.useMiddlewaresForPath('/onlinesInfo', app, this.setContentTypeJSON);
        this.useMiddlewaresForPath('/onlinesInfo', app, this.setStatusCodeOK);
    }

    private useMiddlewaresForPath(path, app, middleWare) {
        app.use(path, middleWare);
    }

    private setContentTypeJSON(req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        next();
    }

    private setStatusCodeOK(req, res, next) {
        res.statusCode = 200;
        next();
    }

    private async onlinesInfoHandler(req, res) {
        let result = {};
        let stats = new OnlinesStats();
        let statsName = stats.getStatsName();
        let statsData = await stats.getStatsData().catch(error => console.log(error));

        result[statsName] = statsData;
        res.json(result);
    }
    
}
