import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      const data = await res.json();

      if (!data.docs || data.docs.length === 0) {
        setError("No books found");
      } else {
        setBooks(data.docs.slice(0, 12)); // top 12 results
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center">
        📚 Book Finder
      </h1>

      <div className="flex justify-center mb-8">
        <div className="relative w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a book..."
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 w-full focus:outline-none shadow-sm"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </div>
        <button
          onClick={fetchBooks}
          className="ml-4 px-5 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition-colors"
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="flex justify-center space-x-2 mb-6">
          <div className="w-4 h-4 rounded-full animate-pulse bg-purple-500"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-purple-600"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-purple-700"></div>
        </div>
      )}

      {error && <p className="text-center text-red-600 mb-6">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center gap-4 hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="w-32 h-48 object-cover rounded"
              />
            ) : (
              <div className="w-32 h-48 bg-gray-300 rounded flex items-center justify-center text-sm">
                No Cover
              </div>
            )}
            <h2 className="font-semibold text-center">{book.title}</h2>
            <p className="text-sm text-gray-700 font-medium text-center">
              {book.author_name ? book.author_name[0] : "Unknown Author"}
            </p>
            <p className="text-xs text-gray-500 text-center">
              {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

