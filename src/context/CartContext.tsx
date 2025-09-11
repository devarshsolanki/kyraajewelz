import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface CartContextType {
  cartCount: number;
  cartItems: any[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartItems = useQuery(api.cart.getCartItems) || [];
  const cartCount = useQuery(api.cart.getCartCount) || 0;

  return (
    <CartContext.Provider value={{ cartCount, cartItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
