import { ValidationError, ValidationErrorItem } from 'sequelize'

export const checkNameLength = (name) => {
  if (typeof name !== 'string' || name.trim().length <= 2) {
    const message = 'Name must be greater than 2 characters'
    throw new ValidationError(message, [
      new ValidationErrorItem(message, 'Validation error', 'name', name, null, 'checkNameLength'),
    ])
  }
}
