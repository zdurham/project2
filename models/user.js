module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
    },
  })

  // Data associations 
  User.associate = (models) => {
    User.hasMany(models.Post, {
      onDelete: 'cascade'
    })
    User.hasMany(models.Comment, {
      onDelete: 'cascade'
   })
  }
  return User
}