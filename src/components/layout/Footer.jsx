import { Link } from "react-router-dom";
import FB1 from "../../assets/icons/FB1.png";
import FB2 from "../../assets/icons/FB2.png";
import Insta1 from "../../assets/icons/Insta1.png";
import Insta2 from "../../assets/icons/Insta2.png";
import Tiktok1 from "../../assets/icons/Tiktok1.png";
import Tiktok2 from "../../assets/icons/Tiktok2.png";

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
            className="w-10 h-10"
            src={FB1}
            onMouseEnter={(event) => {
              event.currentTarget.src = FB2;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.src = FB1;
            }}
            alt="Facebook"
          ></img>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="w-10 h-10"
            src={Insta1}
            onMouseEnter={(event) => {
              event.currentTarget.src = Insta2;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.src = Insta1;
            }}
            alt="Instagram"
          ></img>
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
          <img
            className="w-10 h-10"
            src={Tiktok1}
            onMouseEnter={(event) => {
              event.currentTarget.src = Tiktok2;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.src = Tiktok1;
            }}
            alt="TikTok"
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
