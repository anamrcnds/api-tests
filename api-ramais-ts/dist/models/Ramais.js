"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose');









const ramalSchema = new _mongoose.Schema({
    nome: { type: String, required: true },
    ramal: { type: Number, required: true },
    departamento: { type: String, required: true },
    data_ultima_atualizacao: { type: String, required: true },
    data_criacao: { type: String, required: true },
});

const Ramal = _mongoose.model('Ramais', ramalSchema)

exports.Ramal = Ramal;
