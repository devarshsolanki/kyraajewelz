import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Heart, Volume2, VolumeX } from "lucide-react";
import ProductCard from "../components/ProductCard";
// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

export default function Home() {
  const featuredProducts = useQuery(api.products.getFeaturedProducts);
  const categories = useQuery(api.categories.getCategories);

  // Instagram reels section (local videos)
  const instaReels = [
    {
      video: "https://res.cloudinary.com/dt3dtekuh/video/upload/v1757601682/trecyknhnjphmfruu7k5.mp4",
      productName: "Where Style Meets Craft",
      productDesc: "Exclusive with our influencer",
    },
    {
      video: "https://res.cloudinary.com/dt3dtekuh/video/upload/v1757601705/ovfyzjc38gvua9vvqwpl.mp4",
      productName: "Beautifully Packed",
      productDesc: "Handcrafted with love",
    },
    {
      video: "https://res.cloudinary.com/dt3dtekuh/video/upload/v1757601729/vnxygntosyoithumehan.mp4",
      productName: "Timeless Shine",
      productDesc: "Jewellery for every occasion",
    },
    {
      video: "https://res.cloudinary.com/dt3dtekuh/video/upload/v1757601770/j0vdfn3tz79qpzcxquuf.mp4",
      productName: "Classic Earrings",
      productDesc: "Shine beyond trends",
    },
  ];

  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const toggleSound = (idx: number) => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === idx) {
          const isMuted = video.muted;
          video.muted = !isMuted;
          setActiveVideo(!isMuted ? null : idx);
        } else {
          video.muted = true;
        }
      }
    });
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggeredContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.div className="min-h-screen" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        {/* Hero Section */}
        <section className="relative h-[90vh] sm:h-screen flex items-center justify-center overflow-hidden">
          {/* Cloudinary video background */}
          <video
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            src="https://res.cloudinary.com/dvfwqwnlf/video/upload/v1758530144/videoplayback_2_z2jsrd.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/40 z-10"></div>

          {/* Overlay content remains unchanged */}
          <div className="relative z-30 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="font-playfair bg-white bg-clip-text text-transparent">
                Kyraa Jewelz
              </span>
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl font-thin text-gray-100 mb-4 ">
              Elegance that Defines You
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
              Discover our exquisite collection of handcrafted jewelry, where timeless elegance meets contemporary design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:from-amber-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:border-rose-500 hover:text-rose-600 transition-all duration-300 transform hover:scale-105"
              >
                Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <motion.section
          className="py-16 sm:py-20 bg-white"
          variants={staggeredContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl  font-cinzel font-bold text-gray-900 mb-4">
                Explore Our Collections
              </h2>
              <p className="font-lato sm:text-xl text-gray-600 max-w-2xl mx-auto">
                From timeless classics to contemporary designs, find the perfect piece for every occasion.
              </p>
            </div>

            {/* Desktop Swiper */}
            <div className="hidden lg:block">
              <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                loop={false}
                initialSlide={Math.floor((categories?.length || 5) / 2)}
                coverflowEffect={{
                  rotate: 0,
                  stretch: -50,
                  depth: 250,
                  modifier: 1.5,
                  slideShadows: true,
                }}
                navigation
                modules={[EffectCoverflow, Navigation]}
                className="w-full"
              >
                {categories?.map((category) => (
                  <SwiperSlide key={category._id} className="!w-[280px] xl:!w-[310px] cursor-pointer">
                    <Link
                      to={`/shop?category=${category._id}`}
                      className="group relative block overflow-hidden rounded-2xl shadow-lg"
                    >
                      <div className="aspect-square w-full flex items-center justify-center">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 rounded-2xl"
                          />
                        ) : (
                          <div className="text-6xl text-amber-500">
                            <Heart className="w-16 h-16" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-6 text-white">
                          <h3 className="text-lg xl:text-xl font-semibold mb-1">{category.name}</h3>
                          <p className="text-xs sm:text-sm opacity-90">{category.description}</p>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Mobile Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 lg:hidden"
              variants={staggeredContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2 }}
            >
              {categories?.map((category) => (
                <motion.div
                  key={category._id}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Link
                    to={`/shop?category=${category._id}`}
                    className="group relative block overflow-hidden rounded-2xl shadow-lg"
                  >
                    <div className="aspect-square w-full flex items-center justify-center">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                        />
                      ) : (
                        <div className="text-amber-500">
                          <Heart className="w-10 h-10 sm:w-12 sm:h-12" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-3 sm:p-4 text-white">
                        <h3 className="text-sm sm:text-lg font-semibold">{category.name}</h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Featured Products */}
        <motion.section className="py-16 sm:py-20 bg-gradient-to-br from-amber-50 to-rose-50" 
          viewport={{ amount: 0.2 }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl  font-cinzel font-bold text-gray-900 mb-4">Featured Collection</h2>
              <p className="font-lato sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked pieces that showcase our finest craftsmanship and design excellence.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featuredProducts?.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10 sm:mt-12">
              <Link
                to="/shop"
                className="inline-flex items-center bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 sm:px-8 py-3 rounded-full font-semibold text-base sm:text-lg hover:from-amber-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
              >
                View All Products
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Instagram Reels */}
        <motion.section className="py-12 sm:py-16 bg-rose-50" variants={staggeredContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-5xl  font-cinzel font-bold text-gray-900 mb-4 sm:mb-6">
              Moments of Elegance
            </h2>
            <p className="font-lato sm:text-2xl text-gray-600 mb-8 sm:mb-12">
              Discover our timeless creations — beautifully captured in motion.
            </p>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" variants={staggeredContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2 }}>
              {instaReels.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer hover:scale-105 transition-transform duration-300"
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                >
                  {/* Video */}
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    src={item.video}
                    className="w-full h-[400px] sm:h-[400px] md:h-[450px] object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />

                  {/* Volume Button */}
                  <button
                    onClick={() => toggleSound(idx)}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 hover:bg-black text-white p-1 sm:p-2 rounded-full"
                  >
                    {activeVideo === idx ? (
                      <Volume2 size={18} className="sm:w-5 sm:h-5" />
                    ) : (
                      <VolumeX size={18} className="sm:w-5 sm:h-5" />
                    )}
                  </button>

                  {/* Product Overlay */}
                  <div className="absolute bottom-0 left-0 w-full bg-black/50 p-3 sm:p-4 text-left group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold text-sm sm:text-lg">
                      {item.productName}
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm">{item.productDesc}</p>

                    <Link
                      to="/shop"
                      className="inline-flex items-center text-white bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 px-3 sm:px-4 py-1.5 rounded-lg font-semibold text-xs sm:text-sm mt-2"
                    >
                      Shop now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section className="py-16 sm:py-20 bg-white" variants={staggeredContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="font-lato sm:text-xl text-gray-600">
                Hear from those who have experienced the Kyraa Jewelz difference.
              </p>
            </div>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" variants={staggeredContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2 }}>
              {[
                {
                  name: "Priya Sharma",
                  text: "Absolutely stunning jewelry! The craftsmanship is exceptional and the designs are so elegant. I've received countless compliments.",
                  rating: 5,
                },
                {
                  name: "Anita Patel",
                  text: "The quality is outstanding and the customer service is top-notch. My wedding jewelry from Kyraa Jewelz made my special day even more beautiful.",
                  rating: 5,
                },
                {
                  name: "Meera Singh",
                  text: "I love how each piece tells a story. The attention to detail and the luxurious feel make every purchase worth it.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-amber-50 to-rose-50 p-6 sm:p-8 rounded-2xl shadow-lg"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 sm:mb-6 italic text-sm sm:text-base">
                    "{testimonial.text}"
                  </p>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section className="py-16 sm:py-20 bg-gradient-to-r from-amber-400 to-rose-600" variants={staggeredContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-white mb-4 sm:mb-6">
              Ready to Find Your Perfect Piece?
            </h2>
            <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8">
              Join thousands of satisfied customers who have found their perfect jewelry at Kyraa Jewelz.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-white text-rose-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              Start Shopping
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.section>
        <style>
{`
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`}
</style>
      </motion.div>
    </>
  );
}
