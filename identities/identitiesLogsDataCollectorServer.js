"use strict";
exports.__esModule = true;
var uuid_1 = require("uuid");
var express = require("express");
var bodyParser = require("body-parser");
var crypto = require("crypto");
var IdentitiesLogsDataCollectorServer = /** @class */ (function () {
    function IdentitiesLogsDataCollectorServer() {
        this.masterSecret = '';
        this.logs = [];
        this.port = 1572;
        this.initialize();
    }
    IdentitiesLogsDataCollectorServer.prototype.initialize = function () {
        var app = express();
        this.useMiddlewares(app);
        this.registerRoutes(app);
        this.app = app;
    };
    IdentitiesLogsDataCollectorServer.prototype.useMiddlewares = function (app) {
        var _this = this;
        app.use(bodyParser.json({
            type: "application/json"
        }));
        app.use(function (err, req, res, next) { return _this.errorHandler(err, req, res, next); });
    };
    IdentitiesLogsDataCollectorServer.prototype.resourcesClaim = function () {
        return this.resourceDeclaration;
    };
    IdentitiesLogsDataCollectorServer.prototype.registerRoutes = function (app) {
        var _this = this;
        this.resourceDeclaration = [
            '/identitiesLogs',
            '/identities'
        ];
        app.get('/identitiesLogs', function (req, res) { return _this.retrieveAllLogs(req, res); });
        app.post('/identitiesLogs', function (req, res) { return _this.deleteLogs(req, res); });
        app.post('/identities', function (req, res) { return _this.onIdentitiesRequest(req, res); });
        app.use(function (err, req, res, next) { return _this.errorHandler(err, req, res, next); });
    };
    IdentitiesLogsDataCollectorServer.prototype.deleteLogs = function (req, res) {
        if (req.body.operation === 'clearBySerialNumbers') {
            var counts = this.clearLogsBySerialNumbers(req.body.serialNumbers);
            res.json({
                "message": "Deleted " + counts + " records",
                "passed": true
            });
        }
        else {
            res.json({ "message": "Nothing happend", "passed": true });
        }
    };
    IdentitiesLogsDataCollectorServer.prototype.setContentType = function (req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        next();
    };
    IdentitiesLogsDataCollectorServer.prototype.setStatusCodeOK = function (req, res, next) {
        res.statusCode = 200;
        next();
    };
    IdentitiesLogsDataCollectorServer.prototype.listen = function (port) {
        var _this = this;
        this.app.listen(port, function () { return _this.onServerStarted(port); });
    };
    IdentitiesLogsDataCollectorServer.prototype.setMasterSecret = function (secret) {
        this.masterSecret = secret;
    };
    IdentitiesLogsDataCollectorServer.prototype.errorHandler = function (err, req, res, next) {
        console.log(err.message);
        res.status(400);
        res.json({
            'message': err.message,
            'passed': false
        });
    };
    IdentitiesLogsDataCollectorServer.prototype.clearLogsBySerialNumbers = function (serialNumbers) {
        var length0 = this.logs.length;
        var newLedger = this.logs.filter(function (logObject) { return serialNumbers.indexOf(logObject.serialNumber) === -1; });
        this.logs = newLedger;
        var length1 = this.logs.length;
        return length0 - length1;
    };
    IdentitiesLogsDataCollectorServer.prototype.getOrigin = function (req) {
        var origin = req.headers['Origin'] || req.headers['origin'] || '';
        return origin;
    };
    IdentitiesLogsDataCollectorServer.prototype.onIdentitiesRequest = function (req, res) {
        var purpose = req.body.purpose;
        var result = true;
        var identity = {};
        if (purpose === 'issueNew') {
            identity = this.handleIssueNew(req, res);
            result = true;
        }
        else if (purpose === 'validate') {
            result = this.handleValidate(req, res);
            identity = req.body.identity;
        }
        var datetime = Date.now();
        var ipAddr = this.getIPAddress(req);
        var userAgent = this.getUserAgent(req);
        var origin = this.getOrigin(req);
        this.logs.push({
            "purpose": purpose,
            "datetime": datetime,
            "identity": identity,
            "passed": result,
            "serialNumber": uuid_1.v4(),
            "ipAddr": ipAddr,
            "userAgent": userAgent,
            "origin": origin
        });
    };
    IdentitiesLogsDataCollectorServer.prototype.handleIssueNew = function (req, res) {
        var uuidObject = this.makeUUIDObject();
        res.json(uuidObject);
        return uuidObject;
    };
    IdentitiesLogsDataCollectorServer.prototype.handleValidate = function (req, res) {
        var identity = req.body.identity;
        var checkResult = this.verifyUUIDObject(identity);
        res.json({
            "checkResult": checkResult
        });
        return checkResult;
    };
    IdentitiesLogsDataCollectorServer.prototype.makeUUIDObject = function () {
        var uuidString = uuid_1.v4();
        var uuidHash = crypto.createHmac('sha512', this.masterSecret)
            .update(uuidString)
            .digest('hex');
        var uuidObject = {
            uuid: uuidString,
            checkSum: uuidHash
        };
        return uuidObject;
    };
    IdentitiesLogsDataCollectorServer.prototype.verifyUUIDObject = function (uuidObject) {
        var receivedUUIDHash = uuidObject.checkSum;
        var receivedUUIDString = uuidObject.uuid;
        var computedUUIDHash = crypto.createHmac('sha512', this.masterSecret)
            .update(receivedUUIDString)
            .digest('hex');
        var checkResult = computedUUIDHash === receivedUUIDHash;
        return checkResult;
    };
    IdentitiesLogsDataCollectorServer.prototype.onServerStarted = function (port) {
        console.log("Server running at port " + port);
    };
    IdentitiesLogsDataCollectorServer.prototype.retrieveAllLogs = function (req, res) {
        res.json(this.logs);
    };
    IdentitiesLogsDataCollectorServer.prototype.getUserAgent = function (req) {
        var ua = req.headers['User-Agent'] ||
            req.headers['user-agent'] ||
            '';
        return ua;
    };
    IdentitiesLogsDataCollectorServer.prototype.getIPAddress = function (req) {
        var ip = req.headers['x-forwarded-for'] ||
            req.headers['X-Forwarded-For'] ||
            req.connection.remoteAddress;
        return ip;
    };
    return IdentitiesLogsDataCollectorServer;
}());
var server = new IdentitiesLogsDataCollectorServer();
server.listen(1572);
