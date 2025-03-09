import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import moment from "moment";
import { Link } from "react-router-dom";

type MediaType = "tv" | "movie"

interface CardData {
  id: string
  poster_path?: string | undefined;
  title?: string;
  name?: string;
  release_date: string;
  vote_average: Number;
  media_type: MediaType
}

interface CardProps {
  data: CardData
  trending: boolean;
  index?: number;
  media_type?: MediaType
}

const Card = ({ data, trending, index,media_type }: CardProps) => {
  const imageURL = useSelector((state: RootState) => state.movieData.imageUrl);
  const posterPath = data.poster_path ? imageURL + data.poster_path : "https://fakeimg.pl/230x320?text=No+Image";
  const mediaTypeToUse = media_type || data.media_type;
  return (
    <Link to={`/${mediaTypeToUse}/${data.id}`} className="w-full min-w-[230px] max-w-[230px] h-80 overflow-hidden block rounded relative hover:scale-105 transition-all">
      <img
        src={posterPath}
        alt={data.poster_path ? "Movie Poseter" : "Placeholder Image"}
        className="w-full h-full object-cover rounded-md"
      />
      <div className="absolute top-5">
        {trending && (
          <div className="py-1 px-4 backdrop-blur-3xl rounded-r-full bg-black/60 overflow-hidden">
            #{index} Trending
          </div>
        )}
      </div>
      <div className="absolute bottom-0 h-16 backdrop-blur-3xl w-full bg-black/60 p-2">
        <h2 className="text-ellipsis line-clamp-1 text-lg font-semibold">
          {data?.title || data?.name}
        </h2>
        <div className="text-sm text-neutral-400 flex justify-between items-center">
          <p>{moment(data.release_date).format("MMMM Do YYYY")}</p>
          <p className="bg-black px-2 rounded-full text-xs text-white">
            Rating :{Number(data.vote_average).toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
