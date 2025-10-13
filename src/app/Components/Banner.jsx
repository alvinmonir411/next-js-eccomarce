"use client";

import React from "react";
import Image from "next/image";

export default function Banner() {
  return (
    <section className="w-full bg-gradient-to-r from-base-300 via-primary to-accent py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left Side Text */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            Discover Your Perfect Style
          </h1>
          <p className="text-lg md:text-xl text-base-content mb-6">
            Explore our latest collection and find exclusive deals on your
            favorite products.
          </p>
          <button className="bg-primary hover:bg-secondary-content text-primary-content font-semibold py-3 px-6 rounded-lg shadow-button transition-all duration-300">
            Shop Now
          </button>
        </div>

        {/* Right Side Image */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src={"/Baner-removebg-preview.png"}
            alt="Banner Image"
            className="rounded-lg shadow-card"
            width={700}
            height={400}
            priority
          />
        </div>
      </div>
    </section>
  );
}
