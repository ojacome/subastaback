import bodyParser  from 'body-parser'
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { corsOptions } from './global/environment';




const app = express()



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//middlewares
app.use(cors(corsOptions)); 
app.use(morgan('dev'));





export default app;