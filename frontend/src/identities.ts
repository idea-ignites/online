const axios = require("axios");

export class Identities {

    saveIdentityObjectToLocalStorage(identityObject) {
        window.localStorage.setItem("identityUUID", identityObject.uuid);
        window.localStorage.setItem("identityCheckSum", identityObject.checkSum);

        return identityObject;
    }

    getIdentityFromLocalStorage() {
        let localUUID = window.localStorage.getItem("identityUUID") || "";
        let localUUIDCheckSum = window.localStorage.getItem("identityCheckSum") || "";

        let uuidObject = {
            uuid: localUUID,
            checkSum: localUUIDCheckSum
        };

        return uuidObject;
    }

    isThereAlreadyAnIdentityInLocalStorage() {
        let identityObject = this.getIdentityFromLocalStorage();
        return identityObject.uuid !== '';
    }

    identityCheck() {
        if (! this.isThereAlreadyAnIdentityInLocalStorage()) {
            this.issueNewIdentity()
                .then(identityObject => this.saveIdentityObjectToLocalStorage(identityObject))
                .then(identityObject => this.validateIdentity(identityObject))
                .then(validateResult => {
                    console.log("new identity issued and validated.");
                    console.log(validateResult);
                })
                .catch(error => console.log(error));
        }
        else {
            this.validateIdentity(this.getIdentityFromLocalStorage())
                .then(validateResult => {
                    console.log("identity validated");
                })
                .catch(error => console.log(error));
        }
    }

    async issueNewIdentity() {
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

    async validateIdentity(identitiesObject) {

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
}