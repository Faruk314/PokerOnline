import React, { useEffect, useRef } from "react";
import Wrapper from "./Wrapper";
import { IoClose } from "react-icons/io5";
import chipMD from "../assets/images/chip_md.png.png";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createCheckoutSession } from "../store/slices/payment";
import Loader from "../components/Loader";
import { fetchShopPackages } from "../store/slices/shop";

loadStripe(
  "pk_test_51QYn1lL53CQXsO0aEFJ2b5A5Cb9gGloQmnap4dqLn2VUIm2UQ0J1SyD8hi8wp1c6sPDLb3VpCcnZvFRG5C07VtF400QQTRjCr3"
);

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Shop = ({ setOpenModal }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const paymentLoading = useAppSelector((state) => state.payment.isLoading);
  const shopLoading = useAppSelector((state) => state.shop.isLoading);
  const shopPackages = useAppSelector((state) => state.shop.shopPackages);

  useEffect(() => {
    dispatch(fetchShopPackages());
  }, [dispatch]);

  if (paymentLoading) {
    return (
      <div className="fixed inset-0">
        <Loader />
      </div>
    );
  }

  return (
    <Wrapper setOpenModal={setOpenModal} modalRef={modalRef}>
      <div
        ref={modalRef}
        className="relative z-40 w-[30rem] mx-2 max-h-[30rem] overflow-y-auto h-[30rem] space-y-4 bg-gray-800 rounded-md button-border"
      >
        <div className="sticky w-full bg-gray-800 border-b border-black top-0 right-0 p-6 bg-gray-800 flex items-center justify-between">
          <h2 className="text-2xl">SHOP</h2>
          <button onClick={() => setOpenModal(false)} className="text-3xl">
            <IoClose />
          </button>
        </div>

        <div className="flex flex-col space-y-2 px-6 pt-2 pb-6">
          {shopLoading ? (
            <Loader />
          ) : (
            shopPackages.map((item) => (
              <div
                key={item.packageId}
                className="button-border py-2 px-3 rounded-md flex justify-between"
              >
                <div className="flex space-x-4 items-center">
                  <img src={chipMD} className="w-8 h-8" />

                  <p>{item.amount}</p>
                </div>

                <button
                  onClick={() =>
                    dispatch(createCheckoutSession(item.packageId))
                  }
                  className="button-border p-1 w-[7rem] bg-green-600 hover:bg-green-500 rounded-full"
                >
                  ${item.price}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Shop;
