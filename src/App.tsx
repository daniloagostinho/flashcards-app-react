import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

const App: React.FC = () => {

  const navigate = useNavigate(); // Use o hook useNavigate para navegação

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 sm:p-6 font-poppins text-gray-800">

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text">
        Welcome, human being!
      </h1>

      <p>Choose a type of feature to learn English</p>

      {/* Botões grandes e ajustados ao conteúdo */}
      <div className="flex flex-col gap-8 mt-8">
        <button
          onClick={() => navigate('/generate')} // Navega para "Gerar Flashcards"
          className="inline-flex items-center justify-center py-4 px-6 text-2xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 rounded-xl shadow-md transition-all duration-300"
        >
          Gerar Flashcards
        </button>

        <button
          onClick={() => navigate('/flashcards')} // Navega para "Flashcards Prontos"
          className="inline-flex items-center justify-center py-4 px-6 text-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 rounded-xl shadow-md transition-all duration-300"
        >
          Flashcards Prontos
        </button>
      </div>

    </div>
  );
};

export default App;
