module.exports = function(sequelize, DataTypes) {
  var Cause = sequelize.define("Cause", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    body: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    goal: {
      type: DataTypes.INTEGER
    },
    progress: {
      type: DataTypes.STRING,
      defaultValue: 0
    }
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