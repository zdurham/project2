module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    about: {
      type: DataTypes.TEXT,
    },
    lastLogin: {
      type: DataTypes.DATE
    }
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