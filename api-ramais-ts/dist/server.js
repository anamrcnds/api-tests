"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _mongoose = require('mongoose'); var mongoose = _interopRequireWildcard(_mongoose);
var _ramaisRoutes = require('./routes/ramaisRoutes'); var _ramaisRoutes2 = _interopRequireDefault(_ramaisRoutes);

const app = _express2.default.call(void 0, );

app.use(_express2.default.urlencoded({ extended: true }));
app.use(_express2.default.json());

app.use('/ramais', _ramaisRoutes2.default);

const mongodb_connection = "mongodb+srv://user:senha123@ramais-cluster.qzgxzui.mongodb.net/?retryWrites=true&w=majority"

mongoose.
    connect(mongodb_connection)
    .then(() => {
        app.listen(3000, () => { console.log("Servidor no ar!") } );
    })
    .catch((e) => { console.log(e)})

