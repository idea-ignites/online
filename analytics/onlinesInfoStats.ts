import { DataManagementSystem } from "./dataManagementSystem";
import { UUIDExtractor, UniqueFilter, Count } from "./transforms";

export class OnlinesStats {

    public async uniqueVisitorsWithinLastSecondsAgo(seconds: number): Promise<Array<string>> {
        let dms = new DataManagementSystem();
        let justNow = Date.now();
        let secondsAgo = justNow - seconds * 1000;

        let readable = await dms.getReadableStream("heartbeats", {
            "datetime": {
                "$lte": justNow,
                "$gte": secondsAgo
            }
        });

        let uuidExtractor = new UUIDExtractor({});
        let uniqueFilter = new UniqueFilter({});

        let it = readable.pipe(uuidExtractor).pipe(uniqueFilter);
        let result = [];
        for await (let v of it) {
            result.push(v);
        }

        return result;
    }

    public async howManyPeopleOnlineWithin(seconds: number): Promise<any> {
        let uvs = await this.uniqueVisitorsWithinLastSecondsAgo(seconds);
        return uvs.length;
    }

    public getStatsName() {
        return 'onlinesStats';
    }

    public async getStatsData() {
        let thisYear = await this.howManyPeopleOnlineWithin(60*60*24*365);
        let this6Months = await this.howManyPeopleOnlineWithin(60*60*24*30*6);
        let this3Months = await this.howManyPeopleOnlineWithin(60*60*24*30*3);
        let thisMonth = await this.howManyPeopleOnlineWithin(60*60*24*30);

        let thisWeek = await this.howManyPeopleOnlineWithin(60*60*24*7);
        let this72Hours = await this.howManyPeopleOnlineWithin(60*60*72);
        let this48Hours = await this.howManyPeopleOnlineWithin(60*60*48);
        let thisDay = await this.howManyPeopleOnlineWithin(60*60*24);

        let this12Hours = await this.howManyPeopleOnlineWithin(60*60*12);
        let this1Hour = await this.howManyPeopleOnlineWithin(60*60*1);
        let this30Minutes = await this.howManyPeopleOnlineWithin(60*30);

        let this10Minutes = await this.howManyPeopleOnlineWithin(60*10);
        let this5Minutes = await this.howManyPeopleOnlineWithin(60*5);
        let this1Minute = await this.howManyPeopleOnlineWithin(60*1);

        return {
            "onlinesCounts": {
                "thisYear": thisYear,
                "this6Months": this6Months,
                "this3Months": this3Months,
                "thisMonth": thisMonth,
                "thisWeek": thisWeek,
                "this72Hours": this72Hours,
                "this48Hours": this48Hours,
                "this24Hours": thisDay,
                "this12Hours": this12Hours,
                "this1Hour": this1Hour,
                "this30Minutes": this30Minutes,
                "this10Minutes": this10Minutes,
                "this5Minutes": this5Minutes,
                "this1Minute": this1Minute
            },
            "trends": {
                "longTerm": {
                    "thisYearEveryMonth": thisYear/12,
                    "this6MonthEveryMonth": this6Months/6,
                    "this3MonthsEveryMonth": this3Months/3,
                    "thisMonth": thisMonth
                },
                "shortTerm": {
                    "thisWeekEveryDay": thisWeek/7,
                    "this3DaysEveryDay": this72Hours/3,
                    "this2DaysEveryDay": this48Hours/2,
                    "thisDay": thisDay
                },
                "shorterTerm": {
                    "this12HoursEveryMinute": this12Hours/(12*60),
                    "this1HourEveryMinute": this1Hour/60,
                    "this30MiniteEveryMinute": this30Minutes/30
                },
                "instantTrend": {
                    "this10MinutesEveryMinute": this10Minutes/10,
                    "this5MinutesEveryMinute": this5Minutes/5,
                    "thisMinute": this1Minute
                }
            }
        };
    }

}

