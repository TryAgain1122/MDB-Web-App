import { useParams } from "react-router-dom";
import useFetchDetails from "../hooks/useFetchDetails";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Loader from "../components/Loader";
import Divider from "../components/Divider";
import moment from "moment";
import HorizontalScrollCard from "../components/HorizontalScrollCard";
import useFetch from "../hooks/useFetch";
import { useState } from "react";
import VideoPlay from "../components/VideoPlay";

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
  // Display loading indicator if either data or castData is still being fetched
  if (loading || castLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[280px]">
        <Loader />
      </div>
    );
  }

  // Display fallback message if no data is available
  if (!data) {
    return (
      <div className="flex justify-center items-center w-full h-[280px] text-gray-600">
        No details available.
      </div>
    );
  }
  const duration = (data?.runtime / 60)?.toFixed(1)?.split(".");
  const writer = castData?.crew
    ?.filter((el) => el?.job === "Writer")
    ?.map((el) => el?.name)
    ?.join(", ");
  return (
    <div>
      <div className="w-full h-[280px] relative hidden lg:block">
        <div className="w-full h-full">
          <img
            src={imageURL + data?.backdrop_path}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute w-full h-full top-0 bg-gradient-to-t from-neutral-900/90 to-transparent"></div>
      </div>

      <div className="container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10 ">
        <div className="relative mx-auto lg:-mt-28 lg:mx-0 w-fit min-w-60">
          <img
            src={imageURL + data?.poster_path}
            className="h-80 w-60 object-cover rounded"
          />
          <button
            className="mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-l from-red-500 to-orange-500 hover:scale-105 transition-all"
            onClick={() => handlePlayVideo(data?.id || "")}
          >
            Play Now
          </button>
        </div>

        <div>
          <h2 className="text-2xl lg:text-4xl font-bold text-white ">
            {data?.title || data?.name}
          </h2>
          <p className="text-neutral-400">{data?.tagline}</p>

          <Divider />

          <div className="flex items-center gap-3">
            <p>Rating : {Number(data?.vote_average).toFixed(1)}+</p>
            <span>|</span>
            <p>View : {Number(data?.vote_count)}</p>
            <span>|</span>
            <p>
              Duration : {duration[0]}h {duration[1]}m
            </p>
          </div>

          <Divider />

          <div>
            <h3 className="text-xl font-bold text-white mb-1">Overview</h3>
            <p>{data?.overview}</p>

            <Divider />
            <div className="flex items-center gap-3 my-3 text-center">
              <p>Staus : {data?.status}</p>
              <span>|</span>
              <p>
                Release Date :{" "}
                {moment(data?.release_date).format("MMMM Do YYYY")}
              </p>
              <span>|</span>
              <p>Revenue : {Number(data?.revenue)}</p>
            </div>

            <Divider />
          </div>

          <div>
            <p>
              <span className="text-white">Director</span> :{" "}
              {castData?.crew[0]?.name}
            </p>

            <Divider />

            <p>
              <span className="text-white">Writer : {writer}</span>
            </p>
          </div>

          <Divider />

          <h2 className="font-bold text-lg">Cast :</h2>
          <div className="grid grid-cols-[repeat(auto-fit,96px)] gap-5 my-4">
            {castData?.cast
              ?.filter((el) => el?.profile_path)
              .map((starCast) => {
                return (
                  <div>
                    <div>
                      <img
                        src={imageURL + starCast?.profile_path}
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    </div>
                    <p className="font-bold text-center text-sm text-neutral-400">
                      {starCast?.name}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div>
        {similarData?.length > 0 ? (
          <HorizontalScrollCard
            data={similarData}
            heading={"Similar " + params?.explore}
            media_type={params?.explore as "movie" | "tv"}
            trending={false}
          />
        ) : (
          <></>
        )}

        {recommendationData?.length > 0 ? (
          <HorizontalScrollCard
            data={recommendationData}
            heading={"Recommendation " + params?.explore}
            media_type={params?.explore as "movie" | "tv"}
            trending={false}
          />
        ) : (
          <></>
        )}
      </div>

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
