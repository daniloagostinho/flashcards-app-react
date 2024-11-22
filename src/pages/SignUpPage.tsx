import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // React Spinner

const SignUpPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch('https://backend-flashcards-app.vercel.app/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        toast.success('Registration successful! Redirecting to login...', {
          position: "top-center",
          autoClose: 10000,
        });

        setTimeout(() => {
          navigate('/login');
        }, 10000);

        setName('');
        setEmail('');
        setPassword('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to register user', {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('An error occurred. Please try again.', {
        position: "top-center",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <ToastContainer />
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
          className={`w-full py-3 rounded-lg text-lg font-semibold flex items-center justify-center ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
