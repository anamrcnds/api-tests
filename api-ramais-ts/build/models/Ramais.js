"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose');









const RamalSchema = new _mongoose.Schema({
    nome: { type: String, required: true },
    ramal: { type: Number, required: true },
    departamento: { type: String, required: true },
    dataUltimaAtualizacao: { type: String, required: true },
    dataCriacao: { type: String, required: true },
});

const Ramal = _mongoose.model('Ramais', RamalSchema)

exports. default = Ramal;
