import React, { useEffect, useRef } from "react";
import Wrapper from "./Wrapper";
import { IoClose } from "react-icons/io5";
import chipMD from "../assets/images/chip_md.png.png";
import chipSM from "../assets/images/chip.png";
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
        className="relative z-40 mx-2 overflow-y-auto space-y-4 bg-gray-800 rounded-md button-border"
      >
        <div className="sticky w-full bg-gray-800 border-b border-black top-0 right-0 p-6 bg-gray-800 flex items-center justify-between">
          <h2 className="text-2xl">SHOP</h2>
          <button onClick={() => setOpenModal(false)} className="text-3xl">
            <IoClose />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 px-6 pt-2 pb-6">
          {shopLoading ? (
            <Loader />
          ) : (
            shopPackages.map((item) => (
              <div
                key={item.packageId}
                className="button-border flex flex-col items-center justify-between py-2 h-[16rem] w-[12rem] px-3 rounded-md"
              >
                <div className="flex items-center space-x-1">
                  <span>{item.amount}</span>
                  <img className="h-[1rem]" src={chipSM} />
                </div>

                {item.packageId === 1 && (
                  <div>
                    <img src={chipMD} className="w-[4rem] h-[4rem]" />
                  </div>
                )}

                {item.packageId === 2 && (
                  <div className="relative">
                    <img src={chipMD} className="w-[4rem] h-[4rem]" />

                    <img
                      src={chipMD}
                      className="absolute top-0 right-[3rem] h-[2.5rem] w-[2.5rem] z-[-10]"
                    />
                  </div>
                )}

                {item.packageId === 3 && (
                  <div className="relative">
                    <img
                      src={chipMD}
                      className="absolute top-0 left-[3rem] h-[2.5rem] w-[2.5rem] z-[-10]"
                    />

                    <img src={chipMD} className="w-[4rem] h-[4rem]" />

                    <img
                      src={chipMD}
                      className="absolute top-[-1.2rem] right-[1rem] h-[2.5rem] w-[2.5rem] z-[-10]"
                    />

                    <img
                      src={chipMD}
                      className="absolute top-0 right-[3rem] h-[2.5rem] w-[2.5rem] z-[-10]"
                    />
                  </div>
                )}

                {item.packageId === 4 && (
                  <div className="relative">
                    <img
                      src={chipMD}
                      className="absolute top-0 left-[3rem] h-[2.5rem] w-[2.5rem] z-[-10]"
                    />

                    <img src={chipMD} className="w-[4rem] h-[4rem]" />

                    <img
                      src={chipMD}
                      className="absolute top-[-1.2rem] right-[1rem] h-[2.5rem] w-[2.5rem] z-[-10]"
                    />

                    <img
                      src={chipMD}
                      className="absolute bottom-[-0.9rem] right-[-1rem] h-[2.5rem] w-[2.5rem] z-[-10]"
                    />

                    <img
                      src={chipMD}
                      className="absolute bottom-[-0.9rem] left-[-1rem] h-[2.5rem] w-[2.5rem] z-[-10]"
                    />

                    <img
                      src={chipMD}
                      className="absolute top-0 right-[3rem] h-[2.5rem] w-[2.5rem] z-[-10]"
                    />
                  </div>
                )}

                <button
                  onClick={() =>
                    dispatch(createCheckoutSession(item.packageId))
                  }
                  className="button-border p-1 w-full bg-green-600 hover:bg-green-500 rounded-full"
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
