import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { navigations } from "../constants/navigation";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { FormEvent, useEffect, useState, useRef } from "react";
import axios from "axios";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
}

const Header = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [searchInput, setSearchInput] = useState(query);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync search input with URL query
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim()) {
        fetchData(searchInput.trim());
        setShowSuggestions(true);
      } else {
        setData([]);
        setShowSuggestions(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchData = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await axios.get("/search/multi", {
        params: { query: searchQuery, page: 1 },
      });
      setData(response.data.results?.slice(0, 8) || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item: SearchResult) => {
    navigate(`/${item.media_type}/${item.id}`);
    setShowSuggestions(false);
    setSearchInput("");
  };

  const clearSearch = () => {
    setSearchInput("");
    setData([]);
    setShowSuggestions(false);
  };

  return (
    <header className="fixed top-0 z-50 h-16 w-full bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto flex items-center h-full px-4">
        <Link to="/" className="flex-shrink-0">
          <img
            src="/Images/logo.png"
            alt="Logo"
            className="h-9 filter grayscale brightness-0 invert hover:opacity-80 transition-opacity"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-8">
          {navigations.map((nav) => (
            <NavLink
              key={nav.href}
              to={nav.href}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div ref={searchRef} className="relative">
            <form className="flex items-center" onSubmit={handleSubmit}>
              <div className="relative flex items-center">
                <IoIosSearch className="absolute left-3 text-neutral-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search movies & TV..."
                  className="w-48 lg:w-64 bg-white/10 pl-10 pr-10 py-2 rounded-full text-sm text-white placeholder-neutral-500 outline-none border border-transparent focus:border-white/20 focus:bg-white/15 focus:w-72 transition-all duration-300"
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                  onFocus={() => data.length > 0 && setShowSuggestions(true)}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 text-neutral-400 hover:text-white transition-colors"
                  >
                    <IoMdClose />
                  </button>
                )}
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (searchInput.trim() || data.length > 0) && (
              <div className="absolute top-full mt-2 w-80 bg-neutral-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                ) : data.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {data.map((item) => (
                      <div
                        key={`${item.media_type}-${item.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <div className="w-12 h-16 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                          {item.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                              alt={item.title || item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {item.title || item.name}
                          </p>
                          <p className="text-neutral-500 text-xs mt-0.5">
                            {item.media_type === "movie" ? "Movie" : "TV Show"} •{" "}
                            {(item.release_date || item.first_air_date)?.slice(0, 4) || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
                        setShowSuggestions(false);
                      }}
                      className="w-full py-3 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/10"
                    >
                      View all results for "{searchInput}"
                    </button>
                  </div>
                ) : searchInput.trim() ? (
                  <div className="py-8 text-center text-neutral-500 text-sm">
                    No results found for "{searchInput}"
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-white/20 transition-all text-white">
            <RxAvatar size={32} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
