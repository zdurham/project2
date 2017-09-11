module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    }
  })
  // Data association
  Post.associate = function(models) {
    Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
    Post.hasMany(models.Comment, {
      onDelete: 'cascade'
    }) 
  }
  
  return Post
}