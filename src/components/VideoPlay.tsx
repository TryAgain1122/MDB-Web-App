import { IoClose } from "react-icons/io5";
import { FaFilm } from "react-icons/fa";
import useFetchDetails from "../hooks/useFetchDetails";

interface videoResult {
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

interface videoDataResults {
  results: videoResult[];
}

interface VideoPlayProps {
  data: string;
  close: () => void;
  media_type: string;
}

const VideoPlay = ({ data, close, media_type }: VideoPlayProps) => {
  const { data: videoData, loading } = useFetchDetails<videoDataResults>(
    `/${media_type}/${data}/videos`
  );

  const videoKey = videoData?.results?.[0]?.key;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative w-full max-w-5xl bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          onClick={close}
        >
          <IoClose className="text-2xl" />
        </button>

        {/* Video Container */}
        <div className="aspect-video w-full bg-black">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
              className="w-full h-full"
              title="Video Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500">
              <FaFilm className="text-5xl mb-4" />
              <p className="text-lg font-medium">No video available</p>
              <p className="text-sm mt-1">Check back later for trailers and clips</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlay;
