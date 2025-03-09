import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import axios from "axios";
import MobileNavigations from "./components/MobileNavigations";
import { useDispatch } from "react-redux";
import { setBannerData, setImageURL } from "./store/movieSlice";

function App() {
  const dispatch = useDispatch();

  const fetchTrendingData = async () => {
    try {
      const response = await axios.get("/trending/all/week");
      dispatch(setBannerData(response.data.results));

      console.log(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConfiguration = async () => {
    try {
      const response = await axios.get("/configuration");
      dispatch(setImageURL(response.data.images.secure_base_url+"original"))

      console.log("Config: ", response.data.images.secure_base_url+"original");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrendingData();
    fetchConfiguration();
  }, []);

  return (
    <main className="pb-14 lg:pb-0">
      <Header />
      <div className="min-h-90vh">
        <Outlet />
      </div>
      {/* <Footer /> */}
      <MobileNavigations />
    </main>
  );
}

export default App;
