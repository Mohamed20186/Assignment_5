import { Sequelize } from 'sequelize'
import mysql from 'mysql2/promise'
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } from '../config/config.service.js'

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
})

export const connectDB = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  })
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``)
  await connection.end()

  await sequelize.authenticate()
  
  await sequelize.sync()
  console.log('Database connected and tables are in sync')
}
