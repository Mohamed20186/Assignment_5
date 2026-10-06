import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../connection.js'

export class PostModel extends Model {}

PostModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }, 
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true, 
    paranoid: true, 
  }
)
