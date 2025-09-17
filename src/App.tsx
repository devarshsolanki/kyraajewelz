import { Authenticated, Unauthenticated, useQuery, useConvexAuth } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { AnimatePresence } from "framer-motion";
import CustomLoader from "./components/CustomLoader";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
      <Router>
        <CartProvider>
          <WishlistProvider>
            <Content />
          </WishlistProvider>
        </CartProvider>
      </Router>
      <Toaster position="top-right" />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const { isLoading, isAuthenticated } = useConvexAuth();
  const location = useLocation();
  console.log("Content component - loggedInUser:", loggedInUser);
  console.log("Content component - useConvexAuth: isLoading:", isLoading, "isAuthenticated:", isAuthenticated);

  if (loggedInUser === undefined) {
    return <CustomLoader />;
  }

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/cart" element={
              <Authenticated>
                <Cart />
              </Authenticated>
            } />
            
            <Route path="/checkout" element={
              <Authenticated>
                <Checkout />
              </Authenticated>
            } />
            
            <Route path="/wishlist" element={
              <Authenticated>
                <Wishlist />
              </Authenticated>
            } />
            
            <Route path="/profile" element={
              <Authenticated>
                <Profile />
              </Authenticated>
            } />
            
            <Route path="/admin" element={
              <Authenticated>
                <AdminDashboard />
              </Authenticated>
            } />
            
            <Route path="/login" element={
              <>
                
                  {/* <div className="min-h-screen flex items-center justify-center  pt-10 md:pt-15">
                    <div className=" w-full">
                      <div className="text-center mb-5">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-2">
                          Welcome to Kyraa Jewelz
                        </h1>
                        <p className="text-gray-600">Sign in to continue your jewelry journey</p>
                      </div> */}
                      <SignInForm />
                    {/* </div>
                  </div> */}
               
              </>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
