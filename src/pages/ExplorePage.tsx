import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

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
  const [totalPages, setTotalPages] = useState(0); // Now used in scrolling logic

  const params = useParams<{ explore?: string }>();
  const exploreType = params.explore;

  const fetchData = async () => {
    if (exploreType !== "tv" && exploreType !== "movie") return;

    try {
      const response = await axios.get(`/discover/${exploreType}`, {
        params: { page: pageNo },
      });

      setData((prev) => [...prev, ...response.data.results]);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 &&
      pageNo < totalPages
    ) {
      setPageNo((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo, exploreType]); // Added exploreType to prevent stale data issues

  useEffect(() => {
    setPageNo(1);
    setData([]);
  }, [exploreType]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup listener
  }, [pageNo, totalPages]);

  if (!exploreType || (exploreType !== "tv" && exploreType !== "movie")) {
    return <div>Error: Invalid Explore Type</div>;
  }

  return (
    <div className="py-16">
      <div className="container mx-auto">
        <h3 className="uppercase text-lg lg:text-xl font-semibold my-3">
          {exploreType} show
        </h3>
        <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start">
          {data.map((exploreData) => (
            <Card
              key={exploreData.id}
              data={exploreData}
              media_type={exploreType}
              trending={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
