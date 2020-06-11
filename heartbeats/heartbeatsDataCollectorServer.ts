const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

export class HeartbeatsDataCollectorServer {

    private logs = [];
    private app: any;
    private resourcesDeclaration: any;
    private port = 1574;

    constructor () {
        this.initialize();
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

        app.use(
            (err, req, res, next) => this.errorHandler(err, req, res, next)
        );
    }

    private errorHandler(err, req, res, next) {
        console.log(err.message);
        res.json({
            "message": err.message,
            "passed": false
        });
    }

    public listen(path: number | string) {
        this.app.listen(path, () => this.onServerStarted(path));
    }

    private onServerStarted(path: number | string) {
        console.log(`Server started at ${path}`);
    }

    public resourcesClaim() {
        return this.resourcesDeclaration;
    }

    private registerRoutes(app: any) {
        this.resourcesDeclaration = [
            '/heartbeats'
        ];

        app.get('/heartbeats', (req, res) => this.getHeartbeatsHandler(req, res));
        app.post('/heartbeats', (req, res) => this.postHeartbeatshandler(req, res));
    }

    private postHeartbeatshandler(req, res) {
        let purpose = req.body.purpose;

        if (purpose === 'newHeartbeat') {
            this.handleNewHeartbeat(req, res)
        }
        else {
            this.handleClearBySerialNumbers(req, res)
        }
    }

    private handleClearBySerialNumbers(req, res) {
        let counts = this.clearBySerialNumbers(req.body.serialNumbers);
        res.json({
            "message": `Deleted ${counts} records`,
            "okay": true
        });
    }

    private getOrigin(req) {
        let origin = req.headers['Origin'] || req.headers['origin'] || '';
        return origin;
    }

    private handleNewHeartbeat(req, res) {
        let justNow = Date.now();
        let origin = this.getOrigin(req);

        let newHeartbeat = {
            "receivedAt": justNow,
            "serialNumber": uuidv4(),
            "origin": origin
        };
        Object.assign(newHeartbeat, req.body);
    
        this.appendLog(newHeartbeat);
        res.json(newHeartbeat);
    }

    private appendLog(logObject) {
        this.logs.push(logObject);
    }

    private getHeartbeatsHandler(req, res) {
        res.json(this.logs);
    }

    private clearBySerialNumbers(serialNumbers) {
        let length0 = this.logs.length;
        this.logs = this.logs.filter(
            logObject => serialNumbers.indexOf(logObject.serialNumber) === -1
        );
        let length1 = this.logs.length;
    
        return length0 - length1;
    }
}