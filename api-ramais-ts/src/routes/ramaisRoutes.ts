import { ObjectId } from 'bson';
import { Router, Request, Response} from 'express'
import { IRamal, Ramal } from '../models/Ramais'

const router: Router = Router();

//Lista todos os registros
router.get('/', async (req: Request, res: Response): Promise<Response> => {

    try{
        const ramais: Array<IRamal> = await Ramal.find();

        return res.status(200).json(ramais);
        
    }catch (e) {
        return res.status(500).json({error: e})
    }
})

// Lista o nome e o departamento de um funcionário ao ser buscado pelo nº do ramal
router.get('/:ramal', async (req: Request, res: Response): Promise<Response> => {
    
    const ramal: number = Number(req.params.ramal);
    
        try {
            const funcionario: IRamal | null = await Ramal.findOne( { ramal: ramal }, { nome: 1, departamento: 1} )
            
            if(!funcionario) return res.status(422).json({mensagem: 'Registro não existe!'})
        
            return res.status(200).json(funcionario);

        } catch (e) {
            return res.status(500).json({error: e})
        }
    })

// Busca um funcionário a partir de uma parte de seu nome
router.get('/nome/:string', async (req: Request, res: Response): Promise<Response> => {

        const string: string = String(req.params.string);

        try {
            // Linha 55 não aceitou IRamal | null, apenas tipo object - a investigar
            const funcionario: Array<IRamal> = await Ramal.find( { nome: {"$regex": `${string}` , "$options": "i"}}, {} ); 

            if(!funcionario) return res.status(422).json({mensagem: 'Funcionário não foi encontrado!'})
            
            return res.status(200).json({funcionario});

        } catch (e) {
            return res.status(500).json({error: e})
        }
    })

// Cria um novo registro
router.post('/novo', async (req: Request, res: Response): Promise<Response> => {
    

    const { nome, ramal, departamento }: { nome: string, ramal: number, departamento: string } = req.body
    const dataCriacao: string = Date();
    const dataUltimaAtualizacao: string = Date();

    if(!nome) return  res.status(422).json({erro: `insira nome, ramal e departamento!`});

    const novoRegistro: IRamal = {nome, ramal, departamento, dataUltimaAtualizacao, dataCriacao};

    try {
        await Ramal.create(novoRegistro);

        return res.status(201).json({mensagem: "Novo ramal adicionado!"});

    } catch (e) {
        return res.status(500).json({ erro: e});
    }

})

// Atualiza um novo registro já existente quando buscado pelo número do ramal
router.patch('/atualizar/:ramal', async (req: Request, res: Response): Promise<Response> => {
    const ramalUrl: number = Number(req.params.ramal);

    const { nome, ramal, departamento, dataCriacao }
        : {nome: string, ramal: number, departamento: string, dataCriacao: string} = req.body;

    const dataUltimaAtualizacao: string = Date();

    //Verifica se o ramal existe na database
    const ramalValido = await Ramal.exists({ ramal: ramalUrl})
    if(!ramalValido) return res.status(400).json({mensagem: 'Ramal não encontrado'})

    try {
        const atualizacoes: IRamal= { nome, ramal, departamento, dataUltimaAtualizacao , dataCriacao };

        await Ramal.updateOne({ ramal: ramalUrl }, atualizacoes);

        return res.status(200).json({mensagem: 'Registro atualizado com sucesso!', atualizacoes});

    } catch (e) {
        return res.status(500).json({ erro: e});
    }
})

// Exclui um registro de acordo com o ramal
router.delete('/excluir/:ramal', async (req: Request, res: Response): Promise<Response> => {
    const ramalUrl: number = Number(req.params.ramal);

    //Verifica se o ramal existe na database
    const registroValido = await Ramal.exists({ ramal: ramalUrl})
    if(!registroValido) return res.status(400).json({mensagem: 'Ramal não encontrado!'})

    try {
        await Ramal.deleteOne({ ramal: ramalUrl })

        return res.status(200).json({mensagem: 'Registro removido'})
    } catch (e) {

        return res.status(500).json({ erro: e })
    }
})

export default router;