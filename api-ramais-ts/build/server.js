"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _mongoose = require('mongoose'); var mongoose = _interopRequireWildcard(_mongoose);
var _dotenv = require('dotenv'); var dotenv = _interopRequireWildcard(_dotenv);
var _app = require('./app'); var _app2 = _interopRequireDefault(_app);

dotenv.config()

const PORT = process.env.PORT

mongoose.
    connect(`${process.env.MONGODB_URI}`)
    .then(() => {
        _app2.default.listen(PORT, () => { console.log("Servidor no ar!") } );
    })
    .catch((e) => { 
        console.log(e)
    })
    


