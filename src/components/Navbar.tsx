import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, role, loading, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardPath =
    role === "admin"
      ? "/admin"
      : role === "talent"
        ? "/talent-dashboard"
        : role === "client"
          ? "/client-dashboard"
          : null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? "bg-background/90 backdrop-blur-md border-b border-gold-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-28">
        <Link to="/">
          <img src={logo} alt="Yozora Lounge" className="h-[100px] w-auto" />
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
          {user ? (
            <>
              {dashboardPath && !loading ? (
                <Link to={dashboardPath} className="small-caps-ivory hover:text-gold transition-colors duration-300">
                  Dashboard
                </Link>
              ) : (
                <span className="small-caps-ivory opacity-50">Dashboard</span>
              )}
              <button onClick={signOut} className="btn-gold-outline text-xs py-2 px-6">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="small-caps-ivory hover:text-gold transition-colors duration-300">
                Sign In
              </Link>
              <Link to="/signup/talent" className="btn-gold-outline text-xs py-2 px-6">
                Join as Talent
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
