// src/pages/Blog.jsx
import { Link } from 'react-router-dom';
import { ARTICULOS_BLOG } from '../articles';
import { FaBookOpen, FaArrowLeft } from 'react-icons/fa6';
import Footer from '../components/Footer'; // 👈 Importamos el Footer

function Blog() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Contenido Principal que empuja el footer hacia abajo */}
      <main className="flex-grow py-16 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-6 sm:gap-0">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-negro-barber uppercase tracking-tighter flex items-center gap-2">
                <span className="sm:hidden">El <span className="text-dorado">Blog</span></span>
                <span className="hidden sm:inline">El <span className="text-dorado">Blog</span> Del Studio</span>
              </h1>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Consejos de estilo y cuidado personal</p>
            </div>
            <Link to="/" className="text-gray-400 hover:text-negro-barber transition font-black text-[10px] flex items-center gap-2 border-b border-transparent hover:border-negro-barber">
              <FaArrowLeft /> VOLVER AL INICIO
            </Link>
          </header>

          {/* GRID PURO */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {ARTICULOS_BLOG.map((art) => (
              <div 
                key={art.id} 
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="h-56 overflow-hidden bg-gray-100">
                  <img src={art.imagenMiniatura} alt={art.titulo} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 flex flex-col grow">
                  <h3 className="text-xl font-bold text-negro-barber mb-3 tracking-tight leading-snug">{art.titulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 grow">{art.resumen}</p>
                  
                  <Link 
                    to={`/blog/${art.id}`}
                    className="w-full text-center py-3 bg-gray-50 hover:bg-marron text-marron hover:text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-marron/20 hover:border-marron"
                  >
                    <FaBookOpen /> Leer Artículo
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Blog;