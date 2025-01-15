import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-800 h-[100vh] text-white flex items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <Logo />

        <div className="flex flex-col items-center space-y-2 pb-5">
          <h2 className="text-3xl md:text-4xl font-bold">Payment Success</h2>
          <p className="text-[1rem] md:text-xl">Thank you for your purchase!</p>
        </div>

        <button
          onClick={() => {
            navigate("/menu");
          }}
          className="button-border p-4 w-[10rem] md:w-[15rem] bg-green-600 hover:bg-green-500 font-bold rounded-full"
        >
          Back to menu
        </button>
      </div>
    </section>
  );
};

export default PaymentSuccess;
