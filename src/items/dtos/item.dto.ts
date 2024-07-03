import { Expose, Transform } from 'class-transformer';

export class itemDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  price: number;
  @Expose()
  location: string;
  @Expose()
  category: string;

  @Transform(({ obj }) => {
    return {
      id: obj.user.id,
      name: obj.user.name,
      email: obj.user.email,
    };
  })
  @Expose()
  user: {};
}
