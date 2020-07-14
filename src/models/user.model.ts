import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { Sale } from "./sale.model";


@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;



  @Column()
  email: string;
  
  @Column()
  password: string;
  
  @Column({nullable: true})
  fullName: string;

  @Column({nullable: true})
  address: string;

  @Column({nullable: true})
  phone: string;

  @Column({ default: false})
  isAdmin: boolean





  @CreateDateColumn({ type: "datetime"})
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime"})
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime"}) 
  deletedAt: Date;




  @OneToMany(type => Sale, sale => sale.user)
  sales: Sale[];
}