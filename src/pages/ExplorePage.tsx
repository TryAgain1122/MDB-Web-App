import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { MdMovie, MdTv } from "react-icons/md";

type MediaType = "tv" | "movie";

interface DataResults {
  id: string;
  poster_path?: string | undefined;
  title?: string;
  name?: string;
  release_date: string;
  vote_average: number;
  media_type: MediaType;
}

const ExplorePage = () => {
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState<DataResults[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const params = useParams<{ explore?: string }>();
  const exploreType = params.explore as MediaType;

  const fetchData = useCallback(async (page: number, reset = false) => {
    if (exploreType !== "tv" && exploreType !== "movie") return;

    setLoading(true);
    try {
      const response = await axios.get(`/discover/${exploreType}`, {
        params: { page },
      });

      setData((prev) => reset ? response.data.results : [...prev, ...response.data.results]);
      setTotalPages(response.data.total_pages);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [exploreType]);

  useEffect(() => {
    setPageNo(1);
    setData([]);
    fetchData(1, true);
  }, [exploreType, fetchData]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && pageNo < totalPages) {
          const nextPage = pageNo + 1;
          setPageNo(nextPage);
          fetchData(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, pageNo, totalPages, fetchData]);

  if (!exploreType || (exploreType !== "tv" && exploreType !== "movie")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-neutral-500">
        <p className="text-xl">Invalid page type</p>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          {exploreType === "movie" ? (
            <MdMovie className="text-3xl text-white" />
          ) : (
            <MdTv className="text-3xl text-white" />
          )}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              {exploreType === "movie" ? "Movies" : "TV Shows"}
            </h1>
            <p className="text-neutral-500 text-sm">
              Discover popular {exploreType === "movie" ? "movies" : "TV shows"}
            </p>
          </div>
        </div>

        {/* Loading skeleton for initial load */}
        {loading && data.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-neutral-800 rounded-xl" />
                <div className="mt-3 h-4 bg-neutral-800 rounded w-3/4" />
                <div className="mt-2 h-3 bg-neutral-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Content Grid */}
        {data.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {data.map((exploreData) => (
              <Card
                key={exploreData.id}
                data={exploreData}
                media_type={exploreType}
                trending={false}
              />
            ))}
          </div>
        )}

        {/* Load More Trigger */}
        {pageNo < totalPages && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loading && (
              <div className="flex items-center gap-3 text-neutral-400">
                <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
