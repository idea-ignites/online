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
        "purpose": "validate",
        identity: {
            uuid: 'da127fd0-9ddf-440d-ae0f-0c8484ba0215',
            checkSum: '16c0e80f36e94de77a4f35c8531a8c6a501867ccaf27adb0054d718ea4a4bb4a05810e6a59da0278702e6f3273bfb741a30056e751a1c89a9296a32524276c18'
        }
    }
).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.log(error.response.data);
});