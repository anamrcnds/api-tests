"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);
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

describe(`Testa todas as rotas`, () => { 

        it(`POST /ramais/novo
        Cria um novo registro`,
        async () => {
          
          // Dados do novo registro
          const novoRegistro


 = {                                                                                                                                                                                             
                                nome: 'Carolina',
                                ramal: 8684,
                                departamento: 'Vendas'
                              }
          
          const res = await _supertest2.default.call(void 0, _app2.default)
                                        .post('/ramais/novo')
                                        .send(novoRegistro)
              

          const registroCriado = res.body.data.novoRegistro
          const message = res.body.message
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

        





        const numeroRamal = 8684

        const atualizacoes = {
                                                  // nome: 'Débora',
                                                  // ramal: 9494,
                                                  departamento: 'Marketing'
                                                }
                                
        const res = await _supertest2.default.call(void 0, _app2.default)
                                      .patch(`/ramais/atualizar/${numeroRamal}`)
                                      .send(atualizacoes)
                                    
        const registroAtualizado = res.body.data.atualizacoes
        const message = res.body.message  

        expect(res.statusCode).toBe(200)
        expect(message).toBe('Registro atualizado com sucesso!')
        expect(res.statusCode).not.toBe(400)
        expect(message).not.toBe('Ramal inexistente!')
        expect(res.statusCode).not.toBe(500)
        expect(message).not.toBe('Ocorreu um erro!')

        _optionalChain([expect, 'call', _ => _(registroAtualizado.nome), 'optionalAccess', _2 => _2.toBe, 'call', _3 => _3(atualizacoes.nome)])
        _optionalChain([expect, 'call', _4 => _4(registroAtualizado.ramal), 'optionalAccess', _5 => _5.toBe, 'call', _6 => _6(atualizacoes.ramal)])
        _optionalChain([expect, 'call', _7 => _7(registroAtualizado.departamento), 'optionalAccess', _8 => _8.toBe, 'call', _9 => _9(atualizacoes.departamento)])
        }
        )

    it(`GET /ramais
        Deve retornar todos os registros de ramais`, async () =>{

        const res = await _supertest2.default.call(void 0, _app2.default).get('/ramais')
        const dataSetSize= res.body.data.ramais.length
        const dataSet = res.body.data.ramais
        const message = res.body.message
        
        // console.log(dataSetSize);
        // console.log(dataSet);
        
        expect(res.statusCode).toBe(200)
        expect(message).toBe('Registros encontrados com sucesso!')
        expect(res.statusCode).not.toBe(500)
        expect(message).not.toBe('Ocorreu um erro!')

        expect(dataSetSize).toBeGreaterThanOrEqual(0)

        if(dataSetSize > 1){
          dataSet.forEach((registro







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

        const numeroRamal = 8684

        




          
        const res = await _supertest2.default.call(void 0, _app2.default).get(`/ramais/${numeroRamal}`)
        const registroEncontrado = res.body.data
        const message = res.body.message
        
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

          const res = await _supertest2.default.call(void 0, _app2.default).get(`/ramais/nome/${trechoNome}`)
          const registrosEncontrados = res.body.data
          const message = res.body.message
          
          
          // console.log(registrosEncontrados)
          
          expect(res.statusCode).toBe(200)
          expect(message).toBe('Registro(s) encontrado(s) com sucesso!')
          expect(res.statusCode).not.toBe(422)
          expect(message).not.toBe('Registro inexistente!')
          expect(res.statusCode).not.toBe(500)
          expect(message).not.toBe('Ocorreu um erro!')
          
          if(registrosEncontrados.length > 1){
            registrosEncontrados.forEach((registro) => {
              expect(registro.nome).toMatch(`/${trechoNome}/`)
            })
          }
        }
    )
      
    it(`DELETE /ramais/excluir/:ramal
      Exclui um registro de acordo com o número do ramal fornecido`,
      async () => {
        const numeroRamal = 7
        
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
  }
)

