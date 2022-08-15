'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const {User, Note} = models;

      Note.belongsTo(User);
      User.hasMany(Note);
    }
  }
  Note.init({
    id: {  type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
    title: DataType.STRING,
    content: DataType.STRING,
    settings: DataType.JSONB,
    authorId: {
      type: DataTypes.STRING,
      foreignKey: true
    }

  }, {
    sequelize,
    modelName: 'Note',
    freezeTableName: true
  });
  return Note;
};