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
        "purpose": "clearBySerialNumbers",
        "serialNumbers": [
            '406a5194-9a44-4640-b45f-72262e6939d1',
            '2187ab13-069c-4ec8-8acd-6575df7a7af1'
        ]
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