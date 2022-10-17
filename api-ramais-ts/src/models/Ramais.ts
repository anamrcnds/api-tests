import { Schema, model } from 'mongoose'

interface IRamal{
    nome: String;
    ramal: Number;
    departamento: String;
    dataUltimaAtualizacao: String;
    dataCriacao: String;
}

const RamalSchema = new Schema<IRamal>({
    nome: { type: String, required: true },
    ramal: { type: Number, required: true },
    departamento: { type: String, required: true },
    dataUltimaAtualizacao: { type: String, required: true },
    dataCriacao: { type: String, required: true },
});

const Ramal = model<IRamal>('Ramais', RamalSchema)

export { IRamal, Ramal }
