import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay, FaStar } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const BannerHome = () => {
  const bannerData = useSelector(
    (state: RootState) => state.movieData.bannerData
  );
  const imageURL = useSelector((state: RootState) => state.movieData.imageUrl);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex < bannerData.length - 1 ? currentIndex + 1 : 0;
    goToSlide(nextIndex);
  }, [currentIndex, bannerData.length, goToSlide]);

  const handlePrev = useCallback(() => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : bannerData.length - 1;
    goToSlide(prevIndex);
  }, [currentIndex, bannerData.length, goToSlide]);

  useEffect(() => {
    if (bannerData.length === 0) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        handleNext();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [bannerData.length, isTransitioning, handleNext]);

  if (bannerData.length === 0) return null;

  const currentData = bannerData[currentIndex];

  return (
    <section className="relative w-full h-[85vh] lg:h-screen overflow-hidden bg-neutral-900">
      {/* Background Images - Only render nearby slides for performance */}
      <div className="absolute inset-0">
        {bannerData.slice(0, 10).map((data, index) => {
          const isActive = index === currentIndex;
          const isNearby = Math.abs(index - currentIndex) <= 1 ||
            (currentIndex === 0 && index === bannerData.length - 1) ||
            (currentIndex === bannerData.length - 1 && index === 0);

          if (!isNearby && !isActive) return null;

          return (
            <div
              key={data.id}
              className="absolute inset-0"
              style={{
                opacity: isActive ? 1 : 0,
                transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'opacity',
              }}
            >
              <img
                src={imageURL + data.backdrop_path}
                alt={data?.title || data?.name}
                className="w-full h-full object-cover"
                style={{
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 6000ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />

      {/* Content with smooth transitions */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div
          key={currentIndex}
          className="w-full max-w-2xl pt-16 animate-fadeIn"
        >
          {/* Media Type Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">
              {currentData?.media_type === "movie" ? "Featured Movie" : "Featured TV Show"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {currentData?.title || currentData?.name}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-white/80 mb-4">
            <div className="flex items-center gap-1.5">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{Number(currentData?.vote_average).toFixed(1)}</span>
            </div>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span>{Number(currentData?.popularity).toFixed(0)} Views</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span className="capitalize">{currentData?.media_type}</span>
          </div>

          {/* Overview */}
          <p className="text-white/70 text-base lg:text-lg line-clamp-3 mb-8 leading-relaxed">
            {currentData?.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link to={`/${currentData?.media_type}/${currentData?.id}`}>
              <button className="flex items-center gap-2 px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transform hover:scale-105 transition-all duration-200 shadow-lg">
                <FaPlay className="text-sm" />
                <span>Play Now</span>
              </button>
            </Link>
            <Link to={`/${currentData?.media_type}/${currentData?.id}`}>
              <button className="flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200">
                <IoInformationCircleOutline className="text-xl" />
                <span>More Info</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none">
        <button
          onClick={handlePrev}
          disabled={isTransitioning}
          className="pointer-events-auto p-3 lg:p-4 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all opacity-0 lg:opacity-100 hover:scale-110 disabled:opacity-50"
        >
          <FaChevronLeft className="text-lg" />
        </button>
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className="pointer-events-auto p-3 lg:p-4 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all opacity-0 lg:opacity-100 hover:scale-110 disabled:opacity-50"
        >
          <FaChevronRight className="text-lg" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {bannerData.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerHome;
