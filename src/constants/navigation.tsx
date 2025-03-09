import { FaTv } from "react-icons/fa";
import { BiSolidMoviePlay } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
import { MdHomeFilled } from "react-icons/md";

interface navigationType {
    label: string;
    href: string
    icon: JSX.Element
}

export const navigations:navigationType[] = [
    {
        label: "Tv Shows",
        href: "tv",
        icon: <FaTv />
    },
    {
        label: "Movies",
        href: "movie",
        icon: <BiSolidMoviePlay />
    }
]

export const mobileNavigation:navigationType[] = [
    {
        label: "Home",
        href: "/",
        icon: <MdHomeFilled />
    },
    ...navigations,
    // {
    //     label: "search",
    //     href: "search",
    //     icon: <IoSearchOutline />
    // }
]