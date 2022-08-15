'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Note', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      title: Sequelize.STRING,
      content: Sequelize.STRING,
      settings: Sequelize.JSONB,
      authorId: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    });
    await queryInterface.createTable('Notes', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      parentId: Sequelize.STRING,
      parentType: Sequelize.STRING,
      noteId: {
        type: Sequelize.UUID,
        references: {
          model: 'Note',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Notes');
    await queryInterface.dropTable('Note');
  }
};
