import bcrypt from 'bcrypt'

export const hashPassword = (rawString: string) => bcrypt.hashSync(rawString, 10)
export const verifyPassword = (rawString: string, hash: string) => bcrypt.compareSync(rawString, hash)
