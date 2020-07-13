import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Double } from "typeorm";

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
}