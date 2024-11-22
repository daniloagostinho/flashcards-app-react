import React from 'react';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800 font-poppins">
            {/* Header */}
            <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
                <h1 className="text-2xl font-bold text-blue-600">FlashLearn</h1>
                <nav className="flex space-x-4">
                    <a
                        href="/login"
                        className="text-lg font-semibold text-blue-500 hover:text-blue-700"
                    >
                        Login
                    </a>
                    <a
                        href="/signup"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md"
                    >
                        Sign Up
                    </a>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 py-12">
                <div className="max-w-lg">
                    <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
                        Learn English Visually
                    </h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Associate words with images to boost your memory and language
                        skills. Start learning English in a fun and interactive way today!
                    </p>
                    <a
                        href="/app"
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white text-lg rounded-lg shadow-md hover:from-blue-600 hover:to-green-600"
                    >
                        Start Learning Now
                    </a>
                </div>
                <img
                    src="/assets/img/learning.jpg"
                    alt="Learning illustration"
                    className="w-full sm:w-[600px] h-auto sm:h-[400px] mt-8 md:mt-0 md:ml-8 rounded-lg shadow-lg"
                />

            </section>

            {/* Features Section */}
            <section className="px-6 py-12 bg-white">
                <h3 className="text-3xl font-bold text-center text-blue-600 mb-8">
                    Why Choose FlashLearn?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-blue-50 rounded-lg shadow-md">
                        <img
                            src="https://source.unsplash.com/100x100/?memory"
                            alt="Memory"
                            className="mx-auto mb-4"
                        />
                        <h4 className="text-xl font-bold text-blue-700">Boost Memory</h4>
                        <p className="text-gray-600">
                            Strengthen your memory by associating words with vivid images.
                        </p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-lg shadow-md">
                        <img
                            src="https://source.unsplash.com/100x100/?language"
                            alt="Language"
                            className="mx-auto mb-4"
                        />
                        <h4 className="text-xl font-bold text-blue-700">Interactive Learning</h4>
                        <p className="text-gray-600">
                            Learn interactively with flashcards and engaging visuals.
                        </p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-lg shadow-md">
                        <img
                            src="https://source.unsplash.com/100x100/?mobile"
                            alt="Responsive"
                            className="mx-auto mb-4"
                        />
                        <h4 className="text-xl font-bold text-blue-700">Learn Anywhere</h4>
                        <p className="text-gray-600">
                            Accessible on mobile and desktop for learning on the go.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-600 text-white text-center py-4">
                <p>&copy; 2024 FlashLearn. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
