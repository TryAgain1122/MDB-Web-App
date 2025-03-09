import { useRef } from "react";
import Card from "./Card";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";


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
  media_type
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 300;
    }
  };

  const handlePrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 300;
    }
  };
  return (
    <div className="container mx-auto px-3 my-10">
      <h2 className="uppercase text-lg lg:text-2xl font-bold mb-3 text-white">
        {heading}
      </h2>
      <div className="relative">
        <div
          ref={containerRef}
          className="grid grid-cols-[repeat(auto-fit,230px)] grid-flow-col gap-6 overflow-hidden overflow-x-scroll relative z-10 scroll-smooth transition-all scrolbar-none"
        >
          {data.map((data, index) => (
            <Card
              key={data.id}
              data={data}
              index={index + 1}
              trending={trending}
              media_type={media_type}
            />
          ))}
        </div>
        <div className="absolute top-0 hidden lg:flex justify-between w-full h-full items-center">
          <button
            onClick={handlePrev}
            className="bg-white p-1 rounded-full text-xl z-10 text-black"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={handleNext}
            className="bg-white p-1 rounded-full text-xl z-10 text-black"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollCard;
