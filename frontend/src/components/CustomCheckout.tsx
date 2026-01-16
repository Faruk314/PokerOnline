import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAppDispatch } from "../store/hooks";
import { createPaymentIntent } from "../store/slices/payment";

const stripePromise = loadStripe(
  "pk_test_51MVwHKAVnEy4yTpA2F6k3t9d9vX2Q7Q8Z8k9lLmN0pQ1rS3tW4"
);

interface CustomCheckoutProps {
  packageId: string;
  amount: number;
  price: number;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
}

interface FormData {
  cardholderName: string;
  email: string;
  phone: string;
  country: string;
}

const CheckoutForm = ({
  packageId,
  amount,
  price,
  onClose,
  onSuccess,
  onFailure,
}: CustomCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    cardholderName: "",
    email: "",
    phone: "",
    country: "US",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.cardholderName.trim()) {
      setError("Cardholder name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email address is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await dispatch(
        createPaymentIntent({ packageId, amount, price })
      ).unwrap();

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(result.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.cardholderName,
              email: formData.email,
              phone: formData.phone,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        setIsProcessing(false);
        // Redirect to payment canceled page after a short delay
        setTimeout(() => {
          onFailure();
        }, 2000);
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsProcessing(false);
      // Redirect to payment canceled page for any other errors
      setTimeout(() => {
        onFailure();
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Form Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900/30 to-gray-950/30 border border-white/10 rounded-xl px-6 py-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
          <span className="text-lg font-semibold text-white">
            Complete Your Payment
          </span>
        </div>
        <p className="text-gray-400 text-lg">
          Purchasing{" "}
          <span className="text-yellow-400 font-semibold">
            {amount.toLocaleString()} chips
          </span>{" "}
          for <span className="text-green-400 font-bold">${price}</span>
        </p>
      </div>

      {/* Single Column Layout with Better Spacing */}
      <div className="space-y-10">
        {/* Contact Information - Simplified */}
        <div className="bg-gradient-to-b from-gray-900/20 to-gray-950/20 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <h3 className="text-xl font-bold text-white">
              Contact Information
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                Cardholder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                className="w-full bg-gray-900/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-lg"
                placeholder="John Doe"
                required
              />
              <p className="text-gray-500 text-sm mt-2">
                As it appears on your card
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-lg"
                  placeholder="john@example.com"
                  required
                />
                <p className="text-gray-500 text-sm mt-2">
                  For receipt and updates
                </p>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-lg"
                  placeholder="+1 (555) 123-4567"
                />
                <p className="text-gray-500 text-sm mt-2">For order updates</p>
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full bg-gray-900/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-lg"
                required
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="ES">Spain</option>
                <option value="IT">Italy</option>
                <option value="JP">Japan</option>
                <option value="BR">Brazil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card Information */}
        <div className="bg-gradient-to-b from-gray-900/20 to-gray-950/20 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <h3 className="text-xl font-bold text-white">Payment Details</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                Card Information <span className="text-red-500">*</span>
              </label>
              <div className="bg-gray-900/40 border border-white/10 rounded-xl p-5">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "18px",
                        color: "#ffffff",
                        "::placeholder": {
                          color: "#9ca3af",
                        },
                        iconColor: "#fbbf24",
                      },
                    },
                  }}
                />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-gray-400 text-sm">
                  Secured by Stripe • Your card details are never stored on our
                  servers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-b from-red-900/20 to-red-950/20 border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full bg-red-500 animate-pulse"></div>
              <div>
                <p className="text-red-300 text-lg font-semibold">
                  Payment Error
                </p>
                <p className="text-red-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-6">
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full py-4 px-8 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white rounded-2xl font-bold text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(202,138,4,0.4)] hover:shadow-[0_0_60px_rgba(202,138,4,0.6)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-4">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Processing Your Payment...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span>Pay ${price} Now</span>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full py-4 px-8 bg-gray-800/30 hover:bg-gray-700/40 text-gray-300 rounded-2xl font-medium text-lg transition-all duration-300 disabled:opacity-50 border border-white/10 hover:border-white/20"
          >
            Cancel & Return to Shop
          </button>
        </div>

        <div className="text-center pt-6 border-t border-white/10">
          <p className="text-gray-500 text-sm mt-3">
            By completing your purchase, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </div>
    </form>
  );
};

const CustomCheckout = ({
  packageId,
  amount,
  price,
  onClose,
  onSuccess,
  onFailure,
}: CustomCheckoutProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        packageId={packageId}
        amount={amount}
        price={price}
        onClose={onClose}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </Elements>
  );
};

export default CustomCheckout;
