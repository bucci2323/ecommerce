import { Model, DataTypes, Sequelize } from 'sequelize';

export class Cart extends Model {
  public id!: number;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    Cart.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
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
        tableName: 'carts',
        timestamps: true,
      }
    );
  }

  static associate(models: any) {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cartId',
      as: 'cartItems',
    });
  }
} 