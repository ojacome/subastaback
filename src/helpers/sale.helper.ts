import { Sale } from "../models/sale.model"
import { Correo } from "./send_email.helper"
import { ENABLE_CORREO } from "../global/environment"
import { User } from "../models/user.model"
import { Product } from "../models/product.model"

export enum TipoCorreo{
    OfertaNueva     = "n",
    OfertaAceptada  = "a",
    OfertaPagada    = "p"
}


export const isOferta = (sale: Sale, oferta: number) => {         
    
    // console.log(sale)

    if(sale.user){
        if(oferta >= sale.total + 1 ) {
        
            enviarCorreo(TipoCorreo.OfertaNueva)
            return true
        }
    }
    else{
        if(oferta == sale.total ){ 

            enviarCorreo(TipoCorreo.OfertaNueva)
            return true
        }
        
        if(oferta >= sale.total + 1 ) {
            
            enviarCorreo(TipoCorreo.OfertaNueva)
            return true
        }
    }
    
    
    return false
}

export const enviarCorreo = (tipo: TipoCorreo, user?: any, product?: any) => {         
    
    if(!ENABLE_CORREO){ return }

    switch(tipo){
        case TipoCorreo.OfertaNueva:
            Correo.NuevaOferta();
            break;
        case TipoCorreo.OfertaAceptada:
            Correo.OfertaAceptada(user, product)
            break
        case TipoCorreo.OfertaPagada:
            Correo.OfertaPagada(user, product)
            break        
    }
}