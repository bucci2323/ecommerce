import { Model, DataTypes, Sequelize } from 'sequelize';

export class Category extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public parentId!: number | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    Category.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'categories',
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
        tableName: 'categories',
        timestamps: true,
      }
    );
  }

  static associate(models: any) {
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products',
    });
    Category.belongsTo(models.Category, {
      foreignKey: 'parentId',
      as: 'parent',
    });
    Category.hasMany(models.Category, {
      foreignKey: 'parentId',
      as: 'subcategories',
    });
  }
} 