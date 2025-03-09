import { IoClose } from "react-icons/io5";
import useFetchDetails from "../hooks/useFetchDetails";
import Loader from "./Loader";

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
    <div className="fixed bg-neutral-700 top-0 right-0 bottom-0 left-0 z-40 bg-opacity-50 flex justify-center items-center">
      <div className="bg-black w-full max-h-[80vh] max-w-screen-lg aspect-video rounded relative">
        <button
          className="absolute -right-1 -top-6 text-3xl z-50"
          onClick={close}
        >
          <IoClose />
        </button>
        {loading ? (
          <Loader />
        ) : (
          <>
            {videoKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoData?.results[0]?.key}`}
                className="w-full h-full"
                title="Video Player"
              />
            ) : (
              <p className="text-white text-center">No Video availabe</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPlay;
