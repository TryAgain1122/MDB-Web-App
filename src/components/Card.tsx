import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";
import { FaStar, FaPlay } from "react-icons/fa";

type MediaType = "tv" | "movie";

interface CardData {
  id: string;
  poster_path?: string | undefined;
  title?: string;
  name?: string;
  release_date: string;
  vote_average: Number;
  media_type: MediaType;
}

interface CardProps {
  data: CardData;
  trending: boolean;
  index?: number;
  media_type?: MediaType;
}

const Card = ({ data, trending, index, media_type }: CardProps) => {
  const imageURL = useSelector((state: RootState) => state.movieData.imageUrl);
  const posterPath = data.poster_path
    ? imageURL + data.poster_path
    : null;
  const mediaTypeToUse = media_type || data.media_type;
  const year = data.release_date?.slice(0, 4) || "N/A";
  const rating = Number(data.vote_average).toFixed(1);

  return (
    <Link
      to={`/${mediaTypeToUse}/${data.id}`}
      className="group relative block w-full aspect-[2/3] rounded-xl overflow-hidden bg-neutral-800"
    >
      {/* Poster Image */}
      {posterPath ? (
        <img
          src={posterPath}
          alt={data?.title || data?.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-600">
          <span className="text-sm">No Image</span>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Trending Badge */}
      {trending && (
        <div className="absolute top-3 left-0">
          <div className="flex items-center gap-1.5 py-1.5 pl-3 pr-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-r-full text-white text-xs font-bold shadow-lg">
            <span className="text-lg">#{index}</span>
            <span className="uppercase tracking-wide">Trending</span>
          </div>
        </div>
      )}

      {/* Rating Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg">
        <FaStar className="text-yellow-400 text-xs" />
        <span className="text-white text-xs font-semibold">{rating}</span>
      </div>

      {/* Play Button on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <FaPlay className="text-white text-lg ml-1" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-semibold text-sm lg:text-base line-clamp-2 mb-1.5">
          {data?.title || data?.name}
        </h3>
        <div className="flex items-center gap-2 text-neutral-400 text-xs">
          <span>{year}</span>
          <span className="w-1 h-1 rounded-full bg-neutral-600" />
          <span className="capitalize">{mediaTypeToUse === "tv" ? "TV Show" : "Movie"}</span>
        </div>
      </div>
    </Link>
  );
};

export default Card;
