#!/usr/local/bin/node

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:1572',
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.post(
    '/identitiesLogs', 
    {
        "operation": "clearSome",
        "onAndBefore": 1591449410169
    },
    {
        "headers": {
            "x-master-ticket": "ILoveBlueSky"
        }
    }
).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.log(error.response.data);
});