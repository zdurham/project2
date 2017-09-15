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
    image: {
      type: DataTypes.STRING
    },
    about: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.TEXT
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    stripeAccountId: {
      type: DataTypes.STRING
    },
    amountDonated: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
   User.hasMany(models.Cause, {
     onDelete: 'cascade'
   })
   User.hasMany(models.Payment, {
     onDelete: 'cascade'
   })
   User.hasMany(models.Earning, {
     onDelete: 'cascade'
   })
  }
  return User
}