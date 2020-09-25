import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { IsNotEmpty, Length, MaxLength, MinLength, ValidateIf } from "class-validator";
import { Product } from "./product.model";
import { UniqueName } from "../custom_validations/UniqueName";



@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number;


  @Column( { length: 150 })  
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  @UniqueName(Category)
  @Length(3,150)
  name: string;

  @Column({nullable: true, length: 400})
  @ValidateIf((o) => {
    if(o.description === "" || o.description === null || o.description === undefined){
      return false;
    }
    return true;
  })
  @Length(3,400)
  description: string; 

  @Column({ default: true })
  isActive: boolean

  @Column({select: false})
  updatedByUser: number  



  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime" })
  deletedAt: Date;





  @OneToMany(type => Product, product => product.category)
  products: Product[];
}