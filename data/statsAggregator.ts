import { OnlinesStats } from "./onlinesInfoStats";
import { TimeSeries } from "./timeSeries";

export { StatsAggregator }

var statsAggreagate = {};

class StatsAggregator {

    // private statsCache = {};

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

        return data;
    }

    public startComputeStatsPeriod(periodSeconds: number) {
        let wait = new Promise((resolve, reject) => {
            setTimeout(() => resolve(Date.now()), periodSeconds*1000);
        });

        wait.then(resolved => {
            this.computeStats().then(data => {
                statsAggreagate = JSON.parse(JSON.stringify(data));
            }).catch(error => console.log(error));
            this.startComputeStatsPeriod(periodSeconds);
        });
    }

    public getData() {
        // console.log(`Get data: ${JSON.stringify(this.statsCache)}`);
        return statsAggreagate;
    }

}

// let stats = new StatsAggregator();
// stats.startComputeStatsPeriod(4);
// stats.computeStats();