module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { __MODS__[modId].m.exports.__proto__ = m.exports.__proto__; Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; var desp = Object.getOwnPropertyDescriptor(m.exports, k); if(desp && desp.configurable) Object.defineProperty(m.exports, k, { set: function(val) { __MODS__[modId].m.exports[k] = val; }, get: function() { return __MODS__[modId].m.exports[k]; } }); }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1583126896238, function(require, module, exports) {
const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const base = alphabet.length;

// Create a lookup table to fetch character index
const alphabetLookup = [...alphabet].reduce((lookup, char, index) => {
  lookup[char] = index;
  return lookup;
}, {});

function assertNonNegativeSafeInteger(val) {
  if (
    typeof val !== "number" ||
    isNaN(val) ||
    val < 0 ||
    val > Number.MAX_SAFE_INTEGER ||
    Math.floor(val) !== val
  ) {
    throw new Error("Value passed is not a non-negative safe integer.");
  }
}

function assertString(str) {
  if (typeof str !== "string") {
    throw new Error("Value passed is not a string.");
  }
}

function assertBase58Character(character) {
  if (alphabetLookup[character] === undefined) {
    throw new Error("Value passed is not a valid Base58 string.");
  }
}

exports.int_to_base58 = exports.encode = function(num) {
  let str = "";
  let modulus;

  num = Number(num);

  assertNonNegativeSafeInteger(num);

  while (num >= base) {
    modulus = num % base;
    str = alphabet[modulus] + str;
    num = Math.floor(num / base);
  }

  return alphabet[num] + str;
};

exports.base58_to_int = exports.decode = function(str) {
  assertString(str);

  return [...str].reverse().reduce((num, character, index) => {
    assertBase58Character(character);
    return num + alphabetLookup[character] * Math.pow(base, index);
  }, 0);
};

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1583126896238);
})()
//# sourceMappingURL=index.js.map