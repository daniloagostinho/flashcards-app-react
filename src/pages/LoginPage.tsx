import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('https://backend-flashcards-app.vercel.app/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token); // Save token to local storage
                toast.success('Login successful! Redirecting...', {
                    position: 'top-center',
                    autoClose: 3000,
                });

                setTimeout(() => {
                    navigate('/app');
                }, 3000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to log in', {
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('An error occurred. Please try again.', {
                position: 'top-center',
            });
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
            <ToastContainer />
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Login</h1>
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
            >
                <div className="mb-4">
                    <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full py-3 rounded-lg text-lg font-semibold flex items-center justify-center ${loading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    disabled={loading}
                >
                    {loading ? (
                        <span>Loading...</span>
                    ) : (
                        'Login'
                    )}
                </button>
                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?{' '}
                    <a
                        href="/signup"
                        className="text-blue-500 hover:underline"
                    >
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;