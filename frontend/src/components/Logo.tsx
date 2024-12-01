import pokerLogo from "../assets/images/pokerlogo.png";

const Logo = () => {
  return (
    <div className="flex flex-col items-center space-x-2 mb-10">
      <img src={pokerLogo} className="h-[5.5rem] w-[5.5rem]" />
      <div className="flex flex-col text-2xl">Poker online</div>
    </div>
  );
};

export default Logo;
