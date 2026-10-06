import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../connection.js'

export class CommentModel extends Model {}

CommentModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    postId: { type: DataTypes.INTEGER, allowNull: false }, 
    userId: { type: DataTypes.INTEGER, allowNull: false }, 
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
  }
)
