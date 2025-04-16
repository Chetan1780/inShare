const handleError = require('../Helper/handleError');
const User = require('../models/user');
const { hashPassword, verifyPassword } = require('../Helper/hashPass');
const jwt = require('jsonwebtoken');
const register = async (req, res, next) => {
    try {
        // console.log('Enter register API!!');
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            next(handleError(409, 'User already Registered!!'));
        }
        const hashPass = await hashPassword(password);
        const user = new User({
            name,
            email,
            password: hashPass
        });
        await user.save();
        return res.status(201).json({
            success: true,
            message: "Registration successfull!!"
        })

    } catch (error) {
        next(handleError(500, error.message));
    }
}
const login = async (req, res, next) => {
    try {
        // console.log('Enter Login API!!');
        const { email, password } = req.body;
        const getUser = await User.findOne({ email });
        if (!getUser) {
            next(handleError(404, 'Invalid Login Credential!!'));
        }
        const hashpass = getUser.password;
        const flag = await verifyPassword(hashpass, password);
        if (!flag) {
            next(handleError(404, 'Invalid Login Credential!!'));
        }
        const jwtToken = jwt.sign({
            id: getUser._id,
            name: getUser.name,
        }, process.env.JWT_SECRET, { expiresIn: '10d' });

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'?'none':'strict',
            path:'/',
            maxAge: 10 * 24 * 60 * 60 * 1000,
        });

        const newUser = getUser.toObject({ getters: true });
        delete newUser.password;
        res.status(200).json({
            success: true,
            user: newUser,
            message: 'Login SuccessFull'
        })
    } catch (error) {
        next(handleError(500, error.message));
    }
}
const logout = (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production'?'none':'strict',
    //   path:'/', 
    });
  
    res.json({ message: 'Logged out successfully' });
  };
  
module.exports = { register, login,logout};