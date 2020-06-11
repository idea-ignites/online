#!/usr/local/bin/node

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:1574',
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.get(
    '/heartbeats',
    {
        headers: {
            'x-master-ticket': '00001ILoveBlueSky'
        }
    }
).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.log(error.response.data);
});