import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Product } from "./product.model";
import { UniqueName } from "../custom_validations/UniqueName";



@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number;


  @Column()  
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  @UniqueName(Category)
  name: string;

  @Column({nullable: true})
  description: string; 

  @Column({ default: true })
  isActive: boolean





  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime" })
  deletedAt: Date;





  @OneToMany(type => Product, product => product.category)
  products: Product[];
}