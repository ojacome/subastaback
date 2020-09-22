import schedule from 'node-schedule'
import { getRepository } from 'typeorm';
import { Sale, Status } from '../../models/sale.model';
import { enviarCorreo, TipoCorreo } from '../sale.helper';


export const programarFinalizacionSubasta = (date: any, saleId: number) =>{
    
    schedule.scheduleJob(date, async function(){
        console.log("tarea programada rezagada");

        const saleRepo = getRepository(Sale);

        await saleRepo.findOne({id: saleId, status: Status.Disponible} , { relations: ["user", "product"] })
        .then( async (sale: Sale | undefined) => {
            if (sale) {                
                
                console.log(sale);                
                //tiempo limite sin ofertas pasa a subasta rezagada
                if(!sale.user){
                    sale.status = Status.Rezagado
                                
                    await getRepository(Sale).save(sale)
                    .then( (saleCreated: Sale) => {
            
                        if (!saleCreated) {
                            console.log('no se pude realizar la subasta rezagada');                                
                        }
                
                        //enviar correo de subasta rezagada al correo del admin
                        console.log('subasta rezagada')
            
                    }).catch((err: Error) => console.log("Error al actualizar a subasta rezagada: ", err.message));
                }
                
                // tiempo limite con oferta pasa a subasta finalizada
                if(sale.user){
                    sale.status = Status.Finalizado
                                
                    await getRepository(Sale).save(sale)
                    .then( (saleCreated: Sale) => {
            
                        if (!saleCreated) {
                            console.log('no se pude realizar la subasta finalizada');                                
                        }
                
                        //enviar correo de subasta finalizada al correo del admin
                        console.log('subasta finalizada')
                        enviarCorreo(TipoCorreo.OfertaAceptada, sale.user, sale.product)
    
                    }).catch((err: Error) => console.log("Error al actualizar a subasta finalizada: ", err.message));
                }
            }
        })
        .catch((err: Error) => console.log(err.message));
        

    });
}
 