const LandingPage = () => {
  return (
    <>
      <div className="hidden md:flex w-full justify-evenly items-center border-b border-b-[#4242425C]/36">
        <img src="../src/assets/images/Landing1.png"></img>
        <div className="w-1/3 flex flex-col text-center justify-evenly items-center gap-3">
          <h1 className="font-poppins-bold  text-[28px] text-primary-accent ">
            Find Your Next Career Move with AI-Powered Precision
          </h1>
          <p className="font-poppins text-[14px] text-[#292624] mb-5">
            Search selected jobs, explore companies, and grow your career with
            smart tools built for the Arab job market.
          </p>
          <button className="w-sm bg-tritary-accent border border-gray-100 p-2 rounded-2xl font-poppins-semibold text-primary cursor-pointer hover:bg-secondary-accent transition-colors">
            Search for Jobs
          </button>
          <button className="w-sm border border-gray-700 p-2 rounded-2xl font-poppins-semibold text-primary cursor-pointer mb-3 hover:bg-gray-200 transition-colors">
            Post a Job (For Employers)
          </button>
          <a
            href="#what-can-you-do"
            className="relative group cursor-pointer inline-block hover:bg-[#D9D9D9] px-3 py-2 pb-4 rounded-2xl transition-colors"
          >
            <p className="font-poppins-medium text-primary text-[15px] group-hover:text-[#CA6234]">
              How it works?
            </p>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-2 transition-all duration-300 ease-out">
              <svg
                className="w-3 h-2"
                viewBox="0 0 24 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2L12 10L22 2"
                  stroke="#CA6234"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </a>
        </div>
        <img src="../src/assets/images/Landing2.png"></img>
      </div>

      {/* mobile view */}
      <div className="md:hidden w-full flex flex-col items-center border-b border-b-[#4242425C]/36 px-4 py-8 gap-5">
        <h1 className="font-poppins-bold text-[22px] text-primary-accent text-center">
          Find Your Next Career Move with AI-Powered Precision
        </h1>
        <p className="font-poppins text-[13px] text-[#292624] text-center">
          Search selected jobs, explore companies, and grow your career with
          smart tools built for the Arab job market.
        </p>
        <img
          src="../src/assets/images/Landing1.png"
          className="w-full h-48 object-cover rounded-lg"
        ></img>
        <button className="w-full bg-tritary-accent border border-gray-100 p-3 rounded-2xl font-poppins-semibold text-primary cursor-pointer hover:bg-secondary-accent transition-colors">
          Search for Jobs
        </button>
        <button className="w-full border border-gray-700 p-3 rounded-2xl font-poppins-semibold text-primary cursor-pointer hover:bg-gray-200 transition-colors">
          Post a Job (For Employers)
        </button>
        <a
          href="#what-can-you-do"
          className="relative group cursor-pointer inline-block hover:bg-[#D9D9D9] px-3 py-2 pb-4 rounded-2xl transition-colors"
        >
          <p className="font-poppins-medium text-primary text-[14px] group-hover:text-[#CA6234]">
            How it works?
          </p>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-2 transition-all duration-300 ease-out">
            <svg
              className="w-3 h-2"
              viewBox="0 0 24 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2L12 10L22 2"
                stroke="#CA6234"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </a>
      </div>
      <div
        id="what-can-you-do"
        className="w-full flex flex-col items-center gap-15 pt-10 border-b border-b-[#4242425C]/36"
      >
        <h2 className="font-ponnala text-[#373535] border-b border-b-[#4242425C]/36">
          What Can You Do
        </h2>
        <div className="w-full flex justify-evenly items-center mb-15">
          <div className="flex flex-col justify-center items-center gap-3 hover:scale-105 hover:translate-1 transition-all">
            <img src="../src/assets/icons/suitcase.png"></img>
            <p className="font-poppins-semibold text-[#373535] text-sm">
              Find Your Perfect Job
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 hover:scale-105 hover:translate-1 transition-all">
            <img src="../src/assets/icons/business-and-trade.png"></img>
            <p className="font-poppins-semibold text-[#373535] text-sm">
              Explore Top Companies
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 hover:scale-105 hover:translate-1 transition-all">
            <img src="../src/assets/icons/lamp.png"></img>
            <p className="font-poppins-semibold text-[#373535] text-sm">
              Get Career Advice
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 hover:scale-105 hover:translate-1 transition-all">
            <img src="../src/assets/icons/marketing.png"></img>
            <p className="font-poppins-semibold text-[#373535] text-sm">
              Post Jobs & Hire Talents
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-around items-center gap-15 pt-10 bg-[#FFECE3] border-b border-b-[#4242425C]/36">
        <h2 className="font-ponnala text-[#373535] border-b border-b-[#4242425C]/36">
          Your Journey With Searchera
        </h2>
        <div className="w-full flex justify-evenly items-center">
          <div className="w-1/4 flex flex-col justify-evenly items-center gap-3 text-center p-3 hover:rounded-2xl hover:bg-[#D9D9D9]/25">
            <img src="../src/assets/icons/1.png" className="w-20 h-20"></img>
            <h3 className="font-poppins-semibold text-primary text-md">
              Browse Jobs
            </h3>
            <p className="w-65 font-poppins text-[#373535] text-sm">
              Explore a wide range of jobs with smart filters that match your
              skills and preferences.
            </p>
          </div>
          <div className="w-1/4 flex flex-col justify-evenly items-center gap-3 text-center p-3 hover:rounded-2xl hover:bg-[#D9D9D9]/25">
            <img src="../src/assets/icons/2.png" className="w-20 h-20"></img>
            <h3 className="font-poppins-semibold text-primary text-md">
              Apply Smartly
            </h3>
            <p className="w-65 font-poppins text-[#373535] text-sm">
              Submit your application and take an AI-powered interview from
              wherever you are.
            </p>
          </div>
          <div className="w-1/4 flex flex-col justify-evenly items-center gap-3 text-center p-3 hover:rounded-2xl hover:bg-[#D9D9D9]/25">
            <img src="../src/assets/icons/3.png" className="w-20 h-20"></img>
            <h3 className="font-poppins-semibold text-primary text-md">
              Get Faster Matches
            </h3>
            <p className="w-65 font-poppins text-[#373535] text-sm">
              Receive instant AI feedback and get matched with employers who
              value your profile.
            </p>
          </div>
        </div>
        <p className="mb-10 font-poppins text-primary text-lg">
          “Employers review your results and interview summary to make faster
          hiring decisions.”
        </p>
      </div>
    </>
  );
};
export default LandingPage;
