import { __awaiter, __generator } from "tslib";
import { NetworkMonitor } from '../core/networkMonitor';
import { debug } from '../core/debug';
// Mock debug module
jest.mock('../core/debug', function () { return ({
    debug: {
        info: jest.fn(),
        error: jest.fn()
    }
}); });
// Mock Response and Headers globally
global.Response = /** @class */ (function () {
    function Response(body, init) {
        this.body = body;
        this.status = (init === null || init === void 0 ? void 0 : init.status) || 200;
        this.statusText = (init === null || init === void 0 ? void 0 : init.statusText) || 'OK';
        this.headers = new Headers(init === null || init === void 0 ? void 0 : init.headers);
    }
    Response.prototype.json = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, JSON.parse(this.body)];
            });
        });
    };
    Response.prototype.text = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.body];
            });
        });
    };
    Response.prototype.clone = function () {
        return new Response(this.body, {
            status: this.status,
            statusText: this.statusText,
            headers: this.headers
        });
    };
    return Response;
}());
global.Headers = /** @class */ (function () {
    function Headers(init) {
        var _this = this;
        this.headers = {};
        if (init) {
            Object.entries(init).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                _this.set(key, value);
            });
        }
    }
    Headers.prototype.get = function (name) {
        return this.headers[name.toLowerCase()] || null;
    };
    Headers.prototype.set = function (name, value) {
        this.headers[name.toLowerCase()] = value;
    };
    Headers.prototype.entries = function () {
        return Object.entries(this.headers);
    };
    return Headers;
}());
describe('NetworkMonitor', function () {
    var monitor;
    var originalFetch;
    beforeEach(function () {
        jest.clearAllMocks();
        originalFetch = global.fetch;
        monitor = new NetworkMonitor();
    });
    afterEach(function () {
        global.fetch = originalFetch;
    });
    describe('fetch monitoring', function () {
        it('should track successful fetch requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = new Response(JSON.stringify({ data: 'test' }), {
                            status: 200,
                            statusText: 'OK',
                            headers: new Headers({ 'Content-Type': 'application/json' })
                        });
                        global.fetch = jest.fn().mockResolvedValue(mockResponse);
                        return [4 /*yield*/, fetch('https://api.example.com/data', {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json' }
                            })];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(200);
                        expect(debug.info).toHaveBeenCalledWith('NETWORK', 'Request completed', expect.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should track failed fetch requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = new Response('Not Found', {
                            status: 404,
                            statusText: 'Not Found',
                            headers: new Headers({ 'Content-Type': 'text/plain' })
                        });
                        global.fetch = jest.fn().mockRejectedValue(mockResponse);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch('https://api.example.com/invalid')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        expect(error_1).toBeDefined();
                        return [3 /*break*/, 4];
                    case 4:
                        expect(debug.error).toHaveBeenCalledWith('NETWORK', 'Request failed', expect.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('request management', function () {
        it('should store requests up to the maximum limit', function () {
            var maxRequests = 1000;
            for (var i = 0; i < maxRequests + 10; i++) {
                monitor['requests'].push({
                    id: "req-".concat(i),
                    url: "https://api.example.com/".concat(i),
                    method: 'GET',
                    status: 200,
                    statusText: 'OK',
                    duration: 100,
                    size: 1024,
                    initiator: 'fetch',
                    timestamp: Date.now()
                });
            }
            expect(monitor['requests'].length).toBeLessThanOrEqual(maxRequests);
        });
        it('should clear requests', function () {
            monitor['requests'].push({
                id: 'req-1',
                url: 'https://api.example.com/test',
                method: 'GET',
                status: 200,
                statusText: 'OK',
                duration: 100,
                size: 1024,
                initiator: 'fetch',
                timestamp: Date.now()
            });
            monitor.clearRequests();
            expect(monitor['requests'].length).toBe(0);
        });
    });
    describe('request callbacks', function () {
        it('should notify callbacks when requests are completed', function () {
            var callback = jest.fn();
            monitor.onRequest(callback);
            var request = {
                id: 'req-1',
                url: 'https://api.example.com/test',
                method: 'GET',
                status: 200,
                statusText: 'OK',
                duration: 100,
                size: 1024,
                initiator: 'fetch',
                timestamp: Date.now()
            };
            monitor['requests'].push(request);
            monitor['notifyRequestCallbacks'](request);
            expect(callback).toHaveBeenCalledWith(request);
        });
    });
    describe('header parsing', function () {
        it('should parse headers from string to object', function () {
            var headerString = 'content-type: application/json\nauthorization: Bearer token';
            var headers = monitor['parseHeaders'](headerString);
            expect(headers).toEqual({
                'content-type': 'application/json',
                'authorization': 'Bearer token'
            });
        });
    });
});
//# sourceMappingURL=NetworkMonitor.test.js.map