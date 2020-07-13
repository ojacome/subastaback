import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';



@Entity()
export class ImageProduct {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;    

//   @ManyToOne(type => Incidence , incidence => incidence.files)
//   incidence: Incidence;

}

