module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { __MODS__[modId].m.exports.__proto__ = m.exports.__proto__; Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; var desp = Object.getOwnPropertyDescriptor(m.exports, k); if(desp && desp.configurable) Object.defineProperty(m.exports, k, { set: function(val) { __MODS__[modId].m.exports[k] = val; }, get: function() { return __MODS__[modId].m.exports[k]; } }); }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1583906584117, function(require, module, exports) {

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var object_entries_1 = require("./object-entries");
var flatten = function (args) { return object_entries_1.entries(args).reduce(function (acc, item) { return __spreadArrays(acc, item); }, []); };
/**
 * Add, update or remove querystring parameters.
 * @param {string} url
 * @param {...string|object} args
 * @return {string}
 */
function urlParameterAppend(url) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (args[0] && typeof args[0] === 'object') {
        return urlParameterAppend.call.apply(urlParameterAppend, __spreadArrays([null,
            url], flatten(args[0])));
    }
    // tslint:disable-next-line:prefer-const
    var _a = ((url !== null && url !== void 0 ? url : '')).split('#'), modifiedUrl = _a[0], fragment = _a.slice(1);
    for (var i = 0; i < args.length; i += 2) {
        var param = args[i];
        var value = args[i + 1];
        // add / update
        var firstParamRx = new RegExp("([?])" + param + "=([^&#]*)(&)", 'i');
        var secondParamRx = new RegExp("([?&])" + param + "=([^&#]*)", 'i');
        var hasValue = !(value === null || value === undefined || value === '');
        if (firstParamRx.exec(modifiedUrl)) {
            modifiedUrl = hasValue
                ? modifiedUrl.replace(firstParamRx, "$1" + param + "=" + value + "$3")
                : modifiedUrl.replace(firstParamRx, '?');
        }
        else if (secondParamRx.exec(modifiedUrl)) {
            modifiedUrl = hasValue
                ? modifiedUrl.replace(secondParamRx, "$1" + param + "=" + value)
                : modifiedUrl.replace(secondParamRx, '');
        }
        else if (hasValue) {
            modifiedUrl = "" + modifiedUrl + ((modifiedUrl.indexOf('?') < 0 ? '?' : '&') + param) + "=" + value;
        }
    }
    return "" + modifiedUrl + (fragment.length ? "#" + fragment.join('#') : '');
}
exports.default = urlParameterAppend;
module.exports = urlParameterAppend;

}, function(modId) {var map = {"./object-entries":1583906584118}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1583906584118, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Backwards compatibility for Object.entries function.
 */
/* istanbul ignore next */
exports.entries = typeof Object.entries === 'undefined'
    ? function (obj) { return Object.keys(obj).map(function (key) { return [key, obj[key]]; }); }
    : Object.entries;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1583906584117);
})()
//# sourceMappingURL=index.js.map