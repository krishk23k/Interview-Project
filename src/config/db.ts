import { Sequelize } from "sequelize";

const dbName = process.env.DB_NAME || "interview";
const userName = process.env.DB_USER || "root";
const password = `${process.env.DB_PASSWORD}`;
const sequelizer = new Sequelize("interview", "root", "Data@2004", {
  host: "127.0.0.1",
  dialect: "mysql",
});

sequelizer
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelizer.sync({ alter: true }).then(() => {
  console.log("All models were synchronized successfully.");
});

export default sequelizer;
