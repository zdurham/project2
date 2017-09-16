module.exports = function(sequelize, DataTypes) {
  var Payment = sequelize.define("Payment", {
    amount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false

    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
  // Data association
  Payment.associate = function(models) {
    Payment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  }
  
  return Payment
}