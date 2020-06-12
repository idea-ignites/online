import { IdentitiesLogsDataSource } from "./identitiesLogsDataSource";
import { HeartbeatsDataSource } from "./heartbeatsDataSource";
import { uuid } from 'uuidv4';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

export class DataManagementSystem {

    private dataSources: any;
    private databaseURL = 'mongodb://localhost/27017';
    private databaseName = 'blogOnlineService';
    private databaseHandler: any;
    private databaseClient: any;
    private connected = false;
    private database: any;
    private syncPeriodSeconds: 1;

    constructor() {
        this.initializeDataSources();
        // this.constantSync(this.syncPeriodSeconds);
    }

    public constantSync(periodSeconds: number) {
        let wait = new Promise((resolve, reject) => {
            setTimeout(() => resolve(Date.now()), periodSeconds*1000);
        });

        wait.then(resolved => {
            this.synchronizeAll().catch(error => console.log(error));
            this.constantSync(periodSeconds);
        }).catch(error => console.log(error));
    }

    private async connectDatabase(): Promise<any> {
        let client = new MongoClient(this.databaseURL);
        return await new Promise((resolve, reject) => {
            client.connect((error,client) => {
                if (!error) {
                    this.databaseClient = client;
                    this.connected = true;
                    resolve(client);
                }
                else {
                    console.log("Failed connecting to database.");
                    reject(error);
                }
            });
        });
    }

    private disconnectDatabase() {
        this.databaseClient.close();
        this.connected = false;
    }

    public async fetchFromUpstreams(dataSourceName: string) {
        return this.dataSources[dataSourceName].fetchAll();
    }

    private async synchronize(dataSourceName: string) {
        // console.log(`Synchronizing ${dataSourceName}`);

        return await this.fetchFromUpstreams(dataSourceName).then(data => {

            if (data.length !== 0) {
                this.insertMany(data, dataSourceName);
            }
            return data;

        }).then(data => {

            let serialNumbers = data.map(dataItem => dataItem?.serialNumber);

            return new Promise((resolve, reject) => {
                if (data.length !== 0) {
                    this.dataSources[dataSourceName].deleteByUUIDs(serialNumbers).then(okResponse =>{
                        resolve(okResponse);
                    }).catch(error => reject(error));
                }
                else {
                    resolve("no data need to be sync.");
                }
            });

        });
    }

    public async synchronizeAll() {
        return await Promise.all(
            Object.keys(this.dataSources).map(
                dataSourceName => this.synchronize(dataSourceName)
            )
        )
    }

    public async operationOnDatabase(operation: (db: any, onResolve:any, onReject:any) => void): Promise<any> {
        return await new Promise((resolve, reject) => {
            this.connectDatabase().then(client => {
                operation(client.db(this.databaseName), resolve, reject);
                client.close();
            })
        });
    }

    public async insertMany(arrayOfObjects: Array<Object>, collectionName: string) {
        return await new Promise((resolve, reject) => {
            this.connectDatabase().then(client => {
                let collection = client.db(this.databaseName).collection(collectionName);
                collection.insertMany(arrayOfObjects, (error, response) => {
                    if (!error) { resolve(response); }
                    else { reject(error); }
                });
                client.close();
            });
        });
    }

    private initializeDataSources() {
        let identitiesLogsDataSource = new IdentitiesLogsDataSource();
        let heartbeatsDataSource = new HeartbeatsDataSource();

        this.dataSources = {
            "identitiesLogs": identitiesLogsDataSource,
            "heartbeats": heartbeatsDataSource
        };

    }

}

// let dms = new DataManagementSystem();

// dms.synchronizeAll()
// .then(data => console.log(data))
// .catch(error => console.log(error));

// dms.operationOnDatabase(function(db) {
//     let collection = db.collection("books");
//     collection.insertOne(
//         {"name":"Alice's Advanture in Wonderland", "Category": "Fantasy"},
//         function(error, response) {
//             assert.equal(null, error);
//             console.log(response);
//         }
//     )
// }).then( response => console.log(response) )
// .catch( error => console.log(error) );