import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? "bg-background/90 backdrop-blur-md border-b border-gold-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <Link to="/" className="font-heading text-gold tracking-[0.3em] text-lg uppercase">
          Yozora Lounge
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link to="/how-it-works" className="small-caps-ivory hover:text-gold transition-colors duration-300">
            How It Works
          </Link>
          <Link to="/talents" className="small-caps-ivory hover:text-gold transition-colors duration-300">
            Talents
          </Link>
          <Link to="/credits" className="small-caps-ivory hover:text-gold transition-colors duration-300">
            Credits
          </Link>
          <Link to="/contact" className="small-caps-ivory hover:text-gold transition-colors duration-300">
            Contact
          </Link>
          <Link to="/join" className="btn-gold-outline text-xs py-2 px-6">
            Join as Talent
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
