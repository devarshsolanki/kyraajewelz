// ShimmerLoader.tsx
import React from "react";
import { motion } from "framer-motion";

const ShimmerLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative">
        {/* Shimmer Text */}
        <motion.h1
          className="text-4xl font-extrabold tracking-wide relative"
          style={{
            background: "linear-gradient(90deg, #d4af37, #fff, #d4af37)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          Kyraa Jewelz
        </motion.h1>

        {/* Sparkle - Top Left */}
        <motion.div
          className="absolute -top-4 -left-6 text-yellow-400 text-2xl"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
        >
          ✨
        </motion.div>

        {/* Sparkle - Bottom Right */}
        <motion.div
          className="absolute -bottom-4 -right-6 text-yellow-400 text-2xl"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8, delay: 1 }}
        >
          ✨
        </motion.div>
      </div>
    </div>
  );
};

export default ShimmerLoader;
