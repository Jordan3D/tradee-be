'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const {User, Tag} = models;

      Tag.belongsTo(User);
      Tag.belongsTo(Tag);
      User.hasMany(Tag);
      Tag.hasMany(Tag);
    }
  }
  Tag.init({
    id: {  type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
    title: DataType.STRING,
    level: DataTypes.INTEGER,
    isMeta: DataTypes.BOOLEAN,
    parentId: {
      type: DataTypes.STRING,
      foreignKey: true
    },
    authorId: {
      type: DataTypes.STRING,
      foreignKey: true
    }

  }, {
    sequelize,
    modelName: 'Tag',
    freezeTableName: true
  });
  return Tag;
};