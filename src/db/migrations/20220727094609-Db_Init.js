'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
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
    await queryInterface.createTable('Token', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true},
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      tokenId:Sequelize.STRING
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
    await queryInterface.createTable('Note', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      title: Sequelize.STRING,
      content: Sequelize.TEXT,
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
      parentId: Sequelize.UUID,
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
    await queryInterface.createTable('Broker', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      title: Sequelize.STRING,
      api_key: Sequelize.STRING,
      secret_key: Sequelize.STRING,
      broker_type: Sequelize.STRING,
      isSyncing: Sequelize.BOOLEAN,
      lastSync: Sequelize.JSONB,
      isRemoved:  Sequelize.BOOLEAN,
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
    await queryInterface.createTable('Comment', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      content: Sequelize.STRING,
      rating: Sequelize.INTEGER,
      parentId: Sequelize.UUID,
      parentType: Sequelize.STRING,
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
    await queryInterface.createTable('File', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      key: Sequelize.STRING,
      url: Sequelize.STRING,
      parentId: Sequelize.UUID,
      parentType: Sequelize.STRING,
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
    await queryInterface.createTable('Idea', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      title: Sequelize.STRING,
      content: Sequelize.TEXT,
      authorId: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      photos: Sequelize.JSON
    });
    await queryInterface.createTable('JournalItem', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      title: Sequelize.STRING,
      content: Sequelize.STRING,
      authorId: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      pnls: Sequelize.JSON,
      transactions: Sequelize.JSON
    });
    await queryInterface.createTable('Pair', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      title: Sequelize.STRING
    });
    await queryInterface.createTable('Tags', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      parentId: Sequelize.UUID,
      parentType: Sequelize.STRING,
      tagId: {
        type: Sequelize.UUID,
        references: {
          model: 'Tag',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    });
    await queryInterface.createTable('Trade', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      pairId: Sequelize.UUID,
      authorId: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      brokerId: Sequelize.UUID,
      action: Sequelize.STRING,
      openPrice: Sequelize.FLOAT,
      openTradeTime: Sequelize.DATE,
      closePrice: Sequelize.FLOAT,
      closeTradeTime: Sequelize.DATE,
      leverage: Sequelize.DATE,
      pnl: Sequelize.FLOAT,  
      orderType: Sequelize.STRING,  
      execType: Sequelize.STRING,  
      order_id: Sequelize.STRING,  
      isManual: Sequelize.BOOLEAN
    });
    await queryInterface.createTable('TradeTransaction', {
      id: {  type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      pairId: Sequelize.UUID,
      authorId: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      brokerId: Sequelize.UUID,
      order_id: Sequelize.STRING,  
      exec_id: Sequelize.STRING,  
      side: Sequelize.STRING,
      price: Sequelize.FLOAT,
      order_qty: Sequelize.FLOAT,
      order_type: Sequelize.STRING,
      fee_rate: Sequelize.FLOAT,
      exec_price: Sequelize.FLOAT,
      exec_type: Sequelize.STRING,
      exec_qty: Sequelize.FLOAT,
      exec_fee:  Sequelize.FLOAT,
      exec_value: Sequelize.FLOAT,
      leaves_qty: Sequelize.FLOAT,
      closed_size: Sequelize.FLOAT,
      last_liquidity_ind: Sequelize.STRING,
      trade_time: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('TradeTransaction');
    await queryInterface.dropTable('Trade');
    await queryInterface.dropTable('Tags');
    await queryInterface.dropTable('Pair');
    await queryInterface.dropTable('JournalItem');
    await queryInterface.dropTable('Idea');
    await queryInterface.dropTable('File');
    await queryInterface.dropTable('Comment');
    await queryInterface.dropTable('Broker');
    await queryInterface.dropTable('Notes');
    await queryInterface.dropTable('Note');
    await queryInterface.dropTable('Tag');
    await queryInterface.dropTable('Token');
    await queryInterface.dropTable('User');
  }
};
