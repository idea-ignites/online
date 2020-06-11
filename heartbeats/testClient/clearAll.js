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
        "purpose": "clearAll"
    },
    {
        "headers": {
            'x-master-ticket': 'ILoveBlueSky'
        }
    }
).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.log(error.response.data);
});