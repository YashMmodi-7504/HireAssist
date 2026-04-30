import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, dashboardPathForRole } from "../auth/AuthContext";
import { useToast } from "../components/ui/Toaster";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthed, role, login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const credentials = [
    { role: "Student", email: "student@gmail.com", password: "1234" },
    { role: "Trainer", email: "trainer@gmail.com", password: "1234" },
    { role: "Admin", email: "admin@gmail.com", password: "1234" },
    { role: "Director", email: "director@gmail.com", password: "1234" },
  ];

  // If already authed, send them to their dashboard (or honor the original
  // route the user tried to visit before being kicked to /).
  useEffect(() => {
    if (isAuthed) {
      const from = location.state?.from;
      navigate(from || dashboardPathForRole(role), { replace: true });
    }
  }, [isAuthed, role, navigate, location.state]);

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    if (submitting) return;
    if (!email.trim() || !password) {
      toast({
        title: "Missing details",
        message: "Enter both email and password.",
        variant: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Login failed (${res.status})`);
      }

      console.log("Logged in role:", data.user?.role);
      login(data.token, data.user);
      toast({
        title: `Welcome, ${data.user?.name || "back"}`,
        message: `Signed in as ${data.user?.role}.`,
        variant: "success",
      });
      navigate(dashboardPathForRole(data.user?.role), { replace: true });
    } catch (err) {
      toast({
        title: "Login failed",
        message: err.message || "Couldn't reach the server. Try again.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 🔷 TOP NAVBAR */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-16 py-4">
          {/* LEFT - Logo + Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="HireAssist Logo"
              className="w-14 h-14 object-contain hover:scale-110 transition duration-200 cursor-pointer"
            />
            <div className="text-xl font-bold text-purple-600 tracking-wide">
              HireAssist
            </div>
          </div>

          {/* RIGHT - Menu */}
          <div className="flex items-center gap-6">
            <div className="flex gap-8 text-sm font-medium text-gray-700">
              <span className="hover:text-purple-600 cursor-pointer transition duration-200">Home</span>
              <span className="hover:text-purple-600 cursor-pointer transition duration-200">About</span>
              <span className="hover:text-purple-600 cursor-pointer transition duration-200">Institutions</span>
              <span className="hover:text-purple-600 cursor-pointer transition duration-200">Stories</span>
              <span className="hover:text-purple-600 cursor-pointer transition duration-200">Gallery</span>
              <span className="hover:text-purple-600 cursor-pointer transition duration-200">Resources</span>
              <span className="hover:text-purple-600 cursor-pointer transition duration-200">FAQs</span>
              <span className="hover:text-purple-600 cursor-pointer transition duration-200">Contact</span>
              <span className="font-semibold text-purple-600 hover:text-purple-700 cursor-pointer transition duration-200">Login</span>
              <span className="font-semibold text-purple-600 hover:text-purple-700 cursor-pointer transition duration-200">Register</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔷 HERO SECTION */}
      <div className="flex-1 bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 flex items-stretch justify-center px-20 py-16">
        <div className="flex items-stretch justify-center gap-24 max-w-full">
          {/* LEFT SECTION */}
          <div className="flex flex-col gap-6">
            {/* LOGIN CARD */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition duration-300 w-[350px]">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Sign in to your dashboard
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter your credentials to access your account
              </p>

              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                {/* EMAIL INPUT */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    disabled={submitting}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* PASSWORD INPUT */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={submitting}
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition duration-200"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                          <path d="M5.571 5.571A9.958 9.958 0 0110 2c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-.642 1.574m-9.571 9.571A9.958 9.958 0 0110 18c4.478 0 8.268-2.943 9.542-7a10.014 10.014 0 01-1.074 4.512l1.781 1.781a1 1 0 11-1.414 1.414l-14-14z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* REMEMBER ME */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-purple-400"
                  />
                  <label htmlFor="remember" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Remember Me
                  </label>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 hover:scale-[1.02] active:scale-[0.98] mt-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      SIGNING IN…
                    </>
                  ) : (
                    "LOGIN"
                  )}
                </button>

                {/* FORGOT PASSWORD */}
                <p className="text-xs font-semibold text-purple-600 hover:text-purple-700 text-center cursor-pointer transition duration-200 pt-2">
                  FORGOT YOUR PASSWORD?
                </p>
              </form>
            </div>

            {/* DEMO CREDENTIALS CARD */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 w-[350px]">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Demo Credentials</h3>
              <p className="text-xs text-gray-500 mb-4">Click a row to fill the form</p>
              <div className="space-y-1">
                {credentials.map((cred, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDemoFill(cred)}
                    className="w-full flex justify-between items-center px-3 py-3 rounded-lg hover:bg-purple-50 transition duration-200 cursor-pointer border border-transparent hover:border-purple-200"
                  >
                    <span className="font-semibold text-gray-800 text-sm">{cred.role}</span>
                    <span className="text-gray-500 text-xs font-mono bg-gray-100 px-2 py-1 rounded-md">
                      {cred.email} / {cred.password}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - IMAGE */}
          <div className="bg-white p-3 rounded-xl shadow-2xl h-full flex items-stretch border border-white/50">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=700&h=600&fit=crop"
              alt="Professional team collaboration"
              className="w-[650px] h-full object-cover rounded-lg hover:scale-[1.02] transition duration-300"
            />
          </div>
        </div>
      </div>

      {/* 🔷 FOOTER */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-20 py-16 border-t border-gray-200">
        <div className="flex justify-between gap-16 max-w-7xl mx-auto">
          {/* LEFT COLUMN */}
          <div className="flex-1">
            <img
              src="/logo.png"
              alt="HireAssist Logo"
              className="w-24 h-24 object-contain mb-4 hover:scale-110 transition duration-200 cursor-pointer"
            />
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              HireAssist empowers organizations to streamline recruitment and talent management.
              Follow us and stay connected to discover the latest innovations.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 bg-gray-300 hover:bg-purple-600 rounded-full transition duration-200 shadow-sm hover:shadow-md"></a>
              <a href="#" className="w-8 h-8 bg-gray-300 hover:bg-purple-600 rounded-full transition duration-200 shadow-sm hover:shadow-md"></a>
              <a href="#" className="w-8 h-8 bg-gray-300 hover:bg-purple-600 rounded-full transition duration-200 shadow-sm hover:shadow-md"></a>
            </div>
          </div>

          {/* MIDDLE COLUMN */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-5 text-sm">Quick Links</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 hover:text-purple-600 cursor-pointer transition duration-200">For Enterprises</p>
              <p className="text-sm text-gray-500 hover:text-purple-600 cursor-pointer transition duration-200">For Candidates</p>
              <p className="text-sm text-gray-500 hover:text-purple-600 cursor-pointer transition duration-200">Integration APIs</p>
              <p className="text-sm text-gray-500 hover:text-purple-600 cursor-pointer transition duration-200">Documentation</p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-5 text-sm">Support</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">support@hireassist.com</p>
              <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
              <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition duration-200 inline-block">Contact Support →</a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="text-center text-xs text-gray-500 mt-10 pt-8 border-t border-gray-300">
          © Copyright 2024 HireAssist. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
