import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { Sale } from "./sale.model";


@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;



  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ default: false})
  isAdmin: boolean

  @Column({ default: true})
  isActive: boolean





  @CreateDateColumn({ type: "datetime"})
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime"})
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime"}) 
  deletedAt: Date;




  @OneToMany(type => Sale, sale => sale.user)
  sales: Sale[];
}