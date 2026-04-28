import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

function Portafolio() {
  const trabajos = [
    { id: 1, url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80", tag: "Fade Clásico" },
    { id: 2, url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80", tag: "Perfilado de Barba" },
    { id: 3, url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80", tag: "Corte Moderno" },
    { id: 4, url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80", tag: "Tijera Premium" },
    { id: 5, url: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80", tag: "Estilo Urbano" },
    { id: 6, url: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=800&q=80", tag: "Texturizado VIP" },
  ];

  return (
    <div className="min-h-screen bg-negro-barber py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            NUESTRO <span className="text-dorado">TRABAJO</span>
          </h1>
          <div className="w-24 h-1 bg-dorado mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {trabajos.map((item) => (
            <div key={item.id} className="relative group overflow-hidden rounded-xl border border-gray-800 hover:border-dorado transition-all duration-500 shadow-2xl aspect-4/5">
              <img 
                src={item.url} 
                alt={item.tag} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-negro-barber via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <span className="text-dorado font-bold text-xl tracking-wider">{item.tag}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/" className="inline-flex items-center gap-2 text-dorado font-bold hover:text-white transition-all border-b border-transparent hover:border-dorado pb-1">
            <FaArrowLeft /> VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Portafolio;