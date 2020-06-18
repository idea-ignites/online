import axios from 'axios';

export class IdentitiesLogsDataSource {

    apiEndPoint = "http://localhost";
    apiPath = "/identitiesLogs";
    masterTicket = "ILoveBlueSky";

    baseHeaders = {
        'Content-Type': 'application/json'
    };

    private axiosInstance() {
        return axios.create({
            baseURL: this.apiEndPoint,
            headers: this.baseHeaders
        });
    }

    private async retrieveAllIdentitiesLogs() {
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

    public async fetchAll() {
        return await this.retrieveAllIdentitiesLogs();
    }

    private async clearIdentitiesLogsBySerialNumbers(serialNumbers: Array<string>) {
        let upstreamLink = this.axiosInstance();
        let response = await upstreamLink.post(
            this.apiPath,
            {
                "operation": "clearBySerialNumbers",
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

    public async deleteByUUIDs(uuids: Array<string>) {
        return await this.clearIdentitiesLogsBySerialNumbers(uuids);
    }

}


// let identitiesLogsDataSource = new IdentitiesLogsDataSource();
// identitiesLogsDataSource.fetchAll().then(data => {
//     console.log(data)
//     return data;
// }).then(data => identitiesLogsDataSource.deleteByUUIDs([
//     data[0].serialNumber,
//     data[1].serialNumber
// ])).then(data => {
//     console.log(data);
//     return identitiesLogsDataSource.fetchAll();
// }).then(data => {
//     console.log(data);
// }).catch(error => console.log(error));

// let identitiesLogsDataSource = new IdentitiesLogsDataSource();
// identitiesLogsDataSource.fetchAll().then(data => {
    // console.log(data)
    // return data;
// }).catch(error => console.log(error));