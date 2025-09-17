import React from "react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[75vh] flex items-center justify-center bg-gray-100">
        <img
          src="https://i.pinimg.com/736x/ff/9c/20/ff9c204f62b65141a988cde3c7b1484f.jpg"
          alt="Jewelry Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-center text-white bg-black/50 p-6 rounded-xl">
          <h1 className="text-4xl md:text-6xl font-bold font-cinzel mb-4">Moments of Elegance</h1>
          <p className="mt-4 text-lg md:text-xl font-lato">
            Discover timeless jewelry for every occasion
          </p>
        </div>
      </section>

      {/* Occasion-Based Inspirations */}
     <section className="max-w-7xl mx-auto px-4 py-16 space-y-20">
  {[
    {
      title: "Bridal Elegance",
      desc: "Celebrate your big day with handcrafted bridal jewelry that shines forever. Each piece is thoughtfully designed to complement your wedding attire, adding grace, charm, and timeless beauty. From delicate necklaces to statement earrings, our bridal collection is crafted to make every bride feel radiant and unforgettable.",
      img: "https://res.cloudinary.com/dt3dtekuh/image/upload/v1758018229/zdma7wmhbjvxyyzo35nu.jpg",
    },
    {
      title: "Festive Sparkle",
      desc: "Adorn yourself with vibrant designs for festivals and celebrations. Our festive jewelry captures the joy of tradition with a modern twist, blending colorful gemstones, intricate patterns, and luxurious finishes. Whether it’s Diwali, Navratri, or a family gathering, these sparkling pieces are made to make every celebration shine brighter.",
      img: "https://res.cloudinary.com/dt3dtekuh/image/upload/v1757668884/g6bixmdidkzxypverzzh.jpg",
    },
    {
      title: "Everyday Glam",
      desc: "Delicate pieces that make every day special. Designed for comfort and elegance, our everyday jewelry is perfect for work, casual outings, or coffee dates. Minimal yet stylish, these versatile designs let you add a touch of glamour to your daily look without ever feeling overdone.",
      img: "https://res.cloudinary.com/dt3dtekuh/image/upload/v1758018858/e5bfbbwod2ywf7ozblwv.jpg",
    },
    {
      title: "Luxury Collection",
      desc: "Exclusive statement jewelry for unforgettable moments. Crafted with the finest materials and meticulous artistry, these designs are bold, extravagant, and timeless. From gala evenings to milestone celebrations, our luxury collection ensures you leave a lasting impression wherever you go.",
      img: "https://res.cloudinary.com/dt3dtekuh/image/upload/v1758018663/clscs6o0axljycdt9ldy.jpg",
    },
  ].map((item, idx) => (
    <div
      key={idx}
      className="grid md:grid-cols-2 gap-8 items-center"
    >
      {/* Image */}
      <div className={`${idx % 2 !== 0 ? "md:col-start-2" : ""}`}>
        <img
          src={item.img}
          alt={item.title}
          className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
        />
      </div>

      {/* Text */}
      <div className={`space-y-4 ${idx % 2 !== 0 ? "md:col-start-1 md:row-start-1" : ""}`}>
        <h2 className="text-3xl font-bold font-cinzel">{item.title}</h2>
        <p className="text-gray-600 text-justify">{item.desc}</p>
        <Link
          to="/shop"
          className="inline-block mt-4 px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition"
        >
          Shop This Look
        </Link>
      </div>
    </div>
  ))}
</section>


      {/* Lifestyle Gallery */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Style Inspirations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "https://res.cloudinary.com/dt3dtekuh/image/upload/v1758104856/gdeo9c4ylzxar4vkel8q.png",
              "https://res.cloudinary.com/dt3dtekuh/image/upload/v1758107942/gb10jk94w1msrqabmplq.jpg",
              "https://res.cloudinary.com/dt3dtekuh/image/upload/v1758018465/rfhmqynr5gtblm90pnfm.jpg",
              "https://res.cloudinary.com/dt3dtekuh/image/upload/v1758107880/mm2oo0kqyd2ymnh2gtjp.jpg",
              "https://res.cloudinary.com/dt3dtekuh/image/upload/v1758108155/ngxoenogmk24tqszdjhm.jpg",
              "https://res.cloudinary.com/dt3dtekuh/image/upload/v1758108087/big9qgokuh2ph1czfeon.jpg",
            ].map((img, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={img}
                  alt={`Look ${idx + 1}`}
                  className="w-full h-72 object-cover transform group-hover:scale-110 transition"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Link
                    to="/shop"
                    className="px-4 py-2 bg-white text-black font-medium rounded-full"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-400 to-rose-400 text-white py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Find Your Perfect Piece
        </h2>
        <p className="mt-4 text-lg text-gray-50">
          Explore our full collection of handcrafted jewelry today.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-6 px-8 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition"
        >
          Shop the Collection
        </Link>
      </section>
    </div>
  );
};

export default About;
