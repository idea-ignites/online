const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
import { Readable } from "stream";
import { DataManagementSystem } from "../analytics/dataManagementSystem";

export class HeartbeatsDataCollectorServer {

    private app: any;
    private resourcesDeclaration: any;
    private logStream: Readable;
    private connected = false;

    constructor() {
        this.initialize();
    }

    private async connectToStorage() {
        let dms = new DataManagementSystem();
        let logStorageEntryStream = await dms.getWritableStream(this.getName());

        this.logStream.pipe(logStorageEntryStream);
    }

    public async start() {
        await this.listen();
        this.onServerStarted(this.getSocketName());
        return true;
    }

    private onServerStarted(path: string) {
        console.log(`Server ${this.getName()} started at ${path}`);
    }

    public getName() {
        return "heartbeats";
    }

    private async initialize() {
        this.logStream = new Readable({
            read() {}
        });
    }

    private getSocketName() {
        return __dirname + "/sockets/" + this.getName() + ".socket";
    }

    private listen() {
        const app = express();
        this.registerRoutes(app);
        this.app = app;

        return new Promise((resolve, reject) => {

            let path = this.getSocketName();
            let server = app.listen(path, () => resolve(true));

            server.on('error', (e) => {
                console.log(e);
                process.exit(1);
            });

        });
    }

    public getRoutesTable() {
        return {
            "from": this.resourcesDeclaration,
            "to": this.getSocketName()
        };
    }

    private registerRoutes(app: any) {
        app.use(
            bodyParser.json({
                type: "application/json"
            })
        );

        app.post('/heartbeats', (req, res) => this.postHeartbeatshandler(req, res));

        this.resourcesDeclaration = [
            '/heartbeats'
        ];
    }

    private postHeartbeatshandler(req, res) {
        this.handleNewHeartbeat(req, res)
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

    public async appendLog(logObject) {
        if (! this.connected) {
            await this.connectToStorage();
        }

        this.logStream.push(logObject);
    }
}

// let heartbeats = new HeartbeatsDataCollectorServer();

// heartbeats.appendLog(JSON.stringify({
//     "name": "mike",
//     "age": 15,
//     "gender": "male"
// }));

// heartbeats.appendLog(JSON.stringify({
//     "name": "wayne",
//     "age":20,
//     "gender": "male"
// }));