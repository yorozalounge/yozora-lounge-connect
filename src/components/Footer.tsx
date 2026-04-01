import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-yozora border-t border-gold-subtle">
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <div>
          <img src={logo} alt="Yozora Lounge" className="w-40 h-auto mb-2" />
          <p className="text-ivory font-heading italic text-sm opacity-70">
            Where the Night Begins
          </p>
        </div>
        <div>
          <h4 className="small-caps-gold mb-6">Navigation</h4>
          <div className="flex flex-col gap-3">
            <Link to="/how-it-works" className="text-ivory text-sm opacity-70 hover:opacity-100 transition-opacity">How It Works</Link>
            <Link to="/talents" className="text-ivory text-sm opacity-70 hover:opacity-100 transition-opacity">Talents</Link>
            <Link to="/credits" className="text-ivory text-sm opacity-70 hover:opacity-100 transition-opacity">Credits</Link>
            <Link to="/contact" className="text-ivory text-sm opacity-70 hover:opacity-100 transition-opacity">Contact</Link>
            <Link to="/join" className="text-ivory text-sm opacity-70 hover:opacity-100 transition-opacity">Become a Talent</Link>
          </div>
        </div>
        <div>
          <h4 className="small-caps-gold mb-6">Contact</h4>
          <p className="text-ivory text-sm opacity-70 mb-4">hello@yozoralounge.com</p>
          <div className="flex gap-6 text-gold">
            <span className="text-sm opacity-70 hover:opacity-100 cursor-pointer transition-opacity">Instagram</span>
            <span className="text-sm opacity-70 hover:opacity-100 cursor-pointer transition-opacity">Twitter</span>
            <span className="text-sm opacity-70 hover:opacity-100 cursor-pointer transition-opacity">Facebook</span>
          </div>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-gold-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-ivory-muted text-xs">© 2026 Yozora Lounge. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="text-ivory-muted text-xs hover:text-ivory cursor-pointer transition-colors">Privacy Policy</span>
          <span className="text-ivory-muted text-xs hover:text-ivory cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
