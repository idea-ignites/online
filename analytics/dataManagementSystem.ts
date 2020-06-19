import { v4 as uuidv4 } from  'uuid';
import { Writable, Readable, Transform } from 'stream';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

export class DataManagementSystem {

    private url = "mongodb://127.0.0.1:27017";
    private dbName = "onlineServices";
    private client: any;

    private async connect() {
        let client = new MongoClient(this.url);

        try {
            await client.connect();
            this.client = client;
            return client.db(this.dbName);
        }
        catch (error) {
            console.log(error);
        }
    }

    public async getWritableStream(collectionName: string) {
        let db = await this.connect();
        let collection = db.collection(collectionName);

        let client = this.client;

        let writable = new Writable({
            objectMode: true,

            async write (chunk, encoding, next) {
                if (!client.isConnected) {
                    await client.connect();
                }

                try {
                    let result = await collection.insertOne(chunk);
                    assert.equal(1, result.insertedCount);
                    next();
                }
                catch (error) {
                    console.log(error);
                }
            }
        });

        return writable;
    }

    public async getReadableStream(collectionName: string, condition: any) {
        let db = await this.connect();
        let collection = db.collection(collectionName);
        let readable = collection.find(condition);

        readable.on('end', () => {
            this.close();
        });

        return readable;
    }

    public close() {
        this.client.close();
    }

}

// async function test() {
//     let dms = new DataManagementSystem();
//     let readable = await dms.getReadableStream("heartbeats", {});
//     let writable = new Writable({
//         objectMode: true,
//         write(doc, encoding, next) {
//             console.log(JSON.stringify(doc,null,4));
//             next();
//         }
//     });
//     readable.pipe(writable);
// }

// test();