import Logo from "../components/Logo";

const NotFound = () => {
  return (
    <section className="bg-gray-800 h-[100vh] text-white flex items-center justify-center">
      <div className="flex flex-col items-center space-y-2 pb-10">
        <Logo />
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-4xl font-bold">Page not found</h2>
          <p className="text-xl">
            Sorry, the page that you were looking for could not be found
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
