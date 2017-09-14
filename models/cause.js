module.exports = function(sequelize, DataTypes) {
  var Cause = sequelize.define("Cause", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
  })
  // Data association
  Cause.associate = function(models) {
    Cause.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
    Cause.hasMany(models.Comment, {
      onDelete: 'cascade'
    }) 
  }
  return Cause
}