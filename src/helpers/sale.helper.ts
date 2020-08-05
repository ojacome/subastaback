import { Sale } from "../models/sale.model"
import { Correo } from "./send_email.helper"




export const isOferta = (sale: Sale, oferta: number) => {         
    
    // console.log(sale)

    if(sale.user){
        if(oferta >= sale.total + 1 ) {
        
            Correo.sendCorreoElectronico()
            return true
        }
    }
    else{
        if(oferta == sale.total ){ 

            Correo.sendCorreoElectronico()
            return true
        }
        
        if(oferta >= sale.total + 1 ) {
            
            Correo.sendCorreoElectronico()
            return true
        }
    }
    
    
    return false
}
