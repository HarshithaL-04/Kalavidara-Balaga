import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-natural-secondary pt-16 pb-8 border-t border-natural-border text-natural-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-natural-primary rounded-full flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rotate-45"></div>
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight">
                Kalavidara Balaga
              </span>
            </div>
            <p className="text-natural-muted text-sm leading-relaxed mb-6 font-medium">
              A community-driven platform dedicated to empowering folk artists and preserving the rich cultural heritage of Karnataka.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-natural-border flex items-center justify-center hover:bg-natural-primary hover:text-white transition-all text-natural-muted shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-natural-border flex items-center justify-center hover:bg-natural-primary hover:text-white transition-all text-natural-muted shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-natural-border flex items-center justify-center hover:bg-natural-primary hover:text-white transition-all text-natural-muted shadow-sm">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-natural-primary mb-6">Explore</h4>
            <ul className="space-y-4 text-natural-muted text-sm font-medium">
              <li><Link to="/explore" className="hover:text-natural-primary">Find Artists</Link></li>
              <li><Link to="/explore?category=yakshagana" className="hover:text-natural-primary">Yakshagana</Link></li>
              <li><Link to="/explore?category=dollu" className="hover:text-natural-primary">Dollu Kunitha</Link></li>
              <li><Link to="/explore?category=kamsale" className="hover:text-natural-primary">Kamsale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-natural-primary mb-6">For Artists</h4>
            <ul className="space-y-4 text-natural-muted text-sm font-medium">
              <li><Link to="/signup" className="hover:text-natural-primary">Register Your Troupe</Link></li>
              <li><Link to="/login" className="hover:text-natural-primary">Artist Dashboard</Link></li>
              <li><Link to="/support" className="hover:text-natural-primary">Resources & Support</Link></li>
              <li><Link to="/terms" className="hover:text-natural-primary">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-natural-primary mb-6">Contact Us</h4>
            <ul className="space-y-4 text-natural-muted text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-natural-accent shrink-0" />
                <span>123, Janapada Loka, Ramanagara, Karnataka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-natural-accent shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-natural-accent shrink-0" />
                <span>hello@kalavidara.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-natural-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-natural-muted uppercase tracking-widest font-bold">
          <p>© 2026 Kalavidara Balaga. Preserving Traditional Soul.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-natural-primary">Privacy Policy</Link>
            <Link to="/cookies" className="hover:text-natural-primary">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
