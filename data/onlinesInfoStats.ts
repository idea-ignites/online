import { DataManagementSystem } from "./dataManagementSystem";
const assert = require("assert");

export class OnlinesStats {

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

    public getStatsName() {
        return 'onlinesStats';
    }

    public async getStatsData() {
        let last24Hours = await this.howManyPeopleOnlineWithin(60*60*24);
        let last12Hours = await this.howManyPeopleOnlineWithin(60*60*12);
        let last1Hour = await this.howManyPeopleOnlineWithin(60*60*1);
        let last30Minutes = await this.howManyPeopleOnlineWithin(60*30);
        let last10Minutes = await this.howManyPeopleOnlineWithin(60*10);
        let last5Minutes = await this.howManyPeopleOnlineWithin(60*5);
        let last1Minite = await this.howManyPeopleOnlineWithin(60*1);

        return {
            "last24HoursOnlines": last24Hours,
            "last12HoursOnlines": last12Hours,
            "last1HourOnlines": last1Hour,
            "last30MinutesOnlines": last30Minutes,
            "last10MinutesOnlines": last10Minutes,
            "last5MinutesOnlines": last5Minutes,
            "last1MinuteOnlines": last1Minite
        };
    }

}

