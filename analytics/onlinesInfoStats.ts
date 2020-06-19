import { DataManagementSystem } from "./dataManagementSystem";
import { Writable, Transform } from "stream";



export class OnlinesStats {

    public async fetchHeartbeatsFromNowToSecondsAgo(seconds: number): Promise<any> {
        let dms = new DataManagementSystem();
        let justNow = Date.now();
        let secondsAgo = justNow - seconds * 1000;

        let readable = await dms.getReadableStream("heartbeats", {
            "datetime": {
                "$lte": justNow,
                "$gte": secondsAgo
            }
        });

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

