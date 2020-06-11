const axios = require("axios");

window.addEventListener("load", onLoaded);

function onLoaded(event) {
    console.log("hello!");

    identityCheck();
    transmittingHeartbeats();
}

async function transmittingHeartbeats() {
    let heartbeatPeriodInSeconds = 4;
    let heartbeatObjectPMS = makeHeartbeat(heartbeatPeriodInSeconds);

    heartbeatObjectPMS.then(heartbeatObject => {
        return heartbeatObject;
    })
    .then(heartbeatObject => {
        let response = sendHeartbeat(heartbeatObject);
        return response;
    })
    .then(response => {
        transmittingHeartbeats();
    })
    .catch(error => console.log(error));
}

async function sendHeartbeat(heartbeatObject) {
    const instance = axios.create({
        baseURL: 'http://services.yoursite.com',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    heartbeatObject.purpose = "newHeartbeat";

    let response = await instance.post(
        '/heartbeats', 
        heartbeatObject
    ).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });

    return response;
}

function makeHeartbeat(periodInSeconds) {
    return new Promise((resolve, reject) => {
        let identityObject = getIdentityFromLocalStorage();
        setTimeout(
            () => {
                let newHeartbeatObject = {
                    "identity": identityObject,
                    "datetime": Date.now()
                };

                resolve(newHeartbeatObject);
            }, 
            periodInSeconds*1000
        );
    });
}

function saveIdentityObjectToLocalStorage(identityObject) {
    window.localStorage.setItem("identityUUID", identityObject.uuid);
    window.localStorage.setItem("identityCheckSum", identityObject.checkSum);

    return identityObject;
}

function getIdentityFromLocalStorage() {
    let localUUID = window.localStorage.getItem("identityUUID") || "";
    let localUUIDCheckSum = window.localStorage.getItem("identityCheckSum") || "";

    let uuidObject = {
        uuid: localUUID,
        checkSum: localUUIDCheckSum
    };

    return uuidObject;
}

function isThereAlreadyAnIdentityInLocalStorage() {
    let identityObject = getIdentityFromLocalStorage();
    return identityObject.uuid !== '';
}

function identityCheck() {
    if (!isThereAlreadyAnIdentityInLocalStorage()) {
        issueNewIdentity()
            .then(identityObject => saveIdentityObjectToLocalStorage(identityObject))
            .then(identityObject => validateIdentity(identityObject))
            .then(validateResult => {
                console.log("new identity issued and validated.");
                console.log(validateResult);
            })
            .catch(error => console.log(error));
    }
    else {
        validateIdentity(getIdentityFromLocalStorage())
            .then(validateResult => {
                console.log("identity validated");
            })
            .catch(error => console.log(error));
    }
}

async function issueNewIdentity() {
    const instance = axios.create({
        baseURL: 'http://services.yoursite.com',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    let response = await instance.post(
        '/identities', 
        {
            "purpose": "issueNew"
        }
    ).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error.response.data);
    });

    return response;
}

async function validateIdentity(identitiesObject) {

    const instance = axios.create({
        baseURL: 'http://services.yoursite.com',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let response = await instance.post(
        '/identities', 
        {
            "purpose": "validate",
            "identity": identitiesObject
        }
    ).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error.response.data);
    });

    return response;
}