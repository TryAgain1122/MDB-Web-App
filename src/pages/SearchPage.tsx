import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";

type MediaType = "tv" | "movie";

interface SearchResult {
  id: string;
  poster_path?: string | undefined;
  title?: string;
  name?: string;
  release_date: string;
  vote_average: number;
  media_type: MediaType;
}

const SearchPage = () => {
  const location = useLocation();
  const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ");
  const [searchInput, setSearchInput] = useState(removeSpace || "");
  const navigate = useNavigate();
  const [data, setData] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1); 
  const query = new URLSearchParams(location.search).get("query");;

    //Update Search every hit the keyboard 
    useEffect(() => {
      const timer = setTimeout(() => {
        if (searchInput.trim()) {
          navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`)
          // fetchData(searchInput.trim())
        } else {
          navigate('/')
        }
      },500)
      return () => clearTimeout(timer)
    },[searchInput, navigate])
  const fetchData = async () => {
    try {
      const response = await axios.get("/search/multi", {
        params: {
          query: query,
          page: page,
        },
      });
      setData((prev) => [...prev, ...response.data.results]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    if (query) {
      setPage(1);
      setData([]);
      fetchData();
    }
  }, [query]);

  // const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const searchQuery = event.target.value;
  //   if (searchQuery.trim()) {
  //     navigate(`/search?q=${searchQuery}`);
  //   } else {
  //     navigate(`/search`);
  //   }
  // };

  return (
    <div className="pt-16">
      <div className="container mx-auto">
        <h3 className="uppercase px-4 text-lg my-3 font-semibold">
          Search Result
        </h3>
       { data.length > 0 ? (
         <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-center my-3">
         {data.map((searchData, index) => (
           <Card
             key={index}
             data={searchData}
             media_type={searchData.media_type}
             trending={false}
           />
         ))}
       </div>
       ): (
        <div className="text-center my-10 text-lg font-medium text-gray-500">
          No Results found for "{query}" 
        </div>
       )}
      </div>
    </div>
    // <div className="pt-16 px-4 mx-auto">
    //   <div className="lg:hidden my-2 mx-1 sticky top-[70px] z-30">
    //     <input
    //       type="text"
    //       placeholder="Search here..."
    //       onChange={handleInputChange}
    //       className='px-4 py-1 text-lg w-full bg-white rounded-full text-neutral-900'
    //     />
    //   </div>
    //   <div className="container mx-auto">
    //     <h3 className="capitalize text-lg lg:text-xl font-semibold my-3">
    //       Search Result
    //     </h3>
    //     <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start mx-auto">
    //       {data.map((searchData, index) => (
    //         <Card
    //           data={searchData}
    //           key={`${searchData.id}-${index}`}
    //           media_type={searchData.media_type}
    //           trending={false}
    //           index={index}
    //         />
    //       ))}
    //     </div>
    //   </div>
    // </div>
  );
};

export default SearchPage;
