"use client";
import React from "react";
import Image from "next/image";
// Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper modules
import { Pagination, Navigation, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export const HeroCarousel = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="h1">Our Creations</h1>
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        pagination={{ clickable: true }}
        navigation={true} // arrows
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
        {[
          "/Baner-removebg-preview.png",
          "/Slider1.jpg",
          "/Slider2.jpg",
          "/Baner-removebg-preview.png",
          "/Baner-removebg-preview.png",
          "/Baner-removebg-preview.png",
          "/Baner-removebg-preview.png",
          "/Baner-removebg-preview.png",
          "/Baner-removebg-preview.png",
        ].map((src, i) => (
          <SwiperSlide key={i} className="flex justify-center">
            <div className="w-[450px] h-[350px] border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
              <Image
                src={src}
                alt={`Slide ${i + 1}`}
                width={450}
                height={350}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
