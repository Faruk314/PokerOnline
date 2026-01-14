import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import toast from "../utils/toast";
import { register, reset } from "../store/slices/auth";
import Loader from "../components/Loader";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    password2: "",
  });

  const { userName, email, password, password2 } = formData;

  const { loggedUserInfo, isLoading, isError, isSuccess } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.showPokerError("Register failed");
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

    if (password !== password2) {
      toast.showPokerError("Passwords do not match");
    } else {
      const userData = {
        userName,
        email,
        password,
      };

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Poker Cards */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-20 h-28 bg-gradient-to-br from-red-500 to-red-600 rounded-lg opacity-10 animate-bounce delay-300 rotate-12"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg opacity-10 animate-bounce delay-700 -rotate-6"></div>
        <div className="absolute top-2/3 right-1/3 w-18 h-26 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg opacity-10 animate-bounce delay-1200 rotate-3"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        {/* Animated Border Glow */}
        <div className="absolute -inset-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>

        {/* Glassmorphism Form Container */}
        <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Header with Welcome Bonus */}
          <div className="text-center mb-8">
            <Logo />
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-white mb-2">
                Join the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                  Poker Community
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                Create your account and start playing
              </p>

              {/* Welcome Bonus */}
              <div className="mt-4 inline-flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <span className="text-black text-sm font-bold">🎴</span>
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">1B BONUS CHIPS</div>
                  <div className="text-green-400 text-xs">
                    Free on registration!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Grid Layout for Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-semibold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Username
                  </div>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <input
                    onChange={onChange}
                    name="userName"
                    value={userName}
                    className="relative w-full px-5 py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                    placeholder="Choose a username..."
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-semibold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Email Address
                  </div>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <input
                    onChange={onChange}
                    name="email"
                    value={email}
                    className="relative w-full px-5 py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
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
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Password
                  </div>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <input
                    onChange={onChange}
                    name="password"
                    value={password}
                    type="password"
                    className="relative w-full px-5 py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    placeholder="Create a password..."
                    required
                  />
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Password strength</span>
                      <span
                        className={
                          password.length >= 8
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {password.length >= 8 ? "Strong" : "Weak"}
                      </span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          password.length >= 12
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : password.length >= 8
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                            : "bg-gradient-to-r from-red-500 to-red-600"
                        }`}
                        style={{
                          width: `${Math.min(password.length * 8, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Repeat Password Input */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-semibold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    Confirm Password
                  </div>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <input
                    onChange={onChange}
                    name="password2"
                    value={password2}
                    type="password"
                    className="relative w-full px-5 py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="Repeat your password..."
                    required
                  />
                </div>

                {/* Password Match Indicator */}
                {password2.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        password === password2
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        password === password2
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {password === password2
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-1">
                  <input type="checkbox" className="sr-only" required />
                  <div className="w-5 h-5 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-md group-hover:border-green-500/30 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-has-[:checked]:opacity-100 transition-opacity">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-sm"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 transition-all duration-300"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 transition-all duration-300"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </div>
              </label>
            </div>

            {/* Register Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="relative group w-full py-4 rounded-xl text-white text-sm font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                  CREATE ACCOUNT & GET BONUS
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
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-yellow-500/30 transition-all duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:from-yellow-300 group-hover:to-yellow-500 transition-all duration-300">
                  SIGN IN TO EXISTING ACCOUNT
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
