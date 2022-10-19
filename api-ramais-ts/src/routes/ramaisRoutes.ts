import { Router} from 'express'

const router: Router = Router()

import {
    getListarRegistros,
    getNomeDep,
    getTrechoNome,
    createRegistro,
    updateRegistro,
    deleteRegistro
} from '../controllers/ramaisController'

//Lista todos os registros
router.get('/', getListarRegistros)

// Lista o nome e o departamento de um funcionário de acordo com o número do ramal fornecido
router.get('/:ramal', getNomeDep)
    
// Busca um funcionário a partir de uma parte de seu nome
router.get('/nome/:string', getTrechoNome)
    
// Cria um novo registro
router.post('/novo', createRegistro)

// Atualiza um registro existente de acordo com o número do ramal fornecido
router.patch('/atualizar/:ramal', updateRegistro)

// Exclui um registro de acordo com o número do ramal fornecido
router.delete('/excluir/:ramal', deleteRegistro)

export default router;