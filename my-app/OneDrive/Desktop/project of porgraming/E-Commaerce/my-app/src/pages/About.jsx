import React from "react";

const About = () => {
  return (
    <div id="about">
      <div className="px-4 py-10 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#31859c]">
            About Venora
          </h1>

          <p className="text-gray-600 mb-4 text-sm md:text-base">
            Welcome to{" "}
            <span className="font-semibold text-[#31859c]">Venora</span> — your
            all-in-one online store for everything you need in your daily life.
          </p>

          <p className="text-gray-600 mb-4 text-sm md:text-base">
            Founded in 2023, Venora was built to offer a wide range of products
            — from fashion and electronics to home essentials and more — all in
            one place.
          </p>

          <p className="text-gray-600 mb-8 text-sm md:text-base">
            We focus on quality, affordability, and convenience to make your
            shopping experience simple and enjoyable.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {[
            "Wide variety of products",
            "Affordable prices",
            "Fast delivery",
            "Trusted quality",
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#31859c]/10 p-6 rounded-2xl shadow-sm text-center hover:shadow-md hover:bg-[#31859c]/20 transition"
            >
              <p className="font-medium text-[#31859c]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
