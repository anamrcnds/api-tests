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

describe(`
      - Insere 10 usuários
      - Exclui registros com ramais de número 1, 2, e 3
      - Atualiza o número do ramal dos 7 restantes
      - Lista todos os ramais atualizados
      - Lista o nome e departamento do ramal número 6 
      - Lista todos os registros que possuem 'Mar' no nome`, 
      () => {
              it(`POST /ramais/novo
                  Inserindo 10 usuários`,
                  async () => {
                    
                    




                    // Dados do novo registro
                    const novosRegistros = [
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
                    
                    
                    const registrados = novosRegistros.map( async (registro) => {

                      console.log(registro)
                      const novoRegistro = registro

                      const res = await _supertest2.default.call(void 0, _app2.default).post('/ramais/novo').send(novoRegistro)

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
                    const ramaisExcluir = [1, 2, 3]
                    // const ramaisExcluir: Array<number> = [1, 2, 3, 4, 5, 6, 7]
                    
                    const excluidos = ramaisExcluir.map( async (numeroRamal) => {

                      const res = await _supertest2.default.call(void 0, _app2.default).delete(`/ramais/excluir/${numeroRamal}`)
                      const message = res.body.message
                      const ramalExcluido = res.body.data.ramal

                      console.log(`Registro excluído: ${ramalExcluido}`)
                      
                      const registroExistente = await _Ramais2.default.findOne({ ramal: ramalExcluido })

                      expect(registroExistente).toBeNull();
                      
                      expect(res.statusCode).toBe(200)
                      expect(message).toBe('Registro removido!')
                      expect(res.statusCode).not.toBe(400)
                      expect(message).not.toBe('Ramal não encontrado!')
                      expect(res.statusCode).not.toBe(500)
                      expect(message).not.toBe('Ocorreu um erro!')
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
                
                    





                    // const numeroRamal: number = 6789

                    const ramaisAtualizar = [4, 5, 6, 7, 8, 9, 10]  
                
                    // const registrosAtualizados = ramaisAtualizar.map( async (numeroRamal: number) =>
                    for(let numeroRamal of ramaisAtualizar ) {
                      
                        const atualizarRamal = {
                                                          ramal: num,
                                                         }
                                                
                        const res = await _supertest2.default.call(void 0, _app2.default)
                                                      .patch(`/ramais/atualizar/${numeroRamal}`)
                                                      .send(atualizarRamal)
                                                  
                        const registroAtualizado = res.body.data.atualizacoes
                        const message = res.body.message 
                        
                        console.log(`Ramal atualizado de ${numeroRamal} para ${num}`)
                        
                        expect(res.statusCode).toBe(200)
                        expect(message).toBe('Registro atualizado com sucesso!')
                        expect(res.statusCode).not.toBe(400)
                        expect(message).not.toBe('Ramal inexistente!')
                        expect(res.statusCode).not.toBe(500)
                        expect(message).not.toBe('Ocorreu um erro!')
                        
                        _optionalChain([expect, 'call', _ => _(registroAtualizado.nome), 'optionalAccess', _2 => _2.toBe, 'call', _3 => _3(atualizarRamal.nome)])
                        _optionalChain([expect, 'call', _4 => _4(registroAtualizado.ramal), 'optionalAccess', _5 => _5.toBe, 'call', _6 => _6(atualizarRamal.ramal)])
                        _optionalChain([expect, 'call', _7 => _7(registroAtualizado.departamento), 'optionalAccess', _8 => _8.toBe, 'call', _9 => _9(atualizarRamal.departamento)])

                        num++
                      }
                    

                    // await Promise.all(registrosAtualizados)
                  }
                )

              it(`GET /ramais
                  Lista todos os ramais atualizados`, 
                  async () =>{

                  const res = await _supertest2.default.call(void 0, _app2.default).get('/ramais')
                  const dataSetSize= res.body.data.ramais.length
                  const dataSet = res.body.data.ramais
                  const message = res.body.message
                
                  // console.log(dataSetSize);
                    console.log(dataSet);
                    
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
                  Lista o registro contendo apenas nome e departamento 
                  associados ao ramal número 6`, 
                  async ()=> {

                    const numeroRamal = 6 

                    




                      
                    const res = await _supertest2.default.call(void 0, _app2.default).get(`/ramais/${numeroRamal}`)
                    const registroEncontrado = res.body.data
                    const message = res.body.message
                    const statusCode = res.body.code

                    console.log(registroEncontrado)
                    
                    expect(statusCode).toBe(200)
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

                      const res = await _supertest2.default.call(void 0, _app2.default).get(`/ramais/nome/${trechoNome}`)
                      const registrosEncontrados = res.body.data.registro
                      const message = res.body.message
                      
                      
                      console.log(`Registro encontrado por trecho do nome: ${registrosEncontrados.nome}`)
                      
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
      }
)



