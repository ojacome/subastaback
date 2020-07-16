import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { Sale } from "./sale.model";
import { IsDefined, IsNotEmpty, IsEmail, IsInt, IsNumberString, ValidateIf } from "class-validator";


@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;



  @Column()
  @IsNotEmpty({ message: 'El email no debe estar vacío' })
  @IsEmail(undefined,{message:'Debe escribir un correo válido'})
  email: string;
  
  @Column()
  @IsNotEmpty({ message: 'La contraseña no debe estar vacío' })
  password: string;
  
  @Column()
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  fullName: string;

  @Column({nullable: true})
  address: string;

  @Column({nullable: true})
  @ValidateIf((o) => {
    if(o.phone === "" || o.phone === null || o.phone === undefined){
      return false;
    }
    return true;
  })
  @IsNumberString({no_symbols: true},{message: 'Debe escribir un telefono válido'})
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