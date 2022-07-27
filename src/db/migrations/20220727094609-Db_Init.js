'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Token', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true},
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      tokenId: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      userId: Sequelize.STRING
    });
    await queryInterface.createTable('User', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      username: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
      config: Sequelize.JSONB
    });
    await queryInterface.createTable('Tag', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      title: Sequelize.STRING,
      level: Sequelize.INTEGER,
      isMeta: Sequelize.BOOLEAN,
      parentId: {
        type: Sequelize.UUID,
        references: {
          model: 'Tag',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Tag');
    await queryInterface.dropTable('User');
    await queryInterface.dropTable('Token');
  }
};
