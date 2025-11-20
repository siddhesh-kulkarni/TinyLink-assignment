import { Sequelize } from "sequelize";
let sequelizeInstance: Sequelize | null = null;
import pg from "@/app/lib/pg-loader";

function getSequelize(): Sequelize {
  if (!sequelizeInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    const dbUrl = process.env.DATABASE_URL;
    const needsSSL = dbUrl.includes("sslmode=require") || dbUrl.includes("ssl=true");
    
    sequelizeInstance = new Sequelize(dbUrl, {
      dialect: "postgres",
      protocol: "postgres",
      dialectModule: pg,
      logging: false,
      dialectOptions: needsSSL
        ? {
            ssl: {
              require: false,
              rejectUnauthorized: false,
            },
          }
        : {},
    });
  }
  return sequelizeInstance;
}

export const sequelize = getSequelize();
