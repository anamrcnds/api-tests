import mongoose, { ObjectId } from "mongoose"
import request from 'supertest'
import dotenv from 'dotenv'
import app from '../app'
import Ramal, { IRamal } from "../models/Ramais"

dotenv.config()


describe(`Testa todas as rotas`, () => { 
  
  beforeAll(async() => {
      await mongoose.connect(`${process.env.MONGODB_URI}`)
  })
  
  afterAll(async() => {
    await mongoose.connection.close()
  })
  
    it(`POST /ramais/novo
      Cria um novo registro`,
      async () => {
        
        // Dados do novo registro
        const novoRegistro: { nome: string, 
                              ramal: number, 
                              departamento: string 
                            } = {                                                                                                                                                                                             
                              nome: 'Carolina',
                              ramal: 8684,
                              departamento: 'Vendas'
                            }
        
        const res = await request(app)
                                      .post('/ramais/novo')
                                      .send(novoRegistro)
            

        const registroCriado: IRamal = res.body.data.novoRegistro
        const message: string = res.body.message
        const statusCode = res.body.code
        
        expect(statusCode).toBe(201)
        expect(message).toBe('Registro adicionado com sucesso!')
        expect(statusCode).not.toBe(422)
        expect(message).not.toBe('Ramal já cadastrado!')
        expect(statusCode).not.toBe(422)
        expect(message).not.toBe('Insira nome, ramal e departamento!')
        expect(statusCode).not.toBe(500)
        expect(message).not.toBe('Ocorreu um erro!')

        // console.log('REGISTRO CRIADO = ', registroCriado)

        expect(registroCriado.nome).toBeDefined()
        expect(registroCriado.ramal).toBeDefined()
        expect(registroCriado.departamento).toBeDefined()
        expect(registroCriado.dataUltimaAtualizacao).toBeDefined()
        expect(registroCriado.dataCriacao).toBeDefined()
      }
    )

    it(`PATCH /ramais/atualizar/:ramal
      Atualiza um registro existente de acordo com o número do ramal fornecido`,
      async () => {

        type registroAtualizar = { 
          nome?: string, 
          ramal?: number, 
          departamento?: string 
          }

        const numeroRamal: number = 8684

        const atualizacoes: registroAtualizar = {
                                                  // nome: 'Débora',
                                                  // ramal: 9494,
                                                  departamento: 'Marketing'
                                                }
                                
        const res = await request(app)
          .patch(`/ramais/atualizar/${numeroRamal}`)
          .send(atualizacoes)
                                    
        const registroAtualizado = res.body.data.atualizacoes
        const message: string = res.body.message  

        expect(res.statusCode).toBe(200)
        expect(message).toBe('Registro atualizado com sucesso!')
        expect(res.statusCode).not.toBe(400)
        expect(message).not.toBe('Ramal inexistente!')
        expect(res.statusCode).not.toBe(500)
        expect(message).not.toBe('Ocorreu um erro!')

        expect(registroAtualizado.nome)?.toBe(atualizacoes.nome)
        expect(registroAtualizado.ramal)?.toBe(atualizacoes.ramal)
        expect(registroAtualizado.departamento)?.toBe(atualizacoes.departamento)
      }
    )

    it(`GET /ramais
        Deve retornar todos os registros de ramais`, async () =>{

        const res: any = await request(app).get('/ramais')

        const dataSetSize: number= res.body.data.ramais.length
        const dataSet: Array<object> = res.body.data.ramais
        const message: string = res.body.message
        
        // console.log(dataSetSize);
        // console.log(dataSet);
        
        expect(res.statusCode).toBe(200)
        expect(message).toBe('Registros encontrados com sucesso!')
        expect(res.statusCode).not.toBe(500)
        expect(message).not.toBe('Ocorreu um erro!')

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
      Deve retornar um registro contendo apenas nome e departamento de um registro
      a partir do número de um ramal existente fornecido`, 
      async ()=> {

        const numeroRamal: number = 8684

        type registroNomeDpto = {
            id: string,
            nome: string, 
            departamento: string 
          }
          
        const res: any = await request(app).get(`/ramais/${numeroRamal}`)

        const registroEncontrado: registroNomeDpto = res.body.data
        const message: string = res.body.message
        
        // console.log(registroEncontrado)
        
        expect(res.statusCode).toBe(200)
        expect(message).toBe('Registro encontrado com sucesso!')
        expect(registroEncontrado).not.toHaveProperty([
                                                        'dataUltimaAtualizacao',
                                                        'dataCriacao',
                                                        '__v'
                                                      ])
        expect(res.statusCode).not.toBe(422)
        expect(message).not.toBe('Registro inexistente!')
        expect(res.statusCode).not.toBe(500)
        expect(message).not.toBe('Ocorreu um erro!')
        
      }
    )

    it(`GET /ramais/nome/:string
        Busca um registro a partir de um trecho do nome de
        um funcionário fornecido`,
        async () => {
          const trechoNome = 'ar'

          const res: any = await request(app).get(`/ramais/nome/${trechoNome}`)

          const registrosEncontrados: any = res.body.data
          const message: string = res.body.message
          
          
          // console.log(registrosEncontrados)
          
          expect(res.statusCode).toBe(200)
          expect(message).toBe('Registro(s) encontrado(s) com sucesso!')
          expect(res.statusCode).not.toBe(422)
          expect(message).not.toBe('Registro inexistente!')
          expect(res.statusCode).not.toBe(500)
          expect(message).not.toBe('Ocorreu um erro!')
          
          if(registrosEncontrados.length > 1){
            registrosEncontrados.forEach((registro: { nome: string }) => {
              expect(registro.nome).toMatch(`/${trechoNome}/`)
            })
          }
        }
    )
      
    it(`DELETE /ramais/excluir/:ramal
      Exclui um registro de acordo com o número do ramal fornecido`,
      async () => {
        const numeroRamal: number = 8684
        
        const res = await request(app).delete(`/ramais/excluir/${numeroRamal}`)
        
        const message: string = res.body.message
        
        const registroExistente: IRamal | null = await Ramal.findOne({ ramal: numeroRamal })

        expect(registroExistente).toBeNull();
        
        expect(res.statusCode).toBe(200)
        expect(message).toBe('Registro removido!')
        expect(res.statusCode).not.toBe(400)
        expect(message).not.toBe('Ramal não encontrado!')
        expect(res.statusCode).not.toBe(500)
        expect(message).not.toBe('Ocorreu um erro!')
      }
    )
  }
)

