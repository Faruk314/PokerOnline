import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";

const PaymentCanceled = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-800 h-[100vh] text-white flex items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <Logo />

        <div className="flex flex-col items-center space-y-2 pb-5 max-w-[30rem]">
          <h2 className="text-2xl font-bold">Your payment was canceled</h2>

          <p className="text-center">
            If this was unintentional or you're facing issues completing your
            payment, please try again or contact our support team for
            assistance.
          </p>
        </div>

        <button
          onClick={() => {
            navigate("/menu");
          }}
          className="button-border p-4 w-[15rem] bg-green-600 hover:bg-green-500 font-bold rounded-full"
        >
          Back to menu
        </button>
      </div>
    </section>
  );
};

export default PaymentCanceled;
