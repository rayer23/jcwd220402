"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Order_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order_status.hasMany(models.Transaction)
    }
  }
  Order_status.init(
    {
      order_status_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order_status",
    }
  )
  return Order_status
}
