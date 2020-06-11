var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var axios = require("axios");
window.addEventListener("load", onLoaded);
function onLoaded(event) {
    console.log("hello!");
    identityCheck();
    transmittingHeartbeats();
}
function transmittingHeartbeats() {
    return __awaiter(this, void 0, void 0, function () {
        var heartbeatPeriodInSeconds, heartbeatObjectPMS;
        return __generator(this, function (_a) {
            heartbeatPeriodInSeconds = 4;
            heartbeatObjectPMS = makeHeartbeat(heartbeatPeriodInSeconds);
            heartbeatObjectPMS.then(function (heartbeatObject) {
                return heartbeatObject;
            })
                .then(function (heartbeatObject) {
                var response = sendHeartbeat(heartbeatObject);
                return response;
            })
                .then(function (response) {
                transmittingHeartbeats();
            })
                .catch(function (error) { return console.log(error); });
            return [2 /*return*/];
        });
    });
}
function sendHeartbeat(heartbeatObject) {
    return __awaiter(this, void 0, void 0, function () {
        var instance, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instance = axios.create({
                        baseURL: 'http://services.yoursite.com',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    heartbeatObject.purpose = "newHeartbeat";
                    return [4 /*yield*/, instance.post('/heartbeats', heartbeatObject).then(function (response) {
                            return response.data;
                        }).catch(function (error) {
                            console.log(error);
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
function makeHeartbeat(periodInSeconds) {
    return new Promise(function (resolve, reject) {
        var identityObject = getIdentityFromLocalStorage();
        setTimeout(function () {
            var newHeartbeatObject = {
                "identity": identityObject,
                "datetime": Date.now()
            };
            resolve(newHeartbeatObject);
        }, periodInSeconds * 1000);
    });
}
function saveIdentityObjectToLocalStorage(identityObject) {
    window.localStorage.setItem("identityUUID", identityObject.uuid);
    window.localStorage.setItem("identityCheckSum", identityObject.checkSum);
    return identityObject;
}
function getIdentityFromLocalStorage() {
    var localUUID = window.localStorage.getItem("identityUUID") || "";
    var localUUIDCheckSum = window.localStorage.getItem("identityCheckSum") || "";
    var uuidObject = {
        uuid: localUUID,
        checkSum: localUUIDCheckSum
    };
    return uuidObject;
}
function isThereAlreadyAnIdentityInLocalStorage() {
    var identityObject = getIdentityFromLocalStorage();
    return identityObject.uuid !== '';
}
function identityCheck() {
    if (!isThereAlreadyAnIdentityInLocalStorage()) {
        issueNewIdentity()
            .then(function (identityObject) { return saveIdentityObjectToLocalStorage(identityObject); })
            .then(function (identityObject) { return validateIdentity(identityObject); })
            .then(function (validateResult) {
            console.log("new identity issued and validated.");
            console.log(validateResult);
        })
            .catch(function (error) { return console.log(error); });
    }
    else {
        validateIdentity(getIdentityFromLocalStorage())
            .then(function (validateResult) {
            console.log("identity validated");
        })
            .catch(function (error) { return console.log(error); });
    }
}
function issueNewIdentity() {
    return __awaiter(this, void 0, void 0, function () {
        var instance, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instance = axios.create({
                        baseURL: 'http://services.yoursite.com',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    return [4 /*yield*/, instance.post('/identities', {
                            "purpose": "issueNew"
                        }).then(function (response) {
                            return response.data;
                        }).catch(function (error) {
                            console.log(error.response.data);
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
function validateIdentity(identitiesObject) {
    return __awaiter(this, void 0, void 0, function () {
        var instance, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instance = axios.create({
                        baseURL: 'http://services.yoursite.com',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    return [4 /*yield*/, instance.post('/identities', {
                            "purpose": "validate",
                            "identity": identitiesObject
                        }).then(function (response) {
                            return response.data;
                        }).catch(function (error) {
                            console.log(error.response.data);
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
