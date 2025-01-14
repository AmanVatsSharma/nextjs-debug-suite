import { __awaiter, __extends, __generator } from "tslib";
import { debug } from './debug';
var NetworkMonitor = /** @class */ (function () {
    function NetworkMonitor() {
        this.debug = debug;
        this.requests = [];
        this.maxRequests = 1000;
        this.requestCallbacks = [];
        this.originalFetch = typeof window !== 'undefined' ? window.fetch : fetch;
        this.originalXHR = typeof window !== 'undefined' ? window.XMLHttpRequest : XMLHttpRequest;
        if (typeof window !== 'undefined') {
            this.monitorFetch();
            this.monitorXHR();
        }
    }
    NetworkMonitor.prototype.monitorFetch = function () {
        var _this = this;
        window.fetch = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var request, response, clonedResponse, _a, _b, _c, error_1;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            request = this.createRequest(args[0] instanceof URL ? args[0].toString() : args[0], ((_d = args[1]) === null || _d === void 0 ? void 0 : _d.method) || 'GET');
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 8, , 9]);
                            return [4 /*yield*/, this.originalFetch.apply(window, args)];
                        case 2:
                            response = _e.sent();
                            clonedResponse = response.clone();
                            request.status = response.status;
                            request.statusText = response.statusText;
                            request.headers = this.parseHeaders(response.headers);
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 5, , 7]);
                            _a = request;
                            return [4 /*yield*/, clonedResponse.json()];
                        case 4:
                            _a.responseBody = _e.sent();
                            return [3 /*break*/, 7];
                        case 5:
                            _b = _e.sent();
                            _c = request;
                            return [4 /*yield*/, clonedResponse.text()];
                        case 6:
                            _c.responseBody = _e.sent();
                            return [3 /*break*/, 7];
                        case 7:
                            this.completeRequest(request);
                            return [2 /*return*/, response];
                        case 8:
                            error_1 = _e.sent();
                            request.error = error_1;
                            this.completeRequest(request);
                            throw error_1;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
    };
    NetworkMonitor.prototype.monitorXHR = function () {
        var self = this;
        window.XMLHttpRequest = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super.call(this) || this;
                _this.request = self.createRequest('', 'GET');
                _this.addEventListener('load', function () {
                    _this.request.status = _this.status;
                    _this.request.statusText = _this.statusText;
                    _this.request.headers = self.parseHeaders(_this.getAllResponseHeaders());
                    try {
                        _this.request.responseBody = JSON.parse(_this.responseText);
                    }
                    catch (_a) {
                        _this.request.responseBody = _this.responseText;
                    }
                    self.completeRequest(_this.request);
                });
                _this.addEventListener('error', function (event) {
                    _this.request.error = new Error('XHR request failed');
                    self.completeRequest(_this.request);
                });
                return _this;
            }
            class_1.prototype.open = function (method, url) {
                this.request.method = method;
                this.request.url = url;
                _super.prototype.open.call(this, method, url);
            };
            class_1.prototype.send = function (body) {
                if (body) {
                    try {
                        this.request.requestBody = JSON.parse(body);
                    }
                    catch (_a) {
                        this.request.requestBody = body;
                    }
                }
                _super.prototype.send.call(this, body);
            };
            return class_1;
        }(XMLHttpRequest));
    };
    NetworkMonitor.prototype.createRequest = function (url, method) {
        var request = {
            id: Math.random().toString(36).substring(7),
            url: typeof url === 'string' ? url : url.url,
            method: method,
            startTime: Date.now()
        };
        this.requests.unshift(request);
        if (this.requests.length > this.maxRequests) {
            this.requests = this.requests.slice(0, this.maxRequests);
        }
        this.debug.info('NETWORK', "Request started: ".concat(method, " ").concat(request.url), request);
        return request;
    };
    NetworkMonitor.prototype.completeRequest = function (request) {
        request.endTime = Date.now();
        request.duration = request.endTime - request.startTime;
        var status = request.status ? "".concat(request.status, " ").concat(request.statusText) : 'Failed';
        this.debug.info('NETWORK', "Request completed: ".concat(request.method, " ").concat(request.url), {
            status: status,
            duration: request.duration,
            request: request
        });
        this.requestCallbacks.forEach(function (callback) { return callback(request); });
    };
    NetworkMonitor.prototype.parseHeaders = function (headers) {
        if (headers instanceof Headers) {
            var obj_1 = {};
            headers.forEach(function (value, key) {
                obj_1[key] = value;
            });
            return obj_1;
        }
        if (typeof headers === 'string') {
            return headers.split('\r\n')
                .filter(function (line) { return line; })
                .reduce(function (obj, line) {
                var _a = line.split(': '), key = _a[0], value = _a[1];
                obj[key.toLowerCase()] = value;
                return obj;
            }, {});
        }
        return {};
    };
    NetworkMonitor.prototype.getRequests = function () {
        return this.requests;
    };
    NetworkMonitor.prototype.clearRequests = function () {
        this.requests = [];
    };
    NetworkMonitor.prototype.onRequest = function (callback) {
        var _this = this;
        this.requestCallbacks.push(callback);
        return function () {
            var index = _this.requestCallbacks.indexOf(callback);
            if (index > -1) {
                _this.requestCallbacks.splice(index, 1);
            }
        };
    };
    NetworkMonitor.prototype.destroy = function () {
        if (typeof window !== 'undefined') {
            window.fetch = this.originalFetch;
            window.XMLHttpRequest = this.originalXHR;
        }
        this.requestCallbacks = [];
        this.requests = [];
    };
    return NetworkMonitor;
}());
export { NetworkMonitor };
//# sourceMappingURL=networkMonitor.js.map