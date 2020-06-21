import { OnlinesStats } from "./onlinesInfoStats";
import { TimeSeries } from "./timeSeries";

export { StatsAggregator }

var computed = [];

class StatsAggregator {

    private getStatsSource() {
        let onlinesStats = new OnlinesStats();
        let timeSeries = new TimeSeries();

        return [
            onlinesStats,
            timeSeries
        ];
    }

    public async computeStats() {
        let statsSources = this.getStatsSource();
        let data = {};
        for (let statsSource of statsSources) {
            let statsName = await statsSource.getStatsName();
            let statsData = await statsSource.getStatsData();
            data[statsName] = statsData;
        }

        computed.push({
            "computedAt": Date.now(),
            "data": data
        });

        return data;
    }

    public async getData() {
        let maximumDelayMs = 30 * 1000;
        if (computed.length === 0){
            // console.log("there is no any computed reports yet, so we compute");
            await this.computeStats();
            return computed[0];
        }
        else if ((Date.now() - computed[computed.length-1].computedAt) > maximumDelayMs) {
            // console.log("there are some computed reports, but they are outdated");
            await this.computeStats();
            return computed[computed.length-1];
        }
        else {
            // console.log("there is a report up to date");
            return computed[computed.length-1];
        }
    }

}

async function test() {
    let stats = new StatsAggregator();

    console.log((new Date()).toString());
    let data1 = await stats.getData().catch(e => console.log(e));
    console.log("data1");
    console.log(JSON.stringify(data1, null, 4));

    let wp1 = new Promise((resolve, reject) => {
        setTimeout(() => resolve(Date.now()), 32*1000);
    });

    await wp1;
    console.log((new Date()).toString());
    let data2 = await stats.getData().catch(e => console.log(e));
    console.log("data2");
    console.log(JSON.stringify(data2, null, 4));

    let wp2 = new Promise((resolve, reject) => {
        setTimeout(() => resolve(Date.now()), 4*1000);
    });

    await wp2;
    console.log((new Date()).toString());
    let data3 = await stats.getData().catch(e => console.log(e));
    console.log("data3");
    console.log(JSON.stringify(data3, null, 4));

}

test();

// async function test2() {
//     let stats = new StatsAggregator();
//     let data = await stats.getData();
//     console.log(data);
// }

// test2();