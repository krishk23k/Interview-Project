// ·     Category ID
// ·     Service Name
// ·     Type  (Note - Possible Options are Normal, VIP)
// ·     Price Options (Note - Service can have multiple price option)

import sequelizer from "../config/db";
import { DataTypes } from "sequelize";
import category from "./category";

const service = sequelizer.define(
  "services",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Normal", "VIP"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

category.hasMany(service, { foreignKey: "category_id", onDelete: "CASCADE" });
service.belongsTo(category, { foreignKey: "category_id" });

export default service;
