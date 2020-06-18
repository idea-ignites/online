import { v4 as uuidv4 } from  'uuid';
import { Writable } from 'stream';

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

        let writable = new Writable({
            async write (chunk, encoding, next) {
                let chunkObject = JSON.parse(chunk.toString());

                try {
                    let result = await collection.insertOne(chunkObject);
                    assert.equal(1, result.insertedCount);
                }
                catch (error) {
                    console.log(error);
                }
            }
        });

        return writable;
    }

    public close() {
        this.client.close();
    }

}