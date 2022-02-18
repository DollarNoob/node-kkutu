import {EventEmitter} from "events";
import fetch from "node-fetch";
import {tmpdir} from "os";
import {join} from "path";
import puppeteer from "puppeteer-extra";
puppeteer.use(require("puppeteer-extra-plugin-stealth")());
var _this: any;

export class Client extends EventEmitter {
    constructor() {
		super();
        _this = this;
    }

    launch(executablePath = "./chrome/chrome.exe", headless = false, userDataDir = join(tmpdir(), "node-kkutu")): Promise<any> {
        return new Promise(async function(resolve, reject) {
            _this.browser = await puppeteer.launch({"executablePath": executablePath, "headless": headless, "userDataDir": userDataDir}).catch(reject);
            _this.page = await _this.browser.newPage();
            await _this.browser.pages().then(pages => pages[0].close());
            
            var session = await _this.page.target().createCDPSession();
            await session.send("Network.enable");
            await session.send("Page.enable");

            var mainWSId = "";
            session.on("Network.webSocketFrameReceived", async function(params) {
                if (params.requestId === mainWSId) return;
                switch(params.response.opcode) {
                    case 1:
                        var payload;
                        try {
                            payload = JSON.parse(params.response.payloadData);
                        }
                        catch {}
                        if (!payload) return;
                        else if (payload.type === "conn" && payload.user.id === _this.accountData.id) {
                            mainWSId = params.requestId;
                            _this.sockets = await _this.page.queryObjects(await _this.page.evaluateHandle("WebSocket.prototype"));
                            _this.mainWS = await _this.page.evaluate(sockets => sockets.find(socket => !socket.url.includes("&")).url, _this.sockets);
                            _this.emit("connect", payload.user);
                        }
                        else if (payload.type === "connRoom") {
                            _this.sockets = await _this.page.queryObjects(await _this.page.evaluateHandle("WebSocket.prototype"));
                            _this.gameWS = await _this.page.evaluate((sockets, roomId) => sockets.find(socket => socket.url.endsWith("&" + roomId)).url, _this.sockets, payload.user.place);
                            _this.emit("connectRoom", payload.user);
                        }
                        else if (payload.type === "disconnRoom") {
                            delete payload.type;
                            _this.emit("disconnectRoom", payload);
                        }
                        else if (payload.code === 416) await _this.sendMessage({"type": "enter", "id": payload.id, "spectate": true}, false);
                        else {
                            switch(payload.type) {
                                case "starting":
                                    delete payload.type;
                                    _this.emit("gameStart", payload);
                                    break;
                                case "turnStart":
                                    delete payload.type;
                                    payload.myTurn = await _this.page.evaluate("document.querySelector('.game-input').getAttribute('style')") === "display: block;";
                                    _this.emit("turnStart", payload);
                                    break;
                                case "turnError":
                                    delete payload.type;
                                    _this.emit("turnError", payload);
                                    break;
                                case "turnEnd":
                                    delete payload.type;
                                    _this.emit(payload.score < 0 ? "roundEnd" : "turnEnd", payload);
                                    break;
                                case "roundReady":
                                    delete payload.type;
                                    _this.emit("roundStart", payload);
                                    break;
                                case "roundEnd":
                                    delete payload.type;
                                    _this.emit("gameEnd", payload);
                                    break;
                                case "error":
                                case "preRoom":
                                case "room":
                                case "user":
                                default:
                                    // NotImplementedError
                                    break;
                            }
                        }
                    case 2:
                        var payload;
                        try {
                            payload = Buffer.from(params.response.payloadData, "base64").toString("utf8");
                        }
                        catch {}
                        if (payload && payload.startsWith(Buffer.from("AgE=", "base64").toString("utf8")) && payload.endsWith(Buffer.from("AA==", "base64").toString("utf8"))) _this.emit("message", payload.split(Buffer.from("AA==", "base64").toString("utf8"))[1]);
                        break;
                    default:
                        // NotImplementedError
                        break;
                }
            });

            _this.page.on("response", async function(res) {
                if (res.url() === "https://kkutu.co.kr/o/v1/users/me") _this.accountData = await res.json().then(res => ({"id": res.data._id, "nick": res.data.nick})).catch(() => ({"id": "", "nick": ""}));
            });

            await _this.page.goto("https://kkutu.co.kr/");
            resolve(_this.page);
        });
    }

    close(): Promise<any> {
        return new Promise(async function(resolve, reject) {
            await _this.browser.close().catch(reject);
            resolve(true);
        });
    }

    searchWord(word: string, lang: string): Promise<any> {
        return new Promise(async function(resolve, reject) {
            await fetch(`https://kkutu.co.kr/o/dict/${encodeURIComponent(word)}?lang=${lang}`, {
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://kkutu.co.kr/o/game",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
                "method": "GET"
            }).then(res => res.json()).then(resolve).catch(reject);
        })
    }

    getRankingByPage(page?: number): Promise<any> {
        return new Promise(function(resolve, reject) {
            fetch("https://kkutu.co.kr/o/ranking?p=" + page ? page : 0, {
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://kkutu.co.kr/o/game",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
                "method": "GET"
            }).then(res => res.json()).then(res => resolve(res.data)).catch(reject);
        });
    }

    getRankingById(id: string): Promise<any> {
        return new Promise(function(resolve, reject) {
            fetch("https://kkutu.co.kr/o/ranking?id=" + id, {
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://kkutu.co.kr/o/game",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
                "method": "GET"
            }).then(res => res.json()).then(res => resolve(res.data)).catch(reject);
        });
    }

    createGame(title: string, password: string, limit: number, mode: number, round: number, time: number, injPick = [], manner: boolean, gentle: boolean, etiquette: boolean, inJeong: boolean, mission: boolean, loanWord: boolean, proverb: boolean, strict: boolean, sami: boolean, no2: boolean, onlyBeginner: boolean, wordMaxLen: boolean, noLeave: boolean, doNotJoinDuringGame: boolean, order = "correct", wordLength = "short"): Promise<any> {
        return new Promise((resolve, reject) => _this.sendMessage({"type": "enter", "title": title, "password": password, "limit": String(limit), "mode": String(mode), "round": String(round), "time": String(time), "opts": {"injpick": injPick, "manner": manner, "gentle": gentle, "etiquette": etiquette, "injeong": inJeong, "mission": mission, "loanword": loanWord, "proverb": proverb, "strict": strict, "sami": sami, "no2": no2, "onlybeginner": onlyBeginner, "wordmaxlen": wordMaxLen, "noleave": noLeave, "donotjoinduringgame": doNotJoinDuringGame}, "pq": {"order": order, "wordlength": wordLength}}, false).then(resolve).catch(reject));
    }

    editGame(title: string, password: string, limit: number, mode: number, round: number, time: number, injPick = [], manner: boolean, gentle: boolean, etiquette: boolean, inJeong: boolean, mission: boolean, loanWord: boolean, proverb: boolean, strict: boolean, sami: boolean, no2: boolean, onlyBeginner: boolean, wordMaxLen: boolean, noLeave: boolean, doNotJoinDuringGame: boolean, order = "correct", wordLength = "short"): Promise<any> {
        return new Promise((resolve, reject) => _this.sendMessage({"type": "setRoom", "title": title, "password": password, "limit": String(limit), "mode": String(mode), "round": String(round), "time": String(time), "opts": {"injpick": injPick, "manner": manner, "gentle": gentle, "etiquette": etiquette, "injeong": inJeong, "mission": mission, "loanword": loanWord, "proverb": proverb, "strict": strict, "sami": sami, "no2": no2, "onlybeginner": onlyBeginner, "wordmaxlen": wordMaxLen, "noleave": noLeave, "donotjoinduringgame": doNotJoinDuringGame}, "pq": {"order": order, "wordlength": wordLength}}, false).then(resolve).catch(reject));
    } 

    joinGame(id: number): Promise<any> {
        return new Promise((resolve, reject) => _this.sendMessage({"type": "enter", "id": id}, false).then(resolve).catch(reject));
    }

    startGame(): Promise<any> {
        return new Promise((resolve, reject) => _this.sendMessage({"type": "start"}, true).then(resolve).catch(reject));
    }

    practiceGame(level: number): Promise<any> {
        return new Promise((resolve, reject) => _this.sendMessage({"type": "practice", "level": String(level)}, true).then(resolve).catch(reject));
    }

    inviteGame(id: string): Promise<any> {
        return new Promise((resolve, reject) => _this.sendMessage({"type": "invite", "target": id}, true).then(resolve).catch(reject));
    }

    leaveGame(): Promise<any> {
        return new Promise((resolve, reject) => _this.sendMessage({"type": "leave"}, true).then(resolve).catch(reject));
    }

    setTeam(id: number): Promise<any> {
        return new Promise((resolve, reject) => _this.sendMessage({"type": "team", "value": id}, true).then(resolve).catch(reject));
    }

    setAI(id: string, level: number, team: number): Promise<any> {
        return new Promise((resolve, reject) => _this.sendMessage({"type": "setAI", "target": id, "level": String(level), "team": String(team)}, true).then(resolve).catch(reject));
    }

    setSpectator(state: boolean): Promise<any> {
        return new Promise((resolve, reject) => _this.sendMessage({"type": "form", "mode": state ? "S" : "J"}, false).then(resolve).catch(reject));
    }

    sendMessage(message: Object, inGame: boolean): Promise<any> {
        return new Promise(async function(resolve, reject) {
            await _this.page.evaluate((sockets, wsURL, message) => sockets.find(socket => socket.url === wsURL).send(message), _this.sockets, inGame ? _this.gameWS : _this.mainWS, JSON.stringify(message)).catch(reject);
            resolve(true);
        });
    }

    sendChatMessage(message: string, inGame: boolean): Promise<any> {
        return new Promise(async function(resolve, reject) {
            // https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
            await _this.page.evaluate(function(sockets, wsURL, message) {
                const bStr = atob(message);
                const bLen = bStr.length;
                const bArr = new Uint8Array(bLen);
                for (var i = 0; i < bLen; i++) bArr[i] = bStr.charCodeAt(i);
                sockets.find(socket => socket.url === wsURL).send(bArr.buffer);
            }, _this.sockets, inGame ? _this.gameWS : _this.mainWS, Buffer.from(Buffer.from("AgEyMTI0Mzk3MzI1AA==", "base64").toString("utf8") + message + Buffer.from("AA==", "base64").toString("utf8")).toString("base64")).catch(reject);
            resolve(true);
        });
    }
}

export declare interface Client {
    on(event: "connect", listener: (user: Object) => void): this;
	on(event: "connectRoom", listener: (user: Object) => void): this;
    on(event: "disconnectRoom", listener: (user: Object) => void): this;
    on(event: "message", listener: (message: string) => void): this;
	on(event: "gameStart", listener: (data: Object) => void): this;
	on(event: "gameEnd", listener: (data: Object) => void): this;
	on(event: "turnStart", listener: (data: Object) => void): this;
    on(event: "turnError", listener: (data: Object) => void): this;
	on(event: "turnEnd", listener: (data: Object) => void): this;
    on(event: "roundStart", listener: (data: Object) => void): this;
    on(event: "roundEnd", listener: (data: Object) => void): this;
}