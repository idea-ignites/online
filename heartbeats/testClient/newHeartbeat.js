#!/usr/local/bin/node

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:1574',
    headers: {
        'Content-Type': 'application/json'
    }
});

let justNow = Date.now();

instance.post(
    '/heartbeats', 
    {
        "purpose": "newHeartbeat",
        "datetime": justNow,
        "identity": {
            uuid: '41d7fe9c-32c3-44b3-9dc3-12e14d6e2bcb',
            checkSum: '4263d19b1aa8a68319e0032eb2a46983d4792c0365099bcb0c54ff1adfbd2c3bebf2171b57c92cdb844602fa68890ceea5fbe2611210a4b91df9d463df489cc1'
        }
    }
    // {
    //     "headers": {

    //     }
    // }
).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.log(error);
});