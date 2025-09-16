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
      desc: "Celebrate your big day with handcrafted bridal jewelry that shines forever.",
      img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Festive Sparkle",
      desc: "Adorn yourself with vibrant designs for festivals and celebrations.",
      img: "https://res.cloudinary.com/dt3dtekuh/image/upload/v1757668884/g6bixmdidkzxypverzzh.jpg",
    },
    {
      title: "Everyday Glam",
      desc: "Delicate pieces that make every day special.",
      img: "https://www.shutterstock.com/image-photo/womans-hands-close-wearing-rings-260nw-2320119159.jpg",
    },
    {
      title: "Luxury Collection",
      desc: "Exclusive statement jewelry for unforgettable moments.",
      img: "https://t4.ftcdn.net/jpg/06/29/68/09/360_F_629680959_WtOjol2S8Zsyisqtx5lFgF3YWaNbEdv7.jpg",
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
        <p className="text-gray-600">{item.desc}</p>
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
              "https://t4.ftcdn.net/jpg/12/45/37/95/360_F_1245379563_D5Y90qSfUHN8mg0xVnjG922A0zmO2J3O.jpg",
              "https://t4.ftcdn.net/jpg/05/84/41/65/360_F_584416508_eDB9BQA99eNiJg7YOE63WY8tV57jiPI6.jpg",
              "https://www.theshoppingtree.in/cdn/shop/files/IMG_9838.jpg?v=1752582566&width=1946",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS82vtgyBDLwHmNSgYu8_TPQSgyh73iQzXOJg&s",
              "https://m.media-amazon.com/images/I/61pAR0CvgHL._UF1000,1000_QL80_.jpg",
              "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw3e366e36/images/hi-res/51D3B2BBVAA00_1.jpg?sw=480&sh=480",
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
