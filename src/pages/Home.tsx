import { useSelector } from "react-redux";
import BannerHome from "../components/BannerHome";
import { RootState } from "../store/store";
// import Card from "../components/Card";
// import { useEffect, useState } from "react";
import HorizontalScrollCard from "../components/HorizontalScrollCard";
// import axios from "axios";
import useFetch from "../hooks/useFetch";

const Home = () => {
  const trendingData = useSelector(
    (state: RootState) => state.movieData.bannerData
  );
  const { data: nowPlayingData } = useFetch("/movie/now_playing");
  const { data: topRatedData } = useFetch("/movie/top_rated");
  const { data: tvPopularData } = useFetch("/tv/popular");
  const { data: onTheAirTvShowData } = useFetch("/tv/on_the_air")

  // const [isLoading, setIsLoading] = useState(false);
  // const [nowPlayingData, setNowPlayingData] = useState([]);
  // const [topRatedData, setTopRatedData] = useState([]);
  // const [tvPopularData, setTvPopularData] = useState([])

  // const fetchNowPlayingData = async () => {
  //   try {
  //     const response = await axios.get('/movie/now_playing');
  //     setNowPlayingData(response.data.results)
  //     console.log("Now Playing", response.data.results);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const fetchTopRatedData = async () => {
  //   try {
  //     const response = await axios.get('/movie/top_rated');
  //     setTopRatedData(response.data.results)
  //     console.log("Top Rated ", response.data.results)
  //   } catch (error){
  //     console.log(error)
  //   }
  // }

  // const fetchTvShowPopularData = async () => {
  //   try {
  //     const response = await axios.get('/tv/popular');
  //     console.log("TV POPULAR ", response.data.results);
  //     setTvPopularData(response.data.results)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   fetchNowPlayingData();
  //   fetchTopRatedData();
  //   fetchTvShowPopularData()
  // },[]);

  // useEffect(() => {
  //   if (trendingData) {
  //     setIsLoading(false);
  //   }
  // }, [trendingData]);
  // const trendingMediaType = trendingData && trendingData.length > 0 ? trendingData[0].media_type : "movie";
  return (
    <div>
      <BannerHome />
      {/* <div className="container mx-auto px-3 my-10">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 text-white">
          Trending Shows
        </h2>
        <div className="overflow-hidden">
          <div className="grid grid-cols-[repeat(auto-fit,230px)] grid-flow-col gap-6 overflow-x-scroll">
            {isLoading ? (
              <span>Loading...</span>
            ) : trendingData && trendingData.length > 0 ? (
              trendingData.map((data, index) => (
                <Card
                  key={data.id}
                  data={data}
                  index={index + 1}
                  trending={true}
                />
              ))
            ) : (
              <span>No Movies...</span>
            )}
          </div>
        </div>
      </div> */}
      <HorizontalScrollCard
        data={trendingData}
        heading="Trending"
        trending={true}
      />
      <HorizontalScrollCard
        data={nowPlayingData}
        heading="Now Playing"
        trending={false}
        media_type="movie"
      />
      <HorizontalScrollCard
        data={topRatedData}
        heading="Top Rated"
        trending={false}
        media_type="movie"
      />
      <HorizontalScrollCard
        data={tvPopularData}
        heading="Popular Tv Shows"
        trending={false}
        media_type="tv"
      />
       <HorizontalScrollCard
        data={onTheAirTvShowData}
        heading="On the Air"
        trending={false}
        media_type="tv"
      />
    </div>
  );
};

export default Home;
