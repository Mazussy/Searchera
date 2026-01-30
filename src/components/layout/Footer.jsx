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
          <img className="w-12 h-12" src="/src/assets/icons/facebook.png"></img>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="w-12 h-12" src="/src/assets/icons/social.png"></img>
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
          <img className="w-12 h-12" src="/src/assets/icons/tik-tok.png"></img>
        </a>
      </div>
      <div className="flex gap-10">
        <p className="font-alatsi text-primary text-[17px]">SEARCHERA</p>
        <Link to={"about-us"} className="font-alatsi text-primary text-[17px]">
          About Us
        </Link>
        <Link
          to={"contact-us"}
          className="font-alatsi text-primary text-[17px]"
        >
          {" "}
          Contact Us
        </Link>
      </div>
    </div>
  );
};
export default Footer;
