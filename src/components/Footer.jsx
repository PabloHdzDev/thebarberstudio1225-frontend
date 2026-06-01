// src/components/Footer.jsx
import { FaWhatsapp, FaFacebook, FaPhone } from 'react-icons/fa6';

function Footer() {
  return (
    <footer className="bg-black py-12 text-gray-400 text-center px-4 border-t border-beige/10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="flex-1 h-px md:h-2px bg-beige max-w-60px md:max-w-120px"></span>
          <h2 className="text-xl md:text-3xl font-bold text-beige uppercase tracking-widest whitespace-nowrap">
            The Barber Studio 1225
          </h2>
          <span className="flex-1 h-px md:h-2px bg-beige max-w-60px md:max-w-120px"></span>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-10 mb-10 text-lg">
          <a href="tel:+5213318688146" className="flex items-center gap-2 hover:text-beige transition-colors">
            <FaPhone /> +52 1 33 1868 8146
          </a>
          <a href="https://wa.me/5213318688146" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-green-500 transition-colors">
            <FaWhatsapp className="text-2xl" /> WhatsApp
          </a>
          <a href="https://www.facebook.com/profile.php?id=61584636415745" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-500 transition-colors">
            <FaFacebook className="text-2xl" /> Facebook
          </a>
        </div>
        <p className="text-xs pt-8 text-gray-600 border-t border-gray-900">
          © {new Date().getFullYear()} The Barber Studio 1225. Calidad que se nota.
        </p>
      </div>
    </footer>
  );
}

export default Footer;