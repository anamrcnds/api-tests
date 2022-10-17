import { Schema, model } from 'mongoose'

interface IRamal{
    nome: String;
    ramal: Number;
    departamento: String;
    data_ultima_atualizacao: String;
    data_criacao: String;
}

const ramalSchema = new Schema<IRamal>({
    nome: { type: String, required: true },
    ramal: { type: Number, required: true },
    departamento: { type: String, required: true },
    data_ultima_atualizacao: { type: String, required: true },
    data_criacao: { type: String, required: true },
});

const Ramal = model<IRamal>('Ramais', ramalSchema)

export { IRamal, Ramal }
