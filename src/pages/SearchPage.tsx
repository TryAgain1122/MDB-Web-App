import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import { IoSearchOutline } from "react-icons/io5";

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
  const query = new URLSearchParams(location.search).get("query") || "";
  const [data, setData] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchData = useCallback(async (searchQuery: string, pageNum: number, reset = false) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get("/search/multi", {
        params: {
          query: searchQuery,
          page: pageNum,
        },
      });

      const results = response.data.results || [];
      const total = response.data.total_results || 0;
      const totalPages = response.data.total_pages || 1;

      setData(prev => reset ? results : [...prev, ...results]);
      setTotalResults(total);
      setHasMore(pageNum < totalPages);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset and fetch when query changes
  useEffect(() => {
    if (query) {
      setPage(1);
      setData([]);
      setHasMore(true);
      fetchData(query, 1, true);
    }
  }, [query, fetchData]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && query) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchData(query, nextPage);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, page, query, fetchData]);

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <IoSearchOutline className="text-2xl text-neutral-400" />
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Search Results
            </h1>
          </div>
          {query && (
            <p className="text-neutral-400">
              {loading && data.length === 0 ? (
                "Searching..."
              ) : (
                <>
                  Found <span className="text-white font-medium">{totalResults}</span> results for{" "}
                  <span className="text-white font-medium">"{query}"</span>
                </>
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && data.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-neutral-800 rounded-xl" />
                <div className="mt-3 h-4 bg-neutral-800 rounded w-3/4" />
                <div className="mt-2 h-3 bg-neutral-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {data.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {data.map((searchData) => (
              <Card
                key={`${searchData.media_type}-${searchData.id}`}
                data={searchData}
                media_type={searchData.media_type}
                trending={false}
              />
            ))}
          </div>
        )}

        {/* Load More Trigger */}
        {hasMore && data.length > 0 && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loading && (
              <div className="flex items-center gap-3 text-neutral-400">
                <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && data.length === 0 && query && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-neutral-800/50 rounded-full flex items-center justify-center mb-6">
              <IoSearchOutline className="text-4xl text-neutral-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No results found
            </h3>
            <p className="text-neutral-500 text-center max-w-md">
              We couldn't find any movies or TV shows matching "{query}". Try different keywords or check your spelling.
            </p>
          </div>
        )}

        {/* Empty Query State */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-neutral-800/50 rounded-full flex items-center justify-center mb-6">
              <IoSearchOutline className="text-4xl text-neutral-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Start searching
            </h3>
            <p className="text-neutral-500 text-center max-w-md">
              Use the search bar above to find your favorite movies and TV shows.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
