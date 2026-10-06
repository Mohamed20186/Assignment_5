import { UserModel } from '../../db/models/index.js'

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body

  if (typeof email === 'string') {
    const emailExists = await UserModel.findOne({ where: { email } })
    if (emailExists) {
      return res.status(409).json({ message: 'Email already exists.' })
    }
  }

  const user = UserModel.build({ name, email, password, role })
 
  await user.save()

  return res.status(201).json({ message: 'User added successfully.' })
}

export const createOrUpdateUser = async (req, res) => {
  const { id } = req.params
  const { name, email, password, role } = req.body 

  if (typeof email !== 'string' || !email) {
    return res.status(400).json({ message: 'email is required....!!' })
  }

  const values = Object.fromEntries(
    Object.entries({ id, name, email, password, role }).filter(([, value]) => value !== undefined)
  )

  await UserModel.upsert(values, { validate: false })

  return res.status(200).json({ message: 'User created or updated successfully...!!!' })
}

export const getUserByEmail = async (req, res) => {
  const { email } = req.query
  if (typeof email !== 'string' || !email) {
    return res.status(400).json({ message: 'email query parameter is required......' })
  }

  const user = await UserModel.findOne({
    where: { email },
    attributes: { exclude: ['password'] }, 
  })
  if (!user) {
    return res.status(404).json({ message: 'no user found......' })
  }

  return res.status(200).json({ user })
}


export const getUserById = async (req, res) => {
  const { id } = req.params

  const user = await UserModel.findByPk(id, {
    attributes: { exclude: ['role', 'password'] },
  })
  if (!user) {
    return res.status(404).json({ message: 'no user found' })
  }

  return res.status(200).json(user)
}
