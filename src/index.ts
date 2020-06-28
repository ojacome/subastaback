import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes/routes';
import { createConnection} from 'typeorm';
import 'reflect-metadata';

const app = express()
createConnection();

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//routes 
app.use(router);

app.listen(3000);
console.log('server on port', 3000);