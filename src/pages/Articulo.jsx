// src/pages/Articulo.jsx
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ARTICULOS_BLOG } from '../articles';
import { FaArrowLeft } from 'react-icons/fa6';
import Footer from '../components/Footer';

function Articulo() {
  const { id } = useParams();
  const articulo = ARTICULOS_BLOG.find(art => art.id === id);

  if (!articulo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-black text-negro-barber mb-4">Artículo no encontrado</h2>
        <Link to="/blog" className="text-marron font-bold uppercase text-xs tracking-wider">Volver al blog</Link>
      </div>
    );
  }

  // 👇 Extraemos el componente para poder dibujarlo como una etiqueta HTML
  const ContenidoDelArticulo = articulo.Componente;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">

      <Helmet>
        <title>{`${articulo.titulo} | The Barber Studio 1225`}</title>
        
        <meta name="description" content={articulo.resumen} />
        <meta property="og:title" content={articulo.titulo} />
        <meta property="og:description" content={articulo.resumen} />
        <meta property="og:image" content={articulo.imagenPortada} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Barra superior */}
      <nav className="w-full border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-negro-barber transition font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            <FaArrowLeft /> Volver al Blog
          </Link>
          <span className="bg-dorado/10 text-dorado font-black text-[9px] sm:text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
            Blog Oficial
          </span>
        </div>
      </nav>

      <main className="grow pb-24">
        
        {/* Cabecera */}
        <header className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-negro-barber tracking-tighter leading-tight mb-6">
            {articulo.titulo}
          </h1>
          <p className="text-gray-500 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            {articulo.resumen}
          </p>
        </header>

        {/* Imagen de Portada */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <div className="w-full h-[40vh] md:h-[65vh] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={articulo.imagenPortada} 
              alt={articulo.titulo} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
            />
          </div>
        </div>

        {/* 👇 COLUMNA CENTRAL: Donde la magia del componente sucede */}
        <article className="max-w-3xl mx-auto px-6">
          <div className="text-lg md:text-xl text-gray-700 leading-loose space-y-6 
                       [&>h3]:text-2xl md:[&>h3]:text-3xl [&>h3]:font-black [&>h3]:text-negro-barber [&>h3]:mt-14 [&>h3]:mb-6 [&>h3]:tracking-tight 
                       [&>b]:text-marron-oscuro [&>b]:font-black
                       [&>p]:mb-6">
            
            {/* Aquí React "pegará" todo lo que hayas programado en src/articles/TiposDeFade.jsx */}
            <ContenidoDelArticulo />
            
          </div>

          <hr className="my-16 border-gray-200" />

          {/* CTA Final */}
          <div className="bg-gray-50 p-8 md:p-14 rounded-3xl text-center border border-gray-100 shadow-inner">
            <h4 className="text-2xl md:text-3xl font-black text-negro-barber mb-4 tracking-tighter uppercase italic">
              ¿Inspirado por este artículo?
            </h4>
            <p className="text-gray-500 text-sm md:text-base mb-8 max-w-md mx-auto">
              Ponemos en práctica estos consejos todos los días. Agenda tu cita en Zapopan y deja tu imagen en manos de profesionales.
            </p>
            <Link 
              to="/" 
              className="inline-block bg-negro-barber text-dorado font-black text-center py-4 px-12 rounded-xl text-sm uppercase tracking-widest hover:bg-dorado hover:text-negro-barber transition-all shadow-xl hover:-translate-y-1"
            >
              Agendar mi Cita Ahora
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

export default Articulo;