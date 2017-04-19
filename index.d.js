/**!
 * koa-body-parser - index.js
 * Copyright(c) 2014
 * MIT Licensed
 *
 * Authors:
 *   dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var parse = require('co-body');
var copy = require('copy-to');

/**
 * @param [Object] opts
 *   - {String} jsonLimit default '1mb'
 *   - {String} formLimit default '56kb'
 *   - {string} encoding default 'utf-8'
 *   - {Object} extendTypes
 */

module.exports = function (opts) {
  var parseBody = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(enableJson && (detectJSON && detectJSON(ctx) || ctx.request.is(jsonTypes)))) {
                _context2.next = 4;
                break;
              }

              _context2.next = 3;
              return parse.json(ctx, jsonOpts);

            case 3:
              return _context2.abrupt('return', _context2.sent);

            case 4:
              if (!(enableForm && ctx.request.is(formTypes))) {
                _context2.next = 8;
                break;
              }

              _context2.next = 7;
              return parse.form(ctx, formOpts);

            case 7:
              return _context2.abrupt('return', _context2.sent);

            case 8:
              if (!(enableText && ctx.request.is(textTypes))) {
                _context2.next = 15;
                break;
              }

              _context2.next = 11;
              return parse.text(ctx, textOpts);

            case 11:
              _context2.t0 = _context2.sent;

              if (_context2.t0) {
                _context2.next = 14;
                break;
              }

              _context2.t0 = '';

            case 14:
              return _context2.abrupt('return', _context2.t0);

            case 15:
              return _context2.abrupt('return', {});

            case 16:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function parseBody(_x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  opts = opts || {};
  var detectJSON = opts.detectJSON;
  var onerror = opts.onerror;

  var enableTypes = opts.enableTypes || ['json', 'form'];
  var enableForm = checkEnable(enableTypes, 'form');
  var enableJson = checkEnable(enableTypes, 'json');
  var enableText = checkEnable(enableTypes, 'text');

  opts.detectJSON = undefined;
  opts.onerror = undefined;

  // force co-body return raw body
  opts.returnRawBody = true;

  // default json types
  var jsonTypes = ['application/json', 'application/json-patch+json', 'application/vnd.api+json', 'application/csp-report'];

  // default form types
  var formTypes = ['application/x-www-form-urlencoded'];

  // default text types
  var textTypes = ['text/plain'];

  var jsonOpts = formatOptions(opts, 'json');
  var formOpts = formatOptions(opts, 'form');
  var textOpts = formatOptions(opts, 'text');

  var extendTypes = opts.extendTypes || {};

  extendType(jsonTypes, extendTypes.json);
  extendType(formTypes, extendTypes.form);
  extendType(textTypes, extendTypes.text);

  return function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
      var res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(ctx.request.body !== undefined)) {
                _context.next = 4;
                break;
              }

              _context.next = 3;
              return next();

            case 3:
              return _context.abrupt('return', _context.sent);

            case 4:
              if (!ctx.disableBodyParser) {
                _context.next = 8;
                break;
              }

              _context.next = 7;
              return next();

            case 7:
              return _context.abrupt('return', _context.sent);

            case 8:
              _context.prev = 8;
              _context.next = 11;
              return parseBody(ctx);

            case 11:
              res = _context.sent;

              ctx.request.body = 'parsed' in res ? res.parsed : {};
              if (ctx.request.rawBody === undefined) ctx.request.rawBody = res.raw;
              _context.next = 23;
              break;

            case 16:
              _context.prev = 16;
              _context.t0 = _context['catch'](8);

              if (!onerror) {
                _context.next = 22;
                break;
              }

              onerror(_context.t0, ctx);
              _context.next = 23;
              break;

            case 22:
              throw _context.t0;

            case 23:
              _context.next = 25;
              return next();

            case 25:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[8, 16]]);
    }));

    function bodyParser(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return bodyParser;
  }();
};

function formatOptions(opts, type) {
  var res = {};
  copy(opts).to(res);
  res.limit = opts[type + 'Limit'];
  return res;
}

function extendType(original, extend) {
  if (extend) {
    if (!Array.isArray(extend)) {
      extend = [extend];
    }
    extend.forEach(function (extend) {
      original.push(extend);
    });
  }
}

function checkEnable(types, type) {
  return types.indexOf(type) >= 0;
}
