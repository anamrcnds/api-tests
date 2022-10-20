"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _app = require('./app'); var _app2 = _interopRequireDefault(_app);

_dotenv2.default.config()

const PORT = process.env.PORT

_mongoose2.default.
    connect(process.env.MONGODB_URI)
    .then(() => {
        _app2.default.listen(PORT, () => { console.log("Servidor no ar!") } );
    })
    .catch((e) => { 
        console.log(e)
    })
    


