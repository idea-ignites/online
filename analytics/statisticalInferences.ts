import * as d3 from "d3";
import { DataManagementSystem } from "./dataManagementSystem";

export class StatisticalInferences {

    public getStatsName() {
        return 'statisticalInferences';
    }

    public async getStayingDurationDistribution(from: number, to: number): Promise<any> {
        if ((to - from) < 60*1000) {
            to = from + 60*1000;
        }

        let dms = new DataManagementSystem();
        let readable = await dms.getReadableStream('heartbeats', {
            "datetime": {
                "$gte": from,
                "$lt": to
            }
        });

        let heartbeats = {};
        for await (let heartbeat of readable) {
            let identityUUID = heartbeat.identity.uuid;
            if (heartbeats[identityUUID] === undefined) {
                heartbeats[identityUUID] = {
                    "heartbeats": [],
                    "durations": [0]
                };
            }

            heartbeats[identityUUID].heartbeats.push(heartbeat);
        }

        for (let identityUUID in heartbeats) {
            let identity = heartbeats[identityUUID];
            identity.heartbeats.sort((a, b) => d3.ascending(a.datetime, b.datetime));

            if (identity.heartbeats.length >= 2) {
                for (let i = 1; i < identity.heartbeats.length; i++) {
                    if ((identity.heartbeats[i].datetime - identity.heartbeats[i-1].datetime) < 30*1000) {
                        identity.durations[identity.durations.length-1] += (identity.heartbeats[i].datetime - identity.heartbeats[i-1].datetime);
                    }
                    else {
                        identity.durations.push(0);
                    }
                }
            }

            identity.durations = identity.durations.filter(x => x !== 0);

            delete heartbeats[identityUUID].heartbeats;
        }

        let durations = [];
        for (let identityUUID in heartbeats) {
            durations = durations.concat(heartbeats[identityUUID].durations);
        }

        durations.sort((a, b) => d3.ascending(a,b));

        readable.destroy();
        
        return durations;
    }

    public async getStayingDurationDistributionThisMonth() {
        let now = Date.now();
        let monthAgo = now - 30 * 24 * 60 * 60 * 1000;
        let data = await this.getStayingDurationDistribution(monthAgo, now).catch(console.error);

        return data;
    }

    public async getStatsData() {
        return {
            "stayingDurationsThisMonth": await this.getStayingDurationDistributionThisMonth()
        };
    }
}

// async function test() {
//     let si = new StatisticalInferences();
//     let data = await si.getStatsData();
//     console.log(data);
// }

// test();
