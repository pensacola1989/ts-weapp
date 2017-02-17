"use strict";
var Events = (function () {
    function Events() {
    }
    Events.getInstance = function () {
        Events._referenceCount++;
        console.log(Events._referenceCount);
        if (!Events._instance) {
            Events._instance = new Events();
        }
        return Events._instance;
    };
    Events.prototype.subscribe = function (key, action) {
        if (!Events._channel[key]) {
            Events._channel[key] = [action];
            return;
        }
        Events._channel[key].push(action);
    };
    Events.prototype.publish = function (channelKey) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var handlers = Events._channel[channelKey];
        if (!handlers) {
            return;
        }
        if (handlers.length) {
            handlers.forEach(function (handler) { return handler.apply(void 0, data); });
        }
    };
    Events.prototype.unsubscribe = function (key) {
        var handlers = Events._channel[key];
        if (!handlers) {
            return false;
        }
        delete Events._channel[key];
        return true;
    };
    return Events;
}());
Events._channel = {};
Events._referenceCount = 0;
exports.Events = Events;
