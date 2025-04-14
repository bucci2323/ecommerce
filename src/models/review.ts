import { Model, DataTypes, Sequelize } from 'sequelize';

export class Review extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public rating!: number;
  public comment!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    Review.init(
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
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id',
          },
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 5,
          },
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'reviews',
        timestamps: true,
      }
    );
  }

  static associate(models: any) {
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Review.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
} 