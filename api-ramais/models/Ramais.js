const mongoose = require('mongoose');
const { Schema } = mongoose;

const ramalSchema = new Schema({
    nome: String,
    ramal: Number,
    departamento: String,
    data_ultima_atualizacao: String,
    data_criacao: String,
})

const Ramal = mongoose.model('Ramais', ramalSchema)

module.exports = Ramal;
