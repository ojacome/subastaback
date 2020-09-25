import { Sale } from "../models/sale.model"
import { Correo } from "./email/send_email.helper"
import { ENABLE_CORREO } from "../global/environment"
import { User } from "../models/user.model"
import { Product } from "../models/product.model"

export enum TipoCorreo{
    OfertaNueva         = "n",
    OfertaAceptada      = "a",
    OfertaPagada        = "p",
    ForgotPassword      = "f",
    Contact             = "c",
    EmailVerification   = "e",
    SubastaRezagada     = "r"
}


export const isOferta = (sale: Sale, oferta: number) => {         
    
    // console.log(sale)

    if(sale.user){
        if(oferta >= sale.total + 1 ) {
        
            enviarCorreo(TipoCorreo.OfertaNueva,sale.user, sale.product)
            return true
        }
    }
    else{
        if(oferta == sale.total ){ 

            enviarCorreo(TipoCorreo.OfertaNueva,sale.user, sale.product)
            return true
        }
        
        if(oferta >= sale.total + 1 ) {
            
            enviarCorreo(TipoCorreo.OfertaNueva,sale.user, sale.product)
            return true
        }
    }
    
    
    return false
}

export const enviarCorreo = (tipo: TipoCorreo, user?: any, product?: any, sales?: any[]) => {         
    
    if(!ENABLE_CORREO){ return }

    switch(tipo){
        case TipoCorreo.OfertaNueva:
            Correo.NuevaOferta(product);
            break;
        case TipoCorreo.OfertaAceptada:
            Correo.OfertaAceptada(user, product)
            break
        case TipoCorreo.OfertaPagada:
            Correo.OfertaPagada(user, sales)
            break   
        case TipoCorreo.ForgotPassword:
            Correo.ForgotPassword(user)
            break   
        case TipoCorreo.Contact:
            Correo.Contact(user)
            break 
        case TipoCorreo.EmailVerification:
            Correo.EmailVerification( user, product )
            break 
        case TipoCorreo.SubastaRezagada:
            Correo.SubastaRezagada( product )
            break 
    }
}