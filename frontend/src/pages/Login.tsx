import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { login, reset } from "../store/slices/auth";
import toast from "../utils/toast";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Loader from "../components/Loader";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loggedUserInfo, isLoading, isError, isSuccess } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.showPokerError("Authentication failed");
    }

    if (isSuccess || loggedUserInfo) {
      navigate("/menu");
    }

    dispatch(reset());
  }, [loggedUserInfo, isError, isSuccess, navigate, dispatch]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Poker Chips */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full opacity-10 animate-bounce delay-300"></div>
        <div className="absolute bottom-1/3 right-1/5 w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-10 animate-bounce delay-700"></div>
        <div className="absolute top-2/3 left-2/3 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-10 animate-bounce delay-1200"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Animated Border Glow */}
        <div className="absolute -inset-6 bg-gradient-to-r from-yellow-600 via-red-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>

        {/* Glassmorphism Form Container */}
        <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Logo />
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  Email Address
                </div>
              </label>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <input
                  onChange={onChange}
                  name="email"
                  value={email}
                  className="relative w-full px-5 py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                  placeholder="Enter your email..."
                  type="email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Password
                </div>
              </label>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <input
                  onChange={onChange}
                  name="password"
                  value={password}
                  type="password"
                  className="relative w-full px-5 py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                  placeholder="Enter your password..."
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-5 h-5 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-md group-hover:border-yellow-500/30 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-has-[:checked]:opacity-100 transition-opacity">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-sm"></div>
                  </div>
                </div>
                <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="relative group w-full py-4 rounded-xl text-white text-sm font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 shadow-[0_0_30px_rgba(202,138,4,0.4)] hover:shadow-[0_0_40px_rgba(202,138,4,0.6)] hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                  LOGIN TO POKER
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-b from-gray-900/90 to-gray-950/90 text-gray-500">
                New to poker?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-3 group"
            >
              <div className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 group-hover:from-green-300 group-hover:to-emerald-500 transition-all duration-300">
                  CREATE NEW ACCOUNT
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
