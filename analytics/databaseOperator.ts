const MongoClient = require('mongodb').MongoClient;

export class DatabaseOperator {

    private url = 'mongodb://localhost:27017';
    private dbName = 'blogOnlineService';

    public async getDB() {
        const client = new MongoClient(this.url);

        try {
            await client.connect();
            // console.log('database connected.');
        } catch (error) {
            console.log(error);
            console.log('can\'t connect to database');

            return Promise.reject({"message": "can't connect to database", "ok": false});
        }

        let dbName = this.dbName;
        async function operator(operation: (db) => any) {
            let result = await operation(client.db(dbName));
            client.close();
            return result;
        }

        return operator;
    }
}

// let op = new DatabaseOperator();
// op.getDB().then(operator => operator(async function(db) {
//     try {
//         let collection = db.collection('heartbeats');
//         let docs = await collection.find({}).toArray();
//         // console.log(docs);
//         return Promise.resolve(docs);
//     } catch (error) {
//         console.log(error);
//         let message = "can't retrieve from database.";
//         console.log(message);
//         return Promise.reject({"message": message, "ok":false});
//     }
// })).then(docs => console.log(docs)).catch(err => console.log(err));
