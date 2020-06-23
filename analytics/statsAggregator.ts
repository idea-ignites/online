import { OnlinesStats } from "./onlinesInfoStats";
import { TimeSeries } from "./timeSeries";

export { StatsAggregator }

let computed = undefined;

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

        return {
            "computedAt": Date.now(),
            "data": data
        };
    }

    public async getData() {
        let maximumDelayMs = 30 * 1000;

        if (computed === undefined){
            // there is no computed report yet, so compute it
            computed = await this.computeStats();
        }
        else if ((Date.now() - computed.computedAt) > maximumDelayMs) {
            // there is computed report, but it is outdated
            computed = await this.computeStats();
        }

        // there is report up to date
        return computed;
    }

}

// async function test() {
//     console.log((new Date()).toString());
//     let stats = new StatsAggregator();
//     let data1 = await stats.getData().catch(e => console.log(e));
//     console.log("data1");
//     console.log(JSON.stringify(data1, null, 4));

//     let wp1 = new Promise((resolve, reject) => {
//         setTimeout(() => resolve(Date.now()), 32*1000);
//     });

//     await wp1;
//     console.log((new Date()).toString());
//     let data2 = await stats.getData().catch(e => console.log(e));
//     console.log("data2");
//     console.log(JSON.stringify(data2, null, 4));

//     let wp2 = new Promise((resolve, reject) => {
//         setTimeout(() => resolve(Date.now()), 4*1000);
//     });

//     await wp2;
//     console.log((new Date()).toString());
//     let data3 = await stats.getData().catch(e => console.log(e));
//     console.log("data3");
//     console.log(JSON.stringify(data3, null, 4));

// }

// test();