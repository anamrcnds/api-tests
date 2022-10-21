import { Request, Response } from 'express'
import Ramal, { IRamal }  from '../models/Ramais'

//Lista todos os registros

const getListarRegistros = async (request: Request, response: Response): Promise<void> => {

  try{
    const ramais: Array<IRamal> = await Ramal.find()

    return response.send_ok('Registros encontrados com sucesso!', { ramais })
      
  }catch {
    return response.send_internalServerError('Ocorreu um erro!')
  }
}

// Lista o nome e o departamento de um funcionário de acordo com o número do ramal fornecido
const getNomeDep = async (request: Request, response: Response): Promise<void> => {
    
  const ramal: number = Number(request.params.ramal)
  
    try {
      const registroEncontrado: IRamal | null = await Ramal.findOne( { ramal: ramal }, { nome: 1, departamento: 1})
      
      if(!registroEncontrado) return response.send_unprocessableEntity('Registro inexistente!')
  
        return response.send_ok('Registro encontrado com sucesso!', { registroEncontrado })

    } catch {
        return response.send_internalServerError('Ocorreu um erro!')
    }
  }

// Busca um um registro a partir do trecho do nome do funcionario 
const getTrechoNome = async (request: Request, response: Response): Promise<void> => {
        
    const string: string = String(request.params.string)
    
    try {
        const registro: Array<IRamal> = await Ramal.find( { nome: {"$regex": `${string}` , "$options": "i"}}, {} )
        
        if(!registro) return response.send_unprocessableEntity('Registro inexistente!')
        
        return response.send_ok('Registro(s) encontrado(s) com sucesso!', {registro})
        
    } catch {
        return response.send_internalServerError('Ocorreu um erro!')
    }
  }

// Cria um novo registro
const createRegistro = async (request: Request, response: Response): Promise<void> => {
        
        
    const { nome, ramal, departamento }: { nome: string, ramal: number, departamento: string } = request.body
    const dataCriacao: string = Date();
    const dataUltimaAtualizacao: string = Date()
    
    const ramalExistente: number = await Ramal.findOne({ ramal: ramal }, { ramal: 1})

    if(ramalExistente) return response.send_unprocessableEntity('Ramal já cadastrado!')
    if(!nome) return response.send_unprocessableEntity('Insira nome, ramal e departamento!')
    
    const novoRegistro: IRamal = {nome, ramal, departamento, dataUltimaAtualizacao, dataCriacao}
    
    try {
        await Ramal.create(novoRegistro)
        
        return response.send_created('Registro adicionado com sucesso!', {novoRegistro})
        
    } catch {
        return response.send_internalServerError('Ocorreu um erro!')
    }
}
   
// Atualiza um novo registro já existente de acordo com o número do ramal fornecido
const updateRegistro = async (request: Request, response: Response): Promise<void> => {
    const ramalUrl: number = Number(request.params.ramal)
    
    const { nome, ramal, departamento, dataCriacao }
        : {nome: string, ramal: number, departamento: string, dataCriacao: string} = request.body
        
        const dataUltimaAtualizacao: string = Date()
        
    //Verifica se o ramal existe na db
    const ramalValido = await Ramal.exists({ ramal: ramalUrl})
    if(!ramalValido) return response.send_badRequest('Ramal inexistente!')
    
    try {
        const atualizacoes: IRamal= { nome, ramal, departamento, dataUltimaAtualizacao , dataCriacao }
        
        await Ramal.updateOne({ ramal: ramalUrl }, atualizacoes)
        
        return response.send_ok('Registro atualizado com sucesso!', {atualizacoes})
        
    } catch {
        return response.send_internalServerError('Ocorreu um erro!')
    }
}

// Exclui um registro de acordo com o número do ramal fornecido
const deleteRegistro = async (request: Request, response: Response): Promise<void> => {
    const ramalUrl: number = Number(request.params.ramal)
    
    //Verifica se o ramal existe na database
    const registroValido = await Ramal.findOne({ ramal: ramalUrl })
    if(!registroValido) return response.send_badRequest('Ramal não encontrado!')
    
    try {

        await Ramal.deleteOne({ ramal: ramalUrl })
        
        return response.send_ok('Registro removido!', registroValido)
    } catch {

        return response.send_internalServerError('Ocorreu um erro!')
    }
}

export {
	getListarRegistros,
	getNomeDep,
	getTrechoNome, 
	createRegistro,
	updateRegistro,
	deleteRegistro
}