module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  })
  // Data association
  // Comment.associate = function(models) {
  //   Comment.belongsTo(models.User, {
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   })
  // }
  return Comment
}