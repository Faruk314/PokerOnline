import clubs from "../assets/images/2_of_clubs.png";
import back from "../assets/images/back.png";

const Card = () => {
  return (
    <div className="h-full bg-white w-full rounded-md">
      <img src={back} className="h-full rounded-md" />
    </div>
  );
};

export default Card;
