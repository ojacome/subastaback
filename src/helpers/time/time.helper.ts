
export const sumarDias = (fecha: Date, dias: number) => {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

export const obtenerFechaLimite = (fecha: string) => {
    let f: Date

    if(fecha !== undefined && fecha !== null && fecha !== ''){
        f = new Date(fecha);
        
        let min = sumarDias(new Date(), 2);//minimo 3 dias por cuestiones UTC        
        let max = sumarDias(new Date(), 14);//maximo 14 dias por cuestiones de UTC
        
        if(f > max){ return '2'; } //error para fecha mayor al limite
        if(f < min){ return '1'; } //error para fecha menor al limite

        return fecha;
    }
    else{
        f = sumarDias(new Date(), 7);        
        return `${f.getFullYear()}-${f.getMonth()+1}-${f.getDate()}`; //por defecto 30 dias limite
    }
}