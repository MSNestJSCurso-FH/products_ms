import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsNumber({
    // Maximo 4 decimales
    maxDecimalPlaces: 4,
  })
  @Min(0)
  // Convert a number
  @Type(() => Number)
  public price: number;
}
