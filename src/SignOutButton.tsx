"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useNavigate } from "react-router-dom";


export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 rounded bg-[#e94c4c] text-white border border-gray-200 font-semibold hover:bg-[#cf2c2c] hover:text-[#c9c9c9] transition-colors shadow-sm hover:shadow"
      onClick={async () => {
        try {
          await signOut();   // log user out
          navigate("/");     // redirect to home page
        } catch (error) {
          console.error("Sign out failed:", error);
        }
      }}
    >
      Sign out
    </button>
  );
}
