import React, { useState } from 'react';

const SignUpPage: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('https://backend-flashcards-app.vercel.app/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage('User registered successfully!');
                setName('');
                setEmail('');
                setPassword('');
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Failed to register user');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Sign Up</h1>
            <form
                onSubmit={handleSignUp}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
            >
                <div className="mb-4">
                    <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
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
                    className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600"
                >
                    Sign Up
                </button>
                {message && (
                    <p className="mt-4 text-center text-blue-600 font-semibold">{message}</p>
                )}
            </form>
        </div>
    );
};

export default SignUpPage;
