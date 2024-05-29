import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

// Definir el schema de validacion
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
  })
  // Aceptar properties unknow
  .unknown(true);

// Validacion de los vars
const { error, value } = envsSchema.validate(process.env);

// Validar si exite error
if (error) {
  //   console.log(error);
  //   console.log('ERROR:', error.message);
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
};
