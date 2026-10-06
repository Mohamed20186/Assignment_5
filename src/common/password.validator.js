
export const checkPasswordLength = (value) => {
  if (typeof value !== 'string' || value.length <= 6) {
    throw new Error('Password must be greater than 6 characters')
  }
}
