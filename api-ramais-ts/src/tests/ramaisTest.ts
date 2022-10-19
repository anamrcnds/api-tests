// import {expect, jest, test} from '@jest/globals';
import mongoose from "mongoose";
import request from 'supertest';
import dotenv from 'dotenv'
import app from '../app'
import { Console } from "console";

dotenv.config()

beforeAll(async() => {
    await mongoose.connect(`${process.env.MONGODB_URI}`)
})

afterAll(async() => {
    await mongoose.connection.close()
})

describe('GET /ramais', () => {
  it('Deve retornar todos os registros de ramais', async () =>{
      const res = await request(app).get('/ramais')
      const body = res.body
      const data: number= res.body.data.ramais.length
      const message: string = res.body.message
      
      console.log(data);
      console.log(body);
      
      expect(res.statusCode).toBe(200)
      expect(message).toBe('Registros encontrados com sucesso!')
      expect(data).toBeGreaterThanOrEqual(0)
      expect(res.statusCode).not.toBe(500)
      expect(message).not.toBe('Ocorreu um erro!')
    }
  )
})

describe('GET ramais/:ramal', () => {
  it(`Deve retornar um registro contendo apenas nome e departamento de um registro
      a partir do número de um ramal existente fornecido`, 
      async ()=>{
        const res = await request(app).get('/ramais/1111')
        const funcionario: object = res.body.data.funcionario
        const message: string = res.body.message
        
        console.log(funcionario)
        expect(res.statusCode).toBe(200)
        expect(message).toBe('Registro encontrado com sucesso!')
        expect(funcionario).not.toHaveProperty([
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
})

describe('GET /ramais/nome/:string', () => {
  it(`Busca um registro a partir de um trecho do nome de
  um funcionário fornecido`,
    async () => {
      const res = await request(app).get('/ramais/nome/an')
      const registros: Array<object> = res.body.data.funcionario
      const message: string = res.body.message
      
      console.log(registros)
      
      expect(res.statusCode).toBe(200)
      expect(message).toBe('Registro(s) encontrado(s) com sucesso!')
      expect(res.statusCode).not.toBe(422)
      expect(message).not.toBe('Registro inexistente!')
      expect(res.statusCode).not.toBe(500)
      expect(message).not.toBe('Ocorreu um erro!')
    }
  )
})

describe('POST /ramais/novo', () => {
  it(`Cria um novo registro`,
    async () => {
      const res = await request(app)
                                  .post('/ramais/novo')
                                  .send({
                                    nome: 'Jessica',
                                    ramal: 1313,
                                    departamento: 'Vendas'
                                  })
      
      const novoRegistro: object = res.body.data.novoRegistro
      const message: string = res.body.message
      
      
      console.log(res.body)
      //Console para visualizar dados inseridos
      console.log(novoRegistro)
      
      expect(res.statusCode).toBe(201)
      expect(message).toBe('Registro adicionado com sucesso!')
      expect(res.statusCode).not.toBe(422)
      expect(message).not.toBe('Insira nome, ramal e departamento!')
      expect(res.statusCode).not.toBe(500)
      expect(message).not.toBe('Ocorreu um erro!')
      //Testes a seguir possuem implementação duvidosa - não funcionou agrupar propriedades em array, a investigar melhor implementação
      expect(novoRegistro).toHaveProperty('nome')
      expect(novoRegistro).toHaveProperty('ramal')
      expect(novoRegistro).toHaveProperty('departamento')
      expect(novoRegistro).toHaveProperty('dataUltimaAtualizacao')
      expect(novoRegistro).toHaveProperty('dataCriacao')
    }
  )
})

describe('PATCH /ramais/atualizar/:ramal', () => {
  it(`Atualiza um registro existente de acordo com o número do ramal fornecido`,
  async () => {
    const res = await request(app)
                                  .patch('/ramais/atualizar/1313')
                                  .send({
                                    nome: 'Adalberto',
                                    ramal: 5656,
                                    departamento: 'Era a Jéssica'
                                  })
                                  
                                  const atualizacoes = res.body.data.atualizacoes
      const message: string = res.body.message
      
      //Console para visualizar dados enviados
      console.log(atualizacoes)    
      
      expect(res.statusCode).toBe(200)
      expect(message).toBe('Registro atualizado com sucesso!')
      expect(res.statusCode).not.toBe(400)
      expect(message).not.toBe('Ramal inexistente!')
      expect(res.statusCode).not.toBe(500)
      expect(message).not.toBe('Ocorreu um erro!')
    }
  )
})

//Deletando mais de um documento com mesmo ramal- a investigar

describe('DELETE /ramais/excluir/:ramal', () => {
  it(`Exclui um registro de acordo com o número do ramal fornecido`,
  async () => {
      const res = await request(app).delete('/ramais/excluir/8181')
      const message: string = res.body.message
      
      expect(res.statusCode).toBe(200)
      expect(message).toBe('Registro removido!')
      expect(res.statusCode).not.toBe(400)
      expect(message).not.toBe('Ramal não encontrado!')
      expect(res.statusCode).not.toBe(500)
      expect(message).not.toBe('Ocorreu um erro!')
    }
  )
})











































