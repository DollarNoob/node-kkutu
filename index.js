"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Client = void 0;
var events_1 = require("events");
var node_fetch_1 = require("node-fetch");
var os_1 = require("os");
var path_1 = require("path");
var puppeteer_extra_1 = require("puppeteer-extra");
puppeteer_extra_1["default"].use(require("puppeteer-extra-plugin-stealth")());
var _this;
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client() {
        var _this_1 = _super.call(this) || this;
        _this = _this_1;
        return _this_1;
    }
    Client.prototype.launch = function (executablePath, headless, userDataDir) {
        if (executablePath === void 0) { executablePath = "./chrome/chrome.exe"; }
        if (headless === void 0) { headless = false; }
        if (userDataDir === void 0) { userDataDir = (0, path_1.join)((0, os_1.tmpdir)(), "node-kkutu"); }
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, session, mainWSId;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = _this;
                            return [4 /*yield*/, puppeteer_extra_1["default"].launch({ "executablePath": executablePath, "headless": headless, "userDataDir": userDataDir })["catch"](reject)];
                        case 1:
                            _a.browser = _c.sent();
                            _b = _this;
                            return [4 /*yield*/, _this.browser.newPage()];
                        case 2:
                            _b.page = _c.sent();
                            return [4 /*yield*/, _this.browser.pages().then(function (pages) { return pages[0].close(); })];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, _this.page.target().createCDPSession()];
                        case 4:
                            session = _c.sent();
                            return [4 /*yield*/, session.send("Network.enable")];
                        case 5:
                            _c.sent();
                            return [4 /*yield*/, session.send("Page.enable")];
                        case 6:
                            _c.sent();
                            mainWSId = "";
                            session.on("Network.webSocketFrameReceived", function (params) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var _a, payload, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, payload;
                                    return __generator(this, function (_m) {
                                        switch (_m.label) {
                                            case 0:
                                                if (params.requestId === mainWSId)
                                                    return [2 /*return*/];
                                                _a = params.response.opcode;
                                                switch (_a) {
                                                    case 1: return [3 /*break*/, 1];
                                                    case 2: return [3 /*break*/, 22];
                                                }
                                                return [3 /*break*/, 23];
                                            case 1:
                                                try {
                                                    payload = JSON.parse(params.response.payloadData);
                                                }
                                                catch (_o) { }
                                                if (!!payload) return [3 /*break*/, 2];
                                                return [2 /*return*/];
                                            case 2:
                                                if (!(payload.type === "conn" && payload.user.id === _this.accountData.id)) return [3 /*break*/, 6];
                                                mainWSId = params.requestId;
                                                _b = _this;
                                                _d = (_c = _this.page).queryObjects;
                                                return [4 /*yield*/, _this.page.evaluateHandle("WebSocket.prototype")];
                                            case 3: return [4 /*yield*/, _d.apply(_c, [_m.sent()])];
                                            case 4:
                                                _b.sockets = _m.sent();
                                                _e = _this;
                                                return [4 /*yield*/, _this.page.evaluate(function (sockets) { return sockets.find(function (socket) { return !socket.url.includes("&"); }).url; }, _this.sockets)];
                                            case 5:
                                                _e.mainWS = _m.sent();
                                                _this.emit("connect", payload.user);
                                                return [3 /*break*/, 22];
                                            case 6:
                                                if (!(payload.type === "connRoom")) return [3 /*break*/, 10];
                                                _f = _this;
                                                _h = (_g = _this.page).queryObjects;
                                                return [4 /*yield*/, _this.page.evaluateHandle("WebSocket.prototype")];
                                            case 7: return [4 /*yield*/, _h.apply(_g, [_m.sent()])];
                                            case 8:
                                                _f.sockets = _m.sent();
                                                _j = _this;
                                                return [4 /*yield*/, _this.page.evaluate(function (sockets, roomId) { return sockets.find(function (socket) { return socket.url.endsWith("&" + roomId); }).url; }, _this.sockets, payload.user.place)];
                                            case 9:
                                                _j.gameWS = _m.sent();
                                                _this.emit("connectRoom", payload.user);
                                                return [3 /*break*/, 22];
                                            case 10:
                                                if (!(payload.type === "disconnRoom")) return [3 /*break*/, 11];
                                                delete payload.type;
                                                _this.emit("disconnectRoom", payload);
                                                return [3 /*break*/, 22];
                                            case 11:
                                                if (!(payload.code === 416)) return [3 /*break*/, 13];
                                                return [4 /*yield*/, _this.sendMessage({ "type": "enter", "id": payload.id, "spectate": true }, false)];
                                            case 12:
                                                _m.sent();
                                                return [3 /*break*/, 22];
                                            case 13:
                                                _k = payload.type;
                                                switch (_k) {
                                                    case "starting": return [3 /*break*/, 14];
                                                    case "turnStart": return [3 /*break*/, 15];
                                                    case "turnError": return [3 /*break*/, 17];
                                                    case "turnEnd": return [3 /*break*/, 18];
                                                    case "roundReady": return [3 /*break*/, 19];
                                                    case "roundEnd": return [3 /*break*/, 20];
                                                    case "error": return [3 /*break*/, 21];
                                                    case "preRoom": return [3 /*break*/, 21];
                                                    case "room": return [3 /*break*/, 21];
                                                    case "user": return [3 /*break*/, 21];
                                                }
                                                return [3 /*break*/, 21];
                                            case 14:
                                                delete payload.type;
                                                _this.emit("gameStart", payload);
                                                return [3 /*break*/, 22];
                                            case 15:
                                                delete payload.type;
                                                _l = payload;
                                                return [4 /*yield*/, _this.page.evaluate("document.querySelector('.game-input').getAttribute('style')")];
                                            case 16:
                                                _l.myTurn = (_m.sent()) === "display: block;";
                                                _this.emit("turnStart", payload);
                                                return [3 /*break*/, 22];
                                            case 17:
                                                delete payload.type;
                                                _this.emit("turnError", payload);
                                                return [3 /*break*/, 22];
                                            case 18:
                                                delete payload.type;
                                                _this.emit(payload.score < 0 ? "roundEnd" : "turnEnd", payload);
                                                return [3 /*break*/, 22];
                                            case 19:
                                                delete payload.type;
                                                _this.emit("roundStart", payload);
                                                return [3 /*break*/, 22];
                                            case 20:
                                                delete payload.type;
                                                _this.emit("gameEnd", payload);
                                                return [3 /*break*/, 22];
                                            case 21: 
                                            // NotImplementedError
                                            return [3 /*break*/, 22];
                                            case 22:
                                                try {
                                                    payload = Buffer.from(params.response.payloadData, "base64").toString("utf8");
                                                }
                                                catch (_p) { }
                                                if (payload && payload.startsWith(Buffer.from("AgE=", "base64").toString("utf8")) && payload.endsWith(Buffer.from("AA==", "base64").toString("utf8")))
                                                    _this.emit("message", payload.split(Buffer.from("AA==", "base64").toString("utf8"))[1]);
                                                return [3 /*break*/, 24];
                                            case 23: 
                                            // NotImplementedError
                                            return [3 /*break*/, 24];
                                            case 24: return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                            _this.page.on("response", function (res) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!(res.url() === "https://kkutu.co.kr/o/v1/users/me")) return [3 /*break*/, 2];
                                                _a = _this;
                                                return [4 /*yield*/, res.json().then(function (res) { return ({ "id": res.data._id, "nick": res.data.nick }); })["catch"](function () { return ({ "id": "", "nick": "" }); })];
                                            case 1:
                                                _a.accountData = _b.sent();
                                                _b.label = 2;
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                            return [4 /*yield*/, _this.page.goto("https://kkutu.co.kr/")];
                        case 7:
                            _c.sent();
                            resolve(_this.page);
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    Client.prototype.close = function () {
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _this.browser.close()["catch"](reject)];
                        case 1:
                            _a.sent();
                            resolve(true);
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    Client.prototype.searchWord = function (word, lang) {
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, node_fetch_1["default"])("https://kkutu.co.kr/o/dict/" + encodeURIComponent(word) + "?lang=" + lang, {
                                "headers": {
                                    "Accept": "application/json, text/plain, */*",
                                    "Accept-Language": "en-US,en;q=0.9",
                                    "Referer": "https://kkutu.co.kr/o/game",
                                    "Referrer-Policy": "strict-origin-when-cross-origin"
                                },
                                "body": null,
                                "method": "GET"
                            }).then(function (res) { return res.json(); }).then(resolve)["catch"](reject)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    Client.prototype.getRankingByPage = function (page) {
        return new Promise(function (resolve, reject) {
            (0, node_fetch_1["default"])("https://kkutu.co.kr/o/ranking?p=" + page ? page : 0, {
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://kkutu.co.kr/o/game",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
                "method": "GET"
            }).then(function (res) { return res.json(); }).then(function (res) { return resolve(res.data); })["catch"](reject);
        });
    };
    Client.prototype.getRankingById = function (id) {
        return new Promise(function (resolve, reject) {
            (0, node_fetch_1["default"])("https://kkutu.co.kr/o/ranking?id=" + id, {
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://kkutu.co.kr/o/game",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
                "method": "GET"
            }).then(function (res) { return res.json(); }).then(function (res) { return resolve(res.data); })["catch"](reject);
        });
    };
    Client.prototype.createGame = function (title, password, limit, mode, round, time, injPick, manner, gentle, etiquette, inJeong, mission, loanWord, proverb, strict, sami, no2, onlyBeginner, wordMaxLen, noLeave, doNotJoinDuringGame, order, wordLength) {
        if (injPick === void 0) { injPick = []; }
        if (order === void 0) { order = "correct"; }
        if (wordLength === void 0) { wordLength = "short"; }
        return new Promise(function (resolve, reject) { return _this.sendMessage({ "type": "enter", "title": title, "password": password, "limit": String(limit), "mode": String(mode), "round": String(round), "time": String(time), "opts": { "injpick": injPick, "manner": manner, "gentle": gentle, "etiquette": etiquette, "injeong": inJeong, "mission": mission, "loanword": loanWord, "proverb": proverb, "strict": strict, "sami": sami, "no2": no2, "onlybeginner": onlyBeginner, "wordmaxlen": wordMaxLen, "noleave": noLeave, "donotjoinduringgame": doNotJoinDuringGame }, "pq": { "order": order, "wordlength": wordLength } }, false).then(resolve)["catch"](reject); });
    };
    Client.prototype.editGame = function (title, password, limit, mode, round, time, injPick, manner, gentle, etiquette, inJeong, mission, loanWord, proverb, strict, sami, no2, onlyBeginner, wordMaxLen, noLeave, doNotJoinDuringGame, order, wordLength) {
        if (injPick === void 0) { injPick = []; }
        if (order === void 0) { order = "correct"; }
        if (wordLength === void 0) { wordLength = "short"; }
        return new Promise(function (resolve, reject) { return _this.sendMessage({ "type": "setRoom", "title": title, "password": password, "limit": String(limit), "mode": String(mode), "round": String(round), "time": String(time), "opts": { "injpick": injPick, "manner": manner, "gentle": gentle, "etiquette": etiquette, "injeong": inJeong, "mission": mission, "loanword": loanWord, "proverb": proverb, "strict": strict, "sami": sami, "no2": no2, "onlybeginner": onlyBeginner, "wordmaxlen": wordMaxLen, "noleave": noLeave, "donotjoinduringgame": doNotJoinDuringGame }, "pq": { "order": order, "wordlength": wordLength } }, false).then(resolve)["catch"](reject); });
    };
    Client.prototype.joinGame = function (id) {
        return new Promise(function (resolve, reject) { return _this.sendMessage({ "type": "enter", "id": id }, false).then(resolve)["catch"](reject); });
    };
    Client.prototype.startGame = function () {
        return new Promise(function (resolve, reject) { return _this.sendMessage({ "type": "start" }, true).then(resolve)["catch"](reject); });
    };
    Client.prototype.practiceGame = function (level) {
        return new Promise(function (resolve, reject) { return _this.sendMessage({ "type": "practice", "level": String(level) }, true).then(resolve)["catch"](reject); });
    };
    Client.prototype.inviteGame = function (id) {
        return new Promise(function (resolve, reject) { return _this.sendMessage({ "type": "invite", "target": id }, true).then(resolve)["catch"](reject); });
    };
    Client.prototype.leaveGame = function () {
        return new Promise(function (resolve, reject) { return _this.sendMessage({ "type": "leave" }, true).then(resolve)["catch"](reject); });
    };
    Client.prototype.setTeam = function (id) {
        return new Promise(function (resolve, reject) { return _this.sendMessage({ "type": "team", "value": id }, true).then(resolve)["catch"](reject); });
    };
    Client.prototype.setAI = function (id, level, team) {
        return new Promise(function (resolve, reject) { return _this.sendMessage({ "type": "setAI", "target": id, "level": String(level), "team": String(team) }, true).then(resolve)["catch"](reject); });
    };
    Client.prototype.setSpectator = function (state) {
        return new Promise(function (resolve, reject) { return _this.sendMessage({ "type": "form", "mode": state ? "S" : "J" }, false).then(resolve)["catch"](reject); });
    };
    Client.prototype.sendMessage = function (message, inGame) {
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _this.page.evaluate(function (sockets, wsURL, message) { return sockets.find(function (socket) { return socket.url === wsURL; }).send(message); }, _this.sockets, inGame ? _this.gameWS : _this.mainWS, JSON.stringify(message))["catch"](reject)];
                        case 1:
                            _a.sent();
                            resolve(true);
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    Client.prototype.sendChatMessage = function (message, inGame) {
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
                        return [4 /*yield*/, _this.page.evaluate(function (sockets, wsURL, message) {
                                var bStr = atob(message);
                                var bLen = bStr.length;
                                var bArr = new Uint8Array(bLen);
                                for (var i = 0; i < bLen; i++)
                                    bArr[i] = bStr.charCodeAt(i);
                                sockets.find(function (socket) { return socket.url === wsURL; }).send(bArr.buffer);
                            }, _this.sockets, inGame ? _this.gameWS : _this.mainWS, Buffer.from(Buffer.from("AgEyMTI0Mzk3MzI1AA==", "base64").toString("utf8") + message + Buffer.from("AA==", "base64").toString("utf8")).toString("base64"))["catch"](reject)];
                        case 1:
                            // https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
                            _a.sent();
                            resolve(true);
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    return Client;
}(events_1.EventEmitter));
exports.Client = Client;
