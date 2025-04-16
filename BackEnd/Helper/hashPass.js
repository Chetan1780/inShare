const argon2 = require('argon2');
const hashPassword = async (password)=>{
    return await argon2.hash(password);
}
const verifyPassword = async (hash,pass)=>{
    const flag = await argon2.verify(hash,pass);
    return flag;
}
module.exports = {hashPassword,verifyPassword};