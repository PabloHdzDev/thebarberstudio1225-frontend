import { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaPhone } from 'react-icons/fa6';

function Home() {
  const [servicios, setServicios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resServ, resProd] = await Promise.all([
          api.get('/servicios'),
          api.get('/productos')
        ]);
        setServicios(resServ.data);
        setProductos(resProd.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // 👇 LÓGICA DE BANNER UNIFICADO: Busca ofertas en servicios O productos
  const hayOfertasActivas = servicios.some(s => s.esOferta && s.activo) || 
                            productos.some(p => p.esOferta && p.activo);

  return (
    <div className="font-sans text-negro-barber">
      
      {/* BANNER DE OFERTAS DINÁMICO (ÚNICO) */}
      {hayOfertasActivas && (
        <div className="bg-rojo-oferta text-white py-3 px-4 text-center sticky top-0 z-50 shadow-lg flex items-center justify-center gap-3">
          <span className="animate-bounce text-xl">🔥</span>
          <p className="text-[10px] sm:text-sm font-black uppercase tracking-widest">
            ¡Aprovecha nuestras promociones exclusivas por tiempo limitado!
          </p>
          <span className="animate-bounce text-xl">🔥</span>
        </div>
      )}
      
      {/* 1. HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-beige text-negro-barber">
      <h1 className="text-4xl md:text-7xl xl:text-8xl font-black mb-4 tracking-tighter">
        <span className="block text-2xl md:text-4xl xl:text-5xl">THE</span>
        BARBER STUDIO
        <div className="flex items-center gap-4 mt-2">
          <span className="ml-5 md:ml-15 flex-1 h-1 bg-negro-suave"></span>
          <span className="text-2xl md:text-4xl xl:text-5xl whitespace-nowrap">1225</span>
          <span className="mr-5 md:mr-15 flex-1 h-1 bg-negro-suave"></span>
        </div>
        </h1>
        <p className="text-xl md:text-2xl text-negro-suave mb-10 max-w-2xl">
          Más que un corte: estilo, cuidado personal y piel impecable en un solo lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#servicios" className="border-3 border-marron bg-negro- hover:bg-marron text-marron hover:text-beige px-8 py-4 rounded-full font-extrabold text-lg transition-all shadow-lg shadow-beige/20">
            Agendar mi cita
          </a>
        </div>
      </section>

      {/* 2. SECCIÓN DE SERVICIOS */}
      <section id="servicios" className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 mx-2 sm:mx-10 md:mx-20">
            <div className="flex items-center justify-center gap-4">
              <span className="flex-1 h-1 bg-negro-suave max-w-80px md:max-w-120px"></span>
              <h2 className="text-xl md:text-4xl font-extrabold text-negro-barber uppercase tracking-tight whitespace-nowrap">
                Nuestros Servicios
              </h2>
              <span className="flex-1 h-1 bg-negro-suave max-w-80px md:max-w-120px"></span>
            </div>
          </div>
          
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-arena border-t-marron rounded-full animate-spin mb-4"></div>
              <p className="text-marron font-bold animate-pulse tracking-widest uppercase text-sm">Cargando...</p>
              <p className="text-marron font-bold animate-pulse tracking-widest uppercase text-xs">Puede tardar máximo 30 segundos</p>
            </div>
          ) : servicios.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 font-medium text-lg">Por el momento no hay servicios disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {servicios.map((s) => (
                <div key={s._id} className="group relative rounded-2xl overflow-hidden border border-arena bg-beige shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                  
                  {s.esOferta && (
                    <div className="absolute top-4 right-4 bg-rojo-oferta text-white text-[10px] sm:text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest z-20 shadow-lg shadow-rojo-oferta/40 animate-pulse border-2 border-rojo-oferta">
                      🔥 Oferta Especial
                    </div>
                  )}

                  <div className="h-56 overflow-hidden">
                    <img 
                      src={s.imagen || 'https://via.placeholder.com/400x300?text=Servicio+Barber+Studio+1225'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={s.nombre} 
                    />
                  </div>
                  <div className="p-8 grow relative z-10">
                    <h3 className="text-2xl font-bold mb-3 text-marron-oscuro group-hover:text-marron transition">{s.nombre}</h3>
                    <p className="text-negro-barber group-hover:text-negro-suave leading-relaxed">{s.descripcion}</p>
                  </div>
                  <div className="px-8 py-5 bg-beige-claro flex justify-between items-center mt-auto border-t border-beige/20">
                    
                    <div className="flex flex-col">
                      {s.esOferta && s.precioAnterior > 0 && (
                        <span className="text-xs text-gray-400 font-bold line-through mb-[-4px]">
                          ${s.precioAnterior}
                        </span>
                      )}
                      <span className={`text-2xl font-black group-hover:text-marron ${s.esOferta ? 'text-rojo-oferta' : 'text-marron-oscuro'}`}>
                        ${s.precio}
                      </span>
                    </div>

                    <Link to={`/reservar/${s._id}`} className={`px-5 py-2 rounded-lg font-semibold border hover:scale-105 transition-all ${
                      s.esOferta 
                      ? 'border-rojo-oferta bg-rojo-oferta text-white shadow-lg shadow-rojo-oferta/30' 
                      : 'border-marron bg-beige text-marron hover:text-beige hover:bg-marron'
                    }`}>
                      Reservar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. SECCIÓN DE PRODUCTOS */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 mx-2 sm:mx-10 md:mx-20">
            <div className="flex items-center justify-center gap-4">
              <span className="flex-1 h-1 bg-negro-suave max-w-80px md:max-w-120px"></span>
              <h2 className="text-xl md:text-4xl font-extrabold text-negro-barber uppercase tracking-tight whitespace-nowrap">
                Productos Destacados
              </h2>
              <span className="flex-1 h-1 bg-negro-suave max-w-80px md:max-w-120px"></span>
            </div>
          </div>
          
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-arena border-t-marron rounded-full animate-spin mb-4"></div>
              <p className="text-marron font-bold animate-pulse tracking-widest uppercase text-sm">Cargando...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 font-medium text-lg">Por el momento no hay productos disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {productos.map((prod) => (
                <div key={prod._id} className="group relative text-center p-4 border border-arena rounded-3xl bg-beige shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                  
                  {/* 👇 OVERLAY DE OFERTA PARA PRODUCTOS */}
                  {prod.esOferta && (
                    <div className="absolute top-4 right-4 bg-rojo-oferta text-white text-[10px] sm:text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest z-20 shadow-lg shadow-rojo-oferta/40 animate-pulse border-2 border-rojo-oferta">
                      🔥 Oferta Especial
                    </div>
                  )}

                  <div className="h-64 rounded-2xl mb-6 overflow-hidden bg-arena relative">
                      <img 
                        src={prod.imagen || 'https://via.placeholder.com/400x400?text=Producto'} 
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                        alt={prod.nombre} 
                      />
                  </div>

                  <div className="px-4 pb-4">
                      <h3 className="text-xl font-bold mb-2 text-marron-oscuro group-hover:text-marron transition uppercase tracking-tighter">
                          {prod.nombre}
                      </h3>
                      
                      {/* 👇 PRECIO TACHADO Y PRECIO DE OFERTA PARA PRODUCTOS */}
                      <div className="flex flex-col items-center justify-center mb-4">
                        {prod.esOferta && prod.precioAnterior > 0 && (
                          <span className="text-xs text-gray-400 font-bold line-through mb-[-4px]">
                            ${prod.precioAnterior}
                          </span>
                        )}
                        <p className={`font-black text-2xl group-hover:text-marron transition-colors ${prod.esOferta ? 'text-rojo-oferta' : 'text-marron-oscuro'}`}>
                            ${prod.precio} <span className="text-xs text-gray-400 font-normal">MXN</span>
                        </p>
                      </div>

                      <a
                          href={`https://wa.me/5213318688146?text=Hola! Me interesa comprar el producto: ${prod.nombre}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black transition-all duration-300 ${
                            prod.esOferta 
                            ? 'border-2 border-rojo-oferta text-rojo-oferta hover:bg-rojo-oferta hover:text-white' 
                            : 'border-2 border-marron text-marron hover:bg-marron hover:text-beige'
                          }`}
                      >
                          ADQUIRIR <FaWhatsapp className="text-xl" />
                      </a>
                      
                      {prod.stock <= 3 && prod.stock > 0 && (
                          <p className="text-[10px] font-bold text-red-500 mt-2">¡ÚLTIMAS {prod.stock} UNIDADES!</p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. HORARIOS Y UBICACIÓN */}
      <section className="py-20 bg-negro-barber text-white px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className=" p-10 rounded-3xl border border-gray-800">
            <h3 className="text-3xl font-bold mb-6 text-camel">Horario de Atención</h3>
            <ul className="space-y-4 text-sm sm:text-lg text-gray-300">
              <li className="flex justify-between border-b border-gray-700 pb-2">
                <span>Lunes - Domingos</span> <span>11:00 AM - 7:00 PM</span>
              </li>
              <li className="flex justify-between text-camel font-bold">
                <span>Miércoles</span> <span>Cerrado</span>
              </li>
            </ul>
          </div>

          <div className=" p-10 rounded-3xl flex flex-col justify-center border border-gray-800">
            <h3 className="text-3xl font-bold mb-4 text-camel">Ubicación</h3>

            <p className="text-gray-300 mb-6">
              Av. La Tijera 1225, Los Tulipanes, 45647
            </p>

            <div className="w-full h-48 bg-negro-barber rounded-xl flex items-center justify-center text-beige border border-gray-700 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1867.573429010577!2d-103.43487340160522!3d20.582059400000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428ad234eb3317f%3A0x8a43ef56fc8fa6ce!2z8J-SiEJhcmJlcsOtYSBzdHVkaW8gMTIyNfCfkog!5e0!3m2!1ses!2smx!4v1776730254597!5m2!1ses!2smx"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
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
            <a href="#" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
              <FaInstagram className="text-2xl" /> Instagram
            </a>
          </div>
          <p className="text-xs pt-8 text-gray-600 border-t border-gray-900">
            © {new Date().getFullYear()} The Barber Studio 1225. Calidad que se nota.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;