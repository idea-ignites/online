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
        "operation": "clearBySerialNumbers",
        "serialNumbers": [
            '79dc240c-7115-41d2-b692-31802d6d8580',
            'f5a39c5b-abf3-46cc-ace4-fddc6424fc84'

        ]
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