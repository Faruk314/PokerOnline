import React, { useEffect, useRef } from "react";
import Wrapper from "./Wrapper";
import { IoClose } from "react-icons/io5";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Loader from "../components/Loader";
import { fetchShopPackages } from "../store/slices/shop";
import ShopCard from "../components/ShopCard";

loadStripe(
  "pk_test_51QYn1lL53CQXsO0aEFJ2b5A5Cb9gGloQmnap4dqLn2VUIm2UQ0J1SyD8hi8wp1c6sPDLb3VpCcnZvFRG5C07VtF400QQTRjCr3"
);

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Shop = ({ setOpenModal }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const shopLoading = useAppSelector((state) => state.shop.isLoading);
  const shopPackages = useAppSelector((state) => state.shop.shopPackages);

  useEffect(() => {
    dispatch(fetchShopPackages());
  }, [dispatch]);

  if (shopLoading) {
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
        className="relative z-40 w-[21rem] md:w-[30rem] mx-2 space-y-4 bg-gray-800 rounded-md button-border"
      >
        <div className="sticky w-full bg-gray-800 border-b border-black top-0 right-0 p-6 bg-gray-800 flex items-center justify-between">
          <h2 className="text-2xl">SHOP</h2>
          <button onClick={() => setOpenModal(false)} className="text-3xl">
            <IoClose />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[25rem]">
          <div className="flex flex-col space-y-2 text-[0.9rem] px-4 md:px-6 pt-2 pb-6">
            {shopPackages.map((shopPackage) => (
              <ShopCard key={shopPackage.packageId} shopPackage={shopPackage} />
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Shop;
