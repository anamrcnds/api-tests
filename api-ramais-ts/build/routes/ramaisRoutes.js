"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');

const router = _express.Router.call(void 0, )








var _ramaisController = require('../controllers/ramaisController');

//Lista todos os registros
router.get('/', _ramaisController.getListarRegistros)

// Lista o nome e o departamento de um funcionário de acordo com o número do ramal fornecido
router.get('/:ramal', _ramaisController.getNomeDep)
    
// Busca um funcionário a partir de uma parte de seu nome
router.get('/nome/:string', _ramaisController.getTrechoNome)
    
// Cria um novo registro
router.post('/novo', _ramaisController.createRegistro)

// Atualiza um novo registro já existente de acordo com o número do ramal fornecido
router.patch('/atualizar/:ramal', _ramaisController.updateRegistro)

// Exclui um registro de acordo com o número do ramal fornecido
router.delete('/excluir/:ramal', _ramaisController.deleteRegistro)

exports. default = router;