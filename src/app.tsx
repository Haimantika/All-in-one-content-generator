import React, { useState } from 'react';
import { BookOpen, Send, Sparkles, Menu, X } from 'lucide-react';
import { marked } from 'marked';
import { Tutorial } from './types';
import { generateTutorial } from './services/openai';

function App() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    const newTutorial: Tutorial = {
      topic,
      timestamp: new Date().toLocaleString(),
      isLoading: true
    };

    setTutorials([newTutorial, ...tutorials]);
    
    try {
      const content = await generateTutorial(topic);
      const completedTutorial = { ...newTutorial, content, isLoading: false };
      setTutorials(prevTutorials => [
        completedTutorial,
        ...prevTutorials.slice(1)
      ]);
      setSelectedTutorial(completedTutorial);
    } catch (error) {
      const failedTutorial = { 
        ...newTutorial, 
        error: (error as Error).message, 
        isLoading: false 
      };
      setTutorials(prevTutorials => [
        failedTutorial,
        ...prevTutorials.slice(1)
      ]);
      setSelectedTutorial(failedTutorial);
    } finally {
      setTopic('');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 z-50"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Tutorial History</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="space-y-3">
            {tutorials.map((tutorial, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedTutorial(tutorial);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedTutorial === tutorial
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <h3 className="font-medium truncate">{tutorial.topic}</h3>
                <p className="text-sm text-gray-500">{tutorial.timestamp}</p>
              </button>
            ))}
            {tutorials.length === 0 && (
              <p className="text-gray-500 text-center py-4">No tutorials yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All-in-one Content Generator
            </h1>
            <p className="text-lg text-gray-600">
              Transform any topic into a comprehensive tutorial with AI
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mb-12">
            <div className="flex gap-4">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g., 'Building a REST API with Node.js')"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Selected Tutorial Content */}
          {selectedTutorial ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="p-2 bg-indigo-100 rounded-lg self-start flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0"> {/* Added min-w-0 to handle text overflow */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 break-words">
                    {selectedTutorial.topic}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Generated on {selectedTutorial.timestamp}
                  </p>
                  {selectedTutorial.isLoading ? (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 mt-2 animate-pulse" />
                    </div>
                  ) : selectedTutorial.error ? (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm sm:text-base">
                      {selectedTutorial.error}
                    </div>
                  ) : (
                    <div className="mt-4 relative">
                      <div 
                        className="p-4 bg-gray-50 rounded-lg prose prose-sm sm:prose prose-indigo max-w-none overflow-x-auto whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{ __html: marked(selectedTutorial.content || '') }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                No tutorial selected
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                Generate a new tutorial or select one from the history
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;