import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Double, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user.model";
import { Product } from "./product.model";

export enum Status {        
    EnProceso = 'e',
    Finalizado = 'f',
    Pagado = 'p'
  }


@Entity()
export class Sale {

  @PrimaryGeneratedColumn()
  id: number;


  @Column({    
    type:'enum',
    enum: Status,
    default: Status.EnProceso
  })
  status: Status;

  @Column({type: 'double'})
  total: Double



  @CreateDateColumn({ type: "datetime"})
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime"})
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime"}) 
  deletedAt: Date;




  @ManyToOne(type => User , user => user.sales)
  user: User;

  @OneToOne(type => Product)
    @JoinColumn()
    product: Product;
}