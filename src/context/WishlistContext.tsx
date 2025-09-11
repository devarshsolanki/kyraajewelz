import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface WishlistContextType {
  wishlistCount: number;
  wishlistItems: any[];
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const wishlistItems = useQuery(api.wishlist.getWishlistItems) || [];
  const wishlistCount = useQuery(api.wishlist.getWishlistCount) || 0;

  return (
    <WishlistContext.Provider value={{ wishlistCount, wishlistItems }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
