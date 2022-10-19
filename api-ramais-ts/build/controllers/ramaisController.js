"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Ramais = require('../models/Ramais'); var _Ramais2 = _interopRequireDefault(_Ramais);


//Lista todos os registros

const getListarRegistros = async (request, response) => {

    try{
        const ramais = await _Ramais2.default.find()

        return response.send_ok('Registros encontrados com sucesso!', { ramais })
        
    }catch (e) {
        return response.send_internalServerError('Ocorreu um erro')
    }
}


// Lista o nome e o departamento de um funcionário de acordo com o número do ramal fornecido

const getNomeDep = async (request, response) => {
    
    const ramal = Number(request.params.ramal)
    
        try {
            const funcionario = await _Ramais2.default.findOne( { ramal: ramal }, { nome: 1, departamento: 1})
            
            if(!funcionario) return response.send_unprocessableEntity('Registro inexistente!')
        
            return response.send_ok('Registro encontrado com sucesso!', { funcionario })

        } catch (e2) {
            return response.send_internalServerError('Ocorreu um erro!')
        }
    }

// Busca um funcionário a partir de uma parte de seu nome

const getTrechoNome = async (request, response) => {
        
        const string = String(request.params.string)
        
        try {
            // Linha 55 não aceitou IRamal | null, apenas tipo object - a investigar
            const funcionario = await _Ramais2.default.find( { nome: {"$regex": `${string}` , "$options": "i"}}, {} )
            
            if(!funcionario) return response.send_unprocessableEntity('Registro inexistente!')
            
            return response.send_ok('Registro encontrado com sucesso!', {funcionario})
            
        } catch (e3) {
            return response.send_internalServerError('Ocorreu um erro!')
        }
    }

// Cria um novo registro
const createRegistro = async (request, response) => {
        
        
        const { nome, ramal, departamento } = request.body
        const dataCriacao = Date();
        const dataUltimaAtualizacao = Date()
        
        if(!nome) return response.send_unprocessableEntity('Insira nome, ramal e departamento!')
        
        const novoRegistro = {nome, ramal, departamento, dataUltimaAtualizacao, dataCriacao}
        
        try {
            await _Ramais2.default.create(novoRegistro)
            
            return response.send_created('Registro adicionado com sucesso!', {novoRegistro})
            
        } catch (e4) {
        return response.send_internalServerError('Ocorreu um erro!')
    }
}
   
// Atualiza um novo registro já existente de acordo com o número do ramal fornecido
const updateRegistro = async (request, response) => {
    const ramalUrl = Number(request.params.ramal)
    
    const { nome, ramal, departamento, dataCriacao }
         = request.body
        
        const dataUltimaAtualizacao = Date()
        
    //Verifica se o ramal existe na database
    const ramalValido = await _Ramais2.default.exists({ ramal: ramalUrl})
    if(!ramalValido) return response.send_badRequest('Ramal inexistente!')
    
    try {
        const atualizacoes= { nome, ramal, departamento, dataUltimaAtualizacao , dataCriacao }
        
        await _Ramais2.default.updateOne({ ramal: ramalUrl }, atualizacoes)
        
        return response.send_ok('Registro atualizado com sucesso!', {atualizacoes})
        
    } catch (e5) {
        return response.send_internalServerError('Ocorreu um erro!')
    }
}

// Exclui um registro de acordo com o número do ramal fornecido
const deleteRegistro = async (request, response) => {
    const ramalUrl = Number(request.params.ramal)
    
    //Verifica se o ramal existe na database
    const registroValido = await _Ramais2.default.exists({ ramal: ramalUrl})
    if(!registroValido) return response.send_badRequest('Ramal não encontrado!')
    
    try {

        await _Ramais2.default.deleteOne({ ramal: ramalUrl })
        
        return response.send_ok('Registro removido!')
    } catch (e6) {

        return response.send_internalServerError('Ocorreu um erro!')
    }
}








exports.getListarRegistros = getListarRegistros; exports.getNomeDep = getNomeDep; exports.getTrechoNome = getTrechoNome; exports.createRegistro = createRegistro; exports.updateRegistro = updateRegistro; exports.deleteRegistro = deleteRegistro;