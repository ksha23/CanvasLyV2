"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _users = _interopRequireDefault(require("./users"));
var _calendars = _interopRequireDefault(require("./calendars"));
var _assignments = _interopRequireDefault(require("./assignments"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = (0, _express.Router)();
router.use('/users', _users.default);
router.use('/calendars', _calendars.default);
router.use('/assignments', _assignments.default);
var _default = exports.default = router;
//# sourceMappingURL=index.js.map