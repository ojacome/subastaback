import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Sale } from "../models/sale.model";
import *  as excel from 'exceljs'


export class ReportController {
    
    /**
     * Metodo para obtener incio y fin del mes actual
     *
     * @private
     * @returns
     * @memberof ReportController
     */
    private datesMonth(){

        let now = new Date(); 
        let init = new Date(now.getFullYear(), now.getMonth(), 1);
        let last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return {init, last};
    }
    
    /**
     * Metodo para crear el archivo de excel
     *
     * @private
     * @param {Partial<excel.Column>[]} headers
     * @param {any[]} rows
     * @param {string} sheetName
     * @returns {Promise<Buffer>}
     * @memberof ReportController
     */
    private async createExcel (headers: Partial<excel.Column>[], rows: any[], sheetName: string): Promise<Buffer> {  
	
		const workbook: excel.stream.xlsx.WorkbookWriter = new excel.stream.xlsx.WorkbookWriter({}); //crear el libro
		const sheet: excel.Worksheet = workbook.addWorksheet(sheetName); //crear hoja de trabajo y nombrarla
		sheet.columns = headers; // establecer las propiedades de las columnas 
		
        for(let i = 0; i < rows.length; i++) { //agregar filas a la hoja de trabajo.            
            
			sheet.addRow(rows[i]);
		}
		sheet.commit(); //enviar los datos a la hoja.
		return new Promise((resolve, reject): void => {
			workbook.commit().then(() => { //obtener el flujo del libro de trabajo y leerlo en un bufer.
				const stream: any = (workbook as any).stream;
				const result: Buffer = stream.read();
				resolve(result); 
			}).catch((e) => {
				reject(e);
			});
		});
    }

    /**
     * Metodo para obtener la data de los reportes
     *
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {*} status
     * @param {*} withUser
     * @returns
     * @memberof ReportController
     */
    public async getData(startDate: Date, endDate: Date, status: any, withUser: any){
		console.log(startDate, endDate);
		
		
        let sales =  await 
        getRepository(Sale)
        .createQueryBuilder("sale")        
        .innerJoin("sale.user","user")
        .innerJoin("sale.product","product")
        .select("sale.id","id")
        .addSelect("sale.total","total")        
        .addSelect("sale.updatedAt","fecha_pago")   
        .addSelect("user.fullName","user_name")
        .addSelect("user.email","email")
        .addSelect("user.address","address")
        .addSelect("user.phone","phone")
        .addSelect("product.name","product_name")
        .addSelect("product.description","description")
        .where("sale.status = :status", { status: status})
        .andWhere("sale.updatedAt BETWEEN :start AND :end", {start: startDate, end: endDate})  
        .getRawMany()

		return sales;
	}
    
    /**
     * Consultar las subastas para administrador
     * debe indicar el status
     * si trae con ofertas (s) o sin ofertas(n)
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public reportSalexStatus= async (req: Request, res: Response) => {
                
        const status: any = req.params.status;
        const withUser: any = req.params.user;
        

        let {start, end} =  req.body;            

        //validaciones      
        let startDate = this.datesMonth().init;
        let endDate = this.datesMonth().last;
                        
        if(start !== null && start !=='' && start !== undefined){
                startDate = new Date(start)
        }        
        
        if(end !== null && end !== '' && end !== undefined){
                endDate = new Date(end)  
        } 

        await this.getData(startDate, endDate, status, withUser )								
            .then(async (sales) =>{
                                
                let stream: Buffer = await this.createExcel([
                    { header: 'Código',         key: 'id'},
                    { header: 'Ganador',        key: 'user_name'} ,
                    { header: 'Email',          key: 'email'} ,
                    { header: 'Dirección',      key: 'address'} ,
                    { header: 'Teléfono',       key: 'phone'} ,
                    { header: 'Producto',       key: 'product_name'} ,
                    { header: 'Descripción',    key: 'description'} ,
                    { header: 'Valor pagado',   key: 'total'} ,
                    { header: 'Fecha de pago',   key: 'fecha_pago'} ,
                ], sales, "Subastas Pagadas");
        
                
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=SubastasPagadas${Date.now().toString()}.xlsx`);
                res.setHeader('Content-Length', stream.length);
                res.send(stream);
            })
            .catch((err: any) => {
        
                return res.status(500).json({
                        ok: false,
                        message: 'Error en la búsqueda',
                        error: err.message
                    });
            }); 									
        
    }
}
