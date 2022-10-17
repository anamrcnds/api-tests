"use strict";Object.defineProperty(exports, "__esModule", {value: true});
var _express = require('express');
var _Ramais = require('../models/Ramais');

const router = _express.Router.call(void 0, );

//Lista todos os registros
router.get('/', async (req, res) => {

    try{
        const ramais = await _Ramais.Ramal.find();

        return res.status(200).json(ramais);
        
    }catch (e) {
        return res.status(500).json({error: e})
    }
})

// Lista o nome e o departamento de um funcionário ao ser buscado pelo nº do ramal
router.get('/:ramal', async (req, res) => {
    
    const ramal = Number(req.params.ramal);
    
        try {
            const funcionario = await _Ramais.Ramal.findOne( { ramal: ramal }, { nome: 1, departamento: 1} )
            
            if(!funcionario){
                return res.status(422).json({mensagem: 'Funcionário não foi encontrado!'})
            }
        
            return res.status(200).json(funcionario);

        } catch (e) {
            return res.status(500).json({error: e})
        }
    })

// Busca um funcionário a partir de uma parte de seu nome
router.get('/nome/:string', async (req, res) => {

        const string = String(req.params.string);

        try {
            // Linha 55 não aceitou IRamal | null, apenas tipo object - a investigar
            const funcionario = await _Ramais.Ramal.find( { nome: {"$regex": `${string}` , "$options": "i"}}, {} ); 

            if(!funcionario){
                return res.status(422).json({mensagem: 'Funcionário não foi encontrado!'})
                
            }
            
            return res.status(200).json({funcionario});

        } catch (e) {
            return res.status(500).json({error: e})
        }
    })



// Cria um novo registro
router.post('/novo', async (req, res) => {
    

    const { nome, ramal, departamento } = req.body
    const data_criacao = Date();
    const data_ultima_atualizacao = Date();

    if(!nome){
        return  res.status(422).json({erro: `insira nome, ramal e departamento!`});

    }

    const novoRegistro = {nome, ramal, departamento, data_ultima_atualizacao, data_criacao};

    try {
        await _Ramais.Ramal.create(novoRegistro);

        return res.status(201).json({mensagem: "Novo ramal adicionado!"});
    } catch (e) {
        return res.status(500).json({ erro: e});
    }

})

// Atualiza um novo registro já existente quando buscado pelo número do ramal
router.patch('/atualizar/:ramal', async (req, res) => {
    const ramalUrl = Number(req.params.ramal);

    const { nome, ramal, departamento, data_criacao } = req.body;
    const data_ultima_atualizacao = Date();

    try {
        const atualizacoes= { nome, ramal, departamento, data_ultima_atualizacao , data_criacao};
        
        await _Ramais.Ramal.updateOne({ ramal: ramalUrl }, atualizacoes);

        return res.status(200).json(atualizacoes);

    } catch (e) {
        return res.status(500).json({ erro: e});
    }
})

// Exclui um registro de acordo com o ramal
router.delete('/excluir/:ramal', async (req, res) => {
    const ramalUrl = String(req.params.ramal);
    
    const registro = await _Ramais.Ramal.findOne({ ramal: ramalUrl })

    if(registro){
        return res.status(422).json({mensagem: 'Registro não encontrado.', registro})
    }

    try {
        await _Ramais.Ramal.deleteOne({ ramal: ramalUrl })

        return res.status(200).json({mensagem: 'Registro removido'})
    } catch (e) {

        return res.status(500).json({ erro: e })
    }
})



exports. default = router;