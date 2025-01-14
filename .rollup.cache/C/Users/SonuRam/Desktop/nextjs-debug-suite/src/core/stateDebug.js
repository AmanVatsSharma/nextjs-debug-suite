import { __assign } from "tslib";
import { debug } from './debug';
var StateDebugMonitor = /** @class */ (function () {
    function StateDebugMonitor() {
        this.debug = debug;
        this.changes = [];
        this.maxChanges = 1000;
        this.changeCallbacks = [];
        this.contextPatches = new Map();
    }
    StateDebugMonitor.prototype.trackReduxChanges = function () {
        var _this = this;
        this.reduxMiddleware = function (store) { return function (next) { return function (action) {
            var prevState = store.getState();
            var result = next(action);
            var nextState = store.getState();
            _this.captureChange({
                type: 'redux',
                action: {
                    type: action.type,
                    payload: action.payload
                },
                prevState: prevState,
                nextState: nextState
            });
            return result;
        }; }; };
        return this.reduxMiddleware;
    };
    StateDebugMonitor.prototype.trackContextChanges = function (contextName, prevValue, nextValue) {
        var patch = this.contextPatches.get(contextName);
        var timestamp = Date.now();
        if (patch && timestamp - patch.timestamp < 100) {
            // Debounce rapid context changes
            this.contextPatches.set(contextName, {
                timestamp: timestamp,
                prevValue: patch.prevValue,
                nextValue: nextValue
            });
        }
        else {
            this.contextPatches.set(contextName, {
                timestamp: timestamp,
                prevValue: prevValue,
                nextValue: nextValue
            });
            this.captureChange({
                type: 'context',
                componentName: contextName,
                prevState: prevValue,
                nextState: nextValue
            });
        }
    };
    StateDebugMonitor.prototype.trackStateChanges = function (componentName, hookId, prevState, nextState) {
        this.captureChange({
            type: 'useState',
            componentName: componentName,
            action: { type: "".concat(componentName, ":").concat(hookId) },
            prevState: prevState,
            nextState: nextState
        });
    };
    StateDebugMonitor.prototype.trackCustomChanges = function (name, prevState, nextState, metadata) {
        this.captureChange(__assign({ type: 'custom', componentName: name, prevState: prevState, nextState: nextState }, metadata));
    };
    StateDebugMonitor.prototype.captureChange = function (change) {
        var timestamp = Date.now();
        var id = Math.random().toString(36).substring(7);
        var stateChange = {
            id: id,
            timestamp: timestamp,
            type: change.type || 'custom',
            componentName: change.componentName,
            action: change.action,
            prevState: change.prevState,
            nextState: change.nextState,
            diff: this.calculateDiff(change.prevState, change.nextState)
        };
        this.changes.unshift(stateChange);
        if (this.changes.length > this.maxChanges) {
            this.changes = this.changes.slice(0, this.maxChanges);
        }
        this.debug.log('STATE', "".concat(stateChange.type, " change in ").concat(stateChange.componentName || 'unknown'), stateChange);
        this.notifyChangeCallbacks(stateChange);
    };
    StateDebugMonitor.prototype.calculateDiff = function (prev, next) {
        if (!prev || !next)
            return {};
        var added = {};
        var removed = {};
        var updated = {};
        // Find added and updated
        Object.keys(next).forEach(function (key) {
            if (!(key in prev)) {
                added[key] = next[key];
            }
            else if (prev[key] !== next[key]) {
                updated[key] = {
                    from: prev[key],
                    to: next[key]
                };
            }
        });
        // Find removed
        Object.keys(prev).forEach(function (key) {
            if (!(key in next)) {
                removed[key] = prev[key];
            }
        });
        return {
            added: Object.keys(added).length ? added : undefined,
            removed: Object.keys(removed).length ? removed : undefined,
            updated: Object.keys(updated).length ? updated : undefined
        };
    };
    StateDebugMonitor.prototype.getChanges = function (filter) {
        if (!filter)
            return this.changes;
        return this.changes.filter(function (change) {
            var _a;
            if (filter.type && change.type !== filter.type)
                return false;
            if (filter.componentName && change.componentName !== filter.componentName)
                return false;
            if (filter.actionType && ((_a = change.action) === null || _a === void 0 ? void 0 : _a.type) !== filter.actionType)
                return false;
            return true;
        });
    };
    StateDebugMonitor.prototype.getChange = function (id) {
        return this.changes.find(function (change) { return change.id === id; });
    };
    StateDebugMonitor.prototype.getLatestChange = function (componentName) {
        if (componentName) {
            return this.changes.find(function (change) { return change.componentName === componentName; });
        }
        return this.changes[0];
    };
    StateDebugMonitor.prototype.clearChanges = function () {
        this.changes = [];
        this.contextPatches.clear();
    };
    StateDebugMonitor.prototype.onChange = function (callback) {
        var _this = this;
        this.changeCallbacks.push(callback);
        return function () {
            var index = _this.changeCallbacks.indexOf(callback);
            if (index > -1) {
                _this.changeCallbacks.splice(index, 1);
            }
        };
    };
    StateDebugMonitor.prototype.notifyChangeCallbacks = function (change) {
        this.changeCallbacks.forEach(function (callback) { return callback(change); });
    };
    StateDebugMonitor.prototype.destroy = function () {
        this.changeCallbacks = [];
        this.clearChanges();
    };
    return StateDebugMonitor;
}());
export { StateDebugMonitor };
//# sourceMappingURL=stateDebug.js.map