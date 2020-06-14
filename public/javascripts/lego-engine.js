(function (Vue, crypto) {
  'use strict';

  Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;
  crypto = crypto && Object.prototype.hasOwnProperty.call(crypto, 'default') ? crypto['default'] : crypto;

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  var iterableToArrayLimit = _iterableToArrayLimit;

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var arrayLikeToArray = _arrayLikeToArray;

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
  }

  var unsupportedIterableToArray = _unsupportedIterableToArray;

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var nonIterableRest = _nonIterableRest;

  function _slicedToArray(arr, i) {
    return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
  }

  var slicedToArray = _slicedToArray;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  var has = Object.prototype.hasOwnProperty;
  var isArray = Array.isArray;

  var hexTable = (function () {
      var array = [];
      for (var i = 0; i < 256; ++i) {
          array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
      }

      return array;
  }());

  var compactQueue = function compactQueue(queue) {
      while (queue.length > 1) {
          var item = queue.pop();
          var obj = item.obj[item.prop];

          if (isArray(obj)) {
              var compacted = [];

              for (var j = 0; j < obj.length; ++j) {
                  if (typeof obj[j] !== 'undefined') {
                      compacted.push(obj[j]);
                  }
              }

              item.obj[item.prop] = compacted;
          }
      }
  };

  var arrayToObject = function arrayToObject(source, options) {
      var obj = options && options.plainObjects ? Object.create(null) : {};
      for (var i = 0; i < source.length; ++i) {
          if (typeof source[i] !== 'undefined') {
              obj[i] = source[i];
          }
      }

      return obj;
  };

  var merge = function merge(target, source, options) {
      /* eslint no-param-reassign: 0 */
      if (!source) {
          return target;
      }

      if (typeof source !== 'object') {
          if (isArray(target)) {
              target.push(source);
          } else if (target && typeof target === 'object') {
              if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                  target[source] = true;
              }
          } else {
              return [target, source];
          }

          return target;
      }

      if (!target || typeof target !== 'object') {
          return [target].concat(source);
      }

      var mergeTarget = target;
      if (isArray(target) && !isArray(source)) {
          mergeTarget = arrayToObject(target, options);
      }

      if (isArray(target) && isArray(source)) {
          source.forEach(function (item, i) {
              if (has.call(target, i)) {
                  var targetItem = target[i];
                  if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                      target[i] = merge(targetItem, item, options);
                  } else {
                      target.push(item);
                  }
              } else {
                  target[i] = item;
              }
          });
          return target;
      }

      return Object.keys(source).reduce(function (acc, key) {
          var value = source[key];

          if (has.call(acc, key)) {
              acc[key] = merge(acc[key], value, options);
          } else {
              acc[key] = value;
          }
          return acc;
      }, mergeTarget);
  };

  var assign = function assignSingleSource(target, source) {
      return Object.keys(source).reduce(function (acc, key) {
          acc[key] = source[key];
          return acc;
      }, target);
  };

  var decode = function (str, decoder, charset) {
      var strWithoutPlus = str.replace(/\+/g, ' ');
      if (charset === 'iso-8859-1') {
          // unescape never throws, no try...catch needed:
          return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      // utf-8
      try {
          return decodeURIComponent(strWithoutPlus);
      } catch (e) {
          return strWithoutPlus;
      }
  };

  var encode = function encode(str, defaultEncoder, charset) {
      // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
      // It has been adapted here for stricter adherence to RFC 3986
      if (str.length === 0) {
          return str;
      }

      var string = str;
      if (typeof str === 'symbol') {
          string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== 'string') {
          string = String(str);
      }

      if (charset === 'iso-8859-1') {
          return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
              return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
          });
      }

      var out = '';
      for (var i = 0; i < string.length; ++i) {
          var c = string.charCodeAt(i);

          if (
              c === 0x2D // -
              || c === 0x2E // .
              || c === 0x5F // _
              || c === 0x7E // ~
              || (c >= 0x30 && c <= 0x39) // 0-9
              || (c >= 0x41 && c <= 0x5A) // a-z
              || (c >= 0x61 && c <= 0x7A) // A-Z
          ) {
              out += string.charAt(i);
              continue;
          }

          if (c < 0x80) {
              out = out + hexTable[c];
              continue;
          }

          if (c < 0x800) {
              out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
              continue;
          }

          if (c < 0xD800 || c >= 0xE000) {
              out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
              continue;
          }

          i += 1;
          c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
          out += hexTable[0xF0 | (c >> 18)]
              + hexTable[0x80 | ((c >> 12) & 0x3F)]
              + hexTable[0x80 | ((c >> 6) & 0x3F)]
              + hexTable[0x80 | (c & 0x3F)];
      }

      return out;
  };

  var compact = function compact(value) {
      var queue = [{ obj: { o: value }, prop: 'o' }];
      var refs = [];

      for (var i = 0; i < queue.length; ++i) {
          var item = queue[i];
          var obj = item.obj[item.prop];

          var keys = Object.keys(obj);
          for (var j = 0; j < keys.length; ++j) {
              var key = keys[j];
              var val = obj[key];
              if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                  queue.push({ obj: obj, prop: key });
                  refs.push(val);
              }
          }
      }

      compactQueue(queue);

      return value;
  };

  var isRegExp = function isRegExp(obj) {
      return Object.prototype.toString.call(obj) === '[object RegExp]';
  };

  var isBuffer = function isBuffer(obj) {
      if (!obj || typeof obj !== 'object') {
          return false;
      }

      return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
  };

  var combine = function combine(a, b) {
      return [].concat(a, b);
  };

  var maybeMap = function maybeMap(val, fn) {
      if (isArray(val)) {
          var mapped = [];
          for (var i = 0; i < val.length; i += 1) {
              mapped.push(fn(val[i]));
          }
          return mapped;
      }
      return fn(val);
  };

  var utils = {
      arrayToObject: arrayToObject,
      assign: assign,
      combine: combine,
      compact: compact,
      decode: decode,
      encode: encode,
      isBuffer: isBuffer,
      isRegExp: isRegExp,
      maybeMap: maybeMap,
      merge: merge
  };

  var replace = String.prototype.replace;
  var percentTwenties = /%20/g;



  var Format = {
      RFC1738: 'RFC1738',
      RFC3986: 'RFC3986'
  };

  var formats = utils.assign(
      {
          'default': Format.RFC3986,
          formatters: {
              RFC1738: function (value) {
                  return replace.call(value, percentTwenties, '+');
              },
              RFC3986: function (value) {
                  return String(value);
              }
          }
      },
      Format
  );

  var has$1 = Object.prototype.hasOwnProperty;

  var arrayPrefixGenerators = {
      brackets: function brackets(prefix) {
          return prefix + '[]';
      },
      comma: 'comma',
      indices: function indices(prefix, key) {
          return prefix + '[' + key + ']';
      },
      repeat: function repeat(prefix) {
          return prefix;
      }
  };

  var isArray$1 = Array.isArray;
  var push = Array.prototype.push;
  var pushToArray = function (arr, valueOrArray) {
      push.apply(arr, isArray$1(valueOrArray) ? valueOrArray : [valueOrArray]);
  };

  var toISO = Date.prototype.toISOString;

  var defaultFormat = formats['default'];
  var defaults = {
      addQueryPrefix: false,
      allowDots: false,
      charset: 'utf-8',
      charsetSentinel: false,
      delimiter: '&',
      encode: true,
      encoder: utils.encode,
      encodeValuesOnly: false,
      format: defaultFormat,
      formatter: formats.formatters[defaultFormat],
      // deprecated
      indices: false,
      serializeDate: function serializeDate(date) {
          return toISO.call(date);
      },
      skipNulls: false,
      strictNullHandling: false
  };

  var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
      return typeof v === 'string'
          || typeof v === 'number'
          || typeof v === 'boolean'
          || typeof v === 'symbol'
          || typeof v === 'bigint';
  };

  var stringify = function stringify(
      object,
      prefix,
      generateArrayPrefix,
      strictNullHandling,
      skipNulls,
      encoder,
      filter,
      sort,
      allowDots,
      serializeDate,
      formatter,
      encodeValuesOnly,
      charset
  ) {
      var obj = object;
      if (typeof filter === 'function') {
          obj = filter(prefix, obj);
      } else if (obj instanceof Date) {
          obj = serializeDate(obj);
      } else if (generateArrayPrefix === 'comma' && isArray$1(obj)) {
          obj = utils.maybeMap(obj, function (value) {
              if (value instanceof Date) {
                  return serializeDate(value);
              }
              return value;
          }).join(',');
      }

      if (obj === null) {
          if (strictNullHandling) {
              return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key') : prefix;
          }

          obj = '';
      }

      if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
          if (encoder) {
              var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key');
              return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value'))];
          }
          return [formatter(prefix) + '=' + formatter(String(obj))];
      }

      var values = [];

      if (typeof obj === 'undefined') {
          return values;
      }

      var objKeys;
      if (isArray$1(filter)) {
          objKeys = filter;
      } else {
          var keys = Object.keys(obj);
          objKeys = sort ? keys.sort(sort) : keys;
      }

      for (var i = 0; i < objKeys.length; ++i) {
          var key = objKeys[i];
          var value = obj[key];

          if (skipNulls && value === null) {
              continue;
          }

          var keyPrefix = isArray$1(obj)
              ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix
              : prefix + (allowDots ? '.' + key : '[' + key + ']');

          pushToArray(values, stringify(
              value,
              keyPrefix,
              generateArrayPrefix,
              strictNullHandling,
              skipNulls,
              encoder,
              filter,
              sort,
              allowDots,
              serializeDate,
              formatter,
              encodeValuesOnly,
              charset
          ));
      }

      return values;
  };

  var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
      if (!opts) {
          return defaults;
      }

      if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
          throw new TypeError('Encoder has to be a function.');
      }

      var charset = opts.charset || defaults.charset;
      if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
          throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
      }

      var format = formats['default'];
      if (typeof opts.format !== 'undefined') {
          if (!has$1.call(formats.formatters, opts.format)) {
              throw new TypeError('Unknown format option provided.');
          }
          format = opts.format;
      }
      var formatter = formats.formatters[format];

      var filter = defaults.filter;
      if (typeof opts.filter === 'function' || isArray$1(opts.filter)) {
          filter = opts.filter;
      }

      return {
          addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
          allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
          charset: charset,
          charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
          delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
          encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
          encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
          encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
          filter: filter,
          formatter: formatter,
          serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
          skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
          sort: typeof opts.sort === 'function' ? opts.sort : null,
          strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
      };
  };

  var stringify_1 = function (object, opts) {
      var obj = object;
      var options = normalizeStringifyOptions(opts);

      var objKeys;
      var filter;

      if (typeof options.filter === 'function') {
          filter = options.filter;
          obj = filter('', obj);
      } else if (isArray$1(options.filter)) {
          filter = options.filter;
          objKeys = filter;
      }

      var keys = [];

      if (typeof obj !== 'object' || obj === null) {
          return '';
      }

      var arrayFormat;
      if (opts && opts.arrayFormat in arrayPrefixGenerators) {
          arrayFormat = opts.arrayFormat;
      } else if (opts && 'indices' in opts) {
          arrayFormat = opts.indices ? 'indices' : 'repeat';
      } else {
          arrayFormat = 'indices';
      }

      var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

      if (!objKeys) {
          objKeys = Object.keys(obj);
      }

      if (options.sort) {
          objKeys.sort(options.sort);
      }

      for (var i = 0; i < objKeys.length; ++i) {
          var key = objKeys[i];

          if (options.skipNulls && obj[key] === null) {
              continue;
          }
          pushToArray(keys, stringify(
              obj[key],
              key,
              generateArrayPrefix,
              options.strictNullHandling,
              options.skipNulls,
              options.encode ? options.encoder : null,
              options.filter,
              options.sort,
              options.allowDots,
              options.serializeDate,
              options.formatter,
              options.encodeValuesOnly,
              options.charset
          ));
      }

      var joined = keys.join(options.delimiter);
      var prefix = options.addQueryPrefix === true ? '?' : '';

      if (options.charsetSentinel) {
          if (options.charset === 'iso-8859-1') {
              // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
              prefix += 'utf8=%26%2310003%3B&';
          } else {
              // encodeURIComponent('✓')
              prefix += 'utf8=%E2%9C%93&';
          }
      }

      return joined.length > 0 ? prefix + joined : '';
  };

  var has$2 = Object.prototype.hasOwnProperty;
  var isArray$2 = Array.isArray;

  var defaults$1 = {
      allowDots: false,
      allowPrototypes: false,
      arrayLimit: 20,
      charset: 'utf-8',
      charsetSentinel: false,
      comma: false,
      decoder: utils.decode,
      delimiter: '&',
      depth: 5,
      ignoreQueryPrefix: false,
      interpretNumericEntities: false,
      parameterLimit: 1000,
      parseArrays: true,
      plainObjects: false,
      strictNullHandling: false
  };

  var interpretNumericEntities = function (str) {
      return str.replace(/&#(\d+);/g, function ($0, numberStr) {
          return String.fromCharCode(parseInt(numberStr, 10));
      });
  };

  var parseArrayValue = function (val, options) {
      if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
          return val.split(',');
      }

      return val;
  };

  // This is what browsers will submit when the ✓ character occurs in an
  // application/x-www-form-urlencoded body and the encoding of the page containing
  // the form is iso-8859-1, or when the submitted form has an accept-charset
  // attribute of iso-8859-1. Presumably also with other charsets that do not contain
  // the ✓ character, such as us-ascii.
  var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

  // These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
  var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

  var parseValues = function parseQueryStringValues(str, options) {
      var obj = {};
      var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
      var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
      var parts = cleanStr.split(options.delimiter, limit);
      var skipIndex = -1; // Keep track of where the utf8 sentinel was found
      var i;

      var charset = options.charset;
      if (options.charsetSentinel) {
          for (i = 0; i < parts.length; ++i) {
              if (parts[i].indexOf('utf8=') === 0) {
                  if (parts[i] === charsetSentinel) {
                      charset = 'utf-8';
                  } else if (parts[i] === isoSentinel) {
                      charset = 'iso-8859-1';
                  }
                  skipIndex = i;
                  i = parts.length; // The eslint settings do not allow break;
              }
          }
      }

      for (i = 0; i < parts.length; ++i) {
          if (i === skipIndex) {
              continue;
          }
          var part = parts[i];

          var bracketEqualsPos = part.indexOf(']=');
          var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

          var key, val;
          if (pos === -1) {
              key = options.decoder(part, defaults$1.decoder, charset, 'key');
              val = options.strictNullHandling ? null : '';
          } else {
              key = options.decoder(part.slice(0, pos), defaults$1.decoder, charset, 'key');
              val = utils.maybeMap(
                  parseArrayValue(part.slice(pos + 1), options),
                  function (encodedVal) {
                      return options.decoder(encodedVal, defaults$1.decoder, charset, 'value');
                  }
              );
          }

          if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
              val = interpretNumericEntities(val);
          }

          if (part.indexOf('[]=') > -1) {
              val = isArray$2(val) ? [val] : val;
          }

          if (has$2.call(obj, key)) {
              obj[key] = utils.combine(obj[key], val);
          } else {
              obj[key] = val;
          }
      }

      return obj;
  };

  var parseObject = function (chain, val, options, valuesParsed) {
      var leaf = valuesParsed ? val : parseArrayValue(val, options);

      for (var i = chain.length - 1; i >= 0; --i) {
          var obj;
          var root = chain[i];

          if (root === '[]' && options.parseArrays) {
              obj = [].concat(leaf);
          } else {
              obj = options.plainObjects ? Object.create(null) : {};
              var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
              var index = parseInt(cleanRoot, 10);
              if (!options.parseArrays && cleanRoot === '') {
                  obj = { 0: leaf };
              } else if (
                  !isNaN(index)
                  && root !== cleanRoot
                  && String(index) === cleanRoot
                  && index >= 0
                  && (options.parseArrays && index <= options.arrayLimit)
              ) {
                  obj = [];
                  obj[index] = leaf;
              } else {
                  obj[cleanRoot] = leaf;
              }
          }

          leaf = obj; // eslint-disable-line no-param-reassign
      }

      return leaf;
  };

  var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
      if (!givenKey) {
          return;
      }

      // Transform dot notation to bracket notation
      var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

      // The regex chunks

      var brackets = /(\[[^[\]]*])/;
      var child = /(\[[^[\]]*])/g;

      // Get the parent

      var segment = options.depth > 0 && brackets.exec(key);
      var parent = segment ? key.slice(0, segment.index) : key;

      // Stash the parent if it exists

      var keys = [];
      if (parent) {
          // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
          if (!options.plainObjects && has$2.call(Object.prototype, parent)) {
              if (!options.allowPrototypes) {
                  return;
              }
          }

          keys.push(parent);
      }

      // Loop through children appending to the array until we hit depth

      var i = 0;
      while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
          i += 1;
          if (!options.plainObjects && has$2.call(Object.prototype, segment[1].slice(1, -1))) {
              if (!options.allowPrototypes) {
                  return;
              }
          }
          keys.push(segment[1]);
      }

      // If there's a remainder, just add whatever is left

      if (segment) {
          keys.push('[' + key.slice(segment.index) + ']');
      }

      return parseObject(keys, val, options, valuesParsed);
  };

  var normalizeParseOptions = function normalizeParseOptions(opts) {
      if (!opts) {
          return defaults$1;
      }

      if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
          throw new TypeError('Decoder has to be a function.');
      }

      if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
          throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
      }
      var charset = typeof opts.charset === 'undefined' ? defaults$1.charset : opts.charset;

      return {
          allowDots: typeof opts.allowDots === 'undefined' ? defaults$1.allowDots : !!opts.allowDots,
          allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults$1.allowPrototypes,
          arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults$1.arrayLimit,
          charset: charset,
          charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults$1.charsetSentinel,
          comma: typeof opts.comma === 'boolean' ? opts.comma : defaults$1.comma,
          decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults$1.decoder,
          delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults$1.delimiter,
          // eslint-disable-next-line no-implicit-coercion, no-extra-parens
          depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults$1.depth,
          ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
          interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults$1.interpretNumericEntities,
          parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults$1.parameterLimit,
          parseArrays: opts.parseArrays !== false,
          plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults$1.plainObjects,
          strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults$1.strictNullHandling
      };
  };

  var parse = function (str, opts) {
      var options = normalizeParseOptions(opts);

      if (str === '' || str === null || typeof str === 'undefined') {
          return options.plainObjects ? Object.create(null) : {};
      }

      var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
      var obj = options.plainObjects ? Object.create(null) : {};

      // Iterate over the keys and setup the new object

      var keys = Object.keys(tempObj);
      for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
          obj = utils.merge(obj, newObj, options);
      }

      return utils.compact(obj);
  };

  var lib = {
      formats: formats,
      parse: parse,
      stringify: stringify_1
  };
  var lib_2 = lib.parse;
  var lib_3 = lib.stringify;

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode$1)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode$1(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  var DOMException = self.DOMException;
  try {
    new DOMException();
  } catch (err) {
    DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    DOMException.prototype = Object.create(Error.prototype);
    DOMException.prototype.constructor = DOMException;
  }

  function fetch$1(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch$1.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch$1;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  // the whatwg-fetch polyfill installs the fetch() function
  // on the global object (window or self)
  //
  // Return that as the export for use in Webpack, Browserify etc.

  var fetchNpmBrowserify = self.fetch.bind(self);

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var objectSpread = _objectSpread;

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck$1 = _classCallCheck$1;

  function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
  }

  var createClass$1 = _createClass$1;

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  // 返回一个组合了所有插件的“插件”
  function compose(middlewares) {
    if (!Array.isArray(middlewares)) throw new TypeError('Middlewares must be an array!');
    var middlewaresLen = middlewares.length;

    for (var i = 0; i < middlewaresLen; i++) {
      if (typeof middlewares[i] !== 'function') {
        throw new TypeError('Middleware must be componsed of function');
      }
    }

    return function wrapMiddlewares(params, next) {
      var index = -1;

      function dispatch(i) {
        if (i <= index) {
          return Promise.reject(new Error('next() should not be called multiple times in one middleware!'));
        }

        index = i;
        var fn = middlewares[i] || next;
        if (!fn) return Promise.resolve();

        try {
          return Promise.resolve(fn(params, function () {
            return dispatch(i + 1);
          }));
        } catch (err) {
          return Promise.reject(err);
        }
      }

      return dispatch(0);
    };
  }

  var Onion =
  /*#__PURE__*/
  function () {
    function Onion(defaultMiddlewares) {
      classCallCheck$1(this, Onion);

      if (!Array.isArray(defaultMiddlewares)) throw new TypeError('Default middlewares must be an array!');
      this.defaultMiddlewares = toConsumableArray(defaultMiddlewares);
      this.middlewares = [];
    }

    createClass$1(Onion, [{
      key: "use",
      // 内置内核中间件长度
      value: function use(newMiddleware) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          global: false,
          core: false,
          defaultInstance: false
        };
        var core = false;
        var global = false;
        var defaultInstance = false;

        if (typeof opts === 'number') {
          if (process && process.env && "development" === 'development') {
            console.warn('use() options should be object, number property would be deprecated in future，please update use() options to "{ core: true }".');
          }

          core = true;
          global = false;
        } else if (_typeof_1(opts) === 'object' && opts) {
          global = opts.global || false;
          core = opts.core || false;
          defaultInstance = opts.defaultInstance || false;
        } // 全局中间件


        if (global) {
          Onion.globalMiddlewares.splice(Onion.globalMiddlewares.length - Onion.defaultGlobalMiddlewaresLength, 0, newMiddleware);
          return;
        } // 内核中间件


        if (core) {
          Onion.coreMiddlewares.splice(Onion.coreMiddlewares.length - Onion.defaultCoreMiddlewaresLength, 0, newMiddleware);
          return;
        } // 默认实例中间件，供开发者使用


        if (defaultInstance) {
          this.defaultMiddlewares.push(newMiddleware);
          return;
        } // 实例中间件


        this.middlewares.push(newMiddleware);
      }
    }, {
      key: "execute",
      value: function execute() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var fn = compose([].concat(toConsumableArray(this.middlewares), toConsumableArray(this.defaultMiddlewares), toConsumableArray(Onion.globalMiddlewares), toConsumableArray(Onion.coreMiddlewares)));
        return fn(params);
      }
    }]);

    return Onion;
  }();

  Onion.globalMiddlewares = [];
  Onion.defaultGlobalMiddlewaresLength = 0;
  Onion.coreMiddlewares = [];
  Onion.defaultCoreMiddlewaresLength = 0;

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var assertThisInitialized = _assertThisInitialized;

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
      return call;
    }

    return assertThisInitialized(self);
  }

  var possibleConstructorReturn = _possibleConstructorReturn;

  var getPrototypeOf = createCommonjsModule(function (module) {
  function _getPrototypeOf(o) {
    module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  module.exports = _getPrototypeOf;
  });

  var setPrototypeOf = createCommonjsModule(function (module) {
  function _setPrototypeOf(o, p) {
    module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  module.exports = _setPrototypeOf;
  });

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) setPrototypeOf(subClass, superClass);
  }

  var inherits = _inherits;

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  var isNativeFunction = _isNativeFunction;

  var construct = createCommonjsModule(function (module) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      module.exports = _construct = Reflect.construct;
    } else {
      module.exports = _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  module.exports = _construct;
  });

  var wrapNativeSuper = createCommonjsModule(function (module) {
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return construct(Class, arguments, getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  module.exports = _wrapNativeSuper;
  });

  var MapCache =
  /*#__PURE__*/
  function () {
    function MapCache(options) {
      classCallCheck$1(this, MapCache);

      this.cache = new Map();
      this.timer = {};
      this.extendOptions(options);
    }

    createClass$1(MapCache, [{
      key: "extendOptions",
      value: function extendOptions(options) {
        this.maxCache = options.maxCache || 0;
      }
    }, {
      key: "get",
      value: function get(key) {
        return this.cache.get(JSON.stringify(key));
      }
    }, {
      key: "set",
      value: function set(key, value) {
        var _this = this;

        var ttl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60000;

        // 如果超过最大缓存数, 删除头部的第一个缓存.
        if (this.maxCache > 0 && this.cache.size >= this.maxCache) {
          var deleteKey = toConsumableArray(this.cache.keys())[0];

          this.cache.delete(deleteKey);

          if (this.timer[deleteKey]) {
            clearTimeout(this.timer[deleteKey]);
          }
        }

        var cacheKey = JSON.stringify(key);
        this.cache.set(cacheKey, value);

        if (ttl > 0) {
          this.timer[cacheKey] = setTimeout(function () {
            _this.cache.delete(cacheKey);

            delete _this.timer[cacheKey];
          }, ttl);
        }
      }
    }, {
      key: "delete",
      value: function _delete(key) {
        var cacheKey = JSON.stringify(key);
        delete this.timer[cacheKey];
        return this.cache.delete(cacheKey);
      }
    }, {
      key: "clear",
      value: function clear() {
        this.timer = {};
        return this.cache.clear();
      }
    }]);

    return MapCache;
  }();
  /**
   * 请求异常
   */

  var RequestError =
  /*#__PURE__*/
  function (_Error) {
    inherits(RequestError, _Error);

    function RequestError(text, request) {
      var _this2;

      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'RequestError';

      classCallCheck$1(this, RequestError);

      _this2 = possibleConstructorReturn(this, getPrototypeOf(RequestError).call(this, text));
      _this2.name = 'RequestError';
      _this2.request = request;
      _this2.type = type;
      return _this2;
    }

    return RequestError;
  }(wrapNativeSuper(Error));
  /**
   * 响应异常
   */

  var ResponseError =
  /*#__PURE__*/
  function (_Error2) {
    inherits(ResponseError, _Error2);

    function ResponseError(response, text, data, request) {
      var _this3;

      var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'ResponseError';

      classCallCheck$1(this, ResponseError);

      _this3 = possibleConstructorReturn(this, getPrototypeOf(ResponseError).call(this, text || response.statusText));
      _this3.name = 'ResponseError';
      _this3.data = data;
      _this3.response = response;
      _this3.request = request;
      _this3.type = type;
      return _this3;
    }

    return ResponseError;
  }(wrapNativeSuper(Error));
  /**
   * http://gitlab.alipay-inc.com/KBSJ/gxt/blob/release_gxt_S8928905_20180531/src/util/request.js#L63
   * 支持gbk
   */

  function readerGBK(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();

      reader.onload = function () {
        resolve(reader.result);
      };

      reader.onerror = reject;
      reader.readAsText(file, 'GBK'); // setup GBK decoding
    });
  }
  /**
   * 安全的JSON.parse
   */

  function safeJsonParse(data) {
    var throwErrIfParseFail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var response = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var request = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    try {
      return JSON.parse(data);
    } catch (e) {
      if (throwErrIfParseFail) {
        throw new ResponseError(response, 'JSON.parse fail', data, request, 'ParseError');
      }
    } // eslint-disable-line no-empty


    return data;
  }
  function timeout2Throw(msec, request) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new RequestError("timeout of ".concat(msec, "ms exceeded"), request, 'Timeout'));
      }, msec);
    });
  } // If request options contain 'cancelToken', reject request when token has been canceled

  function cancel2Throw(opt) {
    return new Promise(function (_, reject) {
      if (opt.cancelToken) {
        opt.cancelToken.promise.then(function (cancel) {
          reject(cancel);
        });
      }
    });
  }
  var toString = Object.prototype.toString; // Check env is browser or node

  function getEnv() {
    var env; // Only Node.JS has a process variable that is of [[Class]] process

    if (typeof process !== 'undefined' && toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      env = 'NODE';
    }

    if (typeof XMLHttpRequest !== 'undefined') {
      env = 'BROWSER';
    }

    return env;
  }
  function isArray$3(val) {
    return _typeof_1(val) === 'object' && Object.prototype.toString.call(val) === '[object Array]';
  }
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }
  function isDate(val) {
    return _typeof_1(val) === 'object' && Object.prototype.toString.call(val) === '[object Date]';
  }
  function isObject(val) {
    return val !== null && _typeof_1(val) === 'object';
  }
  function forEach2ObjArr(target, callback) {
    if (!target) return;

    if (_typeof_1(target) !== 'object') {
      target = [target];
    }

    if (isArray$3(target)) {
      for (var i = 0; i < target.length; i++) {
        callback.call(null, target[i], i, target);
      }
    } else {
      for (var key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          callback.call(null, target[key], key, target);
        }
      }
    }
  }
  function getParamObject(val) {
    if (isURLSearchParams(val)) {
      return lib_2(val.toString(), {
        strictNullHandling: true
      });
    }

    if (typeof val === 'string') {
      return [val];
    }

    return val;
  }
  function reqStringify(val) {
    return lib_3(val, {
      arrayFormat: 'repeat',
      strictNullHandling: true
    });
  }
  function mergeRequestOptions(options, options2Merge) {
    return objectSpread({}, options, options2Merge, {
      headers: objectSpread({}, options.headers, options2Merge.headers),
      params: objectSpread({}, getParamObject(options.params), getParamObject(options2Merge.params)),
      method: (options2Merge.method || options.method || 'get').toLowerCase()
    });
  }

  // 前后缀拦截
  var addfix = function addfix(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var prefix = options.prefix,
        suffix = options.suffix;

    if (prefix) {
      url = "".concat(prefix).concat(url);
    }

    if (suffix) {
      url = "".concat(url).concat(suffix);
    }

    return {
      url: url,
      options: options
    };
  };

  var warnedCoreType = false; // 默认缓存判断，开放缓存判断给非 get 请求使用

  function __defaultValidateCache(url, options) {
    var _options$method = options.method,
        method = _options$method === void 0 ? 'get' : _options$method;
    return method.toLowerCase() === 'get';
  }

  function fetchMiddleware(ctx, next) {
    if (!ctx) return next();
    var _ctx$req = ctx.req;
    _ctx$req = _ctx$req === void 0 ? {} : _ctx$req;
    var _ctx$req$options = _ctx$req.options,
        options = _ctx$req$options === void 0 ? {} : _ctx$req$options,
        _ctx$req$url = _ctx$req.url,
        url = _ctx$req$url === void 0 ? '' : _ctx$req$url,
        cache = ctx.cache,
        responseInterceptors = ctx.responseInterceptors;

    var _options$timeout = options.timeout,
        timeout = _options$timeout === void 0 ? 0 : _options$timeout,
        _options$__umiRequest = options.__umiRequestCoreType__,
        __umiRequestCoreType__ = _options$__umiRequest === void 0 ? 'normal' : _options$__umiRequest,
        _options$useCache = options.useCache,
        useCache = _options$useCache === void 0 ? false : _options$useCache,
        _options$method2 = options.method,
        method = _options$method2 === void 0 ? 'get' : _options$method2,
        params = options.params,
        ttl = options.ttl,
        _options$validateCach = options.validateCache,
        validateCache = _options$validateCach === void 0 ? __defaultValidateCache : _options$validateCach;

    if (__umiRequestCoreType__ !== 'normal') {
      if (process && process.env && "development" === 'development' && warnedCoreType === false) {
        warnedCoreType = true;
        console.warn('__umiRequestCoreType__ is a internal property that use in umi-request, change its value would affect the behavior of request! It only use when you want to extend or use request core.');
      }

      return next();
    }

    var adapter = fetch;

    if (!adapter) {
      throw new Error('Global fetch not exist!');
    } // 从缓存池检查是否有缓存数据


    var isBrowser = getEnv() === 'BROWSER';
    var needCache = validateCache(url, options) && useCache && isBrowser;

    if (needCache) {
      var responseCache = cache.get({
        url: url,
        params: params,
        method: method
      });

      if (responseCache) {
        responseCache = responseCache.clone();
        responseCache.useCache = true;
        ctx.res = responseCache;
        return next();
      }
    }

    var response; // 超时处理、取消请求处理

    if (timeout > 0) {
      response = Promise.race([cancel2Throw(options), adapter(url, options), timeout2Throw(timeout, ctx.req)]);
    } else {
      response = Promise.race([cancel2Throw(options), adapter(url, options)]);
    } // 兼容老版本 response.interceptor


    responseInterceptors.forEach(function (handler) {
      response = response.then(function (res) {
        // Fix multiple clones not working, issue: https://github.com/github/fetch/issues/504
        var clonedRes = typeof res.clone === 'function' ? res.clone() : res;
        return handler(clonedRes, options);
      });
    });
    return response.then(function (res) {
      // 是否存入缓存池
      if (needCache) {
        if (res.status === 200) {
          var copy = res.clone();
          copy.useCache = true;
          cache.set({
            url: url,
            params: params,
            method: method
          }, copy, ttl);
        }
      }

      ctx.res = res;
      return next();
    });
  }

  function parseResponseMiddleware(ctx, next) {
    var copy;
    return next().then(function () {
      if (!ctx) return;
      var _ctx$res = ctx.res,
          res = _ctx$res === void 0 ? {} : _ctx$res,
          _ctx$req = ctx.req,
          req = _ctx$req === void 0 ? {} : _ctx$req;

      var _ref = req || {},
          _ref$options = _ref.options;

      _ref$options = _ref$options === void 0 ? {} : _ref$options;
      var _ref$options$response = _ref$options.responseType,
          responseType = _ref$options$response === void 0 ? 'json' : _ref$options$response,
          _ref$options$charset = _ref$options.charset,
          charset = _ref$options$charset === void 0 ? 'utf8' : _ref$options$charset,
          _ref$options$getRespo = _ref$options.getResponse,
          _ref$options$throwErr = _ref$options.throwErrIfParseFail,
          throwErrIfParseFail = _ref$options$throwErr === void 0 ? false : _ref$options$throwErr,
          _ref$options$parseRes = _ref$options.parseResponse,
          parseResponse = _ref$options$parseRes === void 0 ? true : _ref$options$parseRes;

      if (!parseResponse) {
        return;
      }

      if (!res || !res.clone) {
        return;
      } // 只在浏览器环境对 response 做克隆， node 环境如果对 response 克隆会有问题：https://github.com/bitinn/node-fetch/issues/553


      copy = getEnv() === 'BROWSER' ? res.clone() : res;
      copy.useCache = res.useCache || false; // 解析数据

      if (charset === 'gbk') {
        try {
          return res.blob().then(readerGBK).then(function (d) {
            return safeJsonParse(d, false, copy, req);
          });
        } catch (e) {
          throw new ResponseError(copy, e.message, null, req, 'ParseError');
        }
      } else if (responseType === 'json') {
        return res.text().then(function (d) {
          return safeJsonParse(d, throwErrIfParseFail, copy, req);
        });
      }

      try {
        // 其他如text, blob, arrayBuffer, formData
        return res[responseType]();
      } catch (e) {
        throw new ResponseError(copy, 'responseType not support', null, req, 'ParseError');
      }
    }).then(function (body) {
      if (!ctx) return;
      var _ctx$res2 = ctx.res,
          _ctx$req2 = ctx.req,
          req = _ctx$req2 === void 0 ? {} : _ctx$req2;

      var _ref2 = req || {},
          _ref2$options = _ref2.options;

      _ref2$options = _ref2$options === void 0 ? {} : _ref2$options;
      var _ref2$options$getResp = _ref2$options.getResponse,
          getResponse = _ref2$options$getResp === void 0 ? false : _ref2$options$getResp;

      if (!copy) {
        return;
      }

      if (copy.status >= 200 && copy.status < 300) {
        // 提供源response, 以便自定义处理
        if (getResponse) {
          ctx.res = {
            data: body,
            response: copy
          };
          return;
        }

        ctx.res = body;
        return;
      }

      throw new ResponseError(copy, 'http error', body, req, 'HttpError');
    }).catch(function (e) {
      if (e instanceof RequestError || e instanceof ResponseError) {
        throw e;
      } // 对未知错误进行处理


      var req = ctx.req,
          res = ctx.res;
      e.request = e.request || req;
      e.response = e.response || res;
      e.type = e.type || e.name;
      e.data = e.data || undefined;
      throw e;
    });
  }

  function simplePostMiddleware(ctx, next) {
    if (!ctx) return next();
    var _ctx$req = ctx.req;
    _ctx$req = _ctx$req === void 0 ? {} : _ctx$req;
    var _ctx$req$options = _ctx$req.options,
        options = _ctx$req$options === void 0 ? {} : _ctx$req$options;
    var _options$method = options.method,
        method = _options$method === void 0 ? 'get' : _options$method;

    if (['post', 'put', 'patch', 'delete'].indexOf(method.toLowerCase()) === -1) {
      return next();
    }

    var _options$requestType = options.requestType,
        requestType = _options$requestType === void 0 ? 'json' : _options$requestType,
        data = options.data; // 数据使用类axios的新字段data, 避免引用后影响旧代码, 如将body stringify多次

    if (data) {
      var dataType = Object.prototype.toString.call(data);

      if (dataType === '[object Object]' || dataType === '[object Array]') {
        if (requestType === 'json') {
          options.headers = objectSpread({
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
          }, options.headers);
          options.body = JSON.stringify(data);
        } else if (requestType === 'form') {
          options.headers = objectSpread({
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }, options.headers);
          options.body = reqStringify(data);
        }
      } else {
        // 其他 requestType 自定义header
        options.headers = objectSpread({
          Accept: 'application/json'
        }, options.headers);
        options.body = data;
      }
    }

    ctx.req.options = options;
    return next();
  }

  function paramsSerialize(params, paramsSerializer) {
    var serializedParams;
    var jsonStringifiedParams; // 支持参数自动拼装，其他 method 也可用，不冲突

    if (params) {
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        if (isArray$3(params)) {
          jsonStringifiedParams = [];
          forEach2ObjArr(params, function (item) {
            if (item === null || typeof item === 'undefined') {
              jsonStringifiedParams.push(item);
            } else {
              jsonStringifiedParams.push(isObject(item) ? JSON.stringify(item) : item);
            }
          }); // a: [1,2,3] => a=1&a=2&a=3

          serializedParams = reqStringify(jsonStringifiedParams);
        } else {
          jsonStringifiedParams = {};
          forEach2ObjArr(params, function (value, key) {
            var jsonStringifiedValue = value;

            if (value === null || typeof value === 'undefined') {
              jsonStringifiedParams[key] = value;
            } else if (isDate(value)) {
              jsonStringifiedValue = value.toISOString();
            } else if (isArray$3(value)) {
              jsonStringifiedValue = value;
            } else if (isObject(value)) {
              jsonStringifiedValue = JSON.stringify(value);
            }

            jsonStringifiedParams[key] = jsonStringifiedValue;
          });
          var tmp = reqStringify(jsonStringifiedParams);
          serializedParams = tmp;
        }
      }
    }

    return serializedParams;
  } // 对请求参数做处理，实现 query 简化、 post 简化

  function simpleGetMiddleware(ctx, next) {
    if (!ctx) return next();
    var _ctx$req = ctx.req;
    _ctx$req = _ctx$req === void 0 ? {} : _ctx$req;
    var _ctx$req$options = _ctx$req.options,
        options = _ctx$req$options === void 0 ? {} : _ctx$req$options;
    var paramsSerializer = options.paramsSerializer,
        params = options.params;
    var _ctx$req2 = ctx.req;
    _ctx$req2 = _ctx$req2 === void 0 ? {} : _ctx$req2;
    var _ctx$req2$url = _ctx$req2.url,
        url = _ctx$req2$url === void 0 ? '' : _ctx$req2$url; // 将 method 改为大写

    options.method = options.method ? options.method.toUpperCase() : 'GET'; // 设置 credentials 默认值为 same-origin，确保当开发者没有设置时，各浏览器对请求是否发送 cookies 保持一致的行为
    // - omit: 从不发送cookies.
    // - same-origin: 只有当URL与响应脚本同源才发送 cookies、 HTTP Basic authentication 等验证信息.(浏览器默认值,在旧版本浏览器，例如safari 11依旧是omit，safari 12已更改)
    // - include: 不论是不是跨域的请求,总是发送请求资源域在本地的 cookies、 HTTP Basic authentication 等验证信息.

    options.credentials = options.credentials || 'same-origin'; // 支持类似axios 参数自动拼装, 其他method也可用, 不冲突.

    var serializedParams = paramsSerialize(params, paramsSerializer);
    ctx.req.originUrl = url;

    if (serializedParams) {
      var urlSign = url.indexOf('?') !== -1 ? '&' : '?';
      ctx.req.url = "".concat(url).concat(urlSign).concat(serializedParams);
    }

    ctx.req.options = options;
    return next();
  }

  var globalMiddlewares = [simplePostMiddleware, simpleGetMiddleware, parseResponseMiddleware];
  var coreMiddlewares = [fetchMiddleware];
  Onion.globalMiddlewares = globalMiddlewares;
  Onion.defaultGlobalMiddlewaresLength = globalMiddlewares.length;
  Onion.coreMiddlewares = coreMiddlewares;
  Onion.defaultCoreMiddlewaresLength = coreMiddlewares.length;

  var Core =
  /*#__PURE__*/
  function () {
    function Core(initOptions) {
      classCallCheck$1(this, Core);

      this.onion = new Onion([]);
      this.fetchIndex = 0; // 【即将废弃】请求中间件位置

      this.mapCache = new MapCache(initOptions);
      this.initOptions = initOptions;
      this.instanceRequestInterceptors = [];
      this.instanceResponseInterceptors = [];
    } // 旧版拦截器为共享


    createClass$1(Core, [{
      key: "use",
      value: function use(newMiddleware) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          global: false,
          core: false
        };
        this.onion.use(newMiddleware, opt);
        return this;
      }
    }, {
      key: "extendOptions",
      value: function extendOptions(options) {
        this.initOptions = mergeRequestOptions(this.initOptions, options);
        this.mapCache.extendOptions(options);
      } // 执行请求前拦截器

    }, {
      key: "dealRequestInterceptors",
      value: function dealRequestInterceptors(ctx) {
        var reducer = function reducer(p1, p2) {
          return p1.then(function () {
            var ret = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            ctx.req.url = ret.url || ctx.req.url;
            ctx.req.options = ret.options || ctx.req.options;
            return p2(ctx.req.url, ctx.req.options);
          });
        };

        var allInterceptors = [].concat(toConsumableArray(Core.requestInterceptors), toConsumableArray(this.instanceRequestInterceptors));
        return allInterceptors.reduce(reducer, Promise.resolve()).then(function () {
          var ret = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          ctx.req.url = ret.url || ctx.req.url;
          ctx.req.options = ret.options || ctx.req.options;
          return Promise.resolve();
        });
      }
    }, {
      key: "request",
      value: function request(url, options) {
        var _this = this;

        var onion = this.onion;
        var obj = {
          req: {
            url: url,
            options: options
          },
          res: null,
          cache: this.mapCache,
          responseInterceptors: [].concat(toConsumableArray(Core.responseInterceptors), toConsumableArray(this.instanceResponseInterceptors))
        };

        if (typeof url !== 'string') {
          throw new Error('url MUST be a string');
        }

        return new Promise(function (resolve, reject) {
          _this.dealRequestInterceptors(obj).then(function () {
            return onion.execute(obj);
          }).then(function () {
            resolve(obj.res);
          }).catch(function (error) {
            var errorHandler = obj.req.options.errorHandler;

            if (errorHandler) {
              try {
                var data = errorHandler(error);
                resolve(data);
              } catch (e) {
                reject(e);
              }
            } else {
              reject(error);
            }
          });
        });
      }
    }], [{
      key: "requestUse",
      // 请求拦截器 默认 { global: true } 兼容旧版本拦截器
      value: function requestUse(handler) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          global: true
        };
        if (typeof handler !== 'function') throw new TypeError('Interceptor must be function!');

        if (opt.global) {
          Core.requestInterceptors.push(handler);
        } else {
          this.instanceRequestInterceptors.push(handler);
        }
      } // 响应拦截器 默认 { global: true } 兼容旧版本拦截器

    }, {
      key: "responseUse",
      value: function responseUse(handler) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          global: true
        };
        if (typeof handler !== 'function') throw new TypeError('Interceptor must be function!');

        if (opt.global) {
          Core.responseInterceptors.push(handler);
        } else {
          this.instanceResponseInterceptors.push(handler);
        }
      }
    }]);

    return Core;
  }();

  Core.requestInterceptors = [addfix];
  Core.responseInterceptors = [];

  /**
   * 当执行 “取消请求” 操作时会抛出 Cancel 对象作为一场
   * @class
   * @param {string=} message The message.
   */

  function Cancel(message) {
    this.message = message;
  }

  Cancel.prototype.toString = function toString() {
    return this.message ? "Cancel: ".concat(this.message) : 'Cancel';
  };

  Cancel.prototype.__CANCEL__ = true;

  /**
   * 通过 CancelToken 来取消请求操作
   *
   * @class
   * @param {Function} executor The executor function.
   */

  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // 取消操作已被调用过
        return;
      }

      token.reason = new Cancel(message);
      resolvePromise(token.reason);
    });
  }
  /**
   * 如果请求已经取消，抛出 Cancel 异常
   */


  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };
  /**
   * 通过 source 来返回 CancelToken 实例和取消 CancelToken 的函数
   */


  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }

  var request = function request() {
    var initOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var coreInstance = new Core(initOptions);

    var umiInstance = function umiInstance(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var mergeOptions = mergeRequestOptions(coreInstance.initOptions, options);
      return coreInstance.request(url, mergeOptions);
    }; // 中间件


    umiInstance.use = coreInstance.use.bind(coreInstance);
    umiInstance.fetchIndex = coreInstance.fetchIndex; // 拦截器

    umiInstance.interceptors = {
      request: {
        use: Core.requestUse.bind(coreInstance)
      },
      response: {
        use: Core.responseUse.bind(coreInstance)
      }
    }; // 请求语法糖： reguest.get request.post ……

    var METHODS = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options', 'rpc'];
    METHODS.forEach(function (method) {
      umiInstance[method] = function (url, options) {
        return umiInstance(url, objectSpread({}, options, {
          method: method
        }));
      };
    });
    umiInstance.Cancel = Cancel;
    umiInstance.CancelToken = CancelToken;
    umiInstance.isCancel = isCancel;
    umiInstance.extendOptions = coreInstance.extendOptions.bind(coreInstance); // 暴露各个实例的中间件，供开发者自由组合

    umiInstance.middlewares = {
      instance: coreInstance.onion.middlewares,
      defaultInstance: coreInstance.onion.defaultMiddlewares,
      global: Onion.globalMiddlewares,
      core: Onion.coreMiddlewares
    };
    return umiInstance;
  };
  /**
   * extend 方法参考了ky, 让用户可以定制配置.
   * initOpions 初始化参数
   * @param {number} maxCache 最大缓存数
   * @param {string} prefix url前缀
   * @param {function} errorHandler 统一错误处理方法
   * @param {object} headers 统一的headers
   */


  var extend = function extend(initOptions) {
    return request(initOptions);
  };
  /**
   * 暴露 fetch 中间件，保障依旧可以使用
   */

  var fetch$1$1 = request({
    parseResponse: false
  });
  var request$1 = request({});

  var HttpRequest = /*#__PURE__*/function () {
    function HttpRequest() {
      classCallCheck(this, HttpRequest);

      this.options = {
        timeout: 20000,
        charset: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      this.requestInstance = extend(this.options);
    }

    createClass(HttpRequest, [{
      key: "post",
      value: function post() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _Array$prototype$slic = Array.prototype.slice.call(args),
            _Array$prototype$slic2 = slicedToArray(_Array$prototype$slic, 3),
            url = _Array$prototype$slic2[0],
            data = _Array$prototype$slic2[1],
            contentType = _Array$prototype$slic2[2];

        return this.requestInstance.post(url, contentType ? {
          headers: {
            'Content-Type': contentType
          },
          data: data
        } : {
          data: data
        });
      }
    }, {
      key: "get",
      value: function get() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var _Array$prototype$slic3 = Array.prototype.slice.call(args),
            _Array$prototype$slic4 = slicedToArray(_Array$prototype$slic3, 2),
            url = _Array$prototype$slic4[0],
            params = _Array$prototype$slic4[1];

        return this.requestInstance.get(url, {
          params: params
        });
      }
    }, {
      key: "install",
      value: function install(Vue) {
        Vue.prototype.$http = this;
      }
    }], [{
      key: "paramIsEmpty",
      value: function paramIsEmpty() {
        var args = Array.prototype.slice.call(arguments);
        var invalidArgs = args.filter(function (arg) {
          return arg === null || arg === '';
        });
        if (!args.length || invalidArgs.length > 0) throw new Error('参数错误，请检查是否有空参！');
      }
    }]);

    return HttpRequest;
  }();

  var Http = new HttpRequest();

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule$1(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var runtime_1 = createCommonjsModule$1(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] =
      GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
     module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var regenerator = runtime_1;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var asyncToGenerator = _asyncToGenerator;

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script = {
    name: 'carousel-normal',
    data: function data() {
      return {
        instance: null,
        slides: []
      };
    },
    props: {
      id: {
        type: String,
        "default": ''
      },
      css: {
        type: Object,
        "default": function _default() {}
      },
      options: {
        type: Object,
        "default": function _default() {}
      },
      initialState: {
        type: Object,
        "default": function _default() {}
      }
    },
    computed: {
      wrapperStyle: function wrapperStyle() {
        var _this$css = this.css,
            left = _this$css.left,
            top = _this$css.top,
            right = _this$css.right,
            width = _this$css.width,
            height = _this$css.height,
            paddingLeft = _this$css.paddingLeft,
            paddingTop = _this$css.paddingTop,
            paddingBottom = _this$css.paddingBottom,
            paddingRight = _this$css.paddingRight,
            marginTop = _this$css.marginTop,
            marginLeft = _this$css.marginLeft,
            marginBottom = _this$css.marginBottom,
            marginRight = _this$css.marginRight,
            zIndex = _this$css.zIndex,
            borderColor = _this$css.borderColor,
            borderStyle = _this$css.borderStyle,
            borderWidth = _this$css.borderWidth,
            boxSizing = _this$css.boxSizing;
        return {
          position: 'absolute',
          left: left,
          top: top,
          right: right,
          width: width,
          height: height,
          paddingLeft: paddingLeft,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
          paddingRight: paddingRight,
          marginTop: marginTop,
          marginLeft: marginLeft,
          marginBottom: marginBottom,
          marginRight: marginRight,
          zIndex: zIndex,
          borderColor: borderColor,
          borderStyle: borderStyle,
          borderWidth: borderWidth,
          boxSizing: boxSizing
        };
      },
      contentStyle: function contentStyle() {
        var _this$css2 = this.css,
            borderRadius = _this$css2.borderRadius,
            backgroundColor = _this$css2.backgroundColor;
        return {
          height: '100%',
          borderRadius: borderRadius,
          backgroundColor: backgroundColor
        };
      }
    },
    mounted: function mounted() {
      // console.log('result0')
      this.initSwiper(); // console.log('result1')
      // this.fetch(1)
      // console.log('result2')
      // this.fetch(2)
      // console.log('result3')
      // this.fetch(3)
    },
    beforeDestroy: function beforeDestroy() {
      this.instance.destroy();
    },
    methods: {
      getInitialState: function getInitialState(config) {
        var _this = this;

        return new Promise( /*#__PURE__*/function () {
          var _ref = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(resolve, reject) {
            var slides;
            return regenerator.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return _this.fetch(config);

                  case 2:
                    slides = _context.sent;
                    resolve({
                      slides: slides
                    });

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x, _x2) {
            return _ref.apply(this, arguments);
          };
        }());
      },
      initSwiper: function initSwiper() {
        var _this2 = this;

        var swiperOptions = {
          loop: true,
          autoplay: this.options.autoplay,
          speed: this.options.speed,
          delay: this.options.delay,
          effect: this.options.effect,
          pagination: {
            el: '.swiper-pagination'
          }
        };
        setTimeout(function () {
          _this2.instance = new Swiper("#".concat(_this2.id), swiperOptions);
        }, 20);
      },
      fetch: function fetch(config) {
        var _this3 = this;

        return asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
          var result;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return _this3.$dataService.fetch({
                    source: 'bannerSource'
                  });

                case 2:
                  result = _context2.sent;

                  if (!(result.code === 0 && !!result.data.length)) {
                    _context2.next = 5;
                    break;
                  }

                  return _context2.abrupt("return", result.data.slice(0, config.options.nums));

                case 5:
                  return _context2.abrupt("return", []);

                case 6:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }))();
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { style: _vm.wrapperStyle }, [
      _c(
        "div",
        {
          staticClass: "swiper-container",
          style: _vm.contentStyle,
          attrs: { id: _vm.id }
        },
        [
          _c(
            "div",
            { staticClass: "swiper-wrapper" },
            _vm._l(_vm.initialState.slides, function(url, index) {
              return _c("div", { key: index, staticClass: "swiper-slide" }, [
                _c("img", {
                  style: { objectFit: _vm.css.objectFit },
                  attrs: { src: url }
                })
              ])
            }),
            0
          ),
          _vm._v(" "),
          _c("div", { staticClass: "swiper-pagination" })
        ]
      )
    ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$1 = {
    name: 'carousel-rotate',
    data: function data() {
      return {
        instance: null,
        slides: []
      };
    },
    props: {
      id: {
        type: String,
        "default": ''
      },
      css: {
        type: Object,
        "default": function _default() {}
      },
      options: {
        type: Object,
        "default": function _default() {}
      },
      initialState: {
        type: Object,
        "default": function _default() {}
      }
    },
    computed: {
      wrapperStyle: function wrapperStyle() {
        var _this$css = this.css,
            left = _this$css.left,
            top = _this$css.top,
            right = _this$css.right,
            width = _this$css.width,
            height = _this$css.height,
            paddingLeft = _this$css.paddingLeft,
            paddingTop = _this$css.paddingTop,
            paddingBottom = _this$css.paddingBottom,
            paddingRight = _this$css.paddingRight,
            marginTop = _this$css.marginTop,
            marginLeft = _this$css.marginLeft,
            marginBottom = _this$css.marginBottom,
            marginRight = _this$css.marginRight,
            zIndex = _this$css.zIndex,
            borderColor = _this$css.borderColor,
            borderStyle = _this$css.borderStyle,
            borderWidth = _this$css.borderWidth,
            boxSizing = _this$css.boxSizing;
        return {
          position: 'absolute',
          left: left,
          top: top,
          right: right,
          width: width,
          height: height,
          paddingLeft: paddingLeft,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
          paddingRight: paddingRight,
          marginTop: marginTop,
          marginLeft: marginLeft,
          marginBottom: marginBottom,
          marginRight: marginRight,
          zIndex: zIndex,
          borderColor: borderColor,
          borderStyle: borderStyle,
          borderWidth: borderWidth,
          boxSizing: boxSizing
        };
      },
      contentStyle: function contentStyle() {
        return {
          height: '100%'
        };
      },
      slideStyle: function slideStyle() {
        var _this$css2 = this.css,
            slideWidth = _this$css2.slideWidth,
            borderRadius = _this$css2.borderRadius,
            backgroundColor = _this$css2.backgroundColor;
        return {
          width: slideWidth,
          backgroundColor: backgroundColor,
          borderRadius: borderRadius
        };
      }
    },
    mounted: function mounted() {
      this.initSwiper();
    },
    beforeDestroy: function beforeDestroy() {
      this.instance.destroy();
    },
    methods: {
      getInitialState: function getInitialState(config) {
        var _this = this;

        return new Promise( /*#__PURE__*/function () {
          var _ref = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(resolve, reject) {
            var slides;
            return regenerator.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return _this.fetch(config);

                  case 2:
                    slides = _context.sent;
                    resolve({
                      slides: slides
                    });

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x, _x2) {
            return _ref.apply(this, arguments);
          };
        }());
      },
      initSwiper: function initSwiper() {
        var _this2 = this;

        var swiperOptions = {
          slidesPerView: 'auto',
          watchSlidesProgress: true,
          centeredSlides: true,
          loop: true,
          autoplay: this.options.autoplay,
          speed: this.options.speed,
          delay: this.options.delay,
          loopedSlides: 3,
          effect: 'coverflow',
          coverflowEffect: {
            rotate: 0,
            stretch: 10,
            depth: 80,
            modifier: 3,
            slideShadows: true
          }
        };
        /**
         * this.$nextTick doesn't work when there are more than one swipers exist on the page
         * setTimeout delay time should >= 4, but with the number of swipers grows, the time
         * should be bigger too, or there will be unexpected bugs
         */

        setTimeout(function () {
          _this2.instance = new Swiper("#".concat(_this2.id), swiperOptions);
        }, 20);
      },
      fetch: function fetch(config) {
        var _this3 = this;

        return asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
          var result;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return _this3.$dataService.fetch({
                    source: 'bannerSource'
                  });

                case 2:
                  result = _context2.sent;

                  if (!(result.code === 0 && !!result.data.length)) {
                    _context2.next = 5;
                    break;
                  }

                  return _context2.abrupt("return", result.data.slice(0, config.options.nums));

                case 5:
                  return _context2.abrupt("return", []);

                case 6:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }))();
      }
    }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { style: _vm.wrapperStyle }, [
      _c(
        "div",
        {
          staticClass: "swiper-container swiper-rotate",
          style: _vm.contentStyle,
          attrs: { id: _vm.id }
        },
        [
          _c(
            "div",
            { staticClass: "swiper-wrapper" },
            _vm._l(_vm.initialState.slides, function(url, index) {
              return _c(
                "div",
                {
                  key: index,
                  staticClass: "swiper-slide",
                  style: _vm.slideStyle
                },
                [
                  _c("img", {
                    style: { objectFit: _vm.css.objectFit },
                    attrs: { src: url }
                  })
                ]
              )
            }),
            0
          )
        ]
      )
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = undefined;
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$2 = {
    name: 'cmp-carousel',
    data: function data() {
      return {
        instance: null,
        slides: this.options && this.options.items
      };
    },
    props: {
      id: {
        type: String,
        "default": ''
      },
      css: {
        type: Object,
        "default": function _default() {}
      },
      options: {
        type: Object,
        "default": function _default() {}
      }
    },
    computed: {
      wrapperStyle: function wrapperStyle() {
        var _this$css = this.css,
            left = _this$css.left,
            top = _this$css.top,
            right = _this$css.right,
            width = _this$css.width,
            height = _this$css.height,
            paddingLeft = _this$css.paddingLeft,
            paddingTop = _this$css.paddingTop,
            paddingBottom = _this$css.paddingBottom,
            paddingRight = _this$css.paddingRight,
            marginTop = _this$css.marginTop,
            marginLeft = _this$css.marginLeft,
            marginBottom = _this$css.marginBottom,
            marginRight = _this$css.marginRight,
            zIndex = _this$css.zIndex,
            borderColor = _this$css.borderColor,
            borderStyle = _this$css.borderStyle,
            borderWidth = _this$css.borderWidth,
            boxSizing = _this$css.boxSizing;
        return {
          position: 'absolute',
          left: left,
          top: top,
          right: right,
          width: width,
          height: height,
          paddingLeft: paddingLeft,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
          paddingRight: paddingRight,
          marginTop: marginTop,
          marginLeft: marginLeft,
          marginBottom: marginBottom,
          marginRight: marginRight,
          zIndex: zIndex,
          borderColor: borderColor,
          borderStyle: borderStyle,
          borderWidth: borderWidth,
          boxSizing: boxSizing
        };
      },
      contentStyle: function contentStyle() {
        var _this$css2 = this.css,
            borderRadius = _this$css2.borderRadius,
            backgroundColor = _this$css2.backgroundColor;
        return {
          height: '100%',
          borderRadius: borderRadius,
          backgroundColor: backgroundColor
        };
      }
    },
    mounted: function mounted() {
      this.init();
    },
    beforeDestroy: function beforeDestroy() {
      this.instance.destroy();
    },
    methods: {
      init: function init() {
        var _this = this;

        this.$nextTick(function () {
          var swiperOptions = {
            loop: true,
            autoplay: _this.options.autoplay,
            delay: _this.options.delay,
            speed: _this.options.speed,
            effect: _this.options.effect,
            pagination: {
              el: '.swiper-pagination'
            }
          };
          _this.instance = new Swiper("#".concat(_this.id), swiperOptions);
        });
      }
    }
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { style: _vm.wrapperStyle }, [
      _c(
        "div",
        {
          staticClass: "swiper-container swiper-rotate",
          style: _vm.contentStyle,
          attrs: { id: _vm.id }
        },
        [
          _c(
            "div",
            { staticClass: "swiper-wrapper" },
            _vm._l(_vm.slides, function(item, index) {
              return _c(
                "div",
                {
                  key: index,
                  staticClass: "swiper-slide",
                  style: _vm.slideStyle
                },
                [
                  _c("img", {
                    style: { objectFit: _vm.css.objectFit },
                    attrs: { src: item.url }
                  })
                ]
              )
            }),
            0
          ),
          _vm._v(" "),
          _c("div", { staticClass: "swiper-pagination" })
        ]
      )
    ])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = undefined;
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  var script$3 = {
    name: 'cmp-div',
    data: function data() {
      return {};
    },
    props: {
      css: {
        type: Object,
        "default": function _default() {}
      },
      options: {
        type: Object,
        "default": function _default() {}
      }
    }
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "cmp-div", style: _vm.css })
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = undefined;
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  var script$4 = {
    name: 'cmp-image',
    data: function data() {
      return {};
    },
    props: {
      css: {
        type: Object,
        "default": function _default() {}
      },
      options: {
        type: Object,
        "default": function _default() {}
      }
    }
  };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("img", {
      staticClass: "cmp-image",
      style: _vm.css,
      attrs: { src: _vm.options.url }
    })
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = undefined;
    /* scoped */
    const __vue_scope_id__$4 = undefined;
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$4 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  var script$5 = {
    name: 'cmp-text',
    data: function data() {
      return {};
    },
    props: {
      css: {
        type: Object,
        "default": function _default() {}
      },
      options: {
        type: Object,
        "default": function _default() {}
      }
    }
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("p", { staticClass: "cmp-text", style: _vm.css }, [
      _vm._v(_vm._s(_vm.options.text))
    ])
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = undefined;
    /* scoped */
    const __vue_scope_id__$5 = undefined;
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$5 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      false,
      undefined,
      undefined,
      undefined
    );

  function importAll(context) {
    var components = [];
    context.keys().forEach(function (key) {
      // modules = { ...modules, ...context(key) }
      components.push(context(key));
    });
    return components;
  }

  function registerComponents() {
    var components = importAll(function () {
      var map = {
        '/Users/yujia/Documents/projects/lego-page-engine/src/components/carousel/carouselNormal.vue': __vue_component__,
        '/Users/yujia/Documents/projects/lego-page-engine/src/components/carousel/carouselRotate.vue': __vue_component__$1,
        '/Users/yujia/Documents/projects/lego-page-engine/src/components/cmpCarousel/cmpCarousel.vue': __vue_component__$2,
        '/Users/yujia/Documents/projects/lego-page-engine/src/components/cmpDiv/cmpDiv.vue': __vue_component__$3,
        '/Users/yujia/Documents/projects/lego-page-engine/src/components/cmpImage/cmpImage.vue': __vue_component__$4,
        '/Users/yujia/Documents/projects/lego-page-engine/src/components/cmpText/cmpText.vue': __vue_component__$5
      };

      var req = function req(key) {
        return map[key] || function () {
          throw new Error("Cannot find module '" + key + "'.");
        }();
      };

      req.keys = function () {
        return Object.keys(map);
      };

      return req;
    }());
    components.forEach(function (component) {
      Vue.component(component.name, component);
    });
  }

  function constructPage() {
    return _constructPage.apply(this, arguments);
  }

  function _constructPage() {
    _constructPage = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      var cmps, _PAGE_DATA__, pageConfig, componentsConfig, i, data, CmpConstructor, initialState, tempInstance, getInitialState, cmpInstance, rootEl;

      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!window.__PAGE_DATA__) {
                _context.next = 25;
                break;
              }

              cmps = [];
              _PAGE_DATA__ = __PAGE_DATA__, pageConfig = _PAGE_DATA__.pageConfig, componentsConfig = _PAGE_DATA__.componentsConfig;
              setPageData(pageConfig);

              if (!componentsConfig.length) {
                _context.next = 22;
                break;
              }

              i = 0;

            case 6:
              if (!(i < componentsConfig.length)) {
                _context.next = 22;
                break;
              }

              data = componentsConfig[i];
              CmpConstructor = Vue.component(data.name);

              if (!(typeof CmpConstructor === 'function')) {
                _context.next = 19;
                break;
              }

              initialState = {};
              tempInstance = new CmpConstructor();
              getInitialState = tempInstance.$options.methods.getInitialState;

              if (!(typeof getInitialState === 'function')) {
                _context.next = 17;
                break;
              }

              _context.next = 16;
              return getInitialState.call(tempInstance, {
                id: data.id,
                options: data.options
              });

            case 16:
              initialState = _context.sent;

            case 17:
              cmpInstance = new CmpConstructor({
                propsData: {
                  id: data.id,
                  css: transformCss(data.css),
                  options: data.options,
                  initialState: initialState
                }
              }).$mount();
              cmps.push(cmpInstance.$el);

            case 19:
              i++;
              _context.next = 6;
              break;

            case 22:
              rootEl = document.getElementById('lego-app');
              cmps.forEach(function (el) {
                rootEl.appendChild(el);
              });
              console.log(__PAGE_DATA__);

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _constructPage.apply(this, arguments);
  }

  function setPageData(pageConfig) {
    var title = pageConfig.title,
        pageHeight = pageConfig.pageHeight,
        backgroundColor = pageConfig.backgroundColor,
        backgroundImage = pageConfig.backgroundImage,
        backgroundRepeat = pageConfig.backgroundRepeat;
    var rootFontSize = parseFloat(document.documentElement.style.fontSize);
    document.title = title;
    document.body.style.height = "".concat(parseFloat(pageHeight / rootFontSize).toFixed(2), "rem");
    document.body.style.backgroundImage = "url(".concat(backgroundImage, ")");
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.backgroundRepeat = backgroundRepeat;
  }

  function transformCss(cssObj) {
    var attrs = ['width', 'height', 'left', 'top', 'bottom', 'right', 'borderWidth', 'borderRadius', 'fontSize', 'lineHeight', 'letterSpacing', 'paddingTop', 'paddingLeft', 'paddingBottom', 'paddingRight', 'marginTop', 'margiLeft', 'marginBottom', 'marginRight', 'slideWidth'];
    var rootFontSize = parseFloat(document.documentElement.style.fontSize);
    var copyCssObj = Object.assign({}, cssObj);
    Object.keys(copyCssObj).forEach(function (key) {
      if (attrs.includes(key)) {
        copyCssObj[key] = "".concat(parseFloat(copyCssObj[key] / rootFontSize).toFixed(2), "rem");
      }
    });
    copyCssObj.position = 'absolute';
    return copyCssObj;
  }

  function initPage() {
    registerComponents();
    constructPage();
  }

  function _arrayWithoutHoles$1(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr);
  }

  var arrayWithoutHoles$1 = _arrayWithoutHoles$1;

  function _iterableToArray$1(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  var iterableToArray$1 = _iterableToArray$1;

  function _nonIterableSpread$1() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var nonIterableSpread$1 = _nonIterableSpread$1;

  function _toConsumableArray$1(arr) {
    return arrayWithoutHoles$1(arr) || iterableToArray$1(arr) || unsupportedIterableToArray(arr) || nonIterableSpread$1();
  }

  var toConsumableArray$1 = _toConsumableArray$1;

  var BaseUrl = 'http://localhost:3000';

  var DataSource = /*#__PURE__*/function () {
    function DataSource(url, method, params, beforeRequest, afterRequest) {
      classCallCheck(this, DataSource);

      this.url = url;
      this.method = method;
      this.params = params;
      this.beforeRequest = beforeRequest;
      this.afterRequest = afterRequest;
      this.batch = null;
      this.isFlushing = false;
      this.isFlushPending = false;
    }

    createClass(DataSource, [{
      key: "setBatch",
      value: function setBatch(batch) {
        this.batch = batch;
      }
    }, {
      key: "generateAction",
      value: function generateAction() {
        var callback = function callback(resolve, res) {
          resolve(res);
        };

        return new Action(this.url, this.method, this.params, callback);
      }
    }, {
      key: "pack",
      value: function pack(actions) {
        return this.batch.pack(actions);
      }
    }]);

    return DataSource;
  }();

  var Batch = function Batch(pack, unpack) {
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;

    classCallCheck(this, Batch);

    this.pack = typeof pack === 'function' ? pack : function () {};
    this.unpack = typeof unpack === 'function' ? unpack : function () {};
    this.limit = limit;
  };

  var Action = function Action(url, method, params, callback) {
    classCallCheck(this, Action);

    this.url = url;
    this.method = method;
    this.params = params;
    this.callback = callback;
  };

  var bannerSource = function bannerSource(params) {
    var beforeRequest = function beforeRequest() {
      return this.params;
    };

    var afterRequest = function afterRequest(result) {
      return result;
    };

    var source = new DataSource("".concat(BaseUrl, "/data/banner"), 'get', params, beforeRequest, afterRequest);

    var unpack = function unpack(result, actions) {};

    var pack = function pack(actions) {};

    var batch = new Batch(pack, unpack, 2);
    source.setBatch(batch);
    return source;
  };

  var DataSources = {
    bannerSource: bannerSource
  };

  var core = createCommonjsModule$1(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory();
  	}
  }(commonjsGlobal, function () {

  	/*globals window, global, require*/

  	/**
  	 * CryptoJS core components.
  	 */
  	var CryptoJS = CryptoJS || (function (Math, undefined$1) {

  	    var crypto$1;

  	    // Native crypto from window (Browser)
  	    if (typeof window !== 'undefined' && window.crypto) {
  	        crypto$1 = window.crypto;
  	    }

  	    // Native (experimental IE 11) crypto from window (Browser)
  	    if (!crypto$1 && typeof window !== 'undefined' && window.msCrypto) {
  	        crypto$1 = window.msCrypto;
  	    }

  	    // Native crypto from global (NodeJS)
  	    if (!crypto$1 && typeof commonjsGlobal !== 'undefined' && commonjsGlobal.crypto) {
  	        crypto$1 = commonjsGlobal.crypto;
  	    }

  	    // Native crypto import via require (NodeJS)
  	    if (!crypto$1 && typeof commonjsRequire === 'function') {
  	        try {
  	            crypto$1 = crypto;
  	        } catch (err) {}
  	    }

  	    /*
  	     * Cryptographically secure pseudorandom number generator
  	     *
  	     * As Math.random() is cryptographically not safe to use
  	     */
  	    var cryptoSecureRandomInt = function () {
  	        if (crypto$1) {
  	            // Use getRandomValues method (Browser)
  	            if (typeof crypto$1.getRandomValues === 'function') {
  	                try {
  	                    return crypto$1.getRandomValues(new Uint32Array(1))[0];
  	                } catch (err) {}
  	            }

  	            // Use randomBytes method (NodeJS)
  	            if (typeof crypto$1.randomBytes === 'function') {
  	                try {
  	                    return crypto$1.randomBytes(4).readInt32LE();
  	                } catch (err) {}
  	            }
  	        }

  	        throw new Error('Native crypto module could not be used to get secure random number.');
  	    };

  	    /*
  	     * Local polyfill of Object.create

  	     */
  	    var create = Object.create || (function () {
  	        function F() {}

  	        return function (obj) {
  	            var subtype;

  	            F.prototype = obj;

  	            subtype = new F();

  	            F.prototype = null;

  	            return subtype;
  	        };
  	    }());

  	    /**
  	     * CryptoJS namespace.
  	     */
  	    var C = {};

  	    /**
  	     * Library namespace.
  	     */
  	    var C_lib = C.lib = {};

  	    /**
  	     * Base object for prototypal inheritance.
  	     */
  	    var Base = C_lib.Base = (function () {


  	        return {
  	            /**
  	             * Creates a new object that inherits from this object.
  	             *
  	             * @param {Object} overrides Properties to copy into the new object.
  	             *
  	             * @return {Object} The new object.
  	             *
  	             * @static
  	             *
  	             * @example
  	             *
  	             *     var MyType = CryptoJS.lib.Base.extend({
  	             *         field: 'value',
  	             *
  	             *         method: function () {
  	             *         }
  	             *     });
  	             */
  	            extend: function (overrides) {
  	                // Spawn
  	                var subtype = create(this);

  	                // Augment
  	                if (overrides) {
  	                    subtype.mixIn(overrides);
  	                }

  	                // Create default initializer
  	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
  	                    subtype.init = function () {
  	                        subtype.$super.init.apply(this, arguments);
  	                    };
  	                }

  	                // Initializer's prototype is the subtype object
  	                subtype.init.prototype = subtype;

  	                // Reference supertype
  	                subtype.$super = this;

  	                return subtype;
  	            },

  	            /**
  	             * Extends this object and runs the init method.
  	             * Arguments to create() will be passed to init().
  	             *
  	             * @return {Object} The new object.
  	             *
  	             * @static
  	             *
  	             * @example
  	             *
  	             *     var instance = MyType.create();
  	             */
  	            create: function () {
  	                var instance = this.extend();
  	                instance.init.apply(instance, arguments);

  	                return instance;
  	            },

  	            /**
  	             * Initializes a newly created object.
  	             * Override this method to add some logic when your objects are created.
  	             *
  	             * @example
  	             *
  	             *     var MyType = CryptoJS.lib.Base.extend({
  	             *         init: function () {
  	             *             // ...
  	             *         }
  	             *     });
  	             */
  	            init: function () {
  	            },

  	            /**
  	             * Copies properties into this object.
  	             *
  	             * @param {Object} properties The properties to mix in.
  	             *
  	             * @example
  	             *
  	             *     MyType.mixIn({
  	             *         field: 'value'
  	             *     });
  	             */
  	            mixIn: function (properties) {
  	                for (var propertyName in properties) {
  	                    if (properties.hasOwnProperty(propertyName)) {
  	                        this[propertyName] = properties[propertyName];
  	                    }
  	                }

  	                // IE won't copy toString using the loop above
  	                if (properties.hasOwnProperty('toString')) {
  	                    this.toString = properties.toString;
  	                }
  	            },

  	            /**
  	             * Creates a copy of this object.
  	             *
  	             * @return {Object} The clone.
  	             *
  	             * @example
  	             *
  	             *     var clone = instance.clone();
  	             */
  	            clone: function () {
  	                return this.init.prototype.extend(this);
  	            }
  	        };
  	    }());

  	    /**
  	     * An array of 32-bit words.
  	     *
  	     * @property {Array} words The array of 32-bit words.
  	     * @property {number} sigBytes The number of significant bytes in this word array.
  	     */
  	    var WordArray = C_lib.WordArray = Base.extend({
  	        /**
  	         * Initializes a newly created word array.
  	         *
  	         * @param {Array} words (Optional) An array of 32-bit words.
  	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.lib.WordArray.create();
  	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
  	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
  	         */
  	        init: function (words, sigBytes) {
  	            words = this.words = words || [];

  	            if (sigBytes != undefined$1) {
  	                this.sigBytes = sigBytes;
  	            } else {
  	                this.sigBytes = words.length * 4;
  	            }
  	        },

  	        /**
  	         * Converts this word array to a string.
  	         *
  	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
  	         *
  	         * @return {string} The stringified word array.
  	         *
  	         * @example
  	         *
  	         *     var string = wordArray + '';
  	         *     var string = wordArray.toString();
  	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
  	         */
  	        toString: function (encoder) {
  	            return (encoder || Hex).stringify(this);
  	        },

  	        /**
  	         * Concatenates a word array to this word array.
  	         *
  	         * @param {WordArray} wordArray The word array to append.
  	         *
  	         * @return {WordArray} This word array.
  	         *
  	         * @example
  	         *
  	         *     wordArray1.concat(wordArray2);
  	         */
  	        concat: function (wordArray) {
  	            // Shortcuts
  	            var thisWords = this.words;
  	            var thatWords = wordArray.words;
  	            var thisSigBytes = this.sigBytes;
  	            var thatSigBytes = wordArray.sigBytes;

  	            // Clamp excess bits
  	            this.clamp();

  	            // Concat
  	            if (thisSigBytes % 4) {
  	                // Copy one byte at a time
  	                for (var i = 0; i < thatSigBytes; i++) {
  	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
  	                }
  	            } else {
  	                // Copy one word at a time
  	                for (var i = 0; i < thatSigBytes; i += 4) {
  	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
  	                }
  	            }
  	            this.sigBytes += thatSigBytes;

  	            // Chainable
  	            return this;
  	        },

  	        /**
  	         * Removes insignificant bits.
  	         *
  	         * @example
  	         *
  	         *     wordArray.clamp();
  	         */
  	        clamp: function () {
  	            // Shortcuts
  	            var words = this.words;
  	            var sigBytes = this.sigBytes;

  	            // Clamp
  	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
  	            words.length = Math.ceil(sigBytes / 4);
  	        },

  	        /**
  	         * Creates a copy of this word array.
  	         *
  	         * @return {WordArray} The clone.
  	         *
  	         * @example
  	         *
  	         *     var clone = wordArray.clone();
  	         */
  	        clone: function () {
  	            var clone = Base.clone.call(this);
  	            clone.words = this.words.slice(0);

  	            return clone;
  	        },

  	        /**
  	         * Creates a word array filled with random bytes.
  	         *
  	         * @param {number} nBytes The number of random bytes to generate.
  	         *
  	         * @return {WordArray} The random word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
  	         */
  	        random: function (nBytes) {
  	            var words = [];

  	            for (var i = 0; i < nBytes; i += 4) {
  	                words.push(cryptoSecureRandomInt());
  	            }

  	            return new WordArray.init(words, nBytes);
  	        }
  	    });

  	    /**
  	     * Encoder namespace.
  	     */
  	    var C_enc = C.enc = {};

  	    /**
  	     * Hex encoding strategy.
  	     */
  	    var Hex = C_enc.Hex = {
  	        /**
  	         * Converts a word array to a hex string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The hex string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;

  	            // Convert
  	            var hexChars = [];
  	            for (var i = 0; i < sigBytes; i++) {
  	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  	                hexChars.push((bite >>> 4).toString(16));
  	                hexChars.push((bite & 0x0f).toString(16));
  	            }

  	            return hexChars.join('');
  	        },

  	        /**
  	         * Converts a hex string to a word array.
  	         *
  	         * @param {string} hexStr The hex string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
  	         */
  	        parse: function (hexStr) {
  	            // Shortcut
  	            var hexStrLength = hexStr.length;

  	            // Convert
  	            var words = [];
  	            for (var i = 0; i < hexStrLength; i += 2) {
  	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
  	            }

  	            return new WordArray.init(words, hexStrLength / 2);
  	        }
  	    };

  	    /**
  	     * Latin1 encoding strategy.
  	     */
  	    var Latin1 = C_enc.Latin1 = {
  	        /**
  	         * Converts a word array to a Latin1 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The Latin1 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;

  	            // Convert
  	            var latin1Chars = [];
  	            for (var i = 0; i < sigBytes; i++) {
  	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  	                latin1Chars.push(String.fromCharCode(bite));
  	            }

  	            return latin1Chars.join('');
  	        },

  	        /**
  	         * Converts a Latin1 string to a word array.
  	         *
  	         * @param {string} latin1Str The Latin1 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
  	         */
  	        parse: function (latin1Str) {
  	            // Shortcut
  	            var latin1StrLength = latin1Str.length;

  	            // Convert
  	            var words = [];
  	            for (var i = 0; i < latin1StrLength; i++) {
  	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  	            }

  	            return new WordArray.init(words, latin1StrLength);
  	        }
  	    };

  	    /**
  	     * UTF-8 encoding strategy.
  	     */
  	    var Utf8 = C_enc.Utf8 = {
  	        /**
  	         * Converts a word array to a UTF-8 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The UTF-8 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            try {
  	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
  	            } catch (e) {
  	                throw new Error('Malformed UTF-8 data');
  	            }
  	        },

  	        /**
  	         * Converts a UTF-8 string to a word array.
  	         *
  	         * @param {string} utf8Str The UTF-8 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
  	         */
  	        parse: function (utf8Str) {
  	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  	        }
  	    };

  	    /**
  	     * Abstract buffered block algorithm template.
  	     *
  	     * The property blockSize must be implemented in a concrete subtype.
  	     *
  	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
  	     */
  	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
  	        /**
  	         * Resets this block algorithm's data buffer to its initial state.
  	         *
  	         * @example
  	         *
  	         *     bufferedBlockAlgorithm.reset();
  	         */
  	        reset: function () {
  	            // Initial values
  	            this._data = new WordArray.init();
  	            this._nDataBytes = 0;
  	        },

  	        /**
  	         * Adds new data to this block algorithm's buffer.
  	         *
  	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
  	         *
  	         * @example
  	         *
  	         *     bufferedBlockAlgorithm._append('data');
  	         *     bufferedBlockAlgorithm._append(wordArray);
  	         */
  	        _append: function (data) {
  	            // Convert string to WordArray, else assume WordArray already
  	            if (typeof data == 'string') {
  	                data = Utf8.parse(data);
  	            }

  	            // Append
  	            this._data.concat(data);
  	            this._nDataBytes += data.sigBytes;
  	        },

  	        /**
  	         * Processes available data blocks.
  	         *
  	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
  	         *
  	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
  	         *
  	         * @return {WordArray} The processed data.
  	         *
  	         * @example
  	         *
  	         *     var processedData = bufferedBlockAlgorithm._process();
  	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
  	         */
  	        _process: function (doFlush) {
  	            var processedWords;

  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;
  	            var dataSigBytes = data.sigBytes;
  	            var blockSize = this.blockSize;
  	            var blockSizeBytes = blockSize * 4;

  	            // Count blocks ready
  	            var nBlocksReady = dataSigBytes / blockSizeBytes;
  	            if (doFlush) {
  	                // Round up to include partial blocks
  	                nBlocksReady = Math.ceil(nBlocksReady);
  	            } else {
  	                // Round down to include only full blocks,
  	                // less the number of blocks that must remain in the buffer
  	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
  	            }

  	            // Count words ready
  	            var nWordsReady = nBlocksReady * blockSize;

  	            // Count bytes ready
  	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

  	            // Process blocks
  	            if (nWordsReady) {
  	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
  	                    // Perform concrete-algorithm logic
  	                    this._doProcessBlock(dataWords, offset);
  	                }

  	                // Remove processed words
  	                processedWords = dataWords.splice(0, nWordsReady);
  	                data.sigBytes -= nBytesReady;
  	            }

  	            // Return processed words
  	            return new WordArray.init(processedWords, nBytesReady);
  	        },

  	        /**
  	         * Creates a copy of this object.
  	         *
  	         * @return {Object} The clone.
  	         *
  	         * @example
  	         *
  	         *     var clone = bufferedBlockAlgorithm.clone();
  	         */
  	        clone: function () {
  	            var clone = Base.clone.call(this);
  	            clone._data = this._data.clone();

  	            return clone;
  	        },

  	        _minBufferSize: 0
  	    });

  	    /**
  	     * Abstract hasher template.
  	     *
  	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
  	     */
  	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
  	        /**
  	         * Configuration options.
  	         */
  	        cfg: Base.extend(),

  	        /**
  	         * Initializes a newly created hasher.
  	         *
  	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
  	         *
  	         * @example
  	         *
  	         *     var hasher = CryptoJS.algo.SHA256.create();
  	         */
  	        init: function (cfg) {
  	            // Apply config defaults
  	            this.cfg = this.cfg.extend(cfg);

  	            // Set initial values
  	            this.reset();
  	        },

  	        /**
  	         * Resets this hasher to its initial state.
  	         *
  	         * @example
  	         *
  	         *     hasher.reset();
  	         */
  	        reset: function () {
  	            // Reset data buffer
  	            BufferedBlockAlgorithm.reset.call(this);

  	            // Perform concrete-hasher logic
  	            this._doReset();
  	        },

  	        /**
  	         * Updates this hasher with a message.
  	         *
  	         * @param {WordArray|string} messageUpdate The message to append.
  	         *
  	         * @return {Hasher} This hasher.
  	         *
  	         * @example
  	         *
  	         *     hasher.update('message');
  	         *     hasher.update(wordArray);
  	         */
  	        update: function (messageUpdate) {
  	            // Append
  	            this._append(messageUpdate);

  	            // Update the hash
  	            this._process();

  	            // Chainable
  	            return this;
  	        },

  	        /**
  	         * Finalizes the hash computation.
  	         * Note that the finalize operation is effectively a destructive, read-once operation.
  	         *
  	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
  	         *
  	         * @return {WordArray} The hash.
  	         *
  	         * @example
  	         *
  	         *     var hash = hasher.finalize();
  	         *     var hash = hasher.finalize('message');
  	         *     var hash = hasher.finalize(wordArray);
  	         */
  	        finalize: function (messageUpdate) {
  	            // Final message update
  	            if (messageUpdate) {
  	                this._append(messageUpdate);
  	            }

  	            // Perform concrete-hasher logic
  	            var hash = this._doFinalize();

  	            return hash;
  	        },

  	        blockSize: 512/32,

  	        /**
  	         * Creates a shortcut function to a hasher's object interface.
  	         *
  	         * @param {Hasher} hasher The hasher to create a helper for.
  	         *
  	         * @return {Function} The shortcut function.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
  	         */
  	        _createHelper: function (hasher) {
  	            return function (message, cfg) {
  	                return new hasher.init(cfg).finalize(message);
  	            };
  	        },

  	        /**
  	         * Creates a shortcut function to the HMAC's object interface.
  	         *
  	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
  	         *
  	         * @return {Function} The shortcut function.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
  	         */
  	        _createHmacHelper: function (hasher) {
  	            return function (message, key) {
  	                return new C_algo.HMAC.init(hasher, key).finalize(message);
  	            };
  	        }
  	    });

  	    /**
  	     * Algorithm namespace.
  	     */
  	    var C_algo = C.algo = {};

  	    return C;
  	}(Math));


  	return CryptoJS;

  }));
  });

  var x64Core = createCommonjsModule$1(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function (undefined$1) {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var Base = C_lib.Base;
  	    var X32WordArray = C_lib.WordArray;

  	    /**
  	     * x64 namespace.
  	     */
  	    var C_x64 = C.x64 = {};

  	    /**
  	     * A 64-bit word.
  	     */
  	    var X64Word = C_x64.Word = Base.extend({
  	        /**
  	         * Initializes a newly created 64-bit word.
  	         *
  	         * @param {number} high The high 32 bits.
  	         * @param {number} low The low 32 bits.
  	         *
  	         * @example
  	         *
  	         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
  	         */
  	        init: function (high, low) {
  	            this.high = high;
  	            this.low = low;
  	        }

  	        /**
  	         * Bitwise NOTs this word.
  	         *
  	         * @return {X64Word} A new x64-Word object after negating.
  	         *
  	         * @example
  	         *
  	         *     var negated = x64Word.not();
  	         */
  	        // not: function () {
  	            // var high = ~this.high;
  	            // var low = ~this.low;

  	            // return X64Word.create(high, low);
  	        // },

  	        /**
  	         * Bitwise ANDs this word with the passed word.
  	         *
  	         * @param {X64Word} word The x64-Word to AND with this word.
  	         *
  	         * @return {X64Word} A new x64-Word object after ANDing.
  	         *
  	         * @example
  	         *
  	         *     var anded = x64Word.and(anotherX64Word);
  	         */
  	        // and: function (word) {
  	            // var high = this.high & word.high;
  	            // var low = this.low & word.low;

  	            // return X64Word.create(high, low);
  	        // },

  	        /**
  	         * Bitwise ORs this word with the passed word.
  	         *
  	         * @param {X64Word} word The x64-Word to OR with this word.
  	         *
  	         * @return {X64Word} A new x64-Word object after ORing.
  	         *
  	         * @example
  	         *
  	         *     var ored = x64Word.or(anotherX64Word);
  	         */
  	        // or: function (word) {
  	            // var high = this.high | word.high;
  	            // var low = this.low | word.low;

  	            // return X64Word.create(high, low);
  	        // },

  	        /**
  	         * Bitwise XORs this word with the passed word.
  	         *
  	         * @param {X64Word} word The x64-Word to XOR with this word.
  	         *
  	         * @return {X64Word} A new x64-Word object after XORing.
  	         *
  	         * @example
  	         *
  	         *     var xored = x64Word.xor(anotherX64Word);
  	         */
  	        // xor: function (word) {
  	            // var high = this.high ^ word.high;
  	            // var low = this.low ^ word.low;

  	            // return X64Word.create(high, low);
  	        // },

  	        /**
  	         * Shifts this word n bits to the left.
  	         *
  	         * @param {number} n The number of bits to shift.
  	         *
  	         * @return {X64Word} A new x64-Word object after shifting.
  	         *
  	         * @example
  	         *
  	         *     var shifted = x64Word.shiftL(25);
  	         */
  	        // shiftL: function (n) {
  	            // if (n < 32) {
  	                // var high = (this.high << n) | (this.low >>> (32 - n));
  	                // var low = this.low << n;
  	            // } else {
  	                // var high = this.low << (n - 32);
  	                // var low = 0;
  	            // }

  	            // return X64Word.create(high, low);
  	        // },

  	        /**
  	         * Shifts this word n bits to the right.
  	         *
  	         * @param {number} n The number of bits to shift.
  	         *
  	         * @return {X64Word} A new x64-Word object after shifting.
  	         *
  	         * @example
  	         *
  	         *     var shifted = x64Word.shiftR(7);
  	         */
  	        // shiftR: function (n) {
  	            // if (n < 32) {
  	                // var low = (this.low >>> n) | (this.high << (32 - n));
  	                // var high = this.high >>> n;
  	            // } else {
  	                // var low = this.high >>> (n - 32);
  	                // var high = 0;
  	            // }

  	            // return X64Word.create(high, low);
  	        // },

  	        /**
  	         * Rotates this word n bits to the left.
  	         *
  	         * @param {number} n The number of bits to rotate.
  	         *
  	         * @return {X64Word} A new x64-Word object after rotating.
  	         *
  	         * @example
  	         *
  	         *     var rotated = x64Word.rotL(25);
  	         */
  	        // rotL: function (n) {
  	            // return this.shiftL(n).or(this.shiftR(64 - n));
  	        // },

  	        /**
  	         * Rotates this word n bits to the right.
  	         *
  	         * @param {number} n The number of bits to rotate.
  	         *
  	         * @return {X64Word} A new x64-Word object after rotating.
  	         *
  	         * @example
  	         *
  	         *     var rotated = x64Word.rotR(7);
  	         */
  	        // rotR: function (n) {
  	            // return this.shiftR(n).or(this.shiftL(64 - n));
  	        // },

  	        /**
  	         * Adds this word with the passed word.
  	         *
  	         * @param {X64Word} word The x64-Word to add with this word.
  	         *
  	         * @return {X64Word} A new x64-Word object after adding.
  	         *
  	         * @example
  	         *
  	         *     var added = x64Word.add(anotherX64Word);
  	         */
  	        // add: function (word) {
  	            // var low = (this.low + word.low) | 0;
  	            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
  	            // var high = (this.high + word.high + carry) | 0;

  	            // return X64Word.create(high, low);
  	        // }
  	    });

  	    /**
  	     * An array of 64-bit words.
  	     *
  	     * @property {Array} words The array of CryptoJS.x64.Word objects.
  	     * @property {number} sigBytes The number of significant bytes in this word array.
  	     */
  	    var X64WordArray = C_x64.WordArray = Base.extend({
  	        /**
  	         * Initializes a newly created word array.
  	         *
  	         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
  	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.x64.WordArray.create();
  	         *
  	         *     var wordArray = CryptoJS.x64.WordArray.create([
  	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
  	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
  	         *     ]);
  	         *
  	         *     var wordArray = CryptoJS.x64.WordArray.create([
  	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
  	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
  	         *     ], 10);
  	         */
  	        init: function (words, sigBytes) {
  	            words = this.words = words || [];

  	            if (sigBytes != undefined$1) {
  	                this.sigBytes = sigBytes;
  	            } else {
  	                this.sigBytes = words.length * 8;
  	            }
  	        },

  	        /**
  	         * Converts this 64-bit word array to a 32-bit word array.
  	         *
  	         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
  	         *
  	         * @example
  	         *
  	         *     var x32WordArray = x64WordArray.toX32();
  	         */
  	        toX32: function () {
  	            // Shortcuts
  	            var x64Words = this.words;
  	            var x64WordsLength = x64Words.length;

  	            // Convert
  	            var x32Words = [];
  	            for (var i = 0; i < x64WordsLength; i++) {
  	                var x64Word = x64Words[i];
  	                x32Words.push(x64Word.high);
  	                x32Words.push(x64Word.low);
  	            }

  	            return X32WordArray.create(x32Words, this.sigBytes);
  	        },

  	        /**
  	         * Creates a copy of this word array.
  	         *
  	         * @return {X64WordArray} The clone.
  	         *
  	         * @example
  	         *
  	         *     var clone = x64WordArray.clone();
  	         */
  	        clone: function () {
  	            var clone = Base.clone.call(this);

  	            // Clone "words" array
  	            var words = clone.words = this.words.slice(0);

  	            // Clone each X64Word object
  	            var wordsLength = words.length;
  	            for (var i = 0; i < wordsLength; i++) {
  	                words[i] = words[i].clone();
  	            }

  	            return clone;
  	        }
  	    });
  	}());


  	return CryptoJS;

  }));
  });

  var libTypedarrays = createCommonjsModule$1(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Check if typed arrays are supported
  	    if (typeof ArrayBuffer != 'function') {
  	        return;
  	    }

  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;

  	    // Reference original init
  	    var superInit = WordArray.init;

  	    // Augment WordArray.init to handle typed arrays
  	    var subInit = WordArray.init = function (typedArray) {
  	        // Convert buffers to uint8
  	        if (typedArray instanceof ArrayBuffer) {
  	            typedArray = new Uint8Array(typedArray);
  	        }

  	        // Convert other array views to uint8
  	        if (
  	            typedArray instanceof Int8Array ||
  	            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
  	            typedArray instanceof Int16Array ||
  	            typedArray instanceof Uint16Array ||
  	            typedArray instanceof Int32Array ||
  	            typedArray instanceof Uint32Array ||
  	            typedArray instanceof Float32Array ||
  	            typedArray instanceof Float64Array
  	        ) {
  	            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
  	        }

  	        // Handle Uint8Array
  	        if (typedArray instanceof Uint8Array) {
  	            // Shortcut
  	            var typedArrayByteLength = typedArray.byteLength;

  	            // Extract bytes
  	            var words = [];
  	            for (var i = 0; i < typedArrayByteLength; i++) {
  	                words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
  	            }

  	            // Initialize this word array
  	            superInit.call(this, words, typedArrayByteLength);
  	        } else {
  	            // Else call normal init
  	            superInit.apply(this, arguments);
  	        }
  	    };

  	    subInit.prototype = WordArray;
  	}());


  	return CryptoJS.lib.WordArray;

  }));
  });

  var encUtf16 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var C_enc = C.enc;

  	    /**
  	     * UTF-16 BE encoding strategy.
  	     */
  	    var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
  	        /**
  	         * Converts a word array to a UTF-16 BE string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The UTF-16 BE string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;

  	            // Convert
  	            var utf16Chars = [];
  	            for (var i = 0; i < sigBytes; i += 2) {
  	                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
  	                utf16Chars.push(String.fromCharCode(codePoint));
  	            }

  	            return utf16Chars.join('');
  	        },

  	        /**
  	         * Converts a UTF-16 BE string to a word array.
  	         *
  	         * @param {string} utf16Str The UTF-16 BE string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
  	         */
  	        parse: function (utf16Str) {
  	            // Shortcut
  	            var utf16StrLength = utf16Str.length;

  	            // Convert
  	            var words = [];
  	            for (var i = 0; i < utf16StrLength; i++) {
  	                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
  	            }

  	            return WordArray.create(words, utf16StrLength * 2);
  	        }
  	    };

  	    /**
  	     * UTF-16 LE encoding strategy.
  	     */
  	    C_enc.Utf16LE = {
  	        /**
  	         * Converts a word array to a UTF-16 LE string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The UTF-16 LE string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;

  	            // Convert
  	            var utf16Chars = [];
  	            for (var i = 0; i < sigBytes; i += 2) {
  	                var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
  	                utf16Chars.push(String.fromCharCode(codePoint));
  	            }

  	            return utf16Chars.join('');
  	        },

  	        /**
  	         * Converts a UTF-16 LE string to a word array.
  	         *
  	         * @param {string} utf16Str The UTF-16 LE string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
  	         */
  	        parse: function (utf16Str) {
  	            // Shortcut
  	            var utf16StrLength = utf16Str.length;

  	            // Convert
  	            var words = [];
  	            for (var i = 0; i < utf16StrLength; i++) {
  	                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
  	            }

  	            return WordArray.create(words, utf16StrLength * 2);
  	        }
  	    };

  	    function swapEndian(word) {
  	        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
  	    }
  	}());


  	return CryptoJS.enc.Utf16;

  }));
  });

  var encBase64 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var C_enc = C.enc;

  	    /**
  	     * Base64 encoding strategy.
  	     */
  	    var Base64 = C_enc.Base64 = {
  	        /**
  	         * Converts a word array to a Base64 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The Base64 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;
  	            var map = this._map;

  	            // Clamp excess bits
  	            wordArray.clamp();

  	            // Convert
  	            var base64Chars = [];
  	            for (var i = 0; i < sigBytes; i += 3) {
  	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
  	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
  	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

  	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

  	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
  	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
  	                }
  	            }

  	            // Add padding
  	            var paddingChar = map.charAt(64);
  	            if (paddingChar) {
  	                while (base64Chars.length % 4) {
  	                    base64Chars.push(paddingChar);
  	                }
  	            }

  	            return base64Chars.join('');
  	        },

  	        /**
  	         * Converts a Base64 string to a word array.
  	         *
  	         * @param {string} base64Str The Base64 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
  	         */
  	        parse: function (base64Str) {
  	            // Shortcuts
  	            var base64StrLength = base64Str.length;
  	            var map = this._map;
  	            var reverseMap = this._reverseMap;

  	            if (!reverseMap) {
  	                    reverseMap = this._reverseMap = [];
  	                    for (var j = 0; j < map.length; j++) {
  	                        reverseMap[map.charCodeAt(j)] = j;
  	                    }
  	            }

  	            // Ignore padding
  	            var paddingChar = map.charAt(64);
  	            if (paddingChar) {
  	                var paddingIndex = base64Str.indexOf(paddingChar);
  	                if (paddingIndex !== -1) {
  	                    base64StrLength = paddingIndex;
  	                }
  	            }

  	            // Convert
  	            return parseLoop(base64Str, base64StrLength, reverseMap);

  	        },

  	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  	    };

  	    function parseLoop(base64Str, base64StrLength, reverseMap) {
  	      var words = [];
  	      var nBytes = 0;
  	      for (var i = 0; i < base64StrLength; i++) {
  	          if (i % 4) {
  	              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
  	              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
  	              var bitsCombined = bits1 | bits2;
  	              words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
  	              nBytes++;
  	          }
  	      }
  	      return WordArray.create(words, nBytes);
  	    }
  	}());


  	return CryptoJS.enc.Base64;

  }));
  });

  var md5 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function (Math) {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var Hasher = C_lib.Hasher;
  	    var C_algo = C.algo;

  	    // Constants table
  	    var T = [];

  	    // Compute constants
  	    (function () {
  	        for (var i = 0; i < 64; i++) {
  	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
  	        }
  	    }());

  	    /**
  	     * MD5 hash algorithm.
  	     */
  	    var MD5 = C_algo.MD5 = Hasher.extend({
  	        _doReset: function () {
  	            this._hash = new WordArray.init([
  	                0x67452301, 0xefcdab89,
  	                0x98badcfe, 0x10325476
  	            ]);
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            // Swap endian
  	            for (var i = 0; i < 16; i++) {
  	                // Shortcuts
  	                var offset_i = offset + i;
  	                var M_offset_i = M[offset_i];

  	                M[offset_i] = (
  	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
  	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
  	                );
  	            }

  	            // Shortcuts
  	            var H = this._hash.words;

  	            var M_offset_0  = M[offset + 0];
  	            var M_offset_1  = M[offset + 1];
  	            var M_offset_2  = M[offset + 2];
  	            var M_offset_3  = M[offset + 3];
  	            var M_offset_4  = M[offset + 4];
  	            var M_offset_5  = M[offset + 5];
  	            var M_offset_6  = M[offset + 6];
  	            var M_offset_7  = M[offset + 7];
  	            var M_offset_8  = M[offset + 8];
  	            var M_offset_9  = M[offset + 9];
  	            var M_offset_10 = M[offset + 10];
  	            var M_offset_11 = M[offset + 11];
  	            var M_offset_12 = M[offset + 12];
  	            var M_offset_13 = M[offset + 13];
  	            var M_offset_14 = M[offset + 14];
  	            var M_offset_15 = M[offset + 15];

  	            // Working varialbes
  	            var a = H[0];
  	            var b = H[1];
  	            var c = H[2];
  	            var d = H[3];

  	            // Computation
  	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
  	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
  	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
  	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
  	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
  	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
  	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
  	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
  	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
  	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
  	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
  	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
  	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
  	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
  	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
  	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

  	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
  	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
  	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
  	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
  	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
  	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
  	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
  	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
  	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
  	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
  	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
  	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
  	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
  	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
  	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
  	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

  	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
  	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
  	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
  	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
  	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
  	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
  	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
  	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
  	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
  	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
  	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
  	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
  	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
  	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
  	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
  	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

  	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
  	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
  	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
  	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
  	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
  	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
  	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
  	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
  	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
  	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
  	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
  	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
  	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
  	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
  	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
  	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

  	            // Intermediate hash value
  	            H[0] = (H[0] + a) | 0;
  	            H[1] = (H[1] + b) | 0;
  	            H[2] = (H[2] + c) | 0;
  	            H[3] = (H[3] + d) | 0;
  	        },

  	        _doFinalize: function () {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;

  	            var nBitsTotal = this._nDataBytes * 8;
  	            var nBitsLeft = data.sigBytes * 8;

  	            // Add padding
  	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

  	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
  	            var nBitsTotalL = nBitsTotal;
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
  	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
  	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
  	            );
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
  	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
  	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
  	            );

  	            data.sigBytes = (dataWords.length + 1) * 4;

  	            // Hash final blocks
  	            this._process();

  	            // Shortcuts
  	            var hash = this._hash;
  	            var H = hash.words;

  	            // Swap endian
  	            for (var i = 0; i < 4; i++) {
  	                // Shortcut
  	                var H_i = H[i];

  	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
  	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
  	            }

  	            // Return final computed hash
  	            return hash;
  	        },

  	        clone: function () {
  	            var clone = Hasher.clone.call(this);
  	            clone._hash = this._hash.clone();

  	            return clone;
  	        }
  	    });

  	    function FF(a, b, c, d, x, s, t) {
  	        var n = a + ((b & c) | (~b & d)) + x + t;
  	        return ((n << s) | (n >>> (32 - s))) + b;
  	    }

  	    function GG(a, b, c, d, x, s, t) {
  	        var n = a + ((b & d) | (c & ~d)) + x + t;
  	        return ((n << s) | (n >>> (32 - s))) + b;
  	    }

  	    function HH(a, b, c, d, x, s, t) {
  	        var n = a + (b ^ c ^ d) + x + t;
  	        return ((n << s) | (n >>> (32 - s))) + b;
  	    }

  	    function II(a, b, c, d, x, s, t) {
  	        var n = a + (c ^ (b | ~d)) + x + t;
  	        return ((n << s) | (n >>> (32 - s))) + b;
  	    }

  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.MD5('message');
  	     *     var hash = CryptoJS.MD5(wordArray);
  	     */
  	    C.MD5 = Hasher._createHelper(MD5);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacMD5(message, key);
  	     */
  	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
  	}(Math));


  	return CryptoJS.MD5;

  }));
  });

  var sha1 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var Hasher = C_lib.Hasher;
  	    var C_algo = C.algo;

  	    // Reusable object
  	    var W = [];

  	    /**
  	     * SHA-1 hash algorithm.
  	     */
  	    var SHA1 = C_algo.SHA1 = Hasher.extend({
  	        _doReset: function () {
  	            this._hash = new WordArray.init([
  	                0x67452301, 0xefcdab89,
  	                0x98badcfe, 0x10325476,
  	                0xc3d2e1f0
  	            ]);
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            // Shortcut
  	            var H = this._hash.words;

  	            // Working variables
  	            var a = H[0];
  	            var b = H[1];
  	            var c = H[2];
  	            var d = H[3];
  	            var e = H[4];

  	            // Computation
  	            for (var i = 0; i < 80; i++) {
  	                if (i < 16) {
  	                    W[i] = M[offset + i] | 0;
  	                } else {
  	                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
  	                    W[i] = (n << 1) | (n >>> 31);
  	                }

  	                var t = ((a << 5) | (a >>> 27)) + e + W[i];
  	                if (i < 20) {
  	                    t += ((b & c) | (~b & d)) + 0x5a827999;
  	                } else if (i < 40) {
  	                    t += (b ^ c ^ d) + 0x6ed9eba1;
  	                } else if (i < 60) {
  	                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
  	                } else /* if (i < 80) */ {
  	                    t += (b ^ c ^ d) - 0x359d3e2a;
  	                }

  	                e = d;
  	                d = c;
  	                c = (b << 30) | (b >>> 2);
  	                b = a;
  	                a = t;
  	            }

  	            // Intermediate hash value
  	            H[0] = (H[0] + a) | 0;
  	            H[1] = (H[1] + b) | 0;
  	            H[2] = (H[2] + c) | 0;
  	            H[3] = (H[3] + d) | 0;
  	            H[4] = (H[4] + e) | 0;
  	        },

  	        _doFinalize: function () {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;

  	            var nBitsTotal = this._nDataBytes * 8;
  	            var nBitsLeft = data.sigBytes * 8;

  	            // Add padding
  	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
  	            data.sigBytes = dataWords.length * 4;

  	            // Hash final blocks
  	            this._process();

  	            // Return final computed hash
  	            return this._hash;
  	        },

  	        clone: function () {
  	            var clone = Hasher.clone.call(this);
  	            clone._hash = this._hash.clone();

  	            return clone;
  	        }
  	    });

  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.SHA1('message');
  	     *     var hash = CryptoJS.SHA1(wordArray);
  	     */
  	    C.SHA1 = Hasher._createHelper(SHA1);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacSHA1(message, key);
  	     */
  	    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
  	}());


  	return CryptoJS.SHA1;

  }));
  });

  var sha256 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function (Math) {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var Hasher = C_lib.Hasher;
  	    var C_algo = C.algo;

  	    // Initialization and round constants tables
  	    var H = [];
  	    var K = [];

  	    // Compute constants
  	    (function () {
  	        function isPrime(n) {
  	            var sqrtN = Math.sqrt(n);
  	            for (var factor = 2; factor <= sqrtN; factor++) {
  	                if (!(n % factor)) {
  	                    return false;
  	                }
  	            }

  	            return true;
  	        }

  	        function getFractionalBits(n) {
  	            return ((n - (n | 0)) * 0x100000000) | 0;
  	        }

  	        var n = 2;
  	        var nPrime = 0;
  	        while (nPrime < 64) {
  	            if (isPrime(n)) {
  	                if (nPrime < 8) {
  	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
  	                }
  	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

  	                nPrime++;
  	            }

  	            n++;
  	        }
  	    }());

  	    // Reusable object
  	    var W = [];

  	    /**
  	     * SHA-256 hash algorithm.
  	     */
  	    var SHA256 = C_algo.SHA256 = Hasher.extend({
  	        _doReset: function () {
  	            this._hash = new WordArray.init(H.slice(0));
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            // Shortcut
  	            var H = this._hash.words;

  	            // Working variables
  	            var a = H[0];
  	            var b = H[1];
  	            var c = H[2];
  	            var d = H[3];
  	            var e = H[4];
  	            var f = H[5];
  	            var g = H[6];
  	            var h = H[7];

  	            // Computation
  	            for (var i = 0; i < 64; i++) {
  	                if (i < 16) {
  	                    W[i] = M[offset + i] | 0;
  	                } else {
  	                    var gamma0x = W[i - 15];
  	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
  	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
  	                                   (gamma0x >>> 3);

  	                    var gamma1x = W[i - 2];
  	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
  	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
  	                                   (gamma1x >>> 10);

  	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
  	                }

  	                var ch  = (e & f) ^ (~e & g);
  	                var maj = (a & b) ^ (a & c) ^ (b & c);

  	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
  	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

  	                var t1 = h + sigma1 + ch + K[i] + W[i];
  	                var t2 = sigma0 + maj;

  	                h = g;
  	                g = f;
  	                f = e;
  	                e = (d + t1) | 0;
  	                d = c;
  	                c = b;
  	                b = a;
  	                a = (t1 + t2) | 0;
  	            }

  	            // Intermediate hash value
  	            H[0] = (H[0] + a) | 0;
  	            H[1] = (H[1] + b) | 0;
  	            H[2] = (H[2] + c) | 0;
  	            H[3] = (H[3] + d) | 0;
  	            H[4] = (H[4] + e) | 0;
  	            H[5] = (H[5] + f) | 0;
  	            H[6] = (H[6] + g) | 0;
  	            H[7] = (H[7] + h) | 0;
  	        },

  	        _doFinalize: function () {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;

  	            var nBitsTotal = this._nDataBytes * 8;
  	            var nBitsLeft = data.sigBytes * 8;

  	            // Add padding
  	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
  	            data.sigBytes = dataWords.length * 4;

  	            // Hash final blocks
  	            this._process();

  	            // Return final computed hash
  	            return this._hash;
  	        },

  	        clone: function () {
  	            var clone = Hasher.clone.call(this);
  	            clone._hash = this._hash.clone();

  	            return clone;
  	        }
  	    });

  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.SHA256('message');
  	     *     var hash = CryptoJS.SHA256(wordArray);
  	     */
  	    C.SHA256 = Hasher._createHelper(SHA256);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacSHA256(message, key);
  	     */
  	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
  	}(Math));


  	return CryptoJS.SHA256;

  }));
  });

  var sha224 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, sha256);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var C_algo = C.algo;
  	    var SHA256 = C_algo.SHA256;

  	    /**
  	     * SHA-224 hash algorithm.
  	     */
  	    var SHA224 = C_algo.SHA224 = SHA256.extend({
  	        _doReset: function () {
  	            this._hash = new WordArray.init([
  	                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
  	                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
  	            ]);
  	        },

  	        _doFinalize: function () {
  	            var hash = SHA256._doFinalize.call(this);

  	            hash.sigBytes -= 4;

  	            return hash;
  	        }
  	    });

  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.SHA224('message');
  	     *     var hash = CryptoJS.SHA224(wordArray);
  	     */
  	    C.SHA224 = SHA256._createHelper(SHA224);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacSHA224(message, key);
  	     */
  	    C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
  	}());


  	return CryptoJS.SHA224;

  }));
  });

  var sha512 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, x64Core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var Hasher = C_lib.Hasher;
  	    var C_x64 = C.x64;
  	    var X64Word = C_x64.Word;
  	    var X64WordArray = C_x64.WordArray;
  	    var C_algo = C.algo;

  	    function X64Word_create() {
  	        return X64Word.create.apply(X64Word, arguments);
  	    }

  	    // Constants
  	    var K = [
  	        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
  	        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
  	        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
  	        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
  	        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
  	        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
  	        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
  	        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
  	        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
  	        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
  	        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
  	        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
  	        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
  	        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
  	        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
  	        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
  	        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
  	        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
  	        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
  	        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
  	        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
  	        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
  	        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
  	        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
  	        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
  	        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
  	        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
  	        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
  	        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
  	        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
  	        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
  	        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
  	        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
  	        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
  	        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
  	        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
  	        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
  	        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
  	        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
  	        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
  	    ];

  	    // Reusable objects
  	    var W = [];
  	    (function () {
  	        for (var i = 0; i < 80; i++) {
  	            W[i] = X64Word_create();
  	        }
  	    }());

  	    /**
  	     * SHA-512 hash algorithm.
  	     */
  	    var SHA512 = C_algo.SHA512 = Hasher.extend({
  	        _doReset: function () {
  	            this._hash = new X64WordArray.init([
  	                new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
  	                new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
  	                new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
  	                new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
  	            ]);
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            // Shortcuts
  	            var H = this._hash.words;

  	            var H0 = H[0];
  	            var H1 = H[1];
  	            var H2 = H[2];
  	            var H3 = H[3];
  	            var H4 = H[4];
  	            var H5 = H[5];
  	            var H6 = H[6];
  	            var H7 = H[7];

  	            var H0h = H0.high;
  	            var H0l = H0.low;
  	            var H1h = H1.high;
  	            var H1l = H1.low;
  	            var H2h = H2.high;
  	            var H2l = H2.low;
  	            var H3h = H3.high;
  	            var H3l = H3.low;
  	            var H4h = H4.high;
  	            var H4l = H4.low;
  	            var H5h = H5.high;
  	            var H5l = H5.low;
  	            var H6h = H6.high;
  	            var H6l = H6.low;
  	            var H7h = H7.high;
  	            var H7l = H7.low;

  	            // Working variables
  	            var ah = H0h;
  	            var al = H0l;
  	            var bh = H1h;
  	            var bl = H1l;
  	            var ch = H2h;
  	            var cl = H2l;
  	            var dh = H3h;
  	            var dl = H3l;
  	            var eh = H4h;
  	            var el = H4l;
  	            var fh = H5h;
  	            var fl = H5l;
  	            var gh = H6h;
  	            var gl = H6l;
  	            var hh = H7h;
  	            var hl = H7l;

  	            // Rounds
  	            for (var i = 0; i < 80; i++) {
  	                var Wil;
  	                var Wih;

  	                // Shortcut
  	                var Wi = W[i];

  	                // Extend message
  	                if (i < 16) {
  	                    Wih = Wi.high = M[offset + i * 2]     | 0;
  	                    Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
  	                } else {
  	                    // Gamma0
  	                    var gamma0x  = W[i - 15];
  	                    var gamma0xh = gamma0x.high;
  	                    var gamma0xl = gamma0x.low;
  	                    var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
  	                    var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

  	                    // Gamma1
  	                    var gamma1x  = W[i - 2];
  	                    var gamma1xh = gamma1x.high;
  	                    var gamma1xl = gamma1x.low;
  	                    var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
  	                    var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

  	                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
  	                    var Wi7  = W[i - 7];
  	                    var Wi7h = Wi7.high;
  	                    var Wi7l = Wi7.low;

  	                    var Wi16  = W[i - 16];
  	                    var Wi16h = Wi16.high;
  	                    var Wi16l = Wi16.low;

  	                    Wil = gamma0l + Wi7l;
  	                    Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
  	                    Wil = Wil + gamma1l;
  	                    Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
  	                    Wil = Wil + Wi16l;
  	                    Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

  	                    Wi.high = Wih;
  	                    Wi.low  = Wil;
  	                }

  	                var chh  = (eh & fh) ^ (~eh & gh);
  	                var chl  = (el & fl) ^ (~el & gl);
  	                var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
  	                var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

  	                var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
  	                var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
  	                var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
  	                var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

  	                // t1 = h + sigma1 + ch + K[i] + W[i]
  	                var Ki  = K[i];
  	                var Kih = Ki.high;
  	                var Kil = Ki.low;

  	                var t1l = hl + sigma1l;
  	                var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
  	                var t1l = t1l + chl;
  	                var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
  	                var t1l = t1l + Kil;
  	                var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
  	                var t1l = t1l + Wil;
  	                var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

  	                // t2 = sigma0 + maj
  	                var t2l = sigma0l + majl;
  	                var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

  	                // Update working variables
  	                hh = gh;
  	                hl = gl;
  	                gh = fh;
  	                gl = fl;
  	                fh = eh;
  	                fl = el;
  	                el = (dl + t1l) | 0;
  	                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
  	                dh = ch;
  	                dl = cl;
  	                ch = bh;
  	                cl = bl;
  	                bh = ah;
  	                bl = al;
  	                al = (t1l + t2l) | 0;
  	                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
  	            }

  	            // Intermediate hash value
  	            H0l = H0.low  = (H0l + al);
  	            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
  	            H1l = H1.low  = (H1l + bl);
  	            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
  	            H2l = H2.low  = (H2l + cl);
  	            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
  	            H3l = H3.low  = (H3l + dl);
  	            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
  	            H4l = H4.low  = (H4l + el);
  	            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
  	            H5l = H5.low  = (H5l + fl);
  	            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
  	            H6l = H6.low  = (H6l + gl);
  	            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
  	            H7l = H7.low  = (H7l + hl);
  	            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
  	        },

  	        _doFinalize: function () {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;

  	            var nBitsTotal = this._nDataBytes * 8;
  	            var nBitsLeft = data.sigBytes * 8;

  	            // Add padding
  	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
  	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
  	            data.sigBytes = dataWords.length * 4;

  	            // Hash final blocks
  	            this._process();

  	            // Convert hash to 32-bit word array before returning
  	            var hash = this._hash.toX32();

  	            // Return final computed hash
  	            return hash;
  	        },

  	        clone: function () {
  	            var clone = Hasher.clone.call(this);
  	            clone._hash = this._hash.clone();

  	            return clone;
  	        },

  	        blockSize: 1024/32
  	    });

  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.SHA512('message');
  	     *     var hash = CryptoJS.SHA512(wordArray);
  	     */
  	    C.SHA512 = Hasher._createHelper(SHA512);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacSHA512(message, key);
  	     */
  	    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
  	}());


  	return CryptoJS.SHA512;

  }));
  });

  var sha384 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, x64Core, sha512);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_x64 = C.x64;
  	    var X64Word = C_x64.Word;
  	    var X64WordArray = C_x64.WordArray;
  	    var C_algo = C.algo;
  	    var SHA512 = C_algo.SHA512;

  	    /**
  	     * SHA-384 hash algorithm.
  	     */
  	    var SHA384 = C_algo.SHA384 = SHA512.extend({
  	        _doReset: function () {
  	            this._hash = new X64WordArray.init([
  	                new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
  	                new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
  	                new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
  	                new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
  	            ]);
  	        },

  	        _doFinalize: function () {
  	            var hash = SHA512._doFinalize.call(this);

  	            hash.sigBytes -= 16;

  	            return hash;
  	        }
  	    });

  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.SHA384('message');
  	     *     var hash = CryptoJS.SHA384(wordArray);
  	     */
  	    C.SHA384 = SHA512._createHelper(SHA384);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacSHA384(message, key);
  	     */
  	    C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
  	}());


  	return CryptoJS.SHA384;

  }));
  });

  var sha3 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, x64Core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function (Math) {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var Hasher = C_lib.Hasher;
  	    var C_x64 = C.x64;
  	    var X64Word = C_x64.Word;
  	    var C_algo = C.algo;

  	    // Constants tables
  	    var RHO_OFFSETS = [];
  	    var PI_INDEXES  = [];
  	    var ROUND_CONSTANTS = [];

  	    // Compute Constants
  	    (function () {
  	        // Compute rho offset constants
  	        var x = 1, y = 0;
  	        for (var t = 0; t < 24; t++) {
  	            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

  	            var newX = y % 5;
  	            var newY = (2 * x + 3 * y) % 5;
  	            x = newX;
  	            y = newY;
  	        }

  	        // Compute pi index constants
  	        for (var x = 0; x < 5; x++) {
  	            for (var y = 0; y < 5; y++) {
  	                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
  	            }
  	        }

  	        // Compute round constants
  	        var LFSR = 0x01;
  	        for (var i = 0; i < 24; i++) {
  	            var roundConstantMsw = 0;
  	            var roundConstantLsw = 0;

  	            for (var j = 0; j < 7; j++) {
  	                if (LFSR & 0x01) {
  	                    var bitPosition = (1 << j) - 1;
  	                    if (bitPosition < 32) {
  	                        roundConstantLsw ^= 1 << bitPosition;
  	                    } else /* if (bitPosition >= 32) */ {
  	                        roundConstantMsw ^= 1 << (bitPosition - 32);
  	                    }
  	                }

  	                // Compute next LFSR
  	                if (LFSR & 0x80) {
  	                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
  	                    LFSR = (LFSR << 1) ^ 0x71;
  	                } else {
  	                    LFSR <<= 1;
  	                }
  	            }

  	            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
  	        }
  	    }());

  	    // Reusable objects for temporary values
  	    var T = [];
  	    (function () {
  	        for (var i = 0; i < 25; i++) {
  	            T[i] = X64Word.create();
  	        }
  	    }());

  	    /**
  	     * SHA-3 hash algorithm.
  	     */
  	    var SHA3 = C_algo.SHA3 = Hasher.extend({
  	        /**
  	         * Configuration options.
  	         *
  	         * @property {number} outputLength
  	         *   The desired number of bits in the output hash.
  	         *   Only values permitted are: 224, 256, 384, 512.
  	         *   Default: 512
  	         */
  	        cfg: Hasher.cfg.extend({
  	            outputLength: 512
  	        }),

  	        _doReset: function () {
  	            var state = this._state = [];
  	            for (var i = 0; i < 25; i++) {
  	                state[i] = new X64Word.init();
  	            }

  	            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            // Shortcuts
  	            var state = this._state;
  	            var nBlockSizeLanes = this.blockSize / 2;

  	            // Absorb
  	            for (var i = 0; i < nBlockSizeLanes; i++) {
  	                // Shortcuts
  	                var M2i  = M[offset + 2 * i];
  	                var M2i1 = M[offset + 2 * i + 1];

  	                // Swap endian
  	                M2i = (
  	                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
  	                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
  	                );
  	                M2i1 = (
  	                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
  	                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
  	                );

  	                // Absorb message into state
  	                var lane = state[i];
  	                lane.high ^= M2i1;
  	                lane.low  ^= M2i;
  	            }

  	            // Rounds
  	            for (var round = 0; round < 24; round++) {
  	                // Theta
  	                for (var x = 0; x < 5; x++) {
  	                    // Mix column lanes
  	                    var tMsw = 0, tLsw = 0;
  	                    for (var y = 0; y < 5; y++) {
  	                        var lane = state[x + 5 * y];
  	                        tMsw ^= lane.high;
  	                        tLsw ^= lane.low;
  	                    }

  	                    // Temporary values
  	                    var Tx = T[x];
  	                    Tx.high = tMsw;
  	                    Tx.low  = tLsw;
  	                }
  	                for (var x = 0; x < 5; x++) {
  	                    // Shortcuts
  	                    var Tx4 = T[(x + 4) % 5];
  	                    var Tx1 = T[(x + 1) % 5];
  	                    var Tx1Msw = Tx1.high;
  	                    var Tx1Lsw = Tx1.low;

  	                    // Mix surrounding columns
  	                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
  	                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
  	                    for (var y = 0; y < 5; y++) {
  	                        var lane = state[x + 5 * y];
  	                        lane.high ^= tMsw;
  	                        lane.low  ^= tLsw;
  	                    }
  	                }

  	                // Rho Pi
  	                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
  	                    var tMsw;
  	                    var tLsw;

  	                    // Shortcuts
  	                    var lane = state[laneIndex];
  	                    var laneMsw = lane.high;
  	                    var laneLsw = lane.low;
  	                    var rhoOffset = RHO_OFFSETS[laneIndex];

  	                    // Rotate lanes
  	                    if (rhoOffset < 32) {
  	                        tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
  	                        tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
  	                    } else /* if (rhoOffset >= 32) */ {
  	                        tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
  	                        tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
  	                    }

  	                    // Transpose lanes
  	                    var TPiLane = T[PI_INDEXES[laneIndex]];
  	                    TPiLane.high = tMsw;
  	                    TPiLane.low  = tLsw;
  	                }

  	                // Rho pi at x = y = 0
  	                var T0 = T[0];
  	                var state0 = state[0];
  	                T0.high = state0.high;
  	                T0.low  = state0.low;

  	                // Chi
  	                for (var x = 0; x < 5; x++) {
  	                    for (var y = 0; y < 5; y++) {
  	                        // Shortcuts
  	                        var laneIndex = x + 5 * y;
  	                        var lane = state[laneIndex];
  	                        var TLane = T[laneIndex];
  	                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
  	                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];

  	                        // Mix rows
  	                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
  	                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
  	                    }
  	                }

  	                // Iota
  	                var lane = state[0];
  	                var roundConstant = ROUND_CONSTANTS[round];
  	                lane.high ^= roundConstant.high;
  	                lane.low  ^= roundConstant.low;
  	            }
  	        },

  	        _doFinalize: function () {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;
  	            var nBitsTotal = this._nDataBytes * 8;
  	            var nBitsLeft = data.sigBytes * 8;
  	            var blockSizeBits = this.blockSize * 32;

  	            // Add padding
  	            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
  	            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
  	            data.sigBytes = dataWords.length * 4;

  	            // Hash final blocks
  	            this._process();

  	            // Shortcuts
  	            var state = this._state;
  	            var outputLengthBytes = this.cfg.outputLength / 8;
  	            var outputLengthLanes = outputLengthBytes / 8;

  	            // Squeeze
  	            var hashWords = [];
  	            for (var i = 0; i < outputLengthLanes; i++) {
  	                // Shortcuts
  	                var lane = state[i];
  	                var laneMsw = lane.high;
  	                var laneLsw = lane.low;

  	                // Swap endian
  	                laneMsw = (
  	                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
  	                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
  	                );
  	                laneLsw = (
  	                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
  	                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
  	                );

  	                // Squeeze state to retrieve hash
  	                hashWords.push(laneLsw);
  	                hashWords.push(laneMsw);
  	            }

  	            // Return final computed hash
  	            return new WordArray.init(hashWords, outputLengthBytes);
  	        },

  	        clone: function () {
  	            var clone = Hasher.clone.call(this);

  	            var state = clone._state = this._state.slice(0);
  	            for (var i = 0; i < 25; i++) {
  	                state[i] = state[i].clone();
  	            }

  	            return clone;
  	        }
  	    });

  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.SHA3('message');
  	     *     var hash = CryptoJS.SHA3(wordArray);
  	     */
  	    C.SHA3 = Hasher._createHelper(SHA3);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacSHA3(message, key);
  	     */
  	    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
  	}(Math));


  	return CryptoJS.SHA3;

  }));
  });

  var ripemd160 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/** @preserve
  	(c) 2012 by Cédric Mesnil. All rights reserved.

  	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

  	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
  	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

  	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  	*/

  	(function (Math) {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var Hasher = C_lib.Hasher;
  	    var C_algo = C.algo;

  	    // Constants table
  	    var _zl = WordArray.create([
  	        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
  	        7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
  	        3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
  	        1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
  	        4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
  	    var _zr = WordArray.create([
  	        5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
  	        6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
  	        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
  	        8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
  	        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
  	    var _sl = WordArray.create([
  	         11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
  	        7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
  	        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
  	          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
  	        9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
  	    var _sr = WordArray.create([
  	        8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
  	        9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
  	        9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
  	        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
  	        8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);

  	    var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
  	    var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

  	    /**
  	     * RIPEMD160 hash algorithm.
  	     */
  	    var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
  	        _doReset: function () {
  	            this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
  	        },

  	        _doProcessBlock: function (M, offset) {

  	            // Swap endian
  	            for (var i = 0; i < 16; i++) {
  	                // Shortcuts
  	                var offset_i = offset + i;
  	                var M_offset_i = M[offset_i];

  	                // Swap
  	                M[offset_i] = (
  	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
  	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
  	                );
  	            }
  	            // Shortcut
  	            var H  = this._hash.words;
  	            var hl = _hl.words;
  	            var hr = _hr.words;
  	            var zl = _zl.words;
  	            var zr = _zr.words;
  	            var sl = _sl.words;
  	            var sr = _sr.words;

  	            // Working variables
  	            var al, bl, cl, dl, el;
  	            var ar, br, cr, dr, er;

  	            ar = al = H[0];
  	            br = bl = H[1];
  	            cr = cl = H[2];
  	            dr = dl = H[3];
  	            er = el = H[4];
  	            // Computation
  	            var t;
  	            for (var i = 0; i < 80; i += 1) {
  	                t = (al +  M[offset+zl[i]])|0;
  	                if (i<16){
  		            t +=  f1(bl,cl,dl) + hl[0];
  	                } else if (i<32) {
  		            t +=  f2(bl,cl,dl) + hl[1];
  	                } else if (i<48) {
  		            t +=  f3(bl,cl,dl) + hl[2];
  	                } else if (i<64) {
  		            t +=  f4(bl,cl,dl) + hl[3];
  	                } else {// if (i<80) {
  		            t +=  f5(bl,cl,dl) + hl[4];
  	                }
  	                t = t|0;
  	                t =  rotl(t,sl[i]);
  	                t = (t+el)|0;
  	                al = el;
  	                el = dl;
  	                dl = rotl(cl, 10);
  	                cl = bl;
  	                bl = t;

  	                t = (ar + M[offset+zr[i]])|0;
  	                if (i<16){
  		            t +=  f5(br,cr,dr) + hr[0];
  	                } else if (i<32) {
  		            t +=  f4(br,cr,dr) + hr[1];
  	                } else if (i<48) {
  		            t +=  f3(br,cr,dr) + hr[2];
  	                } else if (i<64) {
  		            t +=  f2(br,cr,dr) + hr[3];
  	                } else {// if (i<80) {
  		            t +=  f1(br,cr,dr) + hr[4];
  	                }
  	                t = t|0;
  	                t =  rotl(t,sr[i]) ;
  	                t = (t+er)|0;
  	                ar = er;
  	                er = dr;
  	                dr = rotl(cr, 10);
  	                cr = br;
  	                br = t;
  	            }
  	            // Intermediate hash value
  	            t    = (H[1] + cl + dr)|0;
  	            H[1] = (H[2] + dl + er)|0;
  	            H[2] = (H[3] + el + ar)|0;
  	            H[3] = (H[4] + al + br)|0;
  	            H[4] = (H[0] + bl + cr)|0;
  	            H[0] =  t;
  	        },

  	        _doFinalize: function () {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;

  	            var nBitsTotal = this._nDataBytes * 8;
  	            var nBitsLeft = data.sigBytes * 8;

  	            // Add padding
  	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
  	                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
  	                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
  	            );
  	            data.sigBytes = (dataWords.length + 1) * 4;

  	            // Hash final blocks
  	            this._process();

  	            // Shortcuts
  	            var hash = this._hash;
  	            var H = hash.words;

  	            // Swap endian
  	            for (var i = 0; i < 5; i++) {
  	                // Shortcut
  	                var H_i = H[i];

  	                // Swap
  	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
  	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
  	            }

  	            // Return final computed hash
  	            return hash;
  	        },

  	        clone: function () {
  	            var clone = Hasher.clone.call(this);
  	            clone._hash = this._hash.clone();

  	            return clone;
  	        }
  	    });


  	    function f1(x, y, z) {
  	        return ((x) ^ (y) ^ (z));

  	    }

  	    function f2(x, y, z) {
  	        return (((x)&(y)) | ((~x)&(z)));
  	    }

  	    function f3(x, y, z) {
  	        return (((x) | (~(y))) ^ (z));
  	    }

  	    function f4(x, y, z) {
  	        return (((x) & (z)) | ((y)&(~(z))));
  	    }

  	    function f5(x, y, z) {
  	        return ((x) ^ ((y) |(~(z))));

  	    }

  	    function rotl(x,n) {
  	        return (x<<n) | (x>>>(32-n));
  	    }


  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.RIPEMD160('message');
  	     *     var hash = CryptoJS.RIPEMD160(wordArray);
  	     */
  	    C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
  	     */
  	    C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
  	}());


  	return CryptoJS.RIPEMD160;

  }));
  });

  var hmac = createCommonjsModule$1(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var Base = C_lib.Base;
  	    var C_enc = C.enc;
  	    var Utf8 = C_enc.Utf8;
  	    var C_algo = C.algo;

  	    /**
  	     * HMAC algorithm.
  	     */
  	    var HMAC = C_algo.HMAC = Base.extend({
  	        /**
  	         * Initializes a newly created HMAC.
  	         *
  	         * @param {Hasher} hasher The hash algorithm to use.
  	         * @param {WordArray|string} key The secret key.
  	         *
  	         * @example
  	         *
  	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
  	         */
  	        init: function (hasher, key) {
  	            // Init hasher
  	            hasher = this._hasher = new hasher.init();

  	            // Convert string to WordArray, else assume WordArray already
  	            if (typeof key == 'string') {
  	                key = Utf8.parse(key);
  	            }

  	            // Shortcuts
  	            var hasherBlockSize = hasher.blockSize;
  	            var hasherBlockSizeBytes = hasherBlockSize * 4;

  	            // Allow arbitrary length keys
  	            if (key.sigBytes > hasherBlockSizeBytes) {
  	                key = hasher.finalize(key);
  	            }

  	            // Clamp excess bits
  	            key.clamp();

  	            // Clone key for inner and outer pads
  	            var oKey = this._oKey = key.clone();
  	            var iKey = this._iKey = key.clone();

  	            // Shortcuts
  	            var oKeyWords = oKey.words;
  	            var iKeyWords = iKey.words;

  	            // XOR keys with pad constants
  	            for (var i = 0; i < hasherBlockSize; i++) {
  	                oKeyWords[i] ^= 0x5c5c5c5c;
  	                iKeyWords[i] ^= 0x36363636;
  	            }
  	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

  	            // Set initial values
  	            this.reset();
  	        },

  	        /**
  	         * Resets this HMAC to its initial state.
  	         *
  	         * @example
  	         *
  	         *     hmacHasher.reset();
  	         */
  	        reset: function () {
  	            // Shortcut
  	            var hasher = this._hasher;

  	            // Reset
  	            hasher.reset();
  	            hasher.update(this._iKey);
  	        },

  	        /**
  	         * Updates this HMAC with a message.
  	         *
  	         * @param {WordArray|string} messageUpdate The message to append.
  	         *
  	         * @return {HMAC} This HMAC instance.
  	         *
  	         * @example
  	         *
  	         *     hmacHasher.update('message');
  	         *     hmacHasher.update(wordArray);
  	         */
  	        update: function (messageUpdate) {
  	            this._hasher.update(messageUpdate);

  	            // Chainable
  	            return this;
  	        },

  	        /**
  	         * Finalizes the HMAC computation.
  	         * Note that the finalize operation is effectively a destructive, read-once operation.
  	         *
  	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
  	         *
  	         * @return {WordArray} The HMAC.
  	         *
  	         * @example
  	         *
  	         *     var hmac = hmacHasher.finalize();
  	         *     var hmac = hmacHasher.finalize('message');
  	         *     var hmac = hmacHasher.finalize(wordArray);
  	         */
  	        finalize: function (messageUpdate) {
  	            // Shortcut
  	            var hasher = this._hasher;

  	            // Compute HMAC
  	            var innerHash = hasher.finalize(messageUpdate);
  	            hasher.reset();
  	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

  	            return hmac;
  	        }
  	    });
  	}());


  }));
  });

  var pbkdf2 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, sha1, hmac);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var Base = C_lib.Base;
  	    var WordArray = C_lib.WordArray;
  	    var C_algo = C.algo;
  	    var SHA1 = C_algo.SHA1;
  	    var HMAC = C_algo.HMAC;

  	    /**
  	     * Password-Based Key Derivation Function 2 algorithm.
  	     */
  	    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
  	        /**
  	         * Configuration options.
  	         *
  	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
  	         * @property {Hasher} hasher The hasher to use. Default: SHA1
  	         * @property {number} iterations The number of iterations to perform. Default: 1
  	         */
  	        cfg: Base.extend({
  	            keySize: 128/32,
  	            hasher: SHA1,
  	            iterations: 1
  	        }),

  	        /**
  	         * Initializes a newly created key derivation function.
  	         *
  	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
  	         *
  	         * @example
  	         *
  	         *     var kdf = CryptoJS.algo.PBKDF2.create();
  	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
  	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
  	         */
  	        init: function (cfg) {
  	            this.cfg = this.cfg.extend(cfg);
  	        },

  	        /**
  	         * Computes the Password-Based Key Derivation Function 2.
  	         *
  	         * @param {WordArray|string} password The password.
  	         * @param {WordArray|string} salt A salt.
  	         *
  	         * @return {WordArray} The derived key.
  	         *
  	         * @example
  	         *
  	         *     var key = kdf.compute(password, salt);
  	         */
  	        compute: function (password, salt) {
  	            // Shortcut
  	            var cfg = this.cfg;

  	            // Init HMAC
  	            var hmac = HMAC.create(cfg.hasher, password);

  	            // Initial values
  	            var derivedKey = WordArray.create();
  	            var blockIndex = WordArray.create([0x00000001]);

  	            // Shortcuts
  	            var derivedKeyWords = derivedKey.words;
  	            var blockIndexWords = blockIndex.words;
  	            var keySize = cfg.keySize;
  	            var iterations = cfg.iterations;

  	            // Generate key
  	            while (derivedKeyWords.length < keySize) {
  	                var block = hmac.update(salt).finalize(blockIndex);
  	                hmac.reset();

  	                // Shortcuts
  	                var blockWords = block.words;
  	                var blockWordsLength = blockWords.length;

  	                // Iterations
  	                var intermediate = block;
  	                for (var i = 1; i < iterations; i++) {
  	                    intermediate = hmac.finalize(intermediate);
  	                    hmac.reset();

  	                    // Shortcut
  	                    var intermediateWords = intermediate.words;

  	                    // XOR intermediate with block
  	                    for (var j = 0; j < blockWordsLength; j++) {
  	                        blockWords[j] ^= intermediateWords[j];
  	                    }
  	                }

  	                derivedKey.concat(block);
  	                blockIndexWords[0]++;
  	            }
  	            derivedKey.sigBytes = keySize * 4;

  	            return derivedKey;
  	        }
  	    });

  	    /**
  	     * Computes the Password-Based Key Derivation Function 2.
  	     *
  	     * @param {WordArray|string} password The password.
  	     * @param {WordArray|string} salt A salt.
  	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
  	     *
  	     * @return {WordArray} The derived key.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var key = CryptoJS.PBKDF2(password, salt);
  	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
  	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
  	     */
  	    C.PBKDF2 = function (password, salt, cfg) {
  	        return PBKDF2.create(cfg).compute(password, salt);
  	    };
  	}());


  	return CryptoJS.PBKDF2;

  }));
  });

  var evpkdf = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, sha1, hmac);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var Base = C_lib.Base;
  	    var WordArray = C_lib.WordArray;
  	    var C_algo = C.algo;
  	    var MD5 = C_algo.MD5;

  	    /**
  	     * This key derivation function is meant to conform with EVP_BytesToKey.
  	     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
  	     */
  	    var EvpKDF = C_algo.EvpKDF = Base.extend({
  	        /**
  	         * Configuration options.
  	         *
  	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
  	         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
  	         * @property {number} iterations The number of iterations to perform. Default: 1
  	         */
  	        cfg: Base.extend({
  	            keySize: 128/32,
  	            hasher: MD5,
  	            iterations: 1
  	        }),

  	        /**
  	         * Initializes a newly created key derivation function.
  	         *
  	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
  	         *
  	         * @example
  	         *
  	         *     var kdf = CryptoJS.algo.EvpKDF.create();
  	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
  	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
  	         */
  	        init: function (cfg) {
  	            this.cfg = this.cfg.extend(cfg);
  	        },

  	        /**
  	         * Derives a key from a password.
  	         *
  	         * @param {WordArray|string} password The password.
  	         * @param {WordArray|string} salt A salt.
  	         *
  	         * @return {WordArray} The derived key.
  	         *
  	         * @example
  	         *
  	         *     var key = kdf.compute(password, salt);
  	         */
  	        compute: function (password, salt) {
  	            var block;

  	            // Shortcut
  	            var cfg = this.cfg;

  	            // Init hasher
  	            var hasher = cfg.hasher.create();

  	            // Initial values
  	            var derivedKey = WordArray.create();

  	            // Shortcuts
  	            var derivedKeyWords = derivedKey.words;
  	            var keySize = cfg.keySize;
  	            var iterations = cfg.iterations;

  	            // Generate key
  	            while (derivedKeyWords.length < keySize) {
  	                if (block) {
  	                    hasher.update(block);
  	                }
  	                block = hasher.update(password).finalize(salt);
  	                hasher.reset();

  	                // Iterations
  	                for (var i = 1; i < iterations; i++) {
  	                    block = hasher.finalize(block);
  	                    hasher.reset();
  	                }

  	                derivedKey.concat(block);
  	            }
  	            derivedKey.sigBytes = keySize * 4;

  	            return derivedKey;
  	        }
  	    });

  	    /**
  	     * Derives a key from a password.
  	     *
  	     * @param {WordArray|string} password The password.
  	     * @param {WordArray|string} salt A salt.
  	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
  	     *
  	     * @return {WordArray} The derived key.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var key = CryptoJS.EvpKDF(password, salt);
  	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
  	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
  	     */
  	    C.EvpKDF = function (password, salt, cfg) {
  	        return EvpKDF.create(cfg).compute(password, salt);
  	    };
  	}());


  	return CryptoJS.EvpKDF;

  }));
  });

  var cipherCore = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, evpkdf);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/**
  	 * Cipher core components.
  	 */
  	CryptoJS.lib.Cipher || (function (undefined$1) {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var Base = C_lib.Base;
  	    var WordArray = C_lib.WordArray;
  	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
  	    var C_enc = C.enc;
  	    var Utf8 = C_enc.Utf8;
  	    var Base64 = C_enc.Base64;
  	    var C_algo = C.algo;
  	    var EvpKDF = C_algo.EvpKDF;

  	    /**
  	     * Abstract base cipher template.
  	     *
  	     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
  	     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
  	     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
  	     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
  	     */
  	    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
  	        /**
  	         * Configuration options.
  	         *
  	         * @property {WordArray} iv The IV to use for this operation.
  	         */
  	        cfg: Base.extend(),

  	        /**
  	         * Creates this cipher in encryption mode.
  	         *
  	         * @param {WordArray} key The key.
  	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  	         *
  	         * @return {Cipher} A cipher instance.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
  	         */
  	        createEncryptor: function (key, cfg) {
  	            return this.create(this._ENC_XFORM_MODE, key, cfg);
  	        },

  	        /**
  	         * Creates this cipher in decryption mode.
  	         *
  	         * @param {WordArray} key The key.
  	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  	         *
  	         * @return {Cipher} A cipher instance.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
  	         */
  	        createDecryptor: function (key, cfg) {
  	            return this.create(this._DEC_XFORM_MODE, key, cfg);
  	        },

  	        /**
  	         * Initializes a newly created cipher.
  	         *
  	         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
  	         * @param {WordArray} key The key.
  	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  	         *
  	         * @example
  	         *
  	         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
  	         */
  	        init: function (xformMode, key, cfg) {
  	            // Apply config defaults
  	            this.cfg = this.cfg.extend(cfg);

  	            // Store transform mode and key
  	            this._xformMode = xformMode;
  	            this._key = key;

  	            // Set initial values
  	            this.reset();
  	        },

  	        /**
  	         * Resets this cipher to its initial state.
  	         *
  	         * @example
  	         *
  	         *     cipher.reset();
  	         */
  	        reset: function () {
  	            // Reset data buffer
  	            BufferedBlockAlgorithm.reset.call(this);

  	            // Perform concrete-cipher logic
  	            this._doReset();
  	        },

  	        /**
  	         * Adds data to be encrypted or decrypted.
  	         *
  	         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
  	         *
  	         * @return {WordArray} The data after processing.
  	         *
  	         * @example
  	         *
  	         *     var encrypted = cipher.process('data');
  	         *     var encrypted = cipher.process(wordArray);
  	         */
  	        process: function (dataUpdate) {
  	            // Append
  	            this._append(dataUpdate);

  	            // Process available blocks
  	            return this._process();
  	        },

  	        /**
  	         * Finalizes the encryption or decryption process.
  	         * Note that the finalize operation is effectively a destructive, read-once operation.
  	         *
  	         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
  	         *
  	         * @return {WordArray} The data after final processing.
  	         *
  	         * @example
  	         *
  	         *     var encrypted = cipher.finalize();
  	         *     var encrypted = cipher.finalize('data');
  	         *     var encrypted = cipher.finalize(wordArray);
  	         */
  	        finalize: function (dataUpdate) {
  	            // Final data update
  	            if (dataUpdate) {
  	                this._append(dataUpdate);
  	            }

  	            // Perform concrete-cipher logic
  	            var finalProcessedData = this._doFinalize();

  	            return finalProcessedData;
  	        },

  	        keySize: 128/32,

  	        ivSize: 128/32,

  	        _ENC_XFORM_MODE: 1,

  	        _DEC_XFORM_MODE: 2,

  	        /**
  	         * Creates shortcut functions to a cipher's object interface.
  	         *
  	         * @param {Cipher} cipher The cipher to create a helper for.
  	         *
  	         * @return {Object} An object with encrypt and decrypt shortcut functions.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
  	         */
  	        _createHelper: (function () {
  	            function selectCipherStrategy(key) {
  	                if (typeof key == 'string') {
  	                    return PasswordBasedCipher;
  	                } else {
  	                    return SerializableCipher;
  	                }
  	            }

  	            return function (cipher) {
  	                return {
  	                    encrypt: function (message, key, cfg) {
  	                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
  	                    },

  	                    decrypt: function (ciphertext, key, cfg) {
  	                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
  	                    }
  	                };
  	            };
  	        }())
  	    });

  	    /**
  	     * Abstract base stream cipher template.
  	     *
  	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
  	     */
  	    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
  	        _doFinalize: function () {
  	            // Process partial blocks
  	            var finalProcessedBlocks = this._process(!!'flush');

  	            return finalProcessedBlocks;
  	        },

  	        blockSize: 1
  	    });

  	    /**
  	     * Mode namespace.
  	     */
  	    var C_mode = C.mode = {};

  	    /**
  	     * Abstract base block cipher mode template.
  	     */
  	    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
  	        /**
  	         * Creates this mode for encryption.
  	         *
  	         * @param {Cipher} cipher A block cipher instance.
  	         * @param {Array} iv The IV words.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
  	         */
  	        createEncryptor: function (cipher, iv) {
  	            return this.Encryptor.create(cipher, iv);
  	        },

  	        /**
  	         * Creates this mode for decryption.
  	         *
  	         * @param {Cipher} cipher A block cipher instance.
  	         * @param {Array} iv The IV words.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
  	         */
  	        createDecryptor: function (cipher, iv) {
  	            return this.Decryptor.create(cipher, iv);
  	        },

  	        /**
  	         * Initializes a newly created mode.
  	         *
  	         * @param {Cipher} cipher A block cipher instance.
  	         * @param {Array} iv The IV words.
  	         *
  	         * @example
  	         *
  	         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
  	         */
  	        init: function (cipher, iv) {
  	            this._cipher = cipher;
  	            this._iv = iv;
  	        }
  	    });

  	    /**
  	     * Cipher Block Chaining mode.
  	     */
  	    var CBC = C_mode.CBC = (function () {
  	        /**
  	         * Abstract base CBC mode.
  	         */
  	        var CBC = BlockCipherMode.extend();

  	        /**
  	         * CBC encryptor.
  	         */
  	        CBC.Encryptor = CBC.extend({
  	            /**
  	             * Processes the data block at offset.
  	             *
  	             * @param {Array} words The data words to operate on.
  	             * @param {number} offset The offset where the block starts.
  	             *
  	             * @example
  	             *
  	             *     mode.processBlock(data.words, offset);
  	             */
  	            processBlock: function (words, offset) {
  	                // Shortcuts
  	                var cipher = this._cipher;
  	                var blockSize = cipher.blockSize;

  	                // XOR and encrypt
  	                xorBlock.call(this, words, offset, blockSize);
  	                cipher.encryptBlock(words, offset);

  	                // Remember this block to use with next block
  	                this._prevBlock = words.slice(offset, offset + blockSize);
  	            }
  	        });

  	        /**
  	         * CBC decryptor.
  	         */
  	        CBC.Decryptor = CBC.extend({
  	            /**
  	             * Processes the data block at offset.
  	             *
  	             * @param {Array} words The data words to operate on.
  	             * @param {number} offset The offset where the block starts.
  	             *
  	             * @example
  	             *
  	             *     mode.processBlock(data.words, offset);
  	             */
  	            processBlock: function (words, offset) {
  	                // Shortcuts
  	                var cipher = this._cipher;
  	                var blockSize = cipher.blockSize;

  	                // Remember this block to use with next block
  	                var thisBlock = words.slice(offset, offset + blockSize);

  	                // Decrypt and XOR
  	                cipher.decryptBlock(words, offset);
  	                xorBlock.call(this, words, offset, blockSize);

  	                // This block becomes the previous block
  	                this._prevBlock = thisBlock;
  	            }
  	        });

  	        function xorBlock(words, offset, blockSize) {
  	            var block;

  	            // Shortcut
  	            var iv = this._iv;

  	            // Choose mixing block
  	            if (iv) {
  	                block = iv;

  	                // Remove IV for subsequent blocks
  	                this._iv = undefined$1;
  	            } else {
  	                block = this._prevBlock;
  	            }

  	            // XOR blocks
  	            for (var i = 0; i < blockSize; i++) {
  	                words[offset + i] ^= block[i];
  	            }
  	        }

  	        return CBC;
  	    }());

  	    /**
  	     * Padding namespace.
  	     */
  	    var C_pad = C.pad = {};

  	    /**
  	     * PKCS #5/7 padding strategy.
  	     */
  	    var Pkcs7 = C_pad.Pkcs7 = {
  	        /**
  	         * Pads data using the algorithm defined in PKCS #5/7.
  	         *
  	         * @param {WordArray} data The data to pad.
  	         * @param {number} blockSize The multiple that the data should be padded to.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
  	         */
  	        pad: function (data, blockSize) {
  	            // Shortcut
  	            var blockSizeBytes = blockSize * 4;

  	            // Count padding bytes
  	            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

  	            // Create padding word
  	            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

  	            // Create padding
  	            var paddingWords = [];
  	            for (var i = 0; i < nPaddingBytes; i += 4) {
  	                paddingWords.push(paddingWord);
  	            }
  	            var padding = WordArray.create(paddingWords, nPaddingBytes);

  	            // Add padding
  	            data.concat(padding);
  	        },

  	        /**
  	         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
  	         *
  	         * @param {WordArray} data The data to unpad.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
  	         */
  	        unpad: function (data) {
  	            // Get number of padding bytes from last byte
  	            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

  	            // Remove padding
  	            data.sigBytes -= nPaddingBytes;
  	        }
  	    };

  	    /**
  	     * Abstract base block cipher template.
  	     *
  	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
  	     */
  	    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
  	        /**
  	         * Configuration options.
  	         *
  	         * @property {Mode} mode The block mode to use. Default: CBC
  	         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
  	         */
  	        cfg: Cipher.cfg.extend({
  	            mode: CBC,
  	            padding: Pkcs7
  	        }),

  	        reset: function () {
  	            var modeCreator;

  	            // Reset cipher
  	            Cipher.reset.call(this);

  	            // Shortcuts
  	            var cfg = this.cfg;
  	            var iv = cfg.iv;
  	            var mode = cfg.mode;

  	            // Reset block mode
  	            if (this._xformMode == this._ENC_XFORM_MODE) {
  	                modeCreator = mode.createEncryptor;
  	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
  	                modeCreator = mode.createDecryptor;
  	                // Keep at least one block in the buffer for unpadding
  	                this._minBufferSize = 1;
  	            }

  	            if (this._mode && this._mode.__creator == modeCreator) {
  	                this._mode.init(this, iv && iv.words);
  	            } else {
  	                this._mode = modeCreator.call(mode, this, iv && iv.words);
  	                this._mode.__creator = modeCreator;
  	            }
  	        },

  	        _doProcessBlock: function (words, offset) {
  	            this._mode.processBlock(words, offset);
  	        },

  	        _doFinalize: function () {
  	            var finalProcessedBlocks;

  	            // Shortcut
  	            var padding = this.cfg.padding;

  	            // Finalize
  	            if (this._xformMode == this._ENC_XFORM_MODE) {
  	                // Pad data
  	                padding.pad(this._data, this.blockSize);

  	                // Process final blocks
  	                finalProcessedBlocks = this._process(!!'flush');
  	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
  	                // Process final blocks
  	                finalProcessedBlocks = this._process(!!'flush');

  	                // Unpad data
  	                padding.unpad(finalProcessedBlocks);
  	            }

  	            return finalProcessedBlocks;
  	        },

  	        blockSize: 128/32
  	    });

  	    /**
  	     * A collection of cipher parameters.
  	     *
  	     * @property {WordArray} ciphertext The raw ciphertext.
  	     * @property {WordArray} key The key to this ciphertext.
  	     * @property {WordArray} iv The IV used in the ciphering operation.
  	     * @property {WordArray} salt The salt used with a key derivation function.
  	     * @property {Cipher} algorithm The cipher algorithm.
  	     * @property {Mode} mode The block mode used in the ciphering operation.
  	     * @property {Padding} padding The padding scheme used in the ciphering operation.
  	     * @property {number} blockSize The block size of the cipher.
  	     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
  	     */
  	    var CipherParams = C_lib.CipherParams = Base.extend({
  	        /**
  	         * Initializes a newly created cipher params object.
  	         *
  	         * @param {Object} cipherParams An object with any of the possible cipher parameters.
  	         *
  	         * @example
  	         *
  	         *     var cipherParams = CryptoJS.lib.CipherParams.create({
  	         *         ciphertext: ciphertextWordArray,
  	         *         key: keyWordArray,
  	         *         iv: ivWordArray,
  	         *         salt: saltWordArray,
  	         *         algorithm: CryptoJS.algo.AES,
  	         *         mode: CryptoJS.mode.CBC,
  	         *         padding: CryptoJS.pad.PKCS7,
  	         *         blockSize: 4,
  	         *         formatter: CryptoJS.format.OpenSSL
  	         *     });
  	         */
  	        init: function (cipherParams) {
  	            this.mixIn(cipherParams);
  	        },

  	        /**
  	         * Converts this cipher params object to a string.
  	         *
  	         * @param {Format} formatter (Optional) The formatting strategy to use.
  	         *
  	         * @return {string} The stringified cipher params.
  	         *
  	         * @throws Error If neither the formatter nor the default formatter is set.
  	         *
  	         * @example
  	         *
  	         *     var string = cipherParams + '';
  	         *     var string = cipherParams.toString();
  	         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
  	         */
  	        toString: function (formatter) {
  	            return (formatter || this.formatter).stringify(this);
  	        }
  	    });

  	    /**
  	     * Format namespace.
  	     */
  	    var C_format = C.format = {};

  	    /**
  	     * OpenSSL formatting strategy.
  	     */
  	    var OpenSSLFormatter = C_format.OpenSSL = {
  	        /**
  	         * Converts a cipher params object to an OpenSSL-compatible string.
  	         *
  	         * @param {CipherParams} cipherParams The cipher params object.
  	         *
  	         * @return {string} The OpenSSL-compatible string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
  	         */
  	        stringify: function (cipherParams) {
  	            var wordArray;

  	            // Shortcuts
  	            var ciphertext = cipherParams.ciphertext;
  	            var salt = cipherParams.salt;

  	            // Format
  	            if (salt) {
  	                wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
  	            } else {
  	                wordArray = ciphertext;
  	            }

  	            return wordArray.toString(Base64);
  	        },

  	        /**
  	         * Converts an OpenSSL-compatible string to a cipher params object.
  	         *
  	         * @param {string} openSSLStr The OpenSSL-compatible string.
  	         *
  	         * @return {CipherParams} The cipher params object.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
  	         */
  	        parse: function (openSSLStr) {
  	            var salt;

  	            // Parse base64
  	            var ciphertext = Base64.parse(openSSLStr);

  	            // Shortcut
  	            var ciphertextWords = ciphertext.words;

  	            // Test for salt
  	            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
  	                // Extract salt
  	                salt = WordArray.create(ciphertextWords.slice(2, 4));

  	                // Remove salt from ciphertext
  	                ciphertextWords.splice(0, 4);
  	                ciphertext.sigBytes -= 16;
  	            }

  	            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
  	        }
  	    };

  	    /**
  	     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
  	     */
  	    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
  	        /**
  	         * Configuration options.
  	         *
  	         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
  	         */
  	        cfg: Base.extend({
  	            format: OpenSSLFormatter
  	        }),

  	        /**
  	         * Encrypts a message.
  	         *
  	         * @param {Cipher} cipher The cipher algorithm to use.
  	         * @param {WordArray|string} message The message to encrypt.
  	         * @param {WordArray} key The key.
  	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  	         *
  	         * @return {CipherParams} A cipher params object.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
  	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
  	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
  	         */
  	        encrypt: function (cipher, message, key, cfg) {
  	            // Apply config defaults
  	            cfg = this.cfg.extend(cfg);

  	            // Encrypt
  	            var encryptor = cipher.createEncryptor(key, cfg);
  	            var ciphertext = encryptor.finalize(message);

  	            // Shortcut
  	            var cipherCfg = encryptor.cfg;

  	            // Create and return serializable cipher params
  	            return CipherParams.create({
  	                ciphertext: ciphertext,
  	                key: key,
  	                iv: cipherCfg.iv,
  	                algorithm: cipher,
  	                mode: cipherCfg.mode,
  	                padding: cipherCfg.padding,
  	                blockSize: cipher.blockSize,
  	                formatter: cfg.format
  	            });
  	        },

  	        /**
  	         * Decrypts serialized ciphertext.
  	         *
  	         * @param {Cipher} cipher The cipher algorithm to use.
  	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
  	         * @param {WordArray} key The key.
  	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  	         *
  	         * @return {WordArray} The plaintext.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
  	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
  	         */
  	        decrypt: function (cipher, ciphertext, key, cfg) {
  	            // Apply config defaults
  	            cfg = this.cfg.extend(cfg);

  	            // Convert string to CipherParams
  	            ciphertext = this._parse(ciphertext, cfg.format);

  	            // Decrypt
  	            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

  	            return plaintext;
  	        },

  	        /**
  	         * Converts serialized ciphertext to CipherParams,
  	         * else assumed CipherParams already and returns ciphertext unchanged.
  	         *
  	         * @param {CipherParams|string} ciphertext The ciphertext.
  	         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
  	         *
  	         * @return {CipherParams} The unserialized ciphertext.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
  	         */
  	        _parse: function (ciphertext, format) {
  	            if (typeof ciphertext == 'string') {
  	                return format.parse(ciphertext, this);
  	            } else {
  	                return ciphertext;
  	            }
  	        }
  	    });

  	    /**
  	     * Key derivation function namespace.
  	     */
  	    var C_kdf = C.kdf = {};

  	    /**
  	     * OpenSSL key derivation function.
  	     */
  	    var OpenSSLKdf = C_kdf.OpenSSL = {
  	        /**
  	         * Derives a key and IV from a password.
  	         *
  	         * @param {string} password The password to derive from.
  	         * @param {number} keySize The size in words of the key to generate.
  	         * @param {number} ivSize The size in words of the IV to generate.
  	         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
  	         *
  	         * @return {CipherParams} A cipher params object with the key, IV, and salt.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
  	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
  	         */
  	        execute: function (password, keySize, ivSize, salt) {
  	            // Generate random salt
  	            if (!salt) {
  	                salt = WordArray.random(64/8);
  	            }

  	            // Derive key and IV
  	            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

  	            // Separate key and IV
  	            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
  	            key.sigBytes = keySize * 4;

  	            // Return params
  	            return CipherParams.create({ key: key, iv: iv, salt: salt });
  	        }
  	    };

  	    /**
  	     * A serializable cipher wrapper that derives the key from a password,
  	     * and returns ciphertext as a serializable cipher params object.
  	     */
  	    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
  	        /**
  	         * Configuration options.
  	         *
  	         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
  	         */
  	        cfg: SerializableCipher.cfg.extend({
  	            kdf: OpenSSLKdf
  	        }),

  	        /**
  	         * Encrypts a message using a password.
  	         *
  	         * @param {Cipher} cipher The cipher algorithm to use.
  	         * @param {WordArray|string} message The message to encrypt.
  	         * @param {string} password The password.
  	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  	         *
  	         * @return {CipherParams} A cipher params object.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
  	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
  	         */
  	        encrypt: function (cipher, message, password, cfg) {
  	            // Apply config defaults
  	            cfg = this.cfg.extend(cfg);

  	            // Derive key and other params
  	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

  	            // Add IV to config
  	            cfg.iv = derivedParams.iv;

  	            // Encrypt
  	            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

  	            // Mix in derived params
  	            ciphertext.mixIn(derivedParams);

  	            return ciphertext;
  	        },

  	        /**
  	         * Decrypts serialized ciphertext using a password.
  	         *
  	         * @param {Cipher} cipher The cipher algorithm to use.
  	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
  	         * @param {string} password The password.
  	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  	         *
  	         * @return {WordArray} The plaintext.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
  	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
  	         */
  	        decrypt: function (cipher, ciphertext, password, cfg) {
  	            // Apply config defaults
  	            cfg = this.cfg.extend(cfg);

  	            // Convert string to CipherParams
  	            ciphertext = this._parse(ciphertext, cfg.format);

  	            // Derive key and other params
  	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

  	            // Add IV to config
  	            cfg.iv = derivedParams.iv;

  	            // Decrypt
  	            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

  	            return plaintext;
  	        }
  	    });
  	}());


  }));
  });

  var modeCfb = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/**
  	 * Cipher Feedback block mode.
  	 */
  	CryptoJS.mode.CFB = (function () {
  	    var CFB = CryptoJS.lib.BlockCipherMode.extend();

  	    CFB.Encryptor = CFB.extend({
  	        processBlock: function (words, offset) {
  	            // Shortcuts
  	            var cipher = this._cipher;
  	            var blockSize = cipher.blockSize;

  	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

  	            // Remember this block to use with next block
  	            this._prevBlock = words.slice(offset, offset + blockSize);
  	        }
  	    });

  	    CFB.Decryptor = CFB.extend({
  	        processBlock: function (words, offset) {
  	            // Shortcuts
  	            var cipher = this._cipher;
  	            var blockSize = cipher.blockSize;

  	            // Remember this block to use with next block
  	            var thisBlock = words.slice(offset, offset + blockSize);

  	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

  	            // This block becomes the previous block
  	            this._prevBlock = thisBlock;
  	        }
  	    });

  	    function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
  	        var keystream;

  	        // Shortcut
  	        var iv = this._iv;

  	        // Generate keystream
  	        if (iv) {
  	            keystream = iv.slice(0);

  	            // Remove IV for subsequent blocks
  	            this._iv = undefined;
  	        } else {
  	            keystream = this._prevBlock;
  	        }
  	        cipher.encryptBlock(keystream, 0);

  	        // Encrypt
  	        for (var i = 0; i < blockSize; i++) {
  	            words[offset + i] ^= keystream[i];
  	        }
  	    }

  	    return CFB;
  	}());


  	return CryptoJS.mode.CFB;

  }));
  });

  var modeCtr = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/**
  	 * Counter block mode.
  	 */
  	CryptoJS.mode.CTR = (function () {
  	    var CTR = CryptoJS.lib.BlockCipherMode.extend();

  	    var Encryptor = CTR.Encryptor = CTR.extend({
  	        processBlock: function (words, offset) {
  	            // Shortcuts
  	            var cipher = this._cipher;
  	            var blockSize = cipher.blockSize;
  	            var iv = this._iv;
  	            var counter = this._counter;

  	            // Generate keystream
  	            if (iv) {
  	                counter = this._counter = iv.slice(0);

  	                // Remove IV for subsequent blocks
  	                this._iv = undefined;
  	            }
  	            var keystream = counter.slice(0);
  	            cipher.encryptBlock(keystream, 0);

  	            // Increment counter
  	            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0;

  	            // Encrypt
  	            for (var i = 0; i < blockSize; i++) {
  	                words[offset + i] ^= keystream[i];
  	            }
  	        }
  	    });

  	    CTR.Decryptor = Encryptor;

  	    return CTR;
  	}());


  	return CryptoJS.mode.CTR;

  }));
  });

  var modeCtrGladman = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/** @preserve
  	 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
  	 * derived from CryptoJS.mode.CTR
  	 * Jan Hruby jhruby.web@gmail.com
  	 */
  	CryptoJS.mode.CTRGladman = (function () {
  	    var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

  		function incWord(word)
  		{
  			if (((word >> 24) & 0xff) === 0xff) { //overflow
  			var b1 = (word >> 16)&0xff;
  			var b2 = (word >> 8)&0xff;
  			var b3 = word & 0xff;

  			if (b1 === 0xff) // overflow b1
  			{
  			b1 = 0;
  			if (b2 === 0xff)
  			{
  				b2 = 0;
  				if (b3 === 0xff)
  				{
  					b3 = 0;
  				}
  				else
  				{
  					++b3;
  				}
  			}
  			else
  			{
  				++b2;
  			}
  			}
  			else
  			{
  			++b1;
  			}

  			word = 0;
  			word += (b1 << 16);
  			word += (b2 << 8);
  			word += b3;
  			}
  			else
  			{
  			word += (0x01 << 24);
  			}
  			return word;
  		}

  		function incCounter(counter)
  		{
  			if ((counter[0] = incWord(counter[0])) === 0)
  			{
  				// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
  				counter[1] = incWord(counter[1]);
  			}
  			return counter;
  		}

  	    var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
  	        processBlock: function (words, offset) {
  	            // Shortcuts
  	            var cipher = this._cipher;
  	            var blockSize = cipher.blockSize;
  	            var iv = this._iv;
  	            var counter = this._counter;

  	            // Generate keystream
  	            if (iv) {
  	                counter = this._counter = iv.slice(0);

  	                // Remove IV for subsequent blocks
  	                this._iv = undefined;
  	            }

  				incCounter(counter);

  				var keystream = counter.slice(0);
  	            cipher.encryptBlock(keystream, 0);

  	            // Encrypt
  	            for (var i = 0; i < blockSize; i++) {
  	                words[offset + i] ^= keystream[i];
  	            }
  	        }
  	    });

  	    CTRGladman.Decryptor = Encryptor;

  	    return CTRGladman;
  	}());




  	return CryptoJS.mode.CTRGladman;

  }));
  });

  var modeOfb = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/**
  	 * Output Feedback block mode.
  	 */
  	CryptoJS.mode.OFB = (function () {
  	    var OFB = CryptoJS.lib.BlockCipherMode.extend();

  	    var Encryptor = OFB.Encryptor = OFB.extend({
  	        processBlock: function (words, offset) {
  	            // Shortcuts
  	            var cipher = this._cipher;
  	            var blockSize = cipher.blockSize;
  	            var iv = this._iv;
  	            var keystream = this._keystream;

  	            // Generate keystream
  	            if (iv) {
  	                keystream = this._keystream = iv.slice(0);

  	                // Remove IV for subsequent blocks
  	                this._iv = undefined;
  	            }
  	            cipher.encryptBlock(keystream, 0);

  	            // Encrypt
  	            for (var i = 0; i < blockSize; i++) {
  	                words[offset + i] ^= keystream[i];
  	            }
  	        }
  	    });

  	    OFB.Decryptor = Encryptor;

  	    return OFB;
  	}());


  	return CryptoJS.mode.OFB;

  }));
  });

  var modeEcb = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/**
  	 * Electronic Codebook block mode.
  	 */
  	CryptoJS.mode.ECB = (function () {
  	    var ECB = CryptoJS.lib.BlockCipherMode.extend();

  	    ECB.Encryptor = ECB.extend({
  	        processBlock: function (words, offset) {
  	            this._cipher.encryptBlock(words, offset);
  	        }
  	    });

  	    ECB.Decryptor = ECB.extend({
  	        processBlock: function (words, offset) {
  	            this._cipher.decryptBlock(words, offset);
  	        }
  	    });

  	    return ECB;
  	}());


  	return CryptoJS.mode.ECB;

  }));
  });

  var padAnsix923 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/**
  	 * ANSI X.923 padding strategy.
  	 */
  	CryptoJS.pad.AnsiX923 = {
  	    pad: function (data, blockSize) {
  	        // Shortcuts
  	        var dataSigBytes = data.sigBytes;
  	        var blockSizeBytes = blockSize * 4;

  	        // Count padding bytes
  	        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

  	        // Compute last byte position
  	        var lastBytePos = dataSigBytes + nPaddingBytes - 1;

  	        // Pad
  	        data.clamp();
  	        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
  	        data.sigBytes += nPaddingBytes;
  	    },

  	    unpad: function (data) {
  	        // Get number of padding bytes from last byte
  	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

  	        // Remove padding
  	        data.sigBytes -= nPaddingBytes;
  	    }
  	};


  	return CryptoJS.pad.Ansix923;

  }));
  });

  var padIso10126 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/**
  	 * ISO 10126 padding strategy.
  	 */
  	CryptoJS.pad.Iso10126 = {
  	    pad: function (data, blockSize) {
  	        // Shortcut
  	        var blockSizeBytes = blockSize * 4;

  	        // Count padding bytes
  	        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

  	        // Pad
  	        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
  	             concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
  	    },

  	    unpad: function (data) {
  	        // Get number of padding bytes from last byte
  	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

  	        // Remove padding
  	        data.sigBytes -= nPaddingBytes;
  	    }
  	};


  	return CryptoJS.pad.Iso10126;

  }));
  });

  var padIso97971 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/**
  	 * ISO/IEC 9797-1 Padding Method 2.
  	 */
  	CryptoJS.pad.Iso97971 = {
  	    pad: function (data, blockSize) {
  	        // Add 0x80 byte
  	        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

  	        // Zero pad the rest
  	        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
  	    },

  	    unpad: function (data) {
  	        // Remove zero padding
  	        CryptoJS.pad.ZeroPadding.unpad(data);

  	        // Remove one more byte -- the 0x80 byte
  	        data.sigBytes--;
  	    }
  	};


  	return CryptoJS.pad.Iso97971;

  }));
  });

  var padZeropadding = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/**
  	 * Zero padding strategy.
  	 */
  	CryptoJS.pad.ZeroPadding = {
  	    pad: function (data, blockSize) {
  	        // Shortcut
  	        var blockSizeBytes = blockSize * 4;

  	        // Pad
  	        data.clamp();
  	        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
  	    },

  	    unpad: function (data) {
  	        // Shortcut
  	        var dataWords = data.words;

  	        // Unpad
  	        var i = data.sigBytes - 1;
  	        for (var i = data.sigBytes - 1; i >= 0; i--) {
  	            if (((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
  	                data.sigBytes = i + 1;
  	                break;
  	            }
  	        }
  	    }
  	};


  	return CryptoJS.pad.ZeroPadding;

  }));
  });

  var padNopadding = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	/**
  	 * A noop padding strategy.
  	 */
  	CryptoJS.pad.NoPadding = {
  	    pad: function () {
  	    },

  	    unpad: function () {
  	    }
  	};


  	return CryptoJS.pad.NoPadding;

  }));
  });

  var formatHex = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function (undefined$1) {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var CipherParams = C_lib.CipherParams;
  	    var C_enc = C.enc;
  	    var Hex = C_enc.Hex;
  	    var C_format = C.format;

  	    var HexFormatter = C_format.Hex = {
  	        /**
  	         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
  	         *
  	         * @param {CipherParams} cipherParams The cipher params object.
  	         *
  	         * @return {string} The hexadecimally encoded string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
  	         */
  	        stringify: function (cipherParams) {
  	            return cipherParams.ciphertext.toString(Hex);
  	        },

  	        /**
  	         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
  	         *
  	         * @param {string} input The hexadecimally encoded string.
  	         *
  	         * @return {CipherParams} The cipher params object.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
  	         */
  	        parse: function (input) {
  	            var ciphertext = Hex.parse(input);
  	            return CipherParams.create({ ciphertext: ciphertext });
  	        }
  	    };
  	}());


  	return CryptoJS.format.Hex;

  }));
  });

  var aes = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, encBase64, md5, evpkdf, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var BlockCipher = C_lib.BlockCipher;
  	    var C_algo = C.algo;

  	    // Lookup tables
  	    var SBOX = [];
  	    var INV_SBOX = [];
  	    var SUB_MIX_0 = [];
  	    var SUB_MIX_1 = [];
  	    var SUB_MIX_2 = [];
  	    var SUB_MIX_3 = [];
  	    var INV_SUB_MIX_0 = [];
  	    var INV_SUB_MIX_1 = [];
  	    var INV_SUB_MIX_2 = [];
  	    var INV_SUB_MIX_3 = [];

  	    // Compute lookup tables
  	    (function () {
  	        // Compute double table
  	        var d = [];
  	        for (var i = 0; i < 256; i++) {
  	            if (i < 128) {
  	                d[i] = i << 1;
  	            } else {
  	                d[i] = (i << 1) ^ 0x11b;
  	            }
  	        }

  	        // Walk GF(2^8)
  	        var x = 0;
  	        var xi = 0;
  	        for (var i = 0; i < 256; i++) {
  	            // Compute sbox
  	            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
  	            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
  	            SBOX[x] = sx;
  	            INV_SBOX[sx] = x;

  	            // Compute multiplication
  	            var x2 = d[x];
  	            var x4 = d[x2];
  	            var x8 = d[x4];

  	            // Compute sub bytes, mix columns tables
  	            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
  	            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
  	            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
  	            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
  	            SUB_MIX_3[x] = t;

  	            // Compute inv sub bytes, inv mix columns tables
  	            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
  	            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
  	            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
  	            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
  	            INV_SUB_MIX_3[sx] = t;

  	            // Compute next counter
  	            if (!x) {
  	                x = xi = 1;
  	            } else {
  	                x = x2 ^ d[d[d[x8 ^ x2]]];
  	                xi ^= d[d[xi]];
  	            }
  	        }
  	    }());

  	    // Precomputed Rcon lookup
  	    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

  	    /**
  	     * AES block cipher algorithm.
  	     */
  	    var AES = C_algo.AES = BlockCipher.extend({
  	        _doReset: function () {
  	            var t;

  	            // Skip reset of nRounds has been set before and key did not change
  	            if (this._nRounds && this._keyPriorReset === this._key) {
  	                return;
  	            }

  	            // Shortcuts
  	            var key = this._keyPriorReset = this._key;
  	            var keyWords = key.words;
  	            var keySize = key.sigBytes / 4;

  	            // Compute number of rounds
  	            var nRounds = this._nRounds = keySize + 6;

  	            // Compute number of key schedule rows
  	            var ksRows = (nRounds + 1) * 4;

  	            // Compute key schedule
  	            var keySchedule = this._keySchedule = [];
  	            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
  	                if (ksRow < keySize) {
  	                    keySchedule[ksRow] = keyWords[ksRow];
  	                } else {
  	                    t = keySchedule[ksRow - 1];

  	                    if (!(ksRow % keySize)) {
  	                        // Rot word
  	                        t = (t << 8) | (t >>> 24);

  	                        // Sub word
  	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

  	                        // Mix Rcon
  	                        t ^= RCON[(ksRow / keySize) | 0] << 24;
  	                    } else if (keySize > 6 && ksRow % keySize == 4) {
  	                        // Sub word
  	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
  	                    }

  	                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
  	                }
  	            }

  	            // Compute inv key schedule
  	            var invKeySchedule = this._invKeySchedule = [];
  	            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
  	                var ksRow = ksRows - invKsRow;

  	                if (invKsRow % 4) {
  	                    var t = keySchedule[ksRow];
  	                } else {
  	                    var t = keySchedule[ksRow - 4];
  	                }

  	                if (invKsRow < 4 || ksRow <= 4) {
  	                    invKeySchedule[invKsRow] = t;
  	                } else {
  	                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
  	                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
  	                }
  	            }
  	        },

  	        encryptBlock: function (M, offset) {
  	            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
  	        },

  	        decryptBlock: function (M, offset) {
  	            // Swap 2nd and 4th rows
  	            var t = M[offset + 1];
  	            M[offset + 1] = M[offset + 3];
  	            M[offset + 3] = t;

  	            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

  	            // Inv swap 2nd and 4th rows
  	            var t = M[offset + 1];
  	            M[offset + 1] = M[offset + 3];
  	            M[offset + 3] = t;
  	        },

  	        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
  	            // Shortcut
  	            var nRounds = this._nRounds;

  	            // Get input, add round key
  	            var s0 = M[offset]     ^ keySchedule[0];
  	            var s1 = M[offset + 1] ^ keySchedule[1];
  	            var s2 = M[offset + 2] ^ keySchedule[2];
  	            var s3 = M[offset + 3] ^ keySchedule[3];

  	            // Key schedule row counter
  	            var ksRow = 4;

  	            // Rounds
  	            for (var round = 1; round < nRounds; round++) {
  	                // Shift rows, sub bytes, mix columns, add round key
  	                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
  	                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
  	                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
  	                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

  	                // Update state
  	                s0 = t0;
  	                s1 = t1;
  	                s2 = t2;
  	                s3 = t3;
  	            }

  	            // Shift rows, sub bytes, add round key
  	            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
  	            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
  	            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
  	            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

  	            // Set output
  	            M[offset]     = t0;
  	            M[offset + 1] = t1;
  	            M[offset + 2] = t2;
  	            M[offset + 3] = t3;
  	        },

  	        keySize: 256/32
  	    });

  	    /**
  	     * Shortcut functions to the cipher's object interface.
  	     *
  	     * @example
  	     *
  	     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
  	     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
  	     */
  	    C.AES = BlockCipher._createHelper(AES);
  	}());


  	return CryptoJS.AES;

  }));
  });

  var tripledes = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, encBase64, md5, evpkdf, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var BlockCipher = C_lib.BlockCipher;
  	    var C_algo = C.algo;

  	    // Permuted Choice 1 constants
  	    var PC1 = [
  	        57, 49, 41, 33, 25, 17, 9,  1,
  	        58, 50, 42, 34, 26, 18, 10, 2,
  	        59, 51, 43, 35, 27, 19, 11, 3,
  	        60, 52, 44, 36, 63, 55, 47, 39,
  	        31, 23, 15, 7,  62, 54, 46, 38,
  	        30, 22, 14, 6,  61, 53, 45, 37,
  	        29, 21, 13, 5,  28, 20, 12, 4
  	    ];

  	    // Permuted Choice 2 constants
  	    var PC2 = [
  	        14, 17, 11, 24, 1,  5,
  	        3,  28, 15, 6,  21, 10,
  	        23, 19, 12, 4,  26, 8,
  	        16, 7,  27, 20, 13, 2,
  	        41, 52, 31, 37, 47, 55,
  	        30, 40, 51, 45, 33, 48,
  	        44, 49, 39, 56, 34, 53,
  	        46, 42, 50, 36, 29, 32
  	    ];

  	    // Cumulative bit shift constants
  	    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

  	    // SBOXes and round permutation constants
  	    var SBOX_P = [
  	        {
  	            0x0: 0x808200,
  	            0x10000000: 0x8000,
  	            0x20000000: 0x808002,
  	            0x30000000: 0x2,
  	            0x40000000: 0x200,
  	            0x50000000: 0x808202,
  	            0x60000000: 0x800202,
  	            0x70000000: 0x800000,
  	            0x80000000: 0x202,
  	            0x90000000: 0x800200,
  	            0xa0000000: 0x8200,
  	            0xb0000000: 0x808000,
  	            0xc0000000: 0x8002,
  	            0xd0000000: 0x800002,
  	            0xe0000000: 0x0,
  	            0xf0000000: 0x8202,
  	            0x8000000: 0x0,
  	            0x18000000: 0x808202,
  	            0x28000000: 0x8202,
  	            0x38000000: 0x8000,
  	            0x48000000: 0x808200,
  	            0x58000000: 0x200,
  	            0x68000000: 0x808002,
  	            0x78000000: 0x2,
  	            0x88000000: 0x800200,
  	            0x98000000: 0x8200,
  	            0xa8000000: 0x808000,
  	            0xb8000000: 0x800202,
  	            0xc8000000: 0x800002,
  	            0xd8000000: 0x8002,
  	            0xe8000000: 0x202,
  	            0xf8000000: 0x800000,
  	            0x1: 0x8000,
  	            0x10000001: 0x2,
  	            0x20000001: 0x808200,
  	            0x30000001: 0x800000,
  	            0x40000001: 0x808002,
  	            0x50000001: 0x8200,
  	            0x60000001: 0x200,
  	            0x70000001: 0x800202,
  	            0x80000001: 0x808202,
  	            0x90000001: 0x808000,
  	            0xa0000001: 0x800002,
  	            0xb0000001: 0x8202,
  	            0xc0000001: 0x202,
  	            0xd0000001: 0x800200,
  	            0xe0000001: 0x8002,
  	            0xf0000001: 0x0,
  	            0x8000001: 0x808202,
  	            0x18000001: 0x808000,
  	            0x28000001: 0x800000,
  	            0x38000001: 0x200,
  	            0x48000001: 0x8000,
  	            0x58000001: 0x800002,
  	            0x68000001: 0x2,
  	            0x78000001: 0x8202,
  	            0x88000001: 0x8002,
  	            0x98000001: 0x800202,
  	            0xa8000001: 0x202,
  	            0xb8000001: 0x808200,
  	            0xc8000001: 0x800200,
  	            0xd8000001: 0x0,
  	            0xe8000001: 0x8200,
  	            0xf8000001: 0x808002
  	        },
  	        {
  	            0x0: 0x40084010,
  	            0x1000000: 0x4000,
  	            0x2000000: 0x80000,
  	            0x3000000: 0x40080010,
  	            0x4000000: 0x40000010,
  	            0x5000000: 0x40084000,
  	            0x6000000: 0x40004000,
  	            0x7000000: 0x10,
  	            0x8000000: 0x84000,
  	            0x9000000: 0x40004010,
  	            0xa000000: 0x40000000,
  	            0xb000000: 0x84010,
  	            0xc000000: 0x80010,
  	            0xd000000: 0x0,
  	            0xe000000: 0x4010,
  	            0xf000000: 0x40080000,
  	            0x800000: 0x40004000,
  	            0x1800000: 0x84010,
  	            0x2800000: 0x10,
  	            0x3800000: 0x40004010,
  	            0x4800000: 0x40084010,
  	            0x5800000: 0x40000000,
  	            0x6800000: 0x80000,
  	            0x7800000: 0x40080010,
  	            0x8800000: 0x80010,
  	            0x9800000: 0x0,
  	            0xa800000: 0x4000,
  	            0xb800000: 0x40080000,
  	            0xc800000: 0x40000010,
  	            0xd800000: 0x84000,
  	            0xe800000: 0x40084000,
  	            0xf800000: 0x4010,
  	            0x10000000: 0x0,
  	            0x11000000: 0x40080010,
  	            0x12000000: 0x40004010,
  	            0x13000000: 0x40084000,
  	            0x14000000: 0x40080000,
  	            0x15000000: 0x10,
  	            0x16000000: 0x84010,
  	            0x17000000: 0x4000,
  	            0x18000000: 0x4010,
  	            0x19000000: 0x80000,
  	            0x1a000000: 0x80010,
  	            0x1b000000: 0x40000010,
  	            0x1c000000: 0x84000,
  	            0x1d000000: 0x40004000,
  	            0x1e000000: 0x40000000,
  	            0x1f000000: 0x40084010,
  	            0x10800000: 0x84010,
  	            0x11800000: 0x80000,
  	            0x12800000: 0x40080000,
  	            0x13800000: 0x4000,
  	            0x14800000: 0x40004000,
  	            0x15800000: 0x40084010,
  	            0x16800000: 0x10,
  	            0x17800000: 0x40000000,
  	            0x18800000: 0x40084000,
  	            0x19800000: 0x40000010,
  	            0x1a800000: 0x40004010,
  	            0x1b800000: 0x80010,
  	            0x1c800000: 0x0,
  	            0x1d800000: 0x4010,
  	            0x1e800000: 0x40080010,
  	            0x1f800000: 0x84000
  	        },
  	        {
  	            0x0: 0x104,
  	            0x100000: 0x0,
  	            0x200000: 0x4000100,
  	            0x300000: 0x10104,
  	            0x400000: 0x10004,
  	            0x500000: 0x4000004,
  	            0x600000: 0x4010104,
  	            0x700000: 0x4010000,
  	            0x800000: 0x4000000,
  	            0x900000: 0x4010100,
  	            0xa00000: 0x10100,
  	            0xb00000: 0x4010004,
  	            0xc00000: 0x4000104,
  	            0xd00000: 0x10000,
  	            0xe00000: 0x4,
  	            0xf00000: 0x100,
  	            0x80000: 0x4010100,
  	            0x180000: 0x4010004,
  	            0x280000: 0x0,
  	            0x380000: 0x4000100,
  	            0x480000: 0x4000004,
  	            0x580000: 0x10000,
  	            0x680000: 0x10004,
  	            0x780000: 0x104,
  	            0x880000: 0x4,
  	            0x980000: 0x100,
  	            0xa80000: 0x4010000,
  	            0xb80000: 0x10104,
  	            0xc80000: 0x10100,
  	            0xd80000: 0x4000104,
  	            0xe80000: 0x4010104,
  	            0xf80000: 0x4000000,
  	            0x1000000: 0x4010100,
  	            0x1100000: 0x10004,
  	            0x1200000: 0x10000,
  	            0x1300000: 0x4000100,
  	            0x1400000: 0x100,
  	            0x1500000: 0x4010104,
  	            0x1600000: 0x4000004,
  	            0x1700000: 0x0,
  	            0x1800000: 0x4000104,
  	            0x1900000: 0x4000000,
  	            0x1a00000: 0x4,
  	            0x1b00000: 0x10100,
  	            0x1c00000: 0x4010000,
  	            0x1d00000: 0x104,
  	            0x1e00000: 0x10104,
  	            0x1f00000: 0x4010004,
  	            0x1080000: 0x4000000,
  	            0x1180000: 0x104,
  	            0x1280000: 0x4010100,
  	            0x1380000: 0x0,
  	            0x1480000: 0x10004,
  	            0x1580000: 0x4000100,
  	            0x1680000: 0x100,
  	            0x1780000: 0x4010004,
  	            0x1880000: 0x10000,
  	            0x1980000: 0x4010104,
  	            0x1a80000: 0x10104,
  	            0x1b80000: 0x4000004,
  	            0x1c80000: 0x4000104,
  	            0x1d80000: 0x4010000,
  	            0x1e80000: 0x4,
  	            0x1f80000: 0x10100
  	        },
  	        {
  	            0x0: 0x80401000,
  	            0x10000: 0x80001040,
  	            0x20000: 0x401040,
  	            0x30000: 0x80400000,
  	            0x40000: 0x0,
  	            0x50000: 0x401000,
  	            0x60000: 0x80000040,
  	            0x70000: 0x400040,
  	            0x80000: 0x80000000,
  	            0x90000: 0x400000,
  	            0xa0000: 0x40,
  	            0xb0000: 0x80001000,
  	            0xc0000: 0x80400040,
  	            0xd0000: 0x1040,
  	            0xe0000: 0x1000,
  	            0xf0000: 0x80401040,
  	            0x8000: 0x80001040,
  	            0x18000: 0x40,
  	            0x28000: 0x80400040,
  	            0x38000: 0x80001000,
  	            0x48000: 0x401000,
  	            0x58000: 0x80401040,
  	            0x68000: 0x0,
  	            0x78000: 0x80400000,
  	            0x88000: 0x1000,
  	            0x98000: 0x80401000,
  	            0xa8000: 0x400000,
  	            0xb8000: 0x1040,
  	            0xc8000: 0x80000000,
  	            0xd8000: 0x400040,
  	            0xe8000: 0x401040,
  	            0xf8000: 0x80000040,
  	            0x100000: 0x400040,
  	            0x110000: 0x401000,
  	            0x120000: 0x80000040,
  	            0x130000: 0x0,
  	            0x140000: 0x1040,
  	            0x150000: 0x80400040,
  	            0x160000: 0x80401000,
  	            0x170000: 0x80001040,
  	            0x180000: 0x80401040,
  	            0x190000: 0x80000000,
  	            0x1a0000: 0x80400000,
  	            0x1b0000: 0x401040,
  	            0x1c0000: 0x80001000,
  	            0x1d0000: 0x400000,
  	            0x1e0000: 0x40,
  	            0x1f0000: 0x1000,
  	            0x108000: 0x80400000,
  	            0x118000: 0x80401040,
  	            0x128000: 0x0,
  	            0x138000: 0x401000,
  	            0x148000: 0x400040,
  	            0x158000: 0x80000000,
  	            0x168000: 0x80001040,
  	            0x178000: 0x40,
  	            0x188000: 0x80000040,
  	            0x198000: 0x1000,
  	            0x1a8000: 0x80001000,
  	            0x1b8000: 0x80400040,
  	            0x1c8000: 0x1040,
  	            0x1d8000: 0x80401000,
  	            0x1e8000: 0x400000,
  	            0x1f8000: 0x401040
  	        },
  	        {
  	            0x0: 0x80,
  	            0x1000: 0x1040000,
  	            0x2000: 0x40000,
  	            0x3000: 0x20000000,
  	            0x4000: 0x20040080,
  	            0x5000: 0x1000080,
  	            0x6000: 0x21000080,
  	            0x7000: 0x40080,
  	            0x8000: 0x1000000,
  	            0x9000: 0x20040000,
  	            0xa000: 0x20000080,
  	            0xb000: 0x21040080,
  	            0xc000: 0x21040000,
  	            0xd000: 0x0,
  	            0xe000: 0x1040080,
  	            0xf000: 0x21000000,
  	            0x800: 0x1040080,
  	            0x1800: 0x21000080,
  	            0x2800: 0x80,
  	            0x3800: 0x1040000,
  	            0x4800: 0x40000,
  	            0x5800: 0x20040080,
  	            0x6800: 0x21040000,
  	            0x7800: 0x20000000,
  	            0x8800: 0x20040000,
  	            0x9800: 0x0,
  	            0xa800: 0x21040080,
  	            0xb800: 0x1000080,
  	            0xc800: 0x20000080,
  	            0xd800: 0x21000000,
  	            0xe800: 0x1000000,
  	            0xf800: 0x40080,
  	            0x10000: 0x40000,
  	            0x11000: 0x80,
  	            0x12000: 0x20000000,
  	            0x13000: 0x21000080,
  	            0x14000: 0x1000080,
  	            0x15000: 0x21040000,
  	            0x16000: 0x20040080,
  	            0x17000: 0x1000000,
  	            0x18000: 0x21040080,
  	            0x19000: 0x21000000,
  	            0x1a000: 0x1040000,
  	            0x1b000: 0x20040000,
  	            0x1c000: 0x40080,
  	            0x1d000: 0x20000080,
  	            0x1e000: 0x0,
  	            0x1f000: 0x1040080,
  	            0x10800: 0x21000080,
  	            0x11800: 0x1000000,
  	            0x12800: 0x1040000,
  	            0x13800: 0x20040080,
  	            0x14800: 0x20000000,
  	            0x15800: 0x1040080,
  	            0x16800: 0x80,
  	            0x17800: 0x21040000,
  	            0x18800: 0x40080,
  	            0x19800: 0x21040080,
  	            0x1a800: 0x0,
  	            0x1b800: 0x21000000,
  	            0x1c800: 0x1000080,
  	            0x1d800: 0x40000,
  	            0x1e800: 0x20040000,
  	            0x1f800: 0x20000080
  	        },
  	        {
  	            0x0: 0x10000008,
  	            0x100: 0x2000,
  	            0x200: 0x10200000,
  	            0x300: 0x10202008,
  	            0x400: 0x10002000,
  	            0x500: 0x200000,
  	            0x600: 0x200008,
  	            0x700: 0x10000000,
  	            0x800: 0x0,
  	            0x900: 0x10002008,
  	            0xa00: 0x202000,
  	            0xb00: 0x8,
  	            0xc00: 0x10200008,
  	            0xd00: 0x202008,
  	            0xe00: 0x2008,
  	            0xf00: 0x10202000,
  	            0x80: 0x10200000,
  	            0x180: 0x10202008,
  	            0x280: 0x8,
  	            0x380: 0x200000,
  	            0x480: 0x202008,
  	            0x580: 0x10000008,
  	            0x680: 0x10002000,
  	            0x780: 0x2008,
  	            0x880: 0x200008,
  	            0x980: 0x2000,
  	            0xa80: 0x10002008,
  	            0xb80: 0x10200008,
  	            0xc80: 0x0,
  	            0xd80: 0x10202000,
  	            0xe80: 0x202000,
  	            0xf80: 0x10000000,
  	            0x1000: 0x10002000,
  	            0x1100: 0x10200008,
  	            0x1200: 0x10202008,
  	            0x1300: 0x2008,
  	            0x1400: 0x200000,
  	            0x1500: 0x10000000,
  	            0x1600: 0x10000008,
  	            0x1700: 0x202000,
  	            0x1800: 0x202008,
  	            0x1900: 0x0,
  	            0x1a00: 0x8,
  	            0x1b00: 0x10200000,
  	            0x1c00: 0x2000,
  	            0x1d00: 0x10002008,
  	            0x1e00: 0x10202000,
  	            0x1f00: 0x200008,
  	            0x1080: 0x8,
  	            0x1180: 0x202000,
  	            0x1280: 0x200000,
  	            0x1380: 0x10000008,
  	            0x1480: 0x10002000,
  	            0x1580: 0x2008,
  	            0x1680: 0x10202008,
  	            0x1780: 0x10200000,
  	            0x1880: 0x10202000,
  	            0x1980: 0x10200008,
  	            0x1a80: 0x2000,
  	            0x1b80: 0x202008,
  	            0x1c80: 0x200008,
  	            0x1d80: 0x0,
  	            0x1e80: 0x10000000,
  	            0x1f80: 0x10002008
  	        },
  	        {
  	            0x0: 0x100000,
  	            0x10: 0x2000401,
  	            0x20: 0x400,
  	            0x30: 0x100401,
  	            0x40: 0x2100401,
  	            0x50: 0x0,
  	            0x60: 0x1,
  	            0x70: 0x2100001,
  	            0x80: 0x2000400,
  	            0x90: 0x100001,
  	            0xa0: 0x2000001,
  	            0xb0: 0x2100400,
  	            0xc0: 0x2100000,
  	            0xd0: 0x401,
  	            0xe0: 0x100400,
  	            0xf0: 0x2000000,
  	            0x8: 0x2100001,
  	            0x18: 0x0,
  	            0x28: 0x2000401,
  	            0x38: 0x2100400,
  	            0x48: 0x100000,
  	            0x58: 0x2000001,
  	            0x68: 0x2000000,
  	            0x78: 0x401,
  	            0x88: 0x100401,
  	            0x98: 0x2000400,
  	            0xa8: 0x2100000,
  	            0xb8: 0x100001,
  	            0xc8: 0x400,
  	            0xd8: 0x2100401,
  	            0xe8: 0x1,
  	            0xf8: 0x100400,
  	            0x100: 0x2000000,
  	            0x110: 0x100000,
  	            0x120: 0x2000401,
  	            0x130: 0x2100001,
  	            0x140: 0x100001,
  	            0x150: 0x2000400,
  	            0x160: 0x2100400,
  	            0x170: 0x100401,
  	            0x180: 0x401,
  	            0x190: 0x2100401,
  	            0x1a0: 0x100400,
  	            0x1b0: 0x1,
  	            0x1c0: 0x0,
  	            0x1d0: 0x2100000,
  	            0x1e0: 0x2000001,
  	            0x1f0: 0x400,
  	            0x108: 0x100400,
  	            0x118: 0x2000401,
  	            0x128: 0x2100001,
  	            0x138: 0x1,
  	            0x148: 0x2000000,
  	            0x158: 0x100000,
  	            0x168: 0x401,
  	            0x178: 0x2100400,
  	            0x188: 0x2000001,
  	            0x198: 0x2100000,
  	            0x1a8: 0x0,
  	            0x1b8: 0x2100401,
  	            0x1c8: 0x100401,
  	            0x1d8: 0x400,
  	            0x1e8: 0x2000400,
  	            0x1f8: 0x100001
  	        },
  	        {
  	            0x0: 0x8000820,
  	            0x1: 0x20000,
  	            0x2: 0x8000000,
  	            0x3: 0x20,
  	            0x4: 0x20020,
  	            0x5: 0x8020820,
  	            0x6: 0x8020800,
  	            0x7: 0x800,
  	            0x8: 0x8020000,
  	            0x9: 0x8000800,
  	            0xa: 0x20800,
  	            0xb: 0x8020020,
  	            0xc: 0x820,
  	            0xd: 0x0,
  	            0xe: 0x8000020,
  	            0xf: 0x20820,
  	            0x80000000: 0x800,
  	            0x80000001: 0x8020820,
  	            0x80000002: 0x8000820,
  	            0x80000003: 0x8000000,
  	            0x80000004: 0x8020000,
  	            0x80000005: 0x20800,
  	            0x80000006: 0x20820,
  	            0x80000007: 0x20,
  	            0x80000008: 0x8000020,
  	            0x80000009: 0x820,
  	            0x8000000a: 0x20020,
  	            0x8000000b: 0x8020800,
  	            0x8000000c: 0x0,
  	            0x8000000d: 0x8020020,
  	            0x8000000e: 0x8000800,
  	            0x8000000f: 0x20000,
  	            0x10: 0x20820,
  	            0x11: 0x8020800,
  	            0x12: 0x20,
  	            0x13: 0x800,
  	            0x14: 0x8000800,
  	            0x15: 0x8000020,
  	            0x16: 0x8020020,
  	            0x17: 0x20000,
  	            0x18: 0x0,
  	            0x19: 0x20020,
  	            0x1a: 0x8020000,
  	            0x1b: 0x8000820,
  	            0x1c: 0x8020820,
  	            0x1d: 0x20800,
  	            0x1e: 0x820,
  	            0x1f: 0x8000000,
  	            0x80000010: 0x20000,
  	            0x80000011: 0x800,
  	            0x80000012: 0x8020020,
  	            0x80000013: 0x20820,
  	            0x80000014: 0x20,
  	            0x80000015: 0x8020000,
  	            0x80000016: 0x8000000,
  	            0x80000017: 0x8000820,
  	            0x80000018: 0x8020820,
  	            0x80000019: 0x8000020,
  	            0x8000001a: 0x8000800,
  	            0x8000001b: 0x0,
  	            0x8000001c: 0x20800,
  	            0x8000001d: 0x820,
  	            0x8000001e: 0x20020,
  	            0x8000001f: 0x8020800
  	        }
  	    ];

  	    // Masks that select the SBOX input
  	    var SBOX_MASK = [
  	        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
  	        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
  	    ];

  	    /**
  	     * DES block cipher algorithm.
  	     */
  	    var DES = C_algo.DES = BlockCipher.extend({
  	        _doReset: function () {
  	            // Shortcuts
  	            var key = this._key;
  	            var keyWords = key.words;

  	            // Select 56 bits according to PC1
  	            var keyBits = [];
  	            for (var i = 0; i < 56; i++) {
  	                var keyBitPos = PC1[i] - 1;
  	                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
  	            }

  	            // Assemble 16 subkeys
  	            var subKeys = this._subKeys = [];
  	            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
  	                // Create subkey
  	                var subKey = subKeys[nSubKey] = [];

  	                // Shortcut
  	                var bitShift = BIT_SHIFTS[nSubKey];

  	                // Select 48 bits according to PC2
  	                for (var i = 0; i < 24; i++) {
  	                    // Select from the left 28 key bits
  	                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

  	                    // Select from the right 28 key bits
  	                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
  	                }

  	                // Since each subkey is applied to an expanded 32-bit input,
  	                // the subkey can be broken into 8 values scaled to 32-bits,
  	                // which allows the key to be used without expansion
  	                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
  	                for (var i = 1; i < 7; i++) {
  	                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
  	                }
  	                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
  	            }

  	            // Compute inverse subkeys
  	            var invSubKeys = this._invSubKeys = [];
  	            for (var i = 0; i < 16; i++) {
  	                invSubKeys[i] = subKeys[15 - i];
  	            }
  	        },

  	        encryptBlock: function (M, offset) {
  	            this._doCryptBlock(M, offset, this._subKeys);
  	        },

  	        decryptBlock: function (M, offset) {
  	            this._doCryptBlock(M, offset, this._invSubKeys);
  	        },

  	        _doCryptBlock: function (M, offset, subKeys) {
  	            // Get input
  	            this._lBlock = M[offset];
  	            this._rBlock = M[offset + 1];

  	            // Initial permutation
  	            exchangeLR.call(this, 4,  0x0f0f0f0f);
  	            exchangeLR.call(this, 16, 0x0000ffff);
  	            exchangeRL.call(this, 2,  0x33333333);
  	            exchangeRL.call(this, 8,  0x00ff00ff);
  	            exchangeLR.call(this, 1,  0x55555555);

  	            // Rounds
  	            for (var round = 0; round < 16; round++) {
  	                // Shortcuts
  	                var subKey = subKeys[round];
  	                var lBlock = this._lBlock;
  	                var rBlock = this._rBlock;

  	                // Feistel function
  	                var f = 0;
  	                for (var i = 0; i < 8; i++) {
  	                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
  	                }
  	                this._lBlock = rBlock;
  	                this._rBlock = lBlock ^ f;
  	            }

  	            // Undo swap from last round
  	            var t = this._lBlock;
  	            this._lBlock = this._rBlock;
  	            this._rBlock = t;

  	            // Final permutation
  	            exchangeLR.call(this, 1,  0x55555555);
  	            exchangeRL.call(this, 8,  0x00ff00ff);
  	            exchangeRL.call(this, 2,  0x33333333);
  	            exchangeLR.call(this, 16, 0x0000ffff);
  	            exchangeLR.call(this, 4,  0x0f0f0f0f);

  	            // Set output
  	            M[offset] = this._lBlock;
  	            M[offset + 1] = this._rBlock;
  	        },

  	        keySize: 64/32,

  	        ivSize: 64/32,

  	        blockSize: 64/32
  	    });

  	    // Swap bits across the left and right words
  	    function exchangeLR(offset, mask) {
  	        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
  	        this._rBlock ^= t;
  	        this._lBlock ^= t << offset;
  	    }

  	    function exchangeRL(offset, mask) {
  	        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
  	        this._lBlock ^= t;
  	        this._rBlock ^= t << offset;
  	    }

  	    /**
  	     * Shortcut functions to the cipher's object interface.
  	     *
  	     * @example
  	     *
  	     *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
  	     *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
  	     */
  	    C.DES = BlockCipher._createHelper(DES);

  	    /**
  	     * Triple-DES block cipher algorithm.
  	     */
  	    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
  	        _doReset: function () {
  	            // Shortcuts
  	            var key = this._key;
  	            var keyWords = key.words;
  	            // Make sure the key length is valid (64, 128 or >= 192 bit)
  	            if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
  	                throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
  	            }

  	            // Extend the key according to the keying options defined in 3DES standard
  	            var key1 = keyWords.slice(0, 2);
  	            var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
  	            var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);

  	            // Create DES instances
  	            this._des1 = DES.createEncryptor(WordArray.create(key1));
  	            this._des2 = DES.createEncryptor(WordArray.create(key2));
  	            this._des3 = DES.createEncryptor(WordArray.create(key3));
  	        },

  	        encryptBlock: function (M, offset) {
  	            this._des1.encryptBlock(M, offset);
  	            this._des2.decryptBlock(M, offset);
  	            this._des3.encryptBlock(M, offset);
  	        },

  	        decryptBlock: function (M, offset) {
  	            this._des3.decryptBlock(M, offset);
  	            this._des2.encryptBlock(M, offset);
  	            this._des1.decryptBlock(M, offset);
  	        },

  	        keySize: 192/32,

  	        ivSize: 64/32,

  	        blockSize: 64/32
  	    });

  	    /**
  	     * Shortcut functions to the cipher's object interface.
  	     *
  	     * @example
  	     *
  	     *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
  	     *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
  	     */
  	    C.TripleDES = BlockCipher._createHelper(TripleDES);
  	}());


  	return CryptoJS.TripleDES;

  }));
  });

  var rc4 = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, encBase64, md5, evpkdf, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var StreamCipher = C_lib.StreamCipher;
  	    var C_algo = C.algo;

  	    /**
  	     * RC4 stream cipher algorithm.
  	     */
  	    var RC4 = C_algo.RC4 = StreamCipher.extend({
  	        _doReset: function () {
  	            // Shortcuts
  	            var key = this._key;
  	            var keyWords = key.words;
  	            var keySigBytes = key.sigBytes;

  	            // Init sbox
  	            var S = this._S = [];
  	            for (var i = 0; i < 256; i++) {
  	                S[i] = i;
  	            }

  	            // Key setup
  	            for (var i = 0, j = 0; i < 256; i++) {
  	                var keyByteIndex = i % keySigBytes;
  	                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

  	                j = (j + S[i] + keyByte) % 256;

  	                // Swap
  	                var t = S[i];
  	                S[i] = S[j];
  	                S[j] = t;
  	            }

  	            // Counters
  	            this._i = this._j = 0;
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            M[offset] ^= generateKeystreamWord.call(this);
  	        },

  	        keySize: 256/32,

  	        ivSize: 0
  	    });

  	    function generateKeystreamWord() {
  	        // Shortcuts
  	        var S = this._S;
  	        var i = this._i;
  	        var j = this._j;

  	        // Generate keystream word
  	        var keystreamWord = 0;
  	        for (var n = 0; n < 4; n++) {
  	            i = (i + 1) % 256;
  	            j = (j + S[i]) % 256;

  	            // Swap
  	            var t = S[i];
  	            S[i] = S[j];
  	            S[j] = t;

  	            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
  	        }

  	        // Update counters
  	        this._i = i;
  	        this._j = j;

  	        return keystreamWord;
  	    }

  	    /**
  	     * Shortcut functions to the cipher's object interface.
  	     *
  	     * @example
  	     *
  	     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
  	     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
  	     */
  	    C.RC4 = StreamCipher._createHelper(RC4);

  	    /**
  	     * Modified RC4 stream cipher algorithm.
  	     */
  	    var RC4Drop = C_algo.RC4Drop = RC4.extend({
  	        /**
  	         * Configuration options.
  	         *
  	         * @property {number} drop The number of keystream words to drop. Default 192
  	         */
  	        cfg: RC4.cfg.extend({
  	            drop: 192
  	        }),

  	        _doReset: function () {
  	            RC4._doReset.call(this);

  	            // Drop
  	            for (var i = this.cfg.drop; i > 0; i--) {
  	                generateKeystreamWord.call(this);
  	            }
  	        }
  	    });

  	    /**
  	     * Shortcut functions to the cipher's object interface.
  	     *
  	     * @example
  	     *
  	     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
  	     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
  	     */
  	    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
  	}());


  	return CryptoJS.RC4;

  }));
  });

  var rabbit = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, encBase64, md5, evpkdf, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var StreamCipher = C_lib.StreamCipher;
  	    var C_algo = C.algo;

  	    // Reusable objects
  	    var S  = [];
  	    var C_ = [];
  	    var G  = [];

  	    /**
  	     * Rabbit stream cipher algorithm
  	     */
  	    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
  	        _doReset: function () {
  	            // Shortcuts
  	            var K = this._key.words;
  	            var iv = this.cfg.iv;

  	            // Swap endian
  	            for (var i = 0; i < 4; i++) {
  	                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
  	                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
  	            }

  	            // Generate initial state values
  	            var X = this._X = [
  	                K[0], (K[3] << 16) | (K[2] >>> 16),
  	                K[1], (K[0] << 16) | (K[3] >>> 16),
  	                K[2], (K[1] << 16) | (K[0] >>> 16),
  	                K[3], (K[2] << 16) | (K[1] >>> 16)
  	            ];

  	            // Generate initial counter values
  	            var C = this._C = [
  	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
  	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
  	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
  	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
  	            ];

  	            // Carry bit
  	            this._b = 0;

  	            // Iterate the system four times
  	            for (var i = 0; i < 4; i++) {
  	                nextState.call(this);
  	            }

  	            // Modify the counters
  	            for (var i = 0; i < 8; i++) {
  	                C[i] ^= X[(i + 4) & 7];
  	            }

  	            // IV setup
  	            if (iv) {
  	                // Shortcuts
  	                var IV = iv.words;
  	                var IV_0 = IV[0];
  	                var IV_1 = IV[1];

  	                // Generate four subvectors
  	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
  	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
  	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
  	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

  	                // Modify counter values
  	                C[0] ^= i0;
  	                C[1] ^= i1;
  	                C[2] ^= i2;
  	                C[3] ^= i3;
  	                C[4] ^= i0;
  	                C[5] ^= i1;
  	                C[6] ^= i2;
  	                C[7] ^= i3;

  	                // Iterate the system four times
  	                for (var i = 0; i < 4; i++) {
  	                    nextState.call(this);
  	                }
  	            }
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            // Shortcut
  	            var X = this._X;

  	            // Iterate the system
  	            nextState.call(this);

  	            // Generate four keystream words
  	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
  	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
  	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
  	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

  	            for (var i = 0; i < 4; i++) {
  	                // Swap endian
  	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
  	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

  	                // Encrypt
  	                M[offset + i] ^= S[i];
  	            }
  	        },

  	        blockSize: 128/32,

  	        ivSize: 64/32
  	    });

  	    function nextState() {
  	        // Shortcuts
  	        var X = this._X;
  	        var C = this._C;

  	        // Save old counter values
  	        for (var i = 0; i < 8; i++) {
  	            C_[i] = C[i];
  	        }

  	        // Calculate new counter values
  	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
  	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
  	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
  	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
  	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
  	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
  	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
  	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
  	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

  	        // Calculate the g-values
  	        for (var i = 0; i < 8; i++) {
  	            var gx = X[i] + C[i];

  	            // Construct high and low argument for squaring
  	            var ga = gx & 0xffff;
  	            var gb = gx >>> 16;

  	            // Calculate high and low result of squaring
  	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
  	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

  	            // High XOR low
  	            G[i] = gh ^ gl;
  	        }

  	        // Calculate new state values
  	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
  	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
  	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
  	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
  	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
  	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
  	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
  	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
  	    }

  	    /**
  	     * Shortcut functions to the cipher's object interface.
  	     *
  	     * @example
  	     *
  	     *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
  	     *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
  	     */
  	    C.Rabbit = StreamCipher._createHelper(Rabbit);
  	}());


  	return CryptoJS.Rabbit;

  }));
  });

  var rabbitLegacy = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, encBase64, md5, evpkdf, cipherCore);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var StreamCipher = C_lib.StreamCipher;
  	    var C_algo = C.algo;

  	    // Reusable objects
  	    var S  = [];
  	    var C_ = [];
  	    var G  = [];

  	    /**
  	     * Rabbit stream cipher algorithm.
  	     *
  	     * This is a legacy version that neglected to convert the key to little-endian.
  	     * This error doesn't affect the cipher's security,
  	     * but it does affect its compatibility with other implementations.
  	     */
  	    var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
  	        _doReset: function () {
  	            // Shortcuts
  	            var K = this._key.words;
  	            var iv = this.cfg.iv;

  	            // Generate initial state values
  	            var X = this._X = [
  	                K[0], (K[3] << 16) | (K[2] >>> 16),
  	                K[1], (K[0] << 16) | (K[3] >>> 16),
  	                K[2], (K[1] << 16) | (K[0] >>> 16),
  	                K[3], (K[2] << 16) | (K[1] >>> 16)
  	            ];

  	            // Generate initial counter values
  	            var C = this._C = [
  	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
  	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
  	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
  	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
  	            ];

  	            // Carry bit
  	            this._b = 0;

  	            // Iterate the system four times
  	            for (var i = 0; i < 4; i++) {
  	                nextState.call(this);
  	            }

  	            // Modify the counters
  	            for (var i = 0; i < 8; i++) {
  	                C[i] ^= X[(i + 4) & 7];
  	            }

  	            // IV setup
  	            if (iv) {
  	                // Shortcuts
  	                var IV = iv.words;
  	                var IV_0 = IV[0];
  	                var IV_1 = IV[1];

  	                // Generate four subvectors
  	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
  	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
  	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
  	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

  	                // Modify counter values
  	                C[0] ^= i0;
  	                C[1] ^= i1;
  	                C[2] ^= i2;
  	                C[3] ^= i3;
  	                C[4] ^= i0;
  	                C[5] ^= i1;
  	                C[6] ^= i2;
  	                C[7] ^= i3;

  	                // Iterate the system four times
  	                for (var i = 0; i < 4; i++) {
  	                    nextState.call(this);
  	                }
  	            }
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            // Shortcut
  	            var X = this._X;

  	            // Iterate the system
  	            nextState.call(this);

  	            // Generate four keystream words
  	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
  	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
  	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
  	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

  	            for (var i = 0; i < 4; i++) {
  	                // Swap endian
  	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
  	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

  	                // Encrypt
  	                M[offset + i] ^= S[i];
  	            }
  	        },

  	        blockSize: 128/32,

  	        ivSize: 64/32
  	    });

  	    function nextState() {
  	        // Shortcuts
  	        var X = this._X;
  	        var C = this._C;

  	        // Save old counter values
  	        for (var i = 0; i < 8; i++) {
  	            C_[i] = C[i];
  	        }

  	        // Calculate new counter values
  	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
  	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
  	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
  	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
  	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
  	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
  	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
  	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
  	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

  	        // Calculate the g-values
  	        for (var i = 0; i < 8; i++) {
  	            var gx = X[i] + C[i];

  	            // Construct high and low argument for squaring
  	            var ga = gx & 0xffff;
  	            var gb = gx >>> 16;

  	            // Calculate high and low result of squaring
  	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
  	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

  	            // High XOR low
  	            G[i] = gh ^ gl;
  	        }

  	        // Calculate new state values
  	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
  	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
  	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
  	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
  	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
  	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
  	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
  	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
  	    }

  	    /**
  	     * Shortcut functions to the cipher's object interface.
  	     *
  	     * @example
  	     *
  	     *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
  	     *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
  	     */
  	    C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
  	}());


  	return CryptoJS.RabbitLegacy;

  }));
  });

  var cryptoJs = createCommonjsModule$1(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, x64Core, libTypedarrays, encUtf16, encBase64, md5, sha1, sha256, sha224, sha512, sha384, sha3, ripemd160, hmac, pbkdf2, evpkdf, cipherCore, modeCfb, modeCtr, modeCtrGladman, modeOfb, modeEcb, padAnsix923, padIso10126, padIso97971, padZeropadding, padNopadding, formatHex, aes, tripledes, rc4, rabbit, rabbitLegacy);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	return CryptoJS;

  }));
  });

  var HttpRequest$1 = /*#__PURE__*/function () {
    function HttpRequest() {
      classCallCheck(this, HttpRequest);

      this.options = {
        timeout: 20000,
        charset: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      this.requestInstance = extend(this.options);
    }

    createClass(HttpRequest, [{
      key: "post",
      value: function post() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _Array$prototype$slic = Array.prototype.slice.call(args),
            _Array$prototype$slic2 = slicedToArray(_Array$prototype$slic, 3),
            url = _Array$prototype$slic2[0],
            data = _Array$prototype$slic2[1],
            contentType = _Array$prototype$slic2[2];

        return this.requestInstance.post(url, contentType ? {
          headers: {
            'Content-Type': contentType
          },
          data: data
        } : {
          data: data
        });
      }
    }, {
      key: "get",
      value: function get() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var _Array$prototype$slic3 = Array.prototype.slice.call(args),
            _Array$prototype$slic4 = slicedToArray(_Array$prototype$slic3, 2),
            url = _Array$prototype$slic4[0],
            params = _Array$prototype$slic4[1];

        return this.requestInstance.get(url, {
          params: params
        });
      }
    }, {
      key: "install",
      value: function install(Vue) {
        Vue.prototype.$http = this;
      }
    }], [{
      key: "paramIsEmpty",
      value: function paramIsEmpty() {
        var args = Array.prototype.slice.call(arguments);
        var invalidArgs = args.filter(function (arg) {
          return arg === null || arg === '';
        });
        if (!args.length || invalidArgs.length > 0) throw new Error('参数错误，请检查是否有空参！');
      }
    }]);

    return HttpRequest;
  }();

  var Http$1 = new HttpRequest$1();

  var RequestCenter = /*#__PURE__*/function () {
    function RequestCenter() {
      classCallCheck(this, RequestCenter);

      this.requestMap = new Map();
    }

    createClass(RequestCenter, [{
      key: "addRequest",
      value: function addRequest(action) {
        var url = action.url,
            method = action.method,
            params = action.params,
            callback = action.callback;
        var key = this.genHash(url, method, params);

        if (this.requestMap.has(key)) {
          var _this$requestMap$get = this.requestMap.get(key),
              status = _this$requestMap$get.status,
              callbacks = _this$requestMap$get.callbacks,
              cacheData = _this$requestMap$get.cacheData;

          switch (status) {
            case 0:
              // 等待中 
              callbacks.push(callback);
              break;

            case 1:
              // 已完成 
              callback.bind(null, cacheData)();
              break;

            case 2:
              // 响应异常
              break;

            default:
              return;
          }
        } else {
          this.requestMap.set(key, {
            status: 0,
            callbacks: [callback],
            cacheData: null
          });
          this.sendRequest(url, method, params, key);
        }
      }
    }, {
      key: "genHash",
      value: function genHash(url, method, params) {
        var source = "".concat(url, "_").concat(method, "_").concat(JSON.stringify(this.formatParams(params)));
        return cryptoJs.MD5(source).toString();
      }
    }, {
      key: "formatParams",
      value: function formatParams(params) {
        var _this = this;

        if (Object.prototype.toString.call(params) === '[object Object]') {
          var keys = Object.keys(params).sort();
          var res = Object.create(null);
          keys.forEach(function (key) {
            res[key] = _this.formatParams(params[key]);
          });
          return res;
        }

        return params;
      }
    }, {
      key: "sendRequest",
      value: function sendRequest(url, method) {
        var _this2 = this;

        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var key = arguments.length > 3 ? arguments[3] : undefined;
        Http$1[method](url, params).then(function (res) {
          if (res.code === 0) {
            var _this2$requestMap$get = _this2.requestMap.get(key),
                callbacks = _this2$requestMap$get.callbacks;

            if (callbacks && !!callbacks.length) {
              callbacks.forEach(function (cb) {
                cb.bind(null, res)();
              });
            }

            _this2.requestMap.set(key, {
              status: 1,
              callbacks: [],
              cacheData: res
            });
          }
        })["catch"](function (err) {});
      }
    }]);

    return RequestCenter;
  }();

  var requestCenter = new RequestCenter();

  var EventCenter = /*#__PURE__*/function () {
    function EventCenter() {
      classCallCheck(this, EventCenter);

      this.eventsMap = new Map();
    }

    createClass(EventCenter, [{
      key: "$on",
      value: function $on(eventType, callback) {
        var listeners = this.eventsMap.get(eventType);

        if (listeners && !!listeners.length) {
          this.eventsMap.set(eventType, [].concat(toConsumableArray$1(listeners), [callback]));
        } else {
          this.eventsMap.set(eventType, [callback]);
        }
      }
    }, {
      key: "$once",
      value: function $once(eventType, callback) {
        var _this = this;

        var fn = function fn() {
          var listeners = _this.eventsMap.get(eventType);

          if (listeners && !!listeners.length) {
            var index = listeners.findIndex(function (cb) {
              return cb === callback;
            });

            if (index > -1) {
              listeners.splice(index, 1);
              return callback();
            }
          }
        };

        this.$on(eventType, fn);
      }
    }, {
      key: "$emit",
      value: function $emit(eventType, callback, res) {
        var listeners = this.eventsMap.get(eventType);

        if (listeners && !!listeners.length) {
          var index = listeners.findIndex(function (fn) {
            return fn === callback;
          });

          if (index > -1) {
            var cb = callback.bind(null, res);
            cb();
          }
        }
      }
    }, {
      key: "$off",
      value: function $off(eventType, callback) {
        var listeners = this.eventsMap.get(eventType);

        if (listeners && !!listeners.length) {
          var index = listeners.findIndex(function (fn) {
            return fn === callback;
          });

          if (index > -1) {
            listeners.splice(index, 1);
          }
        }
      }
    }]);

    return EventCenter;
  }();

  var DataCenter = /*#__PURE__*/function () {
    function DataCenter() {
      classCallCheck(this, DataCenter);

      this.dataSourceMap = new Map();
      this.flushMap = new Map();
      this.tick = null;
      this.eventCenter = new EventCenter();
    }

    createClass(DataCenter, [{
      key: "fetch",
      value: function fetch(_ref) {
        var _this = this;

        var source = _ref.source,
            params = _ref.params;
        var currentSource = DataSources[source].call(null, params);
        var batch = currentSource.batch;
        var action = currentSource.generateAction();
        if (!source || !currentSource) return Promise.resolve();

        if (batch.limit > 1 && this.hasExits(source)) {
          var oldActions = this.dataSourceMap.get(source);
          var newActions = [].concat(toConsumableArray$1(oldActions), [action]);
          console.log('newActions: ', newActions);

          if (newActions.length === batch.limit) {
            console.log('fetch full');
            return new Promise(function (resolve, reject) {
              var cb = action.callback.bind(null, resolve);
              action.callback = cb;

              _this.eventCenter.$once('finish', cb);

              _this.dataSourceMap.set(source, newActions);

              _this.flushDataSourceQueue(source);
            });
          } else {
            console.log('fetch notfull', newActions.length, batch.limit);
            return new Promise(function (resolve, reject) {
              var cb = action.callback.bind(null, resolve);
              action.callback = cb;

              _this.eventCenter.$once('finish', cb);

              _this.dataSourceMap.set(source, newActions);

              _this.flushDataSourceQueue(source);
            });
          }
        } else {
          this.flushMap.set(source, {
            isFlushPending: false,
            isFlushing: false
          });
          this.dataSourceMap.set(source, [action]);
        }

        return new Promise(function (resolve, reject) {
          var cb = action.callback.bind(null, resolve);
          action.callback = cb;

          _this.eventCenter.$once('finish', cb);

          _this.flushDataSourceQueue(source);
        });
      }
    }, {
      key: "hasExits",
      value: function hasExits(hash) {
        return this.dataSourceMap.has(hash) ? true : false;
      }
    }, {
      key: "flushDataSourceQueue",
      value: function flushDataSourceQueue(source) {
        var _this2 = this;

        var _this$flushMap$get = this.flushMap.get(source),
            isFlushing = _this$flushMap$get.isFlushing,
            isFlushPending = _this$flushMap$get.isFlushPending;

        if (!isFlushing && !isFlushPending) {
          this.flushMap.set(source, {
            isFlushPending: true,
            isFlushing: false
          });
          this.nextTick(function () {
            var actions = _this2.dataSourceMap.get(source);

            if (actions && !!actions.length) {
              _this2.flushMap.set(source, {
                isFlushPending: false,
                isFlushing: true
              });

              {
                actions.forEach(function (action) {
                  console.log('add');
                  requestCenter.addRequest(action);
                });
              }

              _this2.flushMap.set(source, {
                isFlushPending: false,
                isFlushing: false
              });

              _this2.dataSourceMap.set(source, []);
            }
          });
        }
      }
    }, {
      key: "nextTick",
      value: function nextTick(fn) {
        if (fn && typeof fn === 'function') {
          this.tick = setTimeout(fn, 0);
        }
      }
    }]);

    return DataCenter;
  }();

  var DataService = {
    install: function install(Vue) {
      Vue.prototype.$dataService = new DataCenter();
    }
  };

  Vue.use(Http);
  Vue.use(DataService);
  initPage();

}(Vue, crypto));
