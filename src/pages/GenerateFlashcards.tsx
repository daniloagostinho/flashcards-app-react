import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook useNavigate

interface Flashcard {
  id: number;
  word: string;
  translation: string;
}

const GenerateFlashcards: React.FC = () => {

    const [word, setWord] = useState<string>('');
    const [translation, setTranslation] = useState<string | null>(null);

    const navigate = useNavigate(); // Usando o hook useNavigate para navegação

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login'); // Navegar para a página de login
    };

    const handleSearch = async () => {
        if (!word.trim()) {
            alert('Por favor, introduza uma palavra.');
            return;
        }

        try {
            // Usar o sistema de tradução do backend
            const response = await fetch(`http://localhost:8000/translation/${encodeURIComponent(word.toLowerCase())}`);
            if (response.ok) {
                const data = await response.json();
                setTranslation(data.translation);
            } else {
                alert('Falha ao obter a tradução. Por favor, tente novamente.');
                setTranslation(null);
            }
        } catch (error) {
            console.error('Erro ao buscar a tradução:', error);
            alert('Falha ao obter a tradução. Por favor, tente novamente.');
            setTranslation(null);
        }
    };

    const handleSave = async () => {
        if (translation) {
            try {
                const newFlashcard = { word: word };
                const response = await fetch('http://localhost:8000/flashcards', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newFlashcard),
                });

                if (response.ok) {
                    setWord('');
                    setTranslation(null);
                    alert('Flashcard salvo com sucesso!');
                } else {
                    alert('Falha ao salvar o flashcard.');
                }
            } catch (error) {
                console.error('Erro ao guardar o flashcard:', error);
                alert('Falha ao salvar o flashcard.');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWord(e.target.value);

        if (e.target.value === '') {
            setTranslation(null);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 sm:p-6 font-poppins text-gray-800">
            {/* Header com navegação */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/app')}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                    >
                        <span>←</span>
                        <span>Voltar</span>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">✨ Gerar Flashcards</h1>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>

            {/* Conteúdo principal */}
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)]">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
                    Crie seus flashcards personalizados
                </h2>

                {/* Campo de busca */}
                <div className="w-full max-w-2xl mb-8">
                    <input
                        type="text"
                        placeholder="Digite uma palavra em inglês (ex: car, house, beautiful)"
                        value={word}
                        onChange={handleInputChange}
                        className="w-full h-16 px-6 text-xl font-semibold text-gray-700 placeholder-gray-500 bg-white border-4 border-transparent rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                </div>

                {/* Botões de ação */}
                <div className="flex flex-wrap gap-4 justify-center mb-8">
                    <button
                        onClick={handleSearch}
                        disabled={!word.trim()}
                        className={`px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
                            word.trim()
                                ? 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 shadow-lg text-white transform hover:scale-105'
                                : 'bg-gray-400 cursor-not-allowed text-white'
                        }`}
                    >
                        <span>🔍</span>
                        <span>Buscar Tradução</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!translation}
                        className={`px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
                            translation
                                ? 'bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 shadow-lg text-white transform hover:scale-105'
                                : 'bg-gray-400 cursor-not-allowed text-white'
                        }`}
                    >
                        <span>💾</span>
                        <span>Salvar Flashcard</span>
                    </button>
                </div>

                {/* Exibição do resultado da busca */}
                {translation && (
                    <div className="w-full max-w-md">
                        <div className="flex flex-col items-center justify-center w-full h-56 bg-white rounded-3xl shadow-lg p-4 transform hover:scale-105 transition-all duration-300">
                            <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                                <div className="text-6xl">📚</div>
                            </div>
                            <p className="mt-4 text-xl font-semibold text-gray-800">{word}</p>
                            <p className="text-lg text-blue-600 font-semibold mt-2">{translation}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateFlashcards;