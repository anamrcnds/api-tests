import express, { Express } from 'express'
import * as mongoose from 'mongoose'
import ramaisRoutes from './routes/ramaisRoutes'
import responser from 'responser'
import throwlhos from 'throwlhos'

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(responser)
app.use(throwlhos.middleware)

app.use('/ramais', ramaisRoutes);

const mongodb_connection = "mongodb+srv://user:senha123@ramais-cluster.qzgxzui.mongodb.net/?retryWrites=true&w=majority"

mongoose.
    connect(mongodb_connection)
    .then(() => {
        app.listen(3000, () => { console.log("Servidor no ar!") } );
    })
    .catch((e) => { console.log(e)})

