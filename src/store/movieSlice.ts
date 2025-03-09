import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MediaType = "tv" | "movie";
interface BannerData {
    id: string
    backdrop_path: string
    title?: string
    name?: string
    overview: string
    vote_average: Number
    popularity: Number
    poster_path?: string
    release_date: string
    media_type: MediaType
}

interface movieState {
    bannerData: BannerData[]
    imageUrl: string
}

const initialState:movieState = {
    bannerData: [],
    imageUrl: ""
} 

export const movieSlice = createSlice({
    name: 'movie',
    initialState,
    reducers : {
        setBannerData: (state, action:PayloadAction<BannerData[]>) => {
            state.bannerData = action.payload
        },
        setImageURL: (state, action:PayloadAction<string>) => {
            state.imageUrl = action.payload
        }
    }
})

export const { setBannerData, setImageURL } = movieSlice.actions;
export default movieSlice.reducer;