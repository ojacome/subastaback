import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";


@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true})
  isActive: boolean





  @CreateDateColumn({ type: "datetime"})
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime"})
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime"}) 
  deletedAt: Date;
}