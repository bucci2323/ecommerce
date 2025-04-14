import { Sequelize, DataType } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MYSQL_DATABASE || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_HOST) {
  throw new Error("Missing required MySQL environment variables");
}

const sequelize =
  process.env.NODE_ENV === "development"
    ? new Sequelize(
        process.env.MYSQL_DATABASE,
        process.env.MYSQL_USER,
        process.env.MYSQL_PASSWORD,
        {
          host: process.env.MYSQL_HOST,
          dialect: "mysql",
          logging: console.log,
        }
      )
    : new Sequelize(process.env.MYSQL_PUBLIC_URL || '', {
        dialect: "mysql",
      });

export { sequelize, DataType };
