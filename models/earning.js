module.exports = function(sequelize, DataTypes) {
  var Earning = sequelize.define("Earning", {
    amount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    causeId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    donor: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
  // Data association
  Earning.associate = function(models) {
    Earning.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  }
  
  return Earning
}