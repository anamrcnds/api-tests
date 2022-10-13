const express = require('express');
const mongoose = require('mongoose');
const ramaisRoutes = require('./routes/ramaisRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/ramais', ramaisRoutes);

const mongodb_connection = "mongodb+srv://user:senha123@ramais-cluster.qzgxzui.mongodb.net/?retryWrites=true&w=majority"

mongoose.
    connect(mongodb_connection)
    .then(() => {
        app.listen(3000, () => { console.log("Servidor no ar!") } );
    })
    .catch((e) => { console.log(e)})
