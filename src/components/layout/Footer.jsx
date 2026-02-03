import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full flex justify-evenly items-center pt-5 pb-5">
      <div className="flex gap-10">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="w-10 h-10 hover:content-[url('/src/assets/icons/FB2.png')]"
            src="/src/assets/icons/FB1.png"
          ></img>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="w-10 h-10 hover:content-[url('/src/assets/icons/Insta2.png')]"
            src="/src/assets/icons/Insta1.png"
          ></img>
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
          <img
            className="w-10 h-10 hover:content-[url('/src/assets/icons/Tiktok2.png')]"
            src="/src/assets/icons/Tiktok1.png"
          ></img>
        </a>
      </div>
      <div className="flex gap-10">
        <p className="font-alatsi text-primary text-[17px] hover:text-[#FF996C] transition-colors">
          SEARCHERA
        </p>
        <Link
          to={"about-us"}
          className="font-alatsi text-primary text-[17px] hover:text-[#FF996C] transition-colors"
        >
          About Us
        </Link>
        <Link
          to={"contact-us"}
          className="font-alatsi text-primary text-[17px] hover:text-[#FF996C] transition-colors"
        >
          {" "}
          Contact Us
        </Link>
      </div>
    </div>
  );
};
export default Footer;
