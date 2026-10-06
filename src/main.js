import express from 'express'
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  AggregateError as SequelizeAggregateError,
} from 'sequelize'
import { PORT } from './config/config.service.js'
import { connectDB } from './db/connection.js'
import './db/models/index.js' // registers the models + relations before sync()
import { userRouter, postRouter, commentRouter } from './module/index.js'

const bootstrap = async () => {
  const app = express()

  app.use(express.json())
  app.use((req, res, next) => {
    req.body ??= {}
    next()
  })

  app.use(['/users', '/user'], userRouter)
  app.use('/posts', postRouter)
  app.use('/comments', commentRouter)
  
  app.use((error, req, res, next) => {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ message: 'Email already exists.' })
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((item) => item.message),
      })
    }
    if (error instanceof SequelizeAggregateError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.flatMap(
          (item) => item.errors?.errors?.map((e) => e.message) ?? [item.message]
        ),
      })
    }
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({ message: 'The referenced user or post does not exist.' })
    }
    // e.g. malformed JSON body
    if (error.status && error.status < 500) {
      return res.status(error.status).json({ message: error.message })
    }

    console.error(error)
    return res.status(500).json({ message: 'Internal server error', error: error.message })
  })

  await connectDB()
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error)
  process.exit(1)
})
