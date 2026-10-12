import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionsRef = useRef([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      () => {},
      { threshold: 0.3 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold font-cairo tracking-tight">
            Fleet<span className="text-accent">ly</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["Home", "Vehicles", "Offers", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-cairo text-gray-300 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-cairo text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-accent text-dark text-sm font-semibold rounded-full hover:bg-accent-light transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        data-index="0"
        className="relative min-h-screen flex items-center justify-center pt-20"
      >
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/cars/hero-porsche.jpg)" }} />
        <div className="absolute inset-0 bg-linear-to-b from-dark/90 via-dark/60 to-dark" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-cairo font-extrabold uppercase tracking-tight mb-6 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="bg-linear-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent">
              Liberate Your
            </span>
            <br />
            <span className="bg-linear-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent">
              Drive
            </span>
          </h1>
          <p
            className={`text-lg md:text-xl font-cairo font-light text-gray-300 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Rent exceptional vehicles for unforgettable moments
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Link
              to="/fleet"
              className="px-8 py-4 bg-accent text-dark font-semibold rounded-full hover:bg-accent-light transition-all hover:scale-105"
            >
              Explore Fleet
            </Link>
            <a
              href="#about"
              className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </div>

          {/* Search Widget */}
          <div
            className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto transition-all duration-1000 delay-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-left">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Pickup Location</label>
                <input
                  type="text"
                  placeholder="City or airport"
                  className="w-full mt-2 bg-transparent border-b border-white/20 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="text-left">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Start Date</label>
                <input
                  type="datetime-local"
                  className="w-full mt-2 bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="text-left">
                <label className="text-xs text-gray-400 uppercase tracking-wider">End Date</label>
                <input
                  type="datetime-local"
                  className="w-full mt-2 bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full py-3 bg-accent text-dark font-semibold rounded-lg hover:bg-accent-light transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        data-index="1"
        className="py-32 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-cairo font-light mb-4">
              Feel the <span className="font-bold">Road</span>
            </h2>
            <p className="text-gray-400 font-cairo">An unparalleled driving experience</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-cairo font-normal">
                You've never experienced anything like it.
              </h3>
              <p className="text-gray-400 font-cairo leading-relaxed">
                Enjoy total freedom behind the wheel of carefully selected vehicles for their
                performance, comfort, and style. Whether for a getaway weekend, a special event,
                or a high-end business trip, we put the key to your dreams in your hands.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors group"
              >
                <span className="font-cairo">Contact Us</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-3/4 bg-linear-to-br from-dark-light to-dark rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-dark/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-sm text-gray-300 font-cairo italic">
                    "The perfect blend of power and elegance"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        data-index="2"
        className="py-32 px-6 bg-dark-light/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-cairo font-light mb-4">
              Browse Our <span className="font-bold">Models</span>
            </h2>
            <p className="text-gray-400 font-cairo">Choose your favorite vehicle</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Porsche 911 GT3",
                category: "Sport & Performance",
                description:
                  "The perfect blend of power, aerodynamics, and adrenaline on track and road.",
                price: "350€",
              },
              {
                name: "Porsche Panamera",
                category: "Luxury Sedan",
                description:
                  "Ultimate comfort for long journeys, combining VIP elegance and onboard technology.",
                price: "280€",
              },
              {
                name: "Porsche 911 Classic",
                category: "Classic & Legend",
                description:
                  "Relive the timeless charm of legendary automobiles for your exceptional events.",
                price: "400€",
              },
            ].map((car, index) => (
              <div
                key={index}
                className="group bg-dark border border-white/10 rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-4/3 bg-linear-to-br from-dark-light to-dark relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-dark to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                      {car.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-cairo font-semibold mb-2 group-hover:text-accent transition-colors">
                    {car.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-cairo mb-4">{car.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500">From</span>
                      <p className="text-2xl font-bold text-accent">{car.price}/day</p>
                    </div>
                    <button className="px-4 py-2 border border-white/20 text-sm rounded-full hover:bg-white/10 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        data-index="3"
        className="py-32 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-cairo font-light mb-4">
              Why <span className="font-bold">Choose Us</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "All-Inclusive",
                description: "Comprehensive insurance and 24/7 assistance.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                title: "Custom Delivery",
                description: "Pickup at airport, hotel, or your home.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: "100% Online",
                description: "Simple, fast booking process with no hidden fees.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 border border-white/10 rounded-2xl hover:border-accent/30 transition-all duration-500"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-cairo font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 font-cairo">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        data-index="4"
        className="py-32 px-6 bg-dark-light/50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-cairo font-light mb-16">
            What Our <span className="font-bold">Clients Say</span>
          </h2>
          <blockquote className="text-2xl md:text-3xl font-cairo font-light italic text-gray-300 mb-8">
            "An impeccable experience from start to finish. The vehicle was in pristine condition.
            I highly recommend!"
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              M
            </div>
            <div className="text-left">
              <p className="font-semibold">Marc D.</p>
              <p className="text-sm text-gray-400">Verified Customer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <Link to="/" className="text-2xl font-bold font-cairo tracking-tight">
                Fleet<span className="text-accent">ly</span>
              </Link>
              <p className="mt-4 text-gray-400 text-sm font-cairo">
                Exceptional vehicle rental for unforgettable moments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Legal Notice</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {["Instagram", "LinkedIn", "Facebook"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-colors"
                  >
                    <span className="text-xs">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to receive our private offers and news.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-l-lg text-sm focus:outline-none focus:border-accent"
                />
                <button className="px-4 py-2 bg-accent text-dark rounded-r-lg hover:bg-accent-light transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Fleetly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
