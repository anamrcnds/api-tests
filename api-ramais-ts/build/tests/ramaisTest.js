"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);
var _supertest = require('supertest'); var _supertest2 = _interopRequireDefault(_supertest);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _app = require('../app'); var _app2 = _interopRequireDefault(_app);
var _Ramais = require('../models/Ramais'); var _Ramais2 = _interopRequireDefault(_Ramais);

_dotenv2.default.config()

beforeEach(async() => {
    await _mongoose2.default.connect(`${process.env.MONGODB_URI}`)
})

afterEach(async() => {
    await _mongoose2.default.connection.close()
})

/*it(`GET /ramais
    Deve retornar todos os registros de ramais`, async () =>{

    const res: any = await request(app).get('/ramais')
    const body: any = res.body
    const dataSetSize: number= res.body.data.ramais.length
    const dataSet: Array<object> = res.body.data.ramais
    const message: string = res.body.message
    
    console.log(dataSetSize);
    console.log(body);
    
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

      const numeroRamal: number = 1111

      type registroNomeDpto = {
          id: string,
          nome: string, 
          departamento: string 
      }

      const res: any = await request(app).get(`/ramais/${numeroRamal}`)
      const registroEncontrado: registroNomeDpto = res.body.data.registroEncontrado
      const message: string = res.body.message
      
      console.log(registroEncontrado)

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
      const trechoNome = 'Mar'

      const res: any = await request(app).get(`/ramais/nome/${trechoNome}`)
      const registros: any = res.body.data.registro
      const message: string = res.body.message
      
      console.log(registros)
      
      expect(res.statusCode).toBe(200)
      expect(message).toBe('Registro(s) encontrado(s) com sucesso!')
      expect(res.statusCode).not.toBe(422)
      expect(message).not.toBe('Registro inexistente!')
      expect(res.statusCode).not.toBe(500)
      expect(message).not.toBe('Ocorreu um erro!')
      
      if(registros.length > 1){
        registros.forEach((registro: { nome: string }) => {
          expect(registro.nome).toMatch(`/${trechoNome}/`)
        })
      }

    }
)
 

it(`POST /ramais/novo
    Cria um novo registro`,
    async () => {

      const novoRegistro: { nome: string, 
                            ramal: number, 
                            departamento: string 
                          } = {                                                                                                                                                                                             
                                nome: 'Roberto',
                                ramal: 8282,
                                departamento: 'Marketing'
                              }
                                
      const res = await request(app)
                                  .post('/ramais/novo')
                                  .send(novoRegistro)
      
      const registroCriado: any = res.body.data.novoRegistro
      const message: string = res.body.message
      
      expect(res.statusCode).toBe(201)
      expect(message).toBe('Registro adicionado com sucesso!')
      expect(res.statusCode).not.toBe(422)
      expect(message).not.toBe('Insira nome, ramal e departamento!')
      expect(res.statusCode).not.toBe(500)
      expect(message).not.toBe('Ocorreu um erro!')

      expect(registroCriado).toHaveProperty('nome')
      expect(registroCriado).toHaveProperty('ramal')
      expect(registroCriado).toHaveProperty('departamento')
      expect(registroCriado).toHaveProperty('dataUltimaAtualizacao')
      expect(registroCriado).toHaveProperty('dataCriacao')
      expect(registroCriado.nome).toBe(novoRegistro.nome)
      expect(registroCriado.ramal).toBe(novoRegistro.ramal)
      expect(registroCriado.departamento).toBe(novoRegistro.departamento)
    }
)

it(`PATCH /ramais/atualizar/:ramal
  Atualiza um registro existente de acordo com o número do ramal fornecido`,
  async () => {

    const numeroRamal: number = 1111

    const atualizacoes: { nome?: string, 
                          ramal?: number, 
                          departamento?: string 
                        } = {
                              // nome: 'Débora',
                              ramal: 4444,
                              departamento: 'Marketing'
                            }

    const res = await request(app)
                                .patch(`/ramais/atualizar/${numeroRamal}`)
                                .send(atualizacoes)
                                
    const registroAtualizado = res.body.data.atualizacoes
    const message: string = res.body.message
    
    //Console para visualizar dados enviados
    console.log(registroAtualizado)    
    
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
)*/

//Deletando mais de um documento com mesmo ramal- a investigar

it(`DELETE /ramais/excluir/:ramal
    Exclui um registro de acordo com o número do ramal fornecido`,
    async () => {
        const numeroRamal = 4242

        
        const res = await _supertest2.default.call(void 0, _app2.default).delete(`/ramais/excluir/${numeroRamal}`)
        const message = res.body.message
        
        const registroExistente = await _Ramais2.default.findOne({ ramal: numeroRamal })

        expect(registroExistente).toBeNull();
        
        expect(res.statusCode).toBe(200)
        expect(message).toBe('Registro removido!')
        expect(res.statusCode).not.toBe(400)
        expect(message).not.toBe('Ramal não encontrado!')
        expect(res.statusCode).not.toBe(500)
        expect(message).not.toBe('Ocorreu um erro!')
        
      }
)

