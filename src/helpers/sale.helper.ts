import { Sale } from "../models/sale.model"




export const isOferta = (sale: Sale, oferta: number) => {         
    
    if(oferta == sale.total ){ return true}
    
    if(oferta >= sale.total + 1 ) {return true}
    
    return false
}
