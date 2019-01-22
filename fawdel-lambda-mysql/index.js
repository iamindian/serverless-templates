'use strict';
debugger;
var _googlePlaces = _interopRequireDefault(require("./googlePlaces"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');

var bodyParser = require('body-parser');

var cors = require('cors');

var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

var app = express();
var router = express.Router();
var googlePlaces = new _googlePlaces.default();
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(awsServerlessExpressMiddleware.eventContext());
router.get("/", function (req, res) {
  res.json(req.query);
});
router.get("/place", function (req, res) {
  var placeid = req.query.placeid;
  googlePlaces.place(placeid).then(function (response) {
    res.json(response.json.result.geometry.location);
  });
});
router.get("/nearSearch", function (req, res) {
  var q = req.query;
  var lat = q.lat,
      lng = q.lng,
      address = q.address,
      radius = q.radius;
  googlePlaces.nearSearch(lat, lng, address, radius).then(function (response) {
    var results = response.json.results;
    var rows = results.reduce(function (a, b) {
      a.push({
        name: b.name,
        lat: b.geometry.location.lat,
        lng: b.geometry.location.lng
      });
      return a;
    }, []);
    res.json(rows);
  });
});
router.get("/placesAutoComplete", function (req, res) {
  googlePlaces.placesAutoComplete(req.query.address).then(function (response) {
    res.json(response.json.predictions);
  });
});
app.use("/", router);
module.exports = app;
"use strict";

var app = require('./app');

var port = 3000;
app.listen(port);
console.log("listening on http://localhost:".concat(port));
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _maps = _interopRequireDefault(require("@google/maps"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GooglePlaces =
/*#__PURE__*/
function () {
  function GooglePlaces() {
    _classCallCheck(this, GooglePlaces);

    this.client = _maps.default.createClient({
      key: 'AIzaSyA9kRAVHm_6vUbDjq4Sf7HgIxoC5Rqyx6M',
      Promise: Promise
    });
  }

  _createClass(GooglePlaces, [{
    key: "place",
    value: function () {
      var _place = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(placeid) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", this.client.place({
                  placeid: placeid
                }).asPromise());

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function place(_x) {
        return _place.apply(this, arguments);
      };
    }()
  }, {
    key: "nearSearch",
    value: function () {
      var _nearSearch = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(lat, lng, address, radius) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.client.placesNearby(_defineProperty({
                  keyword: address,
                  location: {
                    lat: lat,
                    lng: lng
                  },
                  radius: radius
                }, "radius", 1000)).asPromise());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function nearSearch(_x2, _x3, _x4, _x5) {
        return _nearSearch.apply(this, arguments);
      };
    }()
  }, {
    key: "placesAutoComplete",
    value: function () {
      var _placesAutoComplete = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(address) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.client.placesAutoComplete({
                  input: address,
                  sessiontoken: 'fawdel'
                }).asPromise());

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function placesAutoComplete(_x6) {
        return _placesAutoComplete.apply(this, arguments);
      };
    }()
  }]);

  return GooglePlaces;
}();

var _default = GooglePlaces;
exports.default = _default;
'use strict';

var awsServerlessExpress = require('aws-serverless-express');

var app = require('./app'); // NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)


var binaryMimeTypes = ['application/javascript', 'application/json', 'application/octet-stream', 'application/xml', 'font/eot', 'font/opentype', 'font/otf', 'image/jpeg', 'image/png', 'image/svg+xml', 'text/comma-separated-values', 'text/css', 'text/html', 'text/javascript', 'text/plain', 'text/text', 'text/xml'];
var server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

exports.handler = function (event, context) {
  awsServerlessExpress.proxy(server, event, context);
};
