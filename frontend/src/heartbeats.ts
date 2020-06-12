const axios = require("axios");

import { Identities } from "./identities";

export class Heartbeats {

    private getAPIInstance() {
        let onlineServicesServerAPIEndPoint = window["onlineServicesServerAPIEndPoint"] || '';
        return axios.create({
            baseURL: onlineServicesServerAPIEndPoint,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async transmittingHeartbeats() {
        let heartbeatPeriodInSeconds = 4;
        let heartbeatObjectPMS = this.makeHeartbeat(heartbeatPeriodInSeconds);

        heartbeatObjectPMS.then(heartbeatObject => {
            return heartbeatObject;
        })
        .then(heartbeatObject => {
            let response = this.sendHeartbeat(heartbeatObject);
            return response;
        })
        .then(response => {
            this.transmittingHeartbeats();
        })
        .catch(error => console.log(error));
    }

    async sendHeartbeat(heartbeatObject) {
        const instance = this.getAPIInstance();

        heartbeatObject.purpose = "newHeartbeat";

        let response = await instance.post(
            '/heartbeats', 
            heartbeatObject
        ).then(function (response) {
            return response.data;
        }).catch(function (error) {
            console.log(error);
        });

        return response;
    }

    makeHeartbeat(periodInSeconds) {
        return new Promise((resolve, reject) => {
            let identityHandler = new Identities();
            let identityObject = identityHandler.getIdentityFromLocalStorage();
            setTimeout(
                () => {
                    let newHeartbeatObject = {
                        "identity": identityObject,
                        "datetime": Date.now()
                    };

                    resolve(newHeartbeatObject);
                }, 
                periodInSeconds*1000
            );
        });
    }
}