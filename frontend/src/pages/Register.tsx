import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toast } from "react-toastify";
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
      toast.error("Register failed");
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
      toast.error("Passwords do not match");
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
    <section className="flex flex-col items-center justify-center bg-gray-800 h-[100vh] w-full">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center space-y-4 w-[20rem] p-8 button-border font-bold text-white rounded-md"
      >
        <Logo />
        <input
          onChange={onChange}
          name="userName"
          value={userName}
          className="rounded-md px-2 py-3 text-gray-500 w-full placeholder:text-[1rem] button-border"
          placeholder="Enter your username"
        />
        <input
          onChange={onChange}
          name="email"
          value={email}
          className="rounded-md px-2 py-3 text-gray-500 w-full placeholder:text-[1rem] button-border"
          placeholder="Enter your email"
        />
        <input
          onChange={onChange}
          name="password"
          value={password}
          type="password"
          className="rounded-md px-2 py-3 text-gray-500 w-full placeholder:text-[1rem] button-border"
          placeholder="Enter your password"
        />

        <input
          onChange={onChange}
          name="password2"
          value={password2}
          type="password"
          className="rounded-md px-2 py-3 text-gray-500 w-full placeholder:text-[1rem] button-border"
          placeholder="Repeat your password"
        />

        <div className="pt-5 w-[15rem]">
          <button className="button-border text-xl font-bold text-white w-full py-3 p-2 w-full bg-green-700 hover:bg-green-600 rounded-full">
            REGISTER
          </button>
        </div>
      </form>

      <span className="text-[0.9rem] text-white font-bold mt-5">
        Already have an account ?{" "}
        <Link className="text-green-600" to="/">
          Login
        </Link>
      </span>
    </section>
  );
};

export default Register;
