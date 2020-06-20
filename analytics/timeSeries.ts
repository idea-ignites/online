import { DataManagementSystem } from "./dataManagementSystem";
import { createWriteStream } from "fs";

export class TimeSeries {

    public getStatsName() {
        return 'timeSeriesStats';
    }

    // time format is unix epoch (i.e. Integer), unit is milisecond
    // return [{ from: when, to: when, counts: howMany}, ...]
    public async getTimeSeriesData(from: number, to: number, period: number) {
        if (period <= 60000) { // 60000 ms is 60 i.e. 1 minute
            period = 60000;  
        }

        if ((to - from) < period) {
            to = from + period;
        }

        let maxIndex = Math.floor((to - from) / period);
        to = from + maxIndex *period;

        let dms = new DataManagementSystem();
        let readable = await dms.getReadableStream('heartbeats', {
            "datetime": {
                "$gte": from,
                "$lt": to
            }
        });

        let stats = [];
        for (let i = 0; i < maxIndex; i++) {
            if (stats[i] === undefined) {
                stats[i] = {
                    "from": from + i * period,
                    "to": from + (i+1)*period,
                    "counts": 0,
                    "uuids": new Set([]),
                    "identities": []
                };
            }
        }

        for await (let doc of readable) {
            let index = Math.floor((doc.datetime - from)/period);
            if (! stats[index].uuids.has(doc.identity.uuid)) {
                stats[index].identities.push(doc);
            }

            stats[index].uuids.add(doc.identity.uuid);
            stats[index].counts = stats[index].uuids.size;
        }

        for (let x of stats) {
            delete x.uuids;
        }

        readable.destroy();

        return stats;
    }

    public async thisMonthEveryDay() {
        let justNow = Date.now();
        let dayLength = 24*60*60*1000;
        let from = justNow - dayLength * 30;
        let to = justNow;
        let period = dayLength;
        return await this.getTimeSeriesData(from, to, period);
    }
    
    public async thisWeekEveryDay() {
        let justNow = Date.now();
        let dayLength = 24*60*60*1000;
        let from = justNow - dayLength * 7;
        let to = justNow;
        let period = dayLength;
        return await this.getTimeSeriesData(from, to, period);
    }

    public async thisDayEveryHour() {
        let justNow = Date.now();
        let hourLength = 60*60*1000;
        let from = justNow - hourLength * 24;
        let to = justNow;
        let period = hourLength;
        return await this.getTimeSeriesData(from, to, period);
    }

    public async thisHourEveryMinute() {
        let justNow = Date.now();
        let minuteLength = 60*1000;
        let from = justNow - minuteLength * 24;
        let to = justNow;
        let period = minuteLength;
        return await this.getTimeSeriesData(from, to, period);
    }

    public async getStatsData() {
        return {
            "thisMonthEveryDay": await this.thisMonthEveryDay(),
            "thisWeekEveryDay": await this.thisWeekEveryDay(),
            "thisDayEveryHour": await this.thisDayEveryHour(),
            "thisHourEveryMinute": await this.thisHourEveryMinute()
        };
    }
}

let ts = new TimeSeries();
ts.getStatsData().then(data => {
    let ws = createWriteStream("output.json");
    ws.write(JSON.stringify(data, null, 4));
    ws.end();
}).catch(e => console.log(e));
    
          
