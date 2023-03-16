"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Cart.belongsTo(models.Product)
            Cart.belongsTo(models.User)
        }
    }
    Cart.init(
        {
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            is_checked: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            note: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "Cart",
        }
    )
    return Cart
}
