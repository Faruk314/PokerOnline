import { ShopPackage } from "../types/types";
import { createCheckoutSession } from "../store/slices/payment";
import { useAppDispatch } from "../store/hooks";
import chipSM from "../assets/images/chip.png";

interface Props {
  shopPackage: ShopPackage;
}

const ShopCard = ({ shopPackage }: Props) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(createCheckoutSession(shopPackage.packageId));
  };

  return (
    <div className="button-border py-2 px-3 rounded-md flex justify-between text-[1.2rem]">
      <div className="flex flex-col items-start">
        <div className="flex items-center space-x-1">
          <img src={chipSM} className="h-[1.2rem]" />
          <span>{shopPackage.amount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Price:</span>
          <span className="text-green-400">{shopPackage.price}$</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 text-[1rem] md:text-[1.1rem]">
        <button
          onClick={handleClick}
          className="button-border font-bold p-1 w-full md:w-[5rem] bg-green-600 hover:bg-green-500 rounded-full"
        >
          <span>Buy</span>
        </button>
      </div>
    </div>
  );
};

export default ShopCard;
