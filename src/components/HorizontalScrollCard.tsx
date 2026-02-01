import { useRef, useState, useEffect } from "react";
import Card from "./Card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface HorizontalScrollCardProps {
  data: {
    id: string;
    poster_path?: string | undefined;
    title?: string;
    name?: string;
    release_date: string;
    vote_average: Number;
    media_type: "movie" | "tv";
  }[];
  heading: string;
  trending: boolean;
  media_type?: "movie" | "tv";
}

const HorizontalScrollCard: React.FC<HorizontalScrollCardProps> = ({
  data,
  heading,
  trending,
  media_type,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollButtons, { passive: true });
    window.addEventListener("resize", checkScrollButtons);

    return () => {
      container.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [data]);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cardWidth = 216; // 200px card + 16px gap
    const scrollAmount = cardWidth * 3;

    const targetScroll = direction === "left"
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth"
    });
  };

  return (
    <div className="container mx-auto px-4 my-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl lg:text-2xl font-bold text-white capitalize">
          {heading}
        </h2>
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2.5 rounded-full transition-all duration-200 ${
              canScrollLeft
                ? "bg-white/10 hover:bg-white/20 text-white hover:scale-105 active:scale-95"
                : "bg-white/5 text-neutral-600 cursor-not-allowed"
            }`}
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2.5 rounded-full transition-all duration-200 ${
              canScrollRight
                ? "bg-white/10 hover:bg-white/20 text-white hover:scale-105 active:scale-95"
                : "bg-white/5 text-neutral-600 cursor-not-allowed"
            }`}
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-none pb-4 scroll-smooth"
        >
          {data.map((item, index) => (
            <div key={item.id} className="flex-shrink-0 w-[180px] lg:w-[200px]">
              <Card
                data={item}
                index={index + 1}
                trending={trending}
                media_type={media_type}
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div
          className={`hidden lg:block absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-neutral-900 to-transparent pointer-events-none transition-opacity duration-300 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`hidden lg:block absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-neutral-900 to-transparent pointer-events-none transition-opacity duration-300 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
};

export default HorizontalScrollCard;
