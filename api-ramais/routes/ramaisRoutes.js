const express = require('express')

const router = express.Router();

const Ramal = require('../models/Ramais')


//Lista todos os registros
router.get('/', async(req, res) => {

    try{
        const ramais = await Ramal.find();

        res.status(200).json(ramais);
        
    }catch (e) {
        res.status(500).json({error: e})
    }
})

// Lista o nome e o departamento de um funcionário ao ser buscado pelo nº do ramal
router.get('/:ramal', async(req, res) => {
    
    const ramal = req.params.ramal;
    
        try {
            const funcionario = await Ramal.findOne( { ramal: ramal }, { nome: 1, departamento: 1} )
            
            if(!funcionario){
                res.status(422).json({mensagem: 'Funcionário não foi encontrado!'})
                return
            }
        
            res.status(200).json(funcionario);

        } catch (e) {
            res.status(500).json({error: e})
        }
    })

// Busca um funcionário a partir de uma parte de seu nome
router.get('/nome/:string', async(req, res) => {

        const string = req.params.string;

        try {
            const registro = await Ramal.find( { nome: {"$regex": `${string}` , "$options": "i"}}, {} );

            if(!funcionario){
                res.status(422).json({mensagem: 'Funcionário não foi encontrado!'})
                return
            }
            
            res.status(200).json({registro});

        } catch (e) {
            res.status(500).json({error: e})
        }
    })



// Cria um novo registro
router.post('/novo', async (req, res) => {

    const { nome, ramal, departamento } = req.body
    const data_criacao = Date();
    const data_ultima_atualizacao = Date();

    if(!nome){
        res.status(422).json({erro: `insira nome, ramal e departamento!`});
        return;
    }

    const novoRegistro = {nome, ramal, departamento, data_ultima_atualizacao, data_criacao};

    try {
        await Ramal.create(novoRegistro);

        res.status(201).json({mensagem: "Novo ramal adicionado!"});
    } catch (e) {
        res.status(500).json({ erro: e});
    }

})

// Atualiza um novo registro já existente quando buscado pelo ramal
router.patch('/atualizar/:ramal', async (req, res) => {
    const ramalUrl = req.params.ramal;

    const { nome, ramal, departamento } = req.body;
    const data_ultima_atualizacao = Date();

    try {
        const atualizacoes = { nome, ramal, departamento, data_ultima_atualizacao };
        
        await Ramal.updateOne({ ramal: ramalUrl }, atualizacoes);

        res.status(200).json(atualizacoes);

    } catch (e) {
        res.status(500).json({ erro: e});
    }

// Exclui um registro de acordo com o ramal
router.delete('/excluir/:ramal', async(req, res) => {
        const ramalUrl = req.params.ramal;
        
        const registro = await Ramal.findOne({ ramal: ramalUrl })

        if(registro){
            res.status(422).json({mensagem: 'Registro não encontrado.', registro})
            return;
        }

        try {
            await Ramal.deleteOne({ ramal: ramalUrl })

            res.status(200).json({mensagem: 'Registro removido'})
        } catch (e) {

            res.status(500).json({ erro: e })
        }
    })

})

module.exports = router;