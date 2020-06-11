"use strict";
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
exports.__esModule = true;
exports.CaddyConfigure = void 0;
var fs = require('fs');
var spawn = require('child_process').spawn;
var axios_1 = require("axios");
var CaddyConfigure = /** @class */ (function () {
    function CaddyConfigure() {
        this.localCaddyConfigure = null;
        this.addReverseProxyRuleIsOccupied = false;
        this.caddyAPIEndPoint = "http://127.0.0.1:2019";
        this.synchronizingPeriod = 10;
        this.ifCaddyisNotStartedYetThenTryStartIt();
        this.synchronizeLocalConfigureToCaddy(this.synchronizingPeriod);
    }
    CaddyConfigure.prototype.caddyStart = function () {
        var caddyProcess = spawn('caddy', ['start'], { 'detached': true, 'stdio': 'ignore' });
    };
    CaddyConfigure.prototype.caddyStop = function () {
        var caddyProcess = spawn('caddy', ['stop'], { 'detached': true, 'stdio': 'ignore' });
    };
    CaddyConfigure.prototype.setConfigureSynchronizingPeriod = function (seconds) {
        this.synchronizingPeriod = seconds;
    };
    CaddyConfigure.prototype.synchronizeLocalConfigureToCaddy = function (periodSeconds) {
        var _this = this;
        return this.waitingPromise(periodSeconds).then(function (resolvedAt) {
            console.log("Start synchronizing configures...");
            _this.uploadLocalConfigureToCaddy()["catch"](function (error) { return console.log(error); });
            _this.synchronizeLocalConfigureToCaddy(periodSeconds);
        });
    };
    CaddyConfigure.prototype.waitingPromise = function (seconds) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () { return resolve(Date.now()); }, seconds * 1000);
        });
    };
    CaddyConfigure.prototype.isCaddyStarted = function () {
        return __awaiter(this, void 0, void 0, function () {
            var instance, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = this.getAxiosInstance();
                        return [4 /*yield*/, instance.get("/config/").then(function (response) {
                                return (response.status >= 100 && response.status < 300);
                            })["catch"](function (error) { return false; })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    CaddyConfigure.prototype.ifCaddyisNotStartedYetThenTryStartIt = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isCaddyStarted, justNow, timeToWait;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isCaddyStarted()];
                    case 1:
                        isCaddyStarted = _a.sent();
                        if (isCaddyStarted) {
                            console.log("Caddy is started.");
                        }
                        else {
                            console.log("Seems that caddy is not started yet, so we are trying to start it...");
                            this.caddyStart();
                            justNow = Date.now();
                            timeToWait = 4000;
                            while (Date.now() < (justNow + timeToWait)) {
                                // wait
                            }
                            this.ifCaddyisNotStartedYetThenTryStartIt();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CaddyConfigure.prototype.setCaddyApiEndPoint = function (apiEndPoint) {
        this.caddyAPIEndPoint = apiEndPoint;
    };
    CaddyConfigure.prototype.getAxiosInstance = function () {
        var instance = axios_1["default"].create({
            "baseURL": this.caddyAPIEndPoint,
            "headers": { "Content-Type": "application/json" }
        });
        return instance;
    };
    CaddyConfigure.prototype.uploadLocalConfigureToCaddy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var instance, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = this.getAxiosInstance();
                        return [4 /*yield*/, instance.post("/load", this.getLocalConfigure())];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    CaddyConfigure.prototype.downloadCaddyConfigureToLocal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var instance, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = this.getAxiosInstance();
                        return [4 /*yield*/, instance.get("/config/").then(function (caddyResponse) {
                                _this.loadConfigureFromDisk = caddyResponse.data;
                                return caddyResponse.data;
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    CaddyConfigure.prototype.getLocalConfigure = function () {
        if (!this.localCaddyConfigure) {
            this.localCaddyConfigure = this.loadConfigureFromDisk("default");
        }
        return this.localCaddyConfigure;
    };
    CaddyConfigure.prototype.getTemplate = function (templateName) {
        try {
            var data = fs.readFileSync(__dirname + "/caddyConfigureTemplates" + "/" + templateName + ".json", "utf8");
            return JSON.parse(data);
        }
        catch (err) {
            console.log(err);
            return null;
        }
    };
    CaddyConfigure.prototype.loadConfigureFromDisk = function (templateName) {
        return this.getTemplate(templateName);
    };
    CaddyConfigure.prototype.addReverseProxyRule = function (from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var routeObject, localCaddyConfigure;
            return __generator(this, function (_a) {
                console.log("Try to add route " + from + " => " + to + " ...");
                routeObject = this.reverseProxyRoute(from, to);
                localCaddyConfigure = this.getLocalConfigure();
                localCaddyConfigure.apps.http.servers.onlineServices.routes.push(routeObject);
                this.localCaddyConfigure = localCaddyConfigure;
                console.log("Route added.");
                return [2 /*return*/];
            });
        });
    };
    CaddyConfigure.prototype.reverseProxyRoute = function (from, to) {
        var routeTemplate = this.loadConfigureFromDisk("reverseProxyRoute");
        if (!routeTemplate) {
            return;
        }
        routeTemplate.match = from.map(function (sourceItem) {
            return { "path": [sourceItem] };
        });
        routeTemplate.handle[0].upstreams[0].dial = to;
        return routeTemplate;
    };
    return CaddyConfigure;
}());
exports.CaddyConfigure = CaddyConfigure;
