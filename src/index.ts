import { createConnection} from 'typeorm';
import 'reflect-metadata';
import app from './app'
import router from './routes/routes';
import { Request, Response, NextFunction} from 'express'


let port = 3900;



//routes 
app.use('/api/v1', router);
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Ruta no encontrada!");
});



createConnection()
    .then( async connection =>{

        console.log("Conectado a la Base de datos")
    })
    .catch(error => console.log("TypeORM error en conexion a la BD: ", error));



app.listen(port, () => {

    console.log('Servidor escuchando en http://localhost:'+port);
});