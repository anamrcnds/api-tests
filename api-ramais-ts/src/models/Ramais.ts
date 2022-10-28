import { Schema, model } from 'mongoose'

export interface IRamal{
    nome: string;
    sobrenome: string;
    ramal: number;
    departamento: string;
    dataUltimaAtualizacao: string;
    dataCriacao: string;
}

const RamalSchema = new Schema<IRamal>({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: true },
    ramal: { type: Number, required: true },
    departamento: { type: String, required: true },
    dataUltimaAtualizacao: { type: String, required: true },
    dataCriacao: { type: String, required: true },
    
});

RamalSchema.virtual('nomeCompleto')
.get(function (nome, sobrenome) {
  return `${this.nome} ${this.sobrenome}`}).

const Ramal = model<IRamal>('Ramais', RamalSchema);

export default Ramal
