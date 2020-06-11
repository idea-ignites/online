import axios from 'axios';

export class HeartbeatsDataSource {

    apiEndPoint = "http://localhost";
    apiPath = "/heartbeats";
    masterTicket = "ILoveBlueSky";

    baseHeaders = {
        'Content-Type': 'application/json'
    };

    axiosInstance() {
        return axios.create({
            baseURL: this.apiEndPoint,
            headers: this.baseHeaders
        });
    }

    async retrieveAllHeartbeats() {
        let upstreamLink = this.axiosInstance();

        let response = await upstreamLink.get(
            this.apiPath,
            {
                headers: {
                    'x-master-ticket': this.masterTicket
                }
            }
        ).then(function (responseFromUpstream) {
            return responseFromUpstream.data;
        }).catch(function (error) {
            console.log(error.response.data);
        });
    
        return response;
    }

    async fetchAll() {
        return await this.retrieveAllHeartbeats();
    }

    async clearHeartbeatsBySerialNumbers(serialNumbers: Array<string>) {
        let upstreamLink = this.axiosInstance();
        let response = await upstreamLink.post(
            this.apiPath,
            {
                "purpose": "clearBySerialNumbers",
                "serialNumbers": serialNumbers
            },
            {
                "headers": {
                    'x-master-ticket': this.masterTicket
                }
            }
        ).then(function (responseFromUpstream) {
            return responseFromUpstream.data;
        }).catch(function (error) {
            console.log(error.response.data);
        });

        return response;
    }

    async deleteByUUIDs(uuids: Array<string>) {
        return await this.clearHeartbeatsBySerialNumbers(uuids);
    }

}

// let heartbeatsSource = new HeartbeatsDataSource();
// heartbeatsSource.fetchAll().then(data => {
//     console.log(data)
//     return data;
// }).then(data => heartbeatsSource.deleteByUUIDs([
//     data[0].serialNumber,
//     data[1].serialNumber
// ])).then(data => {
//     console.log(data);
//     return heartbeatsSource.fetchAll();
// }).then(data => {
//     console.log(data);
// }).catch(error => console.log(error));

// let heartbeatsSource = new HeartbeatsDataSource();
// heartbeatsSource.fetchAll().then(data => {
    // console.log(data);
// }).catch(error => console.log(error));