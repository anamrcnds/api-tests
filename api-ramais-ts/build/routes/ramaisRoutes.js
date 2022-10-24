"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');

const router = _express.Router.call(void 0, )








var _ramaisController = require('../controllers/ramaisController');

//Lista todos os registros
router.get('/', _ramaisController.listarRegistros)

// Lista o nome e o departamento de um funcionário de acordo com o número do ramal fornecido
router.get('/:ramal', _ramaisController.listarNomeDep)
    
// Busca um funcionário a partir de uma parte de seu nome
router.get('/nome/:string', _ramaisController.listarTrechoNome)
    
// Cria um novo registro
router.post('/novo', _ramaisController.novoRegistro)

// Atualiza um registro existente de acordo com o número do ramal fornecido
router.patch('/atualizar/:ramal', _ramaisController.atualizarRegistro)

// Exclui um registro de acordo com o número do ramal fornecido
router.delete('/excluir/:ramal', _ramaisController.excluirRegistro)

exports. default = router;