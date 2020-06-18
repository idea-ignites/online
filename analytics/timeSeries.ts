import { DatabaseOperator } from "./databaseOperator";

export class TimeSeries {

    public getStatsName() {
        return 'timeSeriesStats';
    }

    // time format is unix epoch (i.e. Integer), unit is milisecond
    // return [{ from: when, to: when, counts: howMany}, ...]
    public async getTimeSeriesData(from: number, to: number, period: number) {
        let dbOperator = new DatabaseOperator();
        let data = await dbOperator.getDB().then(operator => operator(async function(db) {
            try {
                let collection = db.collection('heartbeats');
                let docs = await collection.find({
                    "datetime": {"$gte": from, "$lt": to}
                }).sort({"datetime": 1}).toArray();

                return Promise.resolve(docs);
            } catch (error) {
                console.log(error);
                let message = "can't retrieve from database.";
                console.log(message);
                return Promise.reject([]);
            }
        }));

        let collector = [];
        for (let item of data) {
            let t = item?.datetime;
            if (t >= from && t <= to) {
                let periodIndex = Math.floor((t - from)/period);
                if (collector[periodIndex] === undefined) {
                    collector[periodIndex] = {
                        "from": from + (period * periodIndex),
                        "to": from + (period * (periodIndex + 1)),
                        "uuids": new Set()
                    }
                }
                collector[periodIndex].uuids.add(item.identity.uuid);
            }
        }

        if (collector[0] === undefined) {
            collector[0] = {
                "from": from,
                "to": from + period,
                "uuids": new Set()
            };
        }

        for (let i = 0; i < collector.length; i++) {
            if (i >= 1 && collector[i] === undefined) {
                collector[i] = {
                    "from": (collector[i-1].from) + period,
                    "to": (collector[i-1].to) + period,
                    "uuids": new Set()
                };
            }
            collector[i].counts = collector[i].uuids.size;
            delete collector[i].uuids;
        }

        return collector;
    }

    public async lastNDayEveryHour(nDay: number) {
        let justNow = Date.now();
        let dayLength = 24*60*60*1000;
        let from = justNow - nDay*dayLength;
        let to = justNow;
        let period = 60*60*1000;
        return await this.getTimeSeriesData(from, to, period);
    }

    public async lastNDayEveryDay(nDay: number) {
        let justNow = Date.now();
        let dayLength = 24*60*60*1000;
        let from = justNow - nDay*dayLength;
        let to = justNow;
        let period = dayLength;
        return await this.getTimeSeriesData(from, to, period);
    }

    public async lastWeekStats() {
        return await this.lastNDayEveryDay(7);
    }

    public async lastTwoDaysStats() {
        return await this.lastNDayEveryHour(2);
    }

    public async getStatsData() {
        return {
            "lastWeek": await this.lastWeekStats(),
            "lastTwoDays": await this.lastTwoDaysStats()
        };
    }
}

// let ts = new TimeSeries();
// async function test() {
//     await ts.lastNDayEveryDay(10)
//         .then(data => console.log(data))
//         .catch(error => console.log(error));

//     await ts.lastNDayEveryHour(1)
//         .then(data => console.log(data))
//         .catch(error => console.log(error));

//     await ts.lastNDayEveryHour(2)
//         .then(data => console.log(data))
// }

// test();
    
          
