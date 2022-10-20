import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from './app'

dotenv.config()

const PORT = process.env.PORT

mongoose.
    connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => { console.log("Servidor no ar!") } );
    })
    .catch((e) => { 
        console.log(e)
    })
    


