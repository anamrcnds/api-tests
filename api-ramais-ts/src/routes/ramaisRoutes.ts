import { Router, Request, Response} from 'express'
import { IRamal, Ramal } from '../models/Ramais'

const router: Router = Router();

//Lista todos os registros
router.get('/', async (request: Request, response: Response): Promise<void> => {

    try{
        const ramais: Array<IRamal> = await Ramal.find();

        return response.send_ok('Registros encontrados com sucesso!', { ramais })
        
    }catch (e) {
        return response.send_internalServerError('Ocorreu um erro', {error: e})
    }
})

// Lista o nome e o departamento de um funcionário ao ser buscado pelo nº do ramal
router.get('/:ramal', async (request: Request, response: Response): Promise<void> => {
    
    const ramal: number = Number(request.params.ramal);
    
        try {
            const funcionario: IRamal | null = await Ramal.findOne( { ramal: ramal }, { nome: 1, departamento: 1} )
            
            if(!funcionario) return response.send_unprocessableEntity('Registro inexistente!')
        
            return response.send_ok('Registro encontrado com sucesso!', { funcionario });

        } catch {
            return response.send_internalServerError('Ocorreu um erro!')
        }
    })
    
    // Busca um funcionário a partir de uma parte de seu nome
    router.get('/nome/:string', async (request: Request, response: Response): Promise<void> => {
        
        const string: string = String(request.params.string);
        
        try {
            // Linha 55 não aceitou IRamal | null, apenas tipo object - a investigar
            const funcionario: Array<IRamal> = await Ramal.find( { nome: {"$regex": `${string}` , "$options": "i"}}, {} ); 
            
            if(!funcionario) return response.send_unprocessableEntity('Registro inexistente!')
            
            return response.send_ok('Registro encontrado com sucesso!', {funcionario});
            
        } catch (e) {
            return response.send_internalServerError('Ocorreu um erro!')
        }
    })
    
    // Cria um novo registro
    router.post('/novo', async (request: Request, response: Response): Promise<void> => {
        
        
        const { nome, ramal, departamento }: { nome: string, ramal: number, departamento: string } = request.body
        const dataCriacao: string = Date();
        const dataUltimaAtualizacao: string = Date();
        
        if(!nome) return  response.send_unprocessableEntity('Insira nome, ramal e departamento!')
        
        const novoRegistro: IRamal = {nome, ramal, departamento, dataUltimaAtualizacao, dataCriacao}
        
        try {
            await Ramal.create(novoRegistro)
            
            return response.send_created('Registro adicionado com sucesso!', {novoRegistro})
            
        } catch (e) {
        return response.send_internalServerError('Ocorreu um erro!')
    }
    
})

// Atualiza um novo registro já existente quando buscado pelo número do ramal
router.patch('/atualizar/:ramal', async (request: Request, response: Response): Promise<void> => {
    const ramalUrl: number = Number(request.params.ramal);
    
    const { nome, ramal, departamento, dataCriacao }
        : {nome: string, ramal: number, departamento: string, dataCriacao: string} = request.body;
        
        const dataUltimaAtualizacao: string = Date();
        
    //Verifica se o ramal existe na database
    const ramalValido = await Ramal.exists({ ramal: ramalUrl})
    if(!ramalValido) return response.send_badRequest('Ramal inexistente!')
    
    try {
        const atualizacoes: IRamal= { nome, ramal, departamento, dataUltimaAtualizacao , dataCriacao };
        
        await Ramal.updateOne({ ramal: ramalUrl }, atualizacoes);
        
        return response.send_ok('Registro atualizado com sucesso!', {atualizacoes});
        
    } catch (e) {
        return response.send_internalServerError('Ocorreu um erro!')
    }
})

// Exclui um registro de acordo com o ramal
router.delete('/excluir/:ramal', async (request: Request, response: Response): Promise<void> => {
    const ramalUrl: number = Number(request.params.ramal);
    
    //Verifica se o ramal existe na database
    const registroValido = await Ramal.exists({ ramal: ramalUrl})
    if(!registroValido) return response.send_badRequest('Ramal não encontrado!')
    
    try {

        await Ramal.deleteOne({ ramal: ramalUrl })
        
        return response.send_ok('Registro removido!')
    } catch (e) {

        return response.send_internalServerError('Ocorreu um erro!')
    }
})

export default router;