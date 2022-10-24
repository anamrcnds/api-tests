import { Router} from 'express'

const router: Router = Router()

import {
    listarRegistros,
    listarNomeDep,
    listarTrechoNome,
    novoRegistro,
    atualizarRegistro,
    excluirRegistro
} from '../controllers/ramaisController'

//Lista todos os registros
router.get('/', listarRegistros)

// Lista o nome e o departamento de um funcionário de acordo com o número do ramal fornecido
router.get('/:ramal', listarNomeDep)
    
// Busca um funcionário a partir de uma parte de seu nome
router.get('/nome/:string', listarTrechoNome)
    
// Cria um novo registro
router.post('/novo', novoRegistro)

// Atualiza um registro existente de acordo com o número do ramal fornecido
router.patch('/atualizar/:ramal', atualizarRegistro)

// Exclui um registro de acordo com o número do ramal fornecido
router.delete('/excluir/:ramal', excluirRegistro)

export default router;