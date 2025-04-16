import React, { useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { loginSuccess } from '@/redux/user/user.slice';
import { showToast } from '@/Helper/ShowToast';

const passwordSchema = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' });


const signupSchema = z
    .object({
        name: z.string().min(1, { message: 'Name is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });
    const loginSchema = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(1, { message: 'Password is required' }),
    });
    
    function RegisterPage() {
        const [isLogin, setIsLogin] = useState(true);
        const [errors, setErrors] = useState({});
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        const nameInputRef = useRef(null);
        const emailInputRef = useRef(null);
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const user = useSelector((state) => state.user);

    if(user && user.isLoggedIn){
        return navigate('/');
    }        
    
    useEffect(() => {
        if (isLogin) {
            emailInputRef.current?.focus();
        } else {
            nameInputRef.current?.focus();
        }
    }, [isLogin]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const schema = isLogin ? loginSchema : signupSchema;
        try {
            schema.parse(data);
            
            // console.log("hit api");
            
            const api = isLogin ? 'api/user/login' : 'api/user/register';
            const resp = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/${api}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            
            
            if (!resp.ok) {
                throw new Error('Something went wrong');
            }
            const temp = await resp.json();
            if(isLogin && resp.ok){
                showToast('success',temp.message)
                dispatch(loginSuccess(temp.user));
                navigate('/')
            }
            if(!isLogin && resp.ok){
                showToast('success',temp.message)
                setIsLogin(true);
            } 

            // console.log('Form submitted:', data);
        } catch (err) {
            showToast('error', err.message);
            if (err instanceof z.ZodError) {
                const errorMap = {};
                err.errors.forEach((error) => {
                    errorMap[error.path[0]] = error.message;
                });
                setErrors(errorMap);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Inshare</h1>

                <div className="flex justify-center mb-6 space-x-2">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Signup
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    ref={nameInputRef}
                                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                ref={emailInputRef}
                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="pl-10 pr-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {!isLogin && (
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="pl-10 pr-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium"
                    >
                        {isLogin ? 'Login' : 'Signup'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;