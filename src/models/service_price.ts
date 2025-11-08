// ·     Service ID
// ·     Duration
// ·     Price
// ·     Type  (Note - Possible Options are Hourly, Weekly, Monthl)

import sequelizer from "../config/db";
import { DataTypes } from "sequelize";
import service from "./services";
const service_price = sequelizer.define(
  "services_price_options",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Hourly", "Weekly", "Monthly"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

service.hasMany(service_price, {
  foreignKey: "service_id",
  onDelete: "CASCADE",
});
service_price.belongsTo(service, { foreignKey: "service_id" });
export default service_price;
