import { Model, DataTypes, Sequelize } from 'sequelize';

export class OrderItem extends Model {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public price!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    OrderItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'orders',
            key: 'id',
          },
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id',
          },
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,

        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,

        },
      },
      {
        sequelize,
        tableName: 'order_items',
        timestamps: true,
      }
    );
  }

  static associate(models: any) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
} 