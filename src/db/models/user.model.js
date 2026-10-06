import { DataTypes } from 'sequelize'
import { sequelize } from '../connection.js'
import { emailValidation } from '../../common/email.validator.js'
import { checkPasswordLength as validatePasswordLength } from '../../common/password.validator.js'
import { checkNameLength } from '../../common/name.validator.js'

export const UserModel = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
    name: { type: DataTypes.STRING },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: emailValidation, 
    },
    password: { type: DataTypes.STRING },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    validate: {
      
      checkPasswordLength() {
        validatePasswordLength(this.password)
      },
    },
    hooks: {
      beforeCreate: (user) => checkNameLength(user.name),
    },
  }
)
