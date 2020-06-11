"use strict";
exports.__esModule = true;
exports.HeartbeatsDataCollectorServer = void 0;
var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid').v4;
var HeartbeatsDataCollectorServer = /** @class */ (function () {
    function HeartbeatsDataCollectorServer() {
        this.logs = [];
        this.port = 1574;
        this.initialize();
    }
    HeartbeatsDataCollectorServer.prototype.initialize = function () {
        var app = express();
        this.useMiddlewares(app);
        this.registerRoutes(app);
        this.app = app;
    };
    HeartbeatsDataCollectorServer.prototype.useMiddlewares = function (app) {
        var _this = this;
        app.use(bodyParser.json({
            type: "application/json"
        }));
        app.use(function (err, req, res, next) { return _this.errorHandler(err, req, res, next); });
    };
    HeartbeatsDataCollectorServer.prototype.errorHandler = function (err, req, res, next) {
        console.log(err.message);
        res.json({
            "message": err.message,
            "passed": false
        });
    };
    HeartbeatsDataCollectorServer.prototype.listen = function (path) {
        var _this = this;
        this.app.listen(path, function () { return _this.onServerStarted(path); });
    };
    HeartbeatsDataCollectorServer.prototype.onServerStarted = function (path) {
        console.log("Server started at " + path);
    };
    HeartbeatsDataCollectorServer.prototype.resourcesClaim = function () {
        return this.resourcesDeclaration;
    };
    HeartbeatsDataCollectorServer.prototype.registerRoutes = function (app) {
        var _this = this;
        this.resourcesDeclaration = [
            '/heartbeats'
        ];
        app.get('/heartbeats', function (req, res) { return _this.getHeartbeatsHandler(req, res); });
        app.post('/heartbeats', function (req, res) { return _this.postHeartbeatshandler(req, res); });
    };
    HeartbeatsDataCollectorServer.prototype.postHeartbeatshandler = function (req, res) {
        var purpose = req.body.purpose;
        if (purpose === 'newHeartbeat') {
            this.handleNewHeartbeat(req, res);
        }
        else {
            this.handleClearBySerialNumbers(req, res);
        }
    };
    HeartbeatsDataCollectorServer.prototype.handleClearBySerialNumbers = function (req, res) {
        var counts = this.clearBySerialNumbers(req.body.serialNumbers);
        res.json({
            "message": "Deleted " + counts + " records",
            "okay": true
        });
    };
    HeartbeatsDataCollectorServer.prototype.getOrigin = function (req) {
        var origin = req.headers['Origin'] || req.headers['origin'] || '';
        return origin;
    };
    HeartbeatsDataCollectorServer.prototype.handleNewHeartbeat = function (req, res) {
        var justNow = Date.now();
        var origin = this.getOrigin(req);
        var newHeartbeat = {
            "receivedAt": justNow,
            "serialNumber": uuidv4(),
            "origin": origin
        };
        Object.assign(newHeartbeat, req.body);
        this.appendLog(newHeartbeat);
        res.json(newHeartbeat);
    };
    HeartbeatsDataCollectorServer.prototype.appendLog = function (logObject) {
        this.logs.push(logObject);
    };
    HeartbeatsDataCollectorServer.prototype.getHeartbeatsHandler = function (req, res) {
        res.json(this.logs);
    };
    HeartbeatsDataCollectorServer.prototype.clearBySerialNumbers = function (serialNumbers) {
        var length0 = this.logs.length;
        this.logs = this.logs.filter(function (logObject) { return serialNumbers.indexOf(logObject.serialNumber) === -1; });
        var length1 = this.logs.length;
        return length0 - length1;
    };
    return HeartbeatsDataCollectorServer;
}());
exports.HeartbeatsDataCollectorServer = HeartbeatsDataCollectorServer;
