import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';


export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

export const randomPassword = generateRandomPassword(10);
console.log(randomPassword);

export default __dirname;