import { DataServices } from "./dataServices";

const express = require('express');
const bodyParser = require('body-parser');

class MainServer {

    constructor () {
        this.initialize();
    }

    private initialize() {
        const app = express();
        this.useMiddlewares(app);
        this.registerRoutes(app);
        this.listenOnPortForIncomingMessages(app);
    }
    
    private useMiddlewares(app: any) {
        app.use(
            bodyParser.json({
                type: "application/json"
            })
        );
    }

    private listenOnPortForIncomingMessages(app: any) {
        const port = 23982;
        app.listen(port, () => this.onServerStarted(port));
    }

    private onServerStarted(port: number) {
        console.log(`Server started at port ${port}`);
    }

    private registerRoutes(app: any) {
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
        let ds = new DataServices();
        let statsData = await this.getStats(ds).catch(error => console.log(error));
        res.json(statsData);
    }

    private async getStats(dataServices) {
        let last24Hours = await dataServices.howManyPeopleOnlineWithin(60*60*24);
        let last12Hours = await dataServices.howManyPeopleOnlineWithin(60*60*12);
        let last1Hour = await dataServices.howManyPeopleOnlineWithin(60*60*1);
        let last30Minutes = await dataServices.howManyPeopleOnlineWithin(60*30);
        let last10Minutes = await dataServices.howManyPeopleOnlineWithin(60*10);
        let last5Minutes = await dataServices.howManyPeopleOnlineWithin(60*5);

        return {
            "last24HoursOnlines": last24Hours,
            "last12HoursOnlines": last12Hours,
            "last1HourOnlines": last1Hour,
            "last30MinutesOnlines": last30Minutes,
            "last10MinutesOnlines": last10Minutes,
            "last5MinutesOnlines": last5Minutes
        };
    }
}

let server = new MainServer();