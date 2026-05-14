import React from 'react';
import { Search, MapPin, Music2, Calendar as CalendarIcon, TrendingUp, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col gap-16 pb-20 bg-natural-bg">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-natural-secondary border-b border-natural-border">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-natural-text"
          >
            <span className="inline-block px-3 py-1 bg-natural-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
              Karnataka's Largest Folk Network
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 font-serif">
              Discover Traditional <br />
              <span className="text-natural-accent italic font-medium">Soulful Artistry</span>
            </h1>
            <p className="text-lg md:text-xl text-natural-muted mb-8 max-w-lg leading-relaxed font-medium">
              Connecting heritage artists with modern events. Book elite performers for your next cultural gathering.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/explore" className="bg-natural-primary hover:bg-natural-primary/90 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-natural-primary/20">
                Book an Artist <ArrowRight size={20} />
              </Link>
              <Link to="/signup" className="bg-white/50 hover:bg-white text-natural-text px-8 py-3 rounded-full font-bold border border-natural-border transition-all">
                List Your Troupe
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 w-full">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-natural-border grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-natural-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search by Art Form..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-natural-border focus:ring-1 focus:ring-natural-primary focus:border-transparent outline-hidden transition-all text-sm bg-natural-bg/30"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-natural-muted" size={18} />
            <select className="w-full pl-10 pr-4 py-3 rounded-xl border border-natural-border focus:ring-1 focus:ring-natural-primary focus:border-transparent outline-hidden transition-all text-sm appearance-none bg-natural-bg/30">
              <option value="">Select District</option>
              <option value="bangalore">Bangalore</option>
              <option value="mysore">Mysore</option>
              <option value="dharwad">Dharwad</option>
              <option value="shivmogga">Shivmogga</option>
            </select>
          </div>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-natural-muted" size={18} />
            <input 
              type="date" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-natural-border focus:ring-1 focus:ring-natural-primary focus:border-transparent outline-hidden transition-all text-sm bg-natural-bg/30"
            />
          </div>
          <Link to="/explore" className="bg-natural-primary text-white py-3 rounded-xl font-bold hover:bg-natural-primary/90 transition-all shadow-md text-sm flex items-center justify-center">
            Find Performers
          </Link>
        </div>
      </div>

      {/* Featured Art Forms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-natural-text font-serif">Explore Art Forms</h2>
            <p className="text-natural-muted mt-2 font-medium">Discover the rich diversity of our traditional performances</p>
          </div>
          <Link to="/explore" className="text-natural-primary font-bold group flex items-center gap-1 hover:gap-2 transition-all underline underline-offset-4">
            See All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Dollu Kunitha', img: 'https://images.unsplash.com/photo-1514525253361-b83f820c2b4d?auto=format&fit=crop&q=80&w=400', color: 'orange' },
            { name: 'Yakshagana', img: 'https://images.unsplash.com/photo-1590076247867-a2f99ac66b73?auto=format&fit=crop&q=80&w=400', color: 'red' },
            { name: 'Pooja Kunitha', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400', color: 'yellow' },
            { name: 'Kamsale', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=400', color: 'green' },
            { name: 'Veeragase', img: 'https://images.unsplash.com/photo-1596742572447-9150097764d8?auto=format&fit=crop&q=80&w=400', color: 'red' },
            { name: 'Hulivesha', img: 'https://images.unsplash.com/photo-1622321151603-909289e6eb14?auto=format&fit=crop&q=80&w=400', color: 'orange' },
            { name: 'Bhoota Kola', img: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=400', color: 'purple' },
            { name: 'Goravara Kunitha', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400', color: 'blue' }
          ].map((art, i) => (
            <motion.div 
              key={art.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative aspect-square rounded-3xl overflow-hidden group cursor-pointer border border-natural-border shadow-sm"
            >
              <img src={art.img} alt={art.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90" />
              <div className="absolute inset-0 bg-linear-to-t from-natural-primary/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-bold text-lg font-serif">{art.name}</h3>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Explore Troupes</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Performers Section */}
      <section className="bg-natural-secondary/50 py-16 border-y border-natural-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-natural-primary" />
            <h2 className="text-3xl font-bold text-natural-text font-serif">Featured Troupes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Kashiraya Dollu Troupe",
                  artForm: "Dollu Kunitha",
                  location: "Shimoga",
                  rating: 4.9,
                  reviews: 156,
                  price: 18000,
                  img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600",
                  desc: "A legendary troupe preserving the ancient rhythm of Shimoga. They specialize in high-energy drum dance and gravity-defying acrobatics, having performed at critical state-level heritage festivals."
                },
                {
                  name: "Coastal Yakshagana Mandali",
                  artForm: "Yakshagana",
                  location: "Udupi",
                  rating: 5.0,
                  reviews: 84,
                  price: 35000,
                  img: "https://images.unsplash.com/photo-1590076247867-a2f99ac66b73?auto=format&fit=crop&q=80&w=600",
                  desc: "Masters of the 'Badaguthittu' style, this mandali brings mythological epics like Mahabharata to life with authentic facial makeup, hand-crafted costumes, and powerful classical dialogue."
                },
                {
                  name: "Hulivesha Masters Mangaluru",
                  artForm: "Hulivesha",
                  location: "Mangalore",
                  rating: 4.9,
                  reviews: 112,
                  price: 15000,
                  img: "https://images.unsplash.com/photo-1622321151603-909289e6eb14?auto=format&fit=crop&q=80&w=600",
                  desc: "The most iconic tiger dance troupe of coastal Karnataka. They are renowned for their incredible stamina, realistic tiger-like movements, and traditional rhythms that define the spirit of Mangalore's Dasara."
                },
                {
                  name: "Vijayanagara Veeragase Sangha",
                  artForm: "Veeragase",
                  location: "Chikmagalur",
                  rating: 4.7,
                  reviews: 64,
                  price: 20000,
                  img: "https://images.unsplash.com/photo-1608508644127-ae99d652961d?auto=format&fit=crop&q=80&w=600",
                  desc: "Powerful Saivite folk dancers known for their intense expressions and traditional swords. Their performance is a rhythmic journey dedicated to Lord Shiva, featuring elaborate headgear and chanting."
                },
                {
                  name: "Karavali Bhoota Kola Samiti",
                  artForm: "Bhoota Kola",
                  location: "Mangalore",
                  rating: 5.0,
                  reviews: 42,
                  price: 45000,
                  img: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600",
                  desc: "Executing the sacred ritual of spirit worship with absolute authenticity. This group represents the deep-rooted faith of Tulu Nadu, featuring elaborate costumes, stunning makeup, and divine oracles."
                },
                {
                  name: "Goravara Kunitha Balaga",
                  artForm: "Goravara Kunitha",
                  location: "Tumkur",
                  rating: 4.8,
                  reviews: 76,
                  price: 12000,
                  img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=600",
                  desc: "Devotional dance of Shiva's followers, featuring performers in signature black bear-fur caps. Their performance is a spiritual blend of rhythmic music and agility using traditional drums and flutes."
                }
              ].map((troupe, i) => (
               <motion.div 
                 key={troupe.name}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-natural-border group"
               >
                 <div className="relative h-52 overflow-hidden">
                    <img src={troupe.img} alt={troupe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 text-natural-accent">
                      <Star size={12} className="fill-natural-accent" /> {troupe.rating} ({troupe.reviews})
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-natural-primary text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold tracking-wider">{troupe.artForm}</span>
                    </div>
                 </div>
                 <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-bold text-natural-text font-serif">{troupe.name}</h3>
                       <CheckCircle2 size={18} className="text-blue-500" />
                    </div>
                    <div className="flex items-center gap-2 text-natural-muted font-medium text-sm mb-4">
                      <MapPin size={14} className="text-natural-primary" /> {troupe.location} District
                    </div>
                    <p className="text-natural-muted text-sm line-clamp-4 mb-6 leading-relaxed">
                      {troupe.desc}
                    </p>
                    <div className="flex items-center justify-between border-t border-natural-border pt-4">
                       <div className="text-sm">
                          <span className="text-[10px] font-bold text-natural-muted uppercase tracking-wider">Starting from</span>
                          <div className="text-lg font-bold text-natural-accent font-serif">₹{troupe.price.toLocaleString()}</div>
                       </div>
                       <Link to={`/performer/${i + 1}`} className="bg-natural-secondary border border-natural-border text-natural-text px-5 py-2 rounded-xl text-sm font-bold hover:bg-natural-primary hover:text-white transition-all shadow-sm">
                          View Profile
                       </Link>
                    </div>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
               <div className="w-16 h-16 bg-natural-primary/10 text-natural-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} />
               </div>
               <h3 className="text-xl font-bold mb-2 font-serif text-natural-text">Verified Artists</h3>
               <p className="text-natural-muted text-sm font-medium">Every troupe is vetted by our admin team for authenticity and quality.</p>
            </div>
            <div>
               <div className="w-16 h-16 bg-natural-accent/10 text-natural-accent rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Music2 size={32} />
               </div>
               <h3 className="text-xl font-bold mb-2 font-serif text-natural-text">Preserving Culture</h3>
               <p className="text-natural-muted text-sm font-medium">Empowering traditional folk groups by connecting them with new markets.</p>
            </div>
            <div>
               <div className="w-16 h-16 bg-natural-muted/10 text-natural-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp size={32} />
               </div>
               <h3 className="text-xl font-bold mb-2 font-serif text-natural-text">Secure Bookings</h3>
               <p className="text-natural-muted text-sm font-medium">Manage your event details and payments securely through our platform.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
