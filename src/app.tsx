import React, { useState } from 'react';
import { BookOpen, Send, Sparkles } from 'lucide-react';
import { marked } from 'marked';
import { Tutorial } from './types';
import { generateTutorial } from './services/openai';

function App() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);

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
      setTutorials(prevTutorials => [
        { ...newTutorial, content, isLoading: false },
        ...prevTutorials.slice(1)
      ]);
    } catch (error) {
      setTutorials(prevTutorials => [
        { ...newTutorial, error: (error as Error).message, isLoading: false },
        ...prevTutorials.slice(1)
      ]);
    } finally {
      setTopic('');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tutorial Generator
            </h1>
            <p className="text-lg text-gray-600">
              Transform any topic into a comprehensive tutorial with AI.
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mb-12">
            <div className="flex gap-4">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g., 'API, GenerativeAI')"
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

          {/* Tutorial List */}
          <div className="space-y-6">
            {tutorials.map((tutorial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {tutorial.topic}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Generated on {tutorial.timestamp}
                    </p>
                    {tutorial.isLoading ? (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-2/3 mt-2 animate-pulse" />
                      </div>
                    ) : tutorial.error ? (
                      <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                        {tutorial.error}
                      </div>
                    ) : (
                      <div 
                        className="mt-4 p-4 bg-gray-50 rounded-lg prose prose-indigo max-w-none"
                        dangerouslySetInnerHTML={{ __html: marked(tutorial.content || '') }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {tutorials.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No tutorials yet
                </h3>
                <p className="text-gray-500">
                  Enter a topic above to generate your first tutorial
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;