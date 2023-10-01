// import 'dotenv/config';
import bcrypt from 'bcrypt';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT_HASH)));

export const validatePassword = (passwordSend, passwordBD) => bcrypt.compareSync(passwordSend, passwordBD);
