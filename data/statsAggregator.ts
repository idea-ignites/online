import { OnlinesStats } from "./onlinesInfoStats";

export class StatsAggregator {

    private statsCache = {};

    private getStatsSource() {
        let onlinesStats = new OnlinesStats();

        return [
            onlinesStats
        ];
    }

    private async computeStats() {
        let statsSources = this.getStatsSource();
        for (let statsSource of statsSources) {
            let statsName = await statsSource.getStatsName();
            let statsData = await statsSource.getStatsData();
            this.statsCache[statsName] = statsData;
        }
    }

    public startComputeStatsPeriod(periodSeconds: number) {
        let wait = new Promise((resolve, reject) => {
            setTimeout(() => resolve(Date.now()), periodSeconds*1000);
        });

        wait.then(resolved => {
            this.computeStats().catch(error => console.log(error));
            this.startComputeStatsPeriod(periodSeconds);
        });
    }

}