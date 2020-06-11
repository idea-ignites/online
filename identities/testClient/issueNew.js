#!/usr/local/bin/node

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:1572',
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.post(
    '/identities', 
    {
        "purpose": "issueNew"
    }
).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.log(error.response.data);
});