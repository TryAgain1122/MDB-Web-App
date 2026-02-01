import { useParams } from "react-router-dom";
import useFetchDetails from "../hooks/useFetchDetails";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Loader from "../components/Loader";
import moment from "moment";
import HorizontalScrollCard from "../components/HorizontalScrollCard";
import useFetch from "../hooks/useFetch";
import { useState } from "react";
import VideoPlay from "../components/VideoPlay";
import { FaPlay, FaStar, FaClock, FaCalendar, FaDollarSign } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

interface MovieData {
  id: string;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  tagline?: string;
  name?: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  status: string;
  release_date: string;
  revenue: number;
  runtime: number;
}

interface crewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string;
}

interface castMember {
  id: number;
  name: string;
  profile_path: string;
}
interface CastData {
  crew: crewMember[];
  cast: castMember[];
}

interface PlayVideoID {
  id: string;
}

const DetailsPage = () => {
  const imageURL = useSelector((state: RootState) => state.movieData.imageUrl);

  const params = useParams();

  const { data, loading } = useFetchDetails<MovieData>(
    `/${params?.explore}/${params.id}`
  );
  const { data: castData, loading: castLoading } = useFetchDetails<CastData>(
    `/${params?.explore}/${params?.id}/credits`
  );
  const { data: similarData } = useFetch(
    `/${params?.explore}/${params?.id}/similar`
  );
  const { data: recommendationData } = useFetch(
    `/${params?.explore}/${params?.id}/recommendations`
  );
  const [playVideo, setPlayVideo] = useState(false);
  const [playVideoId, setPlayVideoId] = useState<PlayVideoID | null>(null);

  const handlePlayVideo = (data: string) => {
    setPlayVideoId({ id: data });
    setPlayVideo(true);
  };

  if (loading || castLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-screen text-neutral-500">
        <p className="text-xl">No details available</p>
      </div>
    );
  }

  const duration = data?.runtime ? (data?.runtime / 60)?.toFixed(1)?.split(".") : ["0", "0"];
  const director = castData?.crew?.find((el) => el?.job === "Director");
  const writers = castData?.crew
    ?.filter((el) => el?.job === "Writer" || el?.job === "Screenplay")
    ?.slice(0, 3)
    ?.map((el) => el?.name)
    ?.join(", ");
  const revenue = data?.revenue ? `$${(data.revenue / 1000000).toFixed(1)}M` : "N/A";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] lg:h-[70vh]">
        <div className="absolute inset-0">
          <img
            src={imageURL + data?.backdrop_path}
            alt={data?.title || data?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/30" />
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-40 lg:-mt-64 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative group">
              <img
                src={imageURL + data?.poster_path}
                alt={data?.title || data?.name}
                className="w-56 lg:w-72 rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => handlePlayVideo(data?.id || "")}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <FaPlay className="text-black text-xl ml-1" />
                </div>
              </button>
            </div>
            <button
              onClick={() => handlePlayVideo(data?.id || "")}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all"
            >
              <FaPlay className="text-sm" />
              <span>Watch Trailer</span>
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 lg:pt-20">
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2">
              {data?.title || data?.name}
            </h1>
            {data?.tagline && (
              <p className="text-neutral-400 text-lg italic mb-6">"{data.tagline}"</p>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <FaStar className="text-yellow-400" />
                <span className="text-white font-semibold">{Number(data?.vote_average).toFixed(1)}</span>
                <span className="text-neutral-400 text-sm">({data?.vote_count} votes)</span>
              </div>
              {data?.runtime > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white">
                  <FaClock className="text-neutral-400" />
                  <span>{duration[0]}h {duration[1]}m</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white">
                <IoCheckmarkCircle className="text-green-400" />
                <span>{data?.status}</span>
              </div>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">Overview</h3>
              <p className="text-neutral-300 leading-relaxed">{data?.overview}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                <FaCalendar className="text-neutral-400" />
                <div>
                  <p className="text-neutral-500 text-sm">Release Date</p>
                  <p className="text-white">{moment(data?.release_date).format("MMMM D, YYYY")}</p>
                </div>
              </div>
              {data?.revenue > 0 && (
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                  <FaDollarSign className="text-neutral-400" />
                  <div>
                    <p className="text-neutral-500 text-sm">Box Office</p>
                    <p className="text-white">{revenue}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Crew */}
            <div className="flex flex-wrap gap-8 mb-8">
              {director && (
                <div>
                  <p className="text-neutral-500 text-sm mb-1">Director</p>
                  <p className="text-white font-medium">{director.name}</p>
                </div>
              )}
              {writers && (
                <div>
                  <p className="text-neutral-500 text-sm mb-1">Writers</p>
                  <p className="text-white font-medium">{writers}</p>
                </div>
              )}
            </div>

            {/* Cast Section */}
            {castData?.cast && castData.cast.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Top Cast</h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4">
                  {castData.cast
                    .filter((el) => el?.profile_path)
                    .slice(0, 10)
                    .map((starCast) => (
                      <div key={starCast.id} className="flex-shrink-0 text-center">
                        <img
                          src={imageURL + starCast?.profile_path}
                          alt={starCast?.name}
                          className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-full ring-2 ring-white/10"
                        />
                        <p className="mt-2 text-sm text-white font-medium max-w-[80px] lg:max-w-[96px] truncate">
                          {starCast?.name}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar & Recommendations */}
      <div className="mt-8">
        {similarData?.length > 0 && (
          <HorizontalScrollCard
            data={similarData}
            heading={`Similar ${params?.explore === "movie" ? "Movies" : "TV Shows"}`}
            media_type={params?.explore as "movie" | "tv"}
            trending={false}
          />
        )}

        {recommendationData?.length > 0 && (
          <HorizontalScrollCard
            data={recommendationData}
            heading="Recommended For You"
            media_type={params?.explore as "movie" | "tv"}
            trending={false}
          />
        )}
      </div>

      {/* Video Player Modal */}
      {playVideo && playVideoId && (
        <VideoPlay
          data={playVideoId.id}
          close={() => setPlayVideo(false)}
          media_type={params?.explore as "movie" | "tv"}
        />
      )}
    </div>
  );
};

export default DetailsPage;
