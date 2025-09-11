import { Crown, Heart, Award, Users, Import } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import p1 from "../img/p1.jpg";
import p2 from "../img/p2.jpg";
import p3 from "../img/p3.jpg";
import p4 from "../img/p4.webp";
import p5 from "../img/p5.jpg";
import v1 from "../img/v1.mp4";
import v2 from "../img/v2.mp4";
import v3 from "../img/v3.mp4";
import v4 from "../img/v4.mp4";
// Gallery images
const galleryImages = [
  p1,
  p2,
  p3,
  p4,
  p5,
];

// Instagram reels with video + product info
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

// Featured products
const productImages = [
  p1,
  p2,
  p3,
  p4,
  p5,
  p2,
  p3,
  p4,
  
];

export default function About() {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">

      {/* Hero / Gallery Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
            Our Story in Pictures
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            Discover the beauty and craftsmanship behind every piece of Kyraa Jewelz through our visual journey.
          </p>

          {/* Photo Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                onClick={() => {
                  setCurrentIndex(idx);
                  setOpen(true);
                }}
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-lg font-semibold">
                  View
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={galleryImages.map((src) => ({ src }))}
          index={currentIndex}
        />
      )}

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              {
                icon: Award,
                title: "Quality Excellence",
                desc: "Only the finest materials and craftsmanship go into every piece."
              },
              {
                icon: Heart,
                title: "Passionate Craftsmanship",
                desc: "Every jewelry piece is designed with love and attention to detail."
              },
              {
                icon: Users,
                title: "Customer First",
                desc: "Your satisfaction is our top priority."
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-amber-400 to-rose-400 rounded-full">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instagram Reels Section */}
      <section className="py-16 bg-rose-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Instagram Reels</h2>
          <p className="text-xl text-gray-600 mb-12">Follow our journey and latest collections on Instagram</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {instaReels.map((item, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl  group shadow-2xl  duration-300"
              >
                {/* Video Reel */}
                <video
                  src={item.video}
                  className="w-full h-[450px] object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                ></video>

                {/* Product Card Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4 text-left  group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold text-lg">{item.productName}</h3>
                  <p className="text-white/90 text-sm">{item.productDesc}</p>
                  <span className="text-amber-400 font-bold mt-1 block">{item.price}</span>
                </div>

                {/* Play Overlay Icon */}
               
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section below Reels */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {productImages.map((img, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img src={img} alt={`Product ${idx + 1}`} className="w-full h-64 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-rose-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Explore Jewelry That Tells Your Story</h2>
          <p className="text-xl text-white/90 mb-8">
            Browse our curated collection and find the perfect piece to celebrate your moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="bg-white text-rose-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Shop Collection
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-rose-600 transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
