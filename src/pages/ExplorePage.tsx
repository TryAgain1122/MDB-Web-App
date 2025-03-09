import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

type MediaType = "tv" | "movie"
interface DataResults{
  id: string
  poster_path?: string | undefined;
  title?: string;
  name?: string;
  release_date: string;
  vote_average: Number;
  media_type: MediaType
}
const ExplorePage = () => {
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState<DataResults[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const params = useParams<{explore?: string}>();
  const exploreType = params.explore;
  console.log("PARAMS", params.explore);
   
  const fetchData = async () => {
    try {
      if (exploreType === "tv" || exploreType === "movie") {
        const response = await axios.get(`/discover/${params.explore}`, {
          params: {
            page: pageNo
          }
        });
        setData((prev) => {
          return [...prev, ...response.data.results]
        })
        setTotalPages(response.data.total_pages);
        console.log(response.data)
      } else {
        console.log("Invalid media Type")
      }

    } catch(error) {
      console.log(error)
    }
  }

  const handleScroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      setPageNo(prev => prev + 1)
    }
  }

  useEffect(() => {
    fetchData();
  },[pageNo])

  useEffect(() => {
    setPageNo(1);
    setData([])
    fetchData();
  },[exploreType])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  },[])

  if (!exploreType || (exploreType !== "tv" && exploreType !== "movie")) {
    return <div>Error: Invalid Explore Type</div>
  }
  return (
    <div className="py-16">
      <div className="container mx-auto">
        <h3 className="uppercase text-lg lg:text-xl font-semibold my-3">{exploreType} show</h3>
        <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start">
          {data.map((exploreData, index) => (
            <Card 
              key={index}
              data={exploreData}
              media_type={exploreType}
              trending={false}
            />
          ))}
           
        </div>
      </div>
    </div>
  )
}

export default ExplorePage