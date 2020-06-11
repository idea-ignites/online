import { DataManagementSystem } from "./dataManagementSystem";
const assert = require("assert");

export class DataServices {

    public async fetchHeartbeatsFromNowToSecondsAgo(seconds: number): Promise<any> {
        let dms = new DataManagementSystem();
        return await dms.operationOnDatabase(function(db, resolve, reject) {

            let justNow = Date.now();
            let secondsAgo = justNow - seconds*1000;

            let collection = db.collection("heartbeats");
            // resolve(collection.distinct);
            collection.distinct(
                "identity.uuid", 
                {"datetime": {"$lte": justNow, "$gte": secondsAgo}},
                function (error, result) {
                    if (!error) { resolve(result); }
                    else {reject(error)};
                }
            )
        })
    }

    public async howManyPeopleOnlineWithin(seconds: number): Promise<any> {
        return await this
            .fetchHeartbeatsFromNowToSecondsAgo(seconds)
            .then(uuids => uuids?.length);
    }

}

// let ds = new DataServices();

// ds.fetchHeartbeatsFromNowToSecondsAgo(86400)
// .then(response => console.log(response))
// .catch(error => console.log(error));

// ds.howManyPeopleOnlineWithin(86400)
// .then(response => console.log(response))
// .catch(error => console.log(error));