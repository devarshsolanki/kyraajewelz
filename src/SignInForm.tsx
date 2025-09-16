"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // 👇 states for password toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center bg-pink-50 bg-opacity-50 min-h-screen">
      <div className="w-full mt-[80px]">
        <div className="text-center mb-5">
          <h1 className="text-5xl font-playfair p-2 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Welcome to Kyraa Jewelz
          </h1>
          {/* <p className="text-gray-600">Sign in to continue your jewelry journey</p> */}
        </div>
      </div>

      {/* 👇 fixed width container for both pages */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800">
          {flow === "signIn" ? "You're Back !" : "✨ Create Account ✨"}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {flow === "signIn"
            ? "Sign in to continue to your dashboard"
            : "Join us and start your journey"}
        </p>

        {/* Form */}
        <form
          className="flex flex-col gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);

            if (flow === "signUp") {
              const phone = formData.get("phone");
              const password = formData.get("password");
              const confirmPassword = formData.get("confirmPassword");

              setPasswordError(null);
              setConfirmPasswordError(null);
              setPhoneError(null);

              if (password && typeof password === "string" && password.length < 8) {
                setPasswordError("Password must be at least 8 characters long.");
                setSubmitting(false);
                return;
              }

              if (password !== confirmPassword) {
                setConfirmPasswordError("Passwords do not match.");
                setSubmitting(false);
                return;
              }

              if (phone && typeof phone === "string" && !/^\d{10}$/.test(phone)) {
                setPhoneError("Phone number must be 10 digits.");
                setSubmitting(false);
                return;
              }
            }

            try {
              await signIn("password", formData);
              navigate("/");
            } catch (error: any) {
              if (error.message && error.message.includes("Invalid password")) {
                setPasswordError("Invalid password. Please try again.");
              } else {
                setPasswordError(
                  flow === "signIn"
                    ? "Could not sign in, did you mean to sign up?"
                    : "Could not sign up, did you mean to sign in?"
                );
              }
              setSubmitting(false);
              return;
            }
            setSubmitting(false);
          }}
        >
          {/* Responsive 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                type="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>
            {flow === "signUp" && (
              <>
                <div>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    pattern="[0-9]{10}"
                    required
                  />
                  {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                </div>
              </>
            )}

            {/* Password field */}
            <div className="md:col-span-2 relative">
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            {flow === "signUp" && (
              <div className="md:col-span-2 relative">
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {confirmPasswordError && (
                  <p className="text-red-500 text-sm">{confirmPasswordError}</p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-semibold hover:bg-primary-hover transition disabled:opacity-50 mt-2"
            type="submit"
            disabled={submitting}
          >
            {flow === "signIn" ? "Sign in" : "Sign up"}
          </button>

          {/* Switch between sign in / sign up */}
          <div className="text-center text-sm text-gray-600 mt-4">
            <span>
              {flow === "signIn" ? "Don’t have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              className="text-primary hover:text-primary-hover hover:underline font-medium"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            >
              {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <hr className="grow border-gray-300" />
          <span className="mx-4 text-gray-500">or</span>
          <hr className="grow border-gray-300" />
        </div>

        {/* Guest Sign-in */}
        <button
          className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          onClick={async () => {
            try {
              await signIn("anonymous"); // login as guest
              navigate("/"); // redirect to home page
            } catch (error) {
              console.error("Guest login failed:", error);
            }
          }}
        >
          Continue as Guest
</button>
      </div>
    </div>
  );
}
