import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";


const BannerHome = () => {

  const bannerData = useSelector(
    (state: RootState) => state.movieData.bannerData
  );
  const imageURL = useSelector((state: RootState) => state.movieData.imageUrl);
  const [currentImage, setCurrentImage] = useState(0);

  const handleNext = () => {
    if (currentImage < bannerData.length - 1) {
      setCurrentImage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentImage > 0) {
      setCurrentImage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentImage < bannerData.length - 1) {
        handleNext();
      } else {
        setCurrentImage(0);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerData, currentImage]);

  return (
    <section className="w-full h-screen">
      <div className="flex w-full h-full overflow-hidden relative">
        {bannerData.map((data, index) => (
          <div
            key={`${data.id}bannerHome${index}`}
            className="min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative group transition-all"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            <div className="w-full h-full">
              <img
                src={imageURL + data.backdrop_path}
                alt="No Image"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Button Next and Prev Image */}
            <div className="absolute top-0 w-full h-full hidden items-center justify-between px-4 group-hover:flex">
              <button onClick={handlePrev} className="bg-white p-1 rounded-full text-xl z-10 text-black">
                <FaArrowLeft />
              </button>
              <button onClick={handleNext} className="bg-white p-1 rounded-full text-xl z-10 text-black">
                <FaArrowRight />
              </button>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent"></div>

            <div className="container mx-auto">
              <div className="w-full absolute bottom-0 max-w-md px-5">
                <h2 className="font-bold text-2xl lg:text-4xl text-white drop-shadow-xl">
                  {data?.title || data?.name}
                </h2>
                <p className="text-ellipsis line-clamp-3 my-3 text-white">{data.overview}</p>
                <div className="flex items-center gap-4 text-white">
                  <p>Rating: {Number(data.vote_average).toFixed(1)}+</p>
                  <span>|</span>
                  <p>View: {Number(data.popularity).toFixed(0)}</p>
                </div>
                <Link to={`/${data?.media_type}/${data?.id}`}>
                  <button 
                    className="bg-white px-4 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-red-700 to-orange-500 shadow-md transition-all hover:scale-105 active:scale-50"
                    >
                    Play Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BannerHome;
