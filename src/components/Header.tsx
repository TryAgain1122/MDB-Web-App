import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { navigations } from "../constants/navigation";
import { IoIosSearch } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";

const Header = () => {
  const location = useLocation();
  const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ");
  const [searchInput, setSearchInput] = useState(removeSpace || "");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([])
  const [error, setError] = useState<string | null>(null);

  // Update search input when URL changes
  useEffect(() => {
    const timer = setTimeout(() => {
        if (searchInput.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`)
            fetchData(searchInput.trim())
        } else {
            navigate('/')
        }
    }, 500)
    return () => clearTimeout(timer);
  }, [searchInput, navigate]);

  const fetchData = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
        const response = await axios.get('/search/multi', {
            params: { query, page: 1},
        })
        setData(response.data.results);
    } catch (error) {
        setError("Error Fetching Data")
    } finally {
        setLoading(false);
    }
  }

  // Handle form submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="fixed top-0 z-40 h-14 bg-black bg-opacity-70 w-full">
      <div className="container mx-auto flex items-center h-full px-4">
        <Link to="/">
          <img
            src="/Images/logo.png"
            alt="Logo"
            className="h-8 filter grayscale brightness-0 invert"
          />
        </Link>
        <nav className="hidden lg:flex items-center gap-1 ml-5">
          {navigations.map((nav, index) => (
            <div key={`${nav.label}headers${index}`}>
              <NavLink
                to={nav.href}
                className={({ isActive }) =>
                  `px-2 text-neutral-50 hover:text-neutral-200 ${
                    isActive && "text-neutral-200"
                  }`
                }
              >
                {nav.label}
              </NavLink>
            </div>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-5">
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search here..."
              className="bg-transparent px-4 py-1 outline-none border-none hidden lg:block text-white"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
             <input
              type="text"
              placeholder="Search here..."
              className="bg-transparent px-4 py-1 outline-none border-none lg:hidden block text-white"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <button
              className="hidden lg:block text-2xl text-white active:scale-50 transition-all"
              type="submit"
              onClick={() => handleSubmit}
            >
              <IoIosSearch />
            </button>
          </form>
          
          <div className="rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all text-white">
            <RxAvatar size={30} />
          </div>
        </div>
      </div>

    {loading && <Loader />}
    {error && <p>{error}</p>}
    </div>
  );
};

export default Header;
