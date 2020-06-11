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
        "identity": {
          "uuid": "4beb7d5d-4a15-4a17-a457-bfaea03fc41d",
          "checkSum": "111567cd2a5f001034ae59fa305309eb85fcaff0c4048164e2ec4d38cfcdc2d18be284736dd8a8db72beab9e54feea67defbf712f5bb4abccb803a0b8747e78f"
        }
    }
).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.log(error.response.data);
});