import { v4 as uuidv4 } from "uuid";
import express = require("express");
import bodyParser = require("body-parser");
import crypto = require('crypto');

class IdentitiesLogsDataCollectorServer {

    private masterSecret = '';
    private logs = [];
    private port = 1572;
    private app: any;
    private resourceDeclaration: any;

    constructor() {
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

    public resourcesClaim() {
        return this.resourceDeclaration;
    }

    private registerRoutes(app: any) {
        this.resourceDeclaration = [
            '/identitiesLogs',
            '/identities'
        ];

        app.get('/identitiesLogs', (req, res) => this.retrieveAllLogs(req, res));
        app.post('/identitiesLogs', (req, res) => this.deleteLogs(req, res));
        
        app.post('/identities', (req, res) => this.onIdentitiesRequest(req, res));

        app.use((err, req, res, next) => this.errorHandler(err, req, res, next));
        
    }

    private deleteLogs(req, res) {
        if (req.body.operation === 'clearBySerialNumbers') {
            let counts = this.clearLogsBySerialNumbers(req.body.serialNumbers);
            res.json({
                "message": `Deleted ${counts} records`,
                "passed": true
            });
        }
        else {
            res.json({"message": "Nothing happend", "passed": true});
        }
    }

    private setContentType(req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        next();
    }

    private setStatusCodeOK(req, res, next) {
        res.statusCode = 200;
        next()
    }

    public listen(port: number) {
        this.app.listen(port, () => this.onServerStarted(port));
    }

    public setMasterSecret(secret: string) {
        this.masterSecret = secret;
    }

    private errorHandler(err, req, res, next) {
        console.log(err.message);
        res.status(400);
        res.json({
            'message': err.message,
            'passed': false
        });
    }
    
    private clearLogsBySerialNumbers(serialNumbers) {
        let length0 = this.logs.length;
        let newLedger = this.logs.filter(
            logObject => serialNumbers.indexOf(logObject.serialNumber) === -1
        );
    
        this.logs = newLedger;
        let length1 = this.logs.length;
    
        return length0 - length1;
    }

    private getOrigin(req) {
        let origin = req.headers['Origin'] || req.headers['origin'] || '';
        return origin;
    }
    
    private onIdentitiesRequest(req, res) {
        let purpose = req.body.purpose;
        let result = true;
        let identity = {};

        if (purpose === 'issueNew') {
            identity = this.handleIssueNew(req, res);
            result = true;
        }
        else if (purpose === 'validate') {
            result = this.handleValidate(req, res);
            identity = req.body.identity;
        }

        let datetime = Date.now();
        let ipAddr = this.getIPAddress(req);
        let userAgent = this.getUserAgent(req);
        let origin = this.getOrigin(req);

        this.logs.push({
            "purpose": purpose,
            "datetime": datetime,
            "identity": identity,
            "passed": result,
            "serialNumber": uuidv4(),
            "ipAddr": ipAddr,
            "userAgent": userAgent,
            "origin": origin
        });
    }
    
    private handleIssueNew(req, res) {
        let uuidObject = this.makeUUIDObject();
        res.json(uuidObject);

        return uuidObject;
    }
    
    private handleValidate(req, res) {
        let identity = req.body.identity;
        let checkResult = this.verifyUUIDObject(identity);
    
        res.json({
            "checkResult": checkResult
        });

        return checkResult;
    }
    
    private makeUUIDObject() {
        const uuidString = uuidv4();
        const uuidHash = crypto.createHmac('sha512', this.masterSecret)
            .update(uuidString)
            .digest('hex');
        
        let uuidObject =  {
            uuid: uuidString,
            checkSum: uuidHash
        };
        
        return uuidObject;
    }
    
    private verifyUUIDObject(uuidObject) {
        const receivedUUIDHash = uuidObject.checkSum;
        const receivedUUIDString = uuidObject.uuid;
        const computedUUIDHash = crypto.createHmac('sha512', this.masterSecret)
            .update(receivedUUIDString)
            .digest('hex');
        
        let checkResult = computedUUIDHash === receivedUUIDHash;
    
        return checkResult;
    }
    
    private onServerStarted(port) {
        console.log(`Server running at port ${port}`);
    }

    private retrieveAllLogs(req, res) {
        res.json(this.logs);
    }

    private getUserAgent(req) {
        let ua = req.headers['User-Agent'] || 
            req.headers['user-agent'] ||
            '';
        return ua;
    }

    private getIPAddress(req) {
        let ip = req.headers['x-forwarded-for'] ||
            req.headers['X-Forwarded-For'] ||
            req.connection.remoteAddress;
    
        return ip;
    }

}

let server = new IdentitiesLogsDataCollectorServer();
server.listen(1572);