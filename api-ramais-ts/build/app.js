"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _responser = require('responser'); var _responser2 = _interopRequireDefault(_responser);
var _ramaisRoutes = require('./routes/ramaisRoutes'); var _ramaisRoutes2 = _interopRequireDefault(_ramaisRoutes);

const app = _express2.default.call(void 0, );

app.use(_express2.default.urlencoded({ extended: true }));
app.use(_express2.default.json());
app.use(_responser2.default)

app.use('/ramais', _ramaisRoutes2.default);

exports. default = app