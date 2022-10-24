import express, { Express } from 'express'
import responser from 'responser'
import ramaisRoutes from './routes/ramaisRoutes'

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(responser)

app.get("/", (req, res) => {
    res.status(200).json({ alive: "True" });
})
.use('/ramais', ramaisRoutes)

// app.use('/ramais', ramaisRoutes);



export default app