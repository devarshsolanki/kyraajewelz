import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Heart } from "lucide-react";
import ProductCard from "../components/ProductCard";
import v1 from "../img/v1.mp4";
import v2 from "../img/v2.mp4";
import v3 from "../img/v3.mp4";
import v4 from "../img/v4.mp4";
import n1 from "../img/Chain2.png"


// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

export default function Home() {
  const featuredProducts = useQuery(api.products.getFeaturedProducts);
  const categories = useQuery(api.categories.getCategories);

  // Hero slider images
  const sliderImages = [
    // "https://png.pngtree.com/thumb_back/fh260/background/20230716/pngtree-luxurious-jewelry-package-3d-rendering-mockup-template-image_3886307.jpg",
    // "https://t4.ftcdn.net/jpg/02/96/79/33/360_F_296793333_YLcoeUJZ1U3z0mRmChzptMYu3ivdsGYG.jpg",
    // "https://res.cloudinary.com/dt3dtekuh/image/upload/v1757578945/x2rqrjskioosx2etgfiq.jpg",
    // "https://res.cloudinary.com/dt3dtekuh/image/upload/v1757580062/cpmqe2kujx1dyeqmjgei.png",
    n1,
  ];

  // Instagram reels section (local videos)
  const instaReels = [
    {
      video: v1,
      productName: "Elegant Ring",
      productDesc: "18k Gold with Diamond",
      price: "₹45,000",
    },
    {
      video: v2,
      productName: "Luxury Necklace",
      productDesc: "Platinum and Sapphire",
      price: "₹75,000",
    },
    {
      video: v3,
      productName: "Gold Bracelet",
      productDesc: "Handcrafted with love",
      price: "₹35,000",
    },
    {
      video: v4,
      productName: "Diamond Earrings",
      productDesc: "Exquisite sparkle",
      price: "₹55,000",
    },
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[580px] mt-14 flex items-center justify-center overflow-hidden">
        <Link
          to="/shop"
          className="absolute inset-0 transition-all duration-1000 cursor-pointer"
          style={{
            backgroundImage: `url(${sliderImages[currentImage]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />

        {/* <div className="relative z-30 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
              Kyraa Jewelz
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 mb-4 font-light">
            Elegance that Defines You
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our exquisite collection of handcrafted jewelry, where timeless elegance meets contemporary design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Shop Collection
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-rose-500 hover:text-rose-600 transition-all duration-300 transform hover:scale-105"
            >
              Our Story
            </Link>
          </div>
        </div> */}
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From timeless classics to contemporary designs, find the perfect piece for every occasion.
            </p>
          </div>

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
                <SwiperSlide
                  key={category._id}
                  className="!w-[310px] cursor-pointer"
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
                        <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:hidden">
            {categories?.map((category) => (
              <Link
                key={category._id}
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
                    <div className="text-6xl text-amber-500">
                      <Heart className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked pieces that showcase our finest craftsmanship and design excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram Reels */}
      <section className="py-16 bg-rose-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Instagram Reels</h2>
          <p className="text-xl text-gray-600 mb-12">
            Follow our journey and latest collections on Instagram
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {instaReels.map((item, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                {/* Video */}
                <video
                  src={item.video}
                  className="w-full h-[450px] object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* Product Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4 text-left  group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold text-lg">{item.productName}</h3>
                  <p className="text-white/90 text-sm">{item.productDesc}</p>

                  <Link to="/shop" className="text-amber-100 bg-amber-400 w-40 p-2 rounded-lg  font-bold mt-1 block">Shop now</Link>
                </div>

               
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">
              Hear from those who have experienced the Kyraa Jewelz difference.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div key={index} className="bg-gradient-to-br from-amber-50 to-rose-50 p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-400 to-rose-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Find Your Perfect Piece?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of satisfied customers who have found their perfect jewelry at Kyraa Jewelz.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center bg-white text-rose-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
          >
            Start Shopping
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
