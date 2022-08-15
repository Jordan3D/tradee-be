'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const {Notes, Note} = models;

      Notes.belongsTo(Note);
      Note.hasMany(Notes);
    }
  }
  Notes.init({
    id: {  type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
    noteId: {
      type: DataTypes.STRING,
      foreignKey: true
    },
    parentId: DataType.STRING,
    parentType: DataType.STRING
  }, {
    sequelize,
    modelName: 'Notes',
    freezeTableName: true
  });
  return Note;
};