

import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom"
import { useState,useEffect } from "react";
import MainLayout from "../Components/MainLayout"
import CryptoList from "../Components/CryptoList"
import Exchanges from "../Components/Exchanges";
import Currencies from "../Components/Currencies";
import TradingViewWidget from "../Components/TradingViewWidget";
import Watchlist from "../Components/Watchlist";
import ErrorPage from "../Components/ErrorPage";
import About from "../Components/About";


function App() {

  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);
  const [animationPlayed] = useState(
    sessionStorage.getItem("animationPlayed") || "false"
  );

  
  useEffect(() => {
    scrollTo(0, 0);

    const animationTimeout = setTimeout(() => {
      setIsAnimationPlaying(false);
      sessionStorage.setItem("animationPlayed", "true");
    }, 5000);

    return () => clearTimeout(animationTimeout);
  }, []);

  
  const router = createBrowserRouter(
    createRoutesFromElements(
        
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<CryptoList />}/>
        <Route path="currencies/:id" element={<Currencies/>}>
          <Route index element={<TradingViewWidget />} /> 
        </Route> 
        <Route path="exchanges" element={<Exchanges />}/>
        <Route path="about" element={<About />}/>
        <Route path="watchlist" element={<Watchlist />}/>
        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  );

  useEffect(() => {
    if (animationPlayed === "false") {
      if (isAnimationPlaying) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    } else {
      return;
    }
  }, [isAnimationPlaying]);



  return (
    <>
      {animationPlayed === "false" && isAnimationPlaying && (
        <svg
          className={`animation ${isAnimationPlaying ? "" : "active"}`}
          width="100%"
        >
          <text x="50%" y="50%">
            CryptoOracle
          </text>
        </svg>
      )}
      <div
        className={`fade-in ${
          animationPlayed === "false" && isAnimationPlaying ? "" : "active"
        }`}
      >
        <RouterProvider router={router} />
      </div>
    </>
  )

}

export default App;
