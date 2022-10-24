import mongoose, { ObjectId } from "mongoose"
import request from 'supertest'
import dotenv from 'dotenv'
import app from '../app'
import Ramal, { IRamal } from "../models/Ramais"

dotenv.config()

beforeAll(async() => {
    await mongoose.connect(`${process.env.MONGODB_URI}`)
})

afterAll(async() => {
  await mongoose.connection.close()
})

let objectIds: Array <ObjectId> = []

describe(`
      - Insere 10 usuários
      - Exclui registros com ramais de número 1, 2, e 3
      - Atualiza o número do ramal dos 7 restantes
      - Lista todos os ramais atualizados
      - Lista o nome e departamento do ramal número 6 
      - Lista todos os registros que possuem 'Mar' no nome`, 
      () => {
              afterAll(async () => {
                for(let id of objectIds){
                  await Ramal.findByIdAndDelete(id)
                }
              })

              it(`POST /ramais/novo
                  Inserindo 10 usuários`,
                  async () => {
                    
                    type registro = { nome: string, 
                                      ramal: number, 
                                      departamento: string 
                                    }

                    // Dados do novo registro
                    const novosRegistros: Array<object> = [
                                                            {nome: 'Alice', ramal: 1, departamento: 'Vendas'},
                                                            {nome: 'Mateus', ramal: 2, departamento: 'Vendas'},
                                                            {nome: 'Mariana', ramal: 3, departamento: 'Vendas'},
                                                            {nome: 'Marcos', ramal: 4, departamento: 'Vendas'},
                                                            {nome: 'Betina', ramal: 5, departamento: 'Vendas'},
                                                            {nome: 'Roberto', ramal: 6, departamento: 'Vendas'},
                                                            {nome: 'Debora',ramal: 7, departamento: 'Vendas'},
                                                            {nome: 'Virginia',ramal: 8, departamento: 'Vendas'},
                                                            {nome: 'Melissa',ramal: 9, departamento: 'Vendas'},
                                                            {nome: 'Arthur',ramal: 10, departamento: 'Vendas'}
                                                          ]
                    
                    
                    const registrados = novosRegistros.map( async (registro: registro) => {

                      console.log(registro)
                      const novoRegistro: registro = registro

                      const res = await request(app)
                        .post('/ramais/novo')
                        .send(novoRegistro)

                      const registroCriado: IRamal = res.body.data.novoRegistro
                      const message: string = res.body.message
                      const statusCode = res.body.code
                      
                      expect(statusCode).toBe(201)
                      expect(message).toBe('Registro adicionado com sucesso!')

                      console.log(`Status: ${statusCode} - Ramal adicionado: ${registroCriado.ramal}`)
                      // console.log(`Status: ${statusCode} - ${registroCriado.ramal}`)

                      expect(registroCriado.nome).toBeDefined()
                      expect(registroCriado.ramal).toBeDefined()
                      expect(registroCriado.departamento).toBeDefined()
                      expect(registroCriado.dataUltimaAtualizacao).toBeDefined()
                      expect(registroCriado.dataCriacao).toBeDefined()
                    })

                    await Promise.all(registrados)
                  }
              )

              it(`DELETE /ramais/excluir/:ramal
                  Excluindo registros com ramais: 1, 2 e 3`,
                  async () => {
                    const ramaisExcluir: Array<number> = [1, 2, 3]
                    // const ramaisExcluir: Array<number> = [1, 2, 3, 4, 5, 6, 7]
                    
                    const excluidos = ramaisExcluir.map( async (numeroRamal: number) => {

                      const res = await request(app)
                        .delete(`/ramais/excluir/${numeroRamal}`)
                      
                      const message: string = res.body.message
                      const ramalExcluido = res.body.data.ramal

                      console.log(`Registro excluído: ${ramalExcluido}`)
                      
                      const registroExistente: IRamal | null = await Ramal.findOne({ ramal: ramalExcluido })

                      expect(registroExistente).toBeNull();
                      
                      expect(res.statusCode).toBe(200)
                      expect(message).toBe('Registro removido!')
                    })

                    await Promise.all(excluidos)
                  }
                )
            
              it(`PATCH /ramais/atualizar/:ramal
                  Atualiza o número dos 7 ramais restantes.
                  Menor ramal possui valor 4, será substituído 
                  para número 1; 5 para 2 etc...`,
                  async () => {

                    let num = 1;
                
                    type registro = { 
                                      nome?: string, 
                                      ramal?: number, 
                                      departamento?: string 
                                    }

                    // const numeroRamal: number = 6789

                    const ramaisAtualizar: Array<number> = [4, 5, 6, 7, 8, 9, 10]  
                
                    // const registrosAtualizados = ramaisAtualizar.map( async (numeroRamal: number) =>
                    for(let numeroRamal of ramaisAtualizar ) {
                      
                        const atualizarRamal: registro = {
                                                          ramal: num,
                                                         }
                                                
                        const res = await request(app)
                          .patch(`/ramais/atualizar/${numeroRamal}`)
                          .send(atualizarRamal)
                                                  
                        const registroAtualizado = res.body.data.atualizacoes
                        const message: string = res.body.message 
                        const _id: ObjectId = res.body.data.ramalValido

                        objectIds.push(_id)
                        
                        console.log(`Ramal atualizado de ${numeroRamal} para ${num}`)
                        
                        expect(res.statusCode).toBe(200)
                        expect(message).toBe('Registro atualizado com sucesso!')
                        
                        expect(registroAtualizado.nome)?.toBe(atualizarRamal.nome)
                        expect(registroAtualizado.ramal)?.toBe(atualizarRamal.ramal)
                        expect(registroAtualizado.departamento)?.toBe(atualizarRamal.departamento)

                        num++
                      }
                    

                    // await Promise.all(registrosAtualizados)
                  }
                )

              it(`GET /ramais
                  Lista todos os ramais atualizados`, 
                  async () =>{

                  const res: any = await request(app).get('/ramais')

                  const dataSetSize: number= res.body.data.ramais.length
                  const dataSet: Array<object> = res.body.data.ramais
                  const message: string = res.body.message
                
                  // console.log(dataSetSize);
                    console.log(dataSet);
                    
                    expect(res.statusCode).toBe(200)
                    expect(message).toBe('Registros encontrados com sucesso!')

                    expect(dataSetSize).toBeGreaterThanOrEqual(0)

                    if(dataSetSize > 1){

                      dataSet.forEach((registro: {
                                                  _id: string, 
                                                  nome: string, 
                                                  ramal: number, 
                                                  departamento: string, 
                                                  dataUltimaAtualizacao: string;
                                                  dataCriacao: string;
                                                  }
                                          ) => {
                                                  expect(registro._id).toBeDefined()
                                                  expect(registro.nome).toBeDefined()
                                                  expect(registro.ramal).toBeDefined()
                                                  expect(registro.departamento).toBeDefined()
                                                  expect(registro.dataUltimaAtualizacao).toBeDefined()
                                                  expect(registro.dataCriacao).toBeDefined()
                                                }
                      )
                    }
                  }
                )

              it(`GET ramais/:ramal
                  Lista o registro contendo apenas nome e departamento 
                  associados ao ramal número 6`, 
                  async ()=> {

                    const numeroRamal: number = 6 

                    type registroNomeDpto = {
                        id: string,
                        nome: string, 
                        departamento: string 
                      }
                      
                    const res: any = await request(app).get(`/ramais/${numeroRamal}`)
                   
                    const registroEncontrado: registroNomeDpto = res.body.data
                    const message: string = res.body.message
                    const statusCode = res.body.code

                    console.log(registroEncontrado)
                    
                    expect(statusCode).toBe(200)
                    expect(message).toBe('Registro encontrado com sucesso!')
                    expect(registroEncontrado).not.toHaveProperty([
                                                                    'dataUltimaAtualizacao',
                                                                    'dataCriacao',
                                                                    '__v'
                                                                  ])
                  }
                )

              it(`GET /ramais/nome/:string
                  Busca um registro a partir de um trecho do nome de
                  um funcionário fornecido`,
                  async () => {
                    const trechoNome = 'Mar'

                    const res: any = await request(app).get(`/ramais/nome/${trechoNome}`)
                   
                    const registrosEncontrados: Array<object> = res.body.data.registro
                    const message: string = res.body.message
                    
                    registrosEncontrados.forEach((registro: { nome: string }) => {
                      console.log(`Registro encontrado por trecho do nome: ${registro.nome}`)
                    })

                    expect(res.statusCode).toBe(200)
                    expect(message).toBe('Registro(s) encontrado(s) com sucesso!')
                    
                    console.log("TESTE:", registrosEncontrados)
                     
                    if(registrosEncontrados.length >= 1){
                      registrosEncontrados.forEach((registro: { nome: string }) => {
                        expect(registro.nome).toMatch(new RegExp(trechoNome))
                      })
                    }
                  }
              )       
  
      }
)



