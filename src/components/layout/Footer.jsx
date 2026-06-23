import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-[#E5E5E5] bg-[#F8F9FB] py-12 text-[#4F4F4F]">
      <div className="mx-auto flex w-full max-w-340 flex-col gap-10 px-4 sm:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm space-y-4">
          <p className="text-2xl font-poppins-semibold text-[#141414]">SEARCHERA</p>
          <p className="text-sm leading-6 text-[#6B6B6B]">
            A polished hiring platform designed for modern companies and talented applicants.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-8 sm:w-auto sm:grid-cols-3">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#141414]">Company</p>
            <Link to="about-us" className="block text-sm text-[#5F5F5F] transition hover:text-black">
              About Us
            </Link>
            <Link to="contact-us" className="block text-sm text-[#5F5F5F] transition hover:text-black">
              Contact
            </Link>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#141414]">Explore</p>
            <Link to="/jobs" className="block text-sm text-[#5F5F5F] transition hover:text-black">
              Browse jobs
            </Link>
            <Link to="/profile" className="block text-sm text-[#5F5F5F] transition hover:text-black">
              My profile
            </Link>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#141414]">Support</p>
            <p className="text-sm text-[#5F5F5F]">Privacy Policy</p>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[#E5E5E5] pt-6 text-center text-sm text-[#7A7A7A]">
        © 2026 SEARCHERA. Crafted for a cleaner hiring journey.
      </div>
    </footer>
  );
};

export default Footer;
