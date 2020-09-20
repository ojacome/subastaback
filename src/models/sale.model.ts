import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Double, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user.model";
import { Product } from "./product.model";
import { IsNumber, IsNotEmpty, min, Min, IsEnum } from "class-validator";
import { sumarDias } from "../helpers/time/time.helper";

export enum Status {        
    Disponible = 'd',
    Finalizado = 'f',
    Pagado = 'p',
    Rezagado = 'r'
  }

const limite = () => {
  let currentDate = new Date();
  return sumarDias(currentDate, 30);
}
const current = new Date()
@Entity()
export class Sale {

  @PrimaryGeneratedColumn()
  id: number;


  @Column({    
    type:'enum',
    enum: Status,
    default: Status.Disponible
  })
  @IsEnum(Status,{
    message:'Valor no permitido'
  })
  status: Status;

  @Column({type: 'double'})
  @IsNotEmpty({ message: 'El número no debe estar vacío' })
  @IsNumber({maxDecimalPlaces: 2},{message: 'El número ingresado es inválido'})
  @Min(1,{message: 'La mínima cantidad es de 1.'})
  total: number

  @Column({ type: 'datetime' })
  @IsNotEmpty({ message: 'Debe escribir una fecha máxima de finalización.'})
  deadline: Date

  @CreateDateColumn({ type: "datetime"})
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime"})
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime"}) 
  deletedAt: Date;




  @ManyToOne(type => User , user => user.sales)
  user: User;

  @OneToOne(type => Product, product => product.sale)
  @JoinColumn()
  product: Product;
}