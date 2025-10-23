import React from "react";

import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import Banner from "./Components/Banner";
import { HeroCarousel } from "./Utilitis/HeroCarosel";
import FeturedProducts from "./Utilitis/FeturedProducts";

export const HomeLayout = () => {
  return (
    <div>
      <ToastContainer />
      <Banner />
      <HeroCarousel />
      <FeturedProducts />
    </div>
  );
};
