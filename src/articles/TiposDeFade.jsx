import React from 'react';
import tiposDeFadeImg from '../assets/blog/TiposDeFade/TiposDeFade.webp';
import lowFadeImg from '../assets/blog/TiposDeFade/LowFade.webp';
import midFadeImg from '../assets/blog/TiposDeFade/MidFade.webp';
import highFadeImg from '../assets/blog/TiposDeFade/HighFade.webp';
import final from '../assets/blog/TiposDeFade/Final.webp';

export const meta = {
  id: "tipos-de-fade",
  titulo: "Tipos de fade y cuál elegir",
  resumen: "Conoce las diferencias entre Low Fade, Mid Fade y High Fade, y aprende cuál se adapta mejor a tu rostro, estilo y rutina diaria.",
  imagenMiniatura: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&auto=format&fit=crop&q=60",
  imagenPortada: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200",
};

const fadeImages = {
  tipos: tiposDeFadeImg,
   low: lowFadeImg,
   mid: midFadeImg,
  high: highFadeImg,
  final: final,
};

function ArticleImage({ src, alt, caption, contain = false }) {
  return (
    <div className="my-10 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <img
        src={src}
        alt={alt}
        className={`w-full h-72 md:h-96 ${contain ? 'object-contain bg-gray-50' : 'object-cover'}`}
        loading="lazy"
      />
      <p className="text-center text-xs text-gray-400 py-3 px-4 bg-gray-50 italic">
        {caption}
      </p>
    </div>
  );
}

export default function TiposDeFade() {
  return (
    <>
      <p>
        El <b>fade</b>, también conocido como desvanecido, es uno de los cortes más pedidos en la barbería moderna. Su atractivo está en el acabado limpio de los laterales, el contraste entre zonas cortas y largas, y la facilidad para adaptarlo a diferentes estilos.
      </p>

      <p>
        Aunque muchas personas llegan pidiendo simplemente “un fade”, existen diferentes tipos de desvanecido. La diferencia principal está en <b>qué tan alto comienza el degradado</b> y qué tanto contraste genera en el rostro.
      </p>

      <p>
        Elegir bien el tipo de fade puede cambiar por completo tu apariencia. Un fade bajo puede verse elegante y discreto, mientras que uno alto puede dar una imagen más fuerte, marcada y moderna.
      </p>

      <ArticleImage
        src={fadeImages.tipos}
        alt="Tipos de fade: Low Fade, Mid Fade y High Fade"
        caption="Tipos de fade: Low Fade, Mid Fade y High Fade."
        contain
      />

      <h3>1. Low Fade: discreto, limpio y elegante</h3>

      <p>
        El <b>Low Fade</b> es el desvanecido más bajo. El corte empieza a degradarse muy cerca de la oreja y de la nuca, dejando la mayor parte del cabello lateral con una transición suave.
      </p>

      <p>
        Este estilo es ideal para quienes quieren verse arreglados sin llamar demasiado la atención. Funciona muy bien para ambientes de trabajo, escuela o situaciones donde se busca un corte limpio, pero no demasiado agresivo.
      </p>

      <p>
        También es una excelente opción si es tu primera vez probando un fade, porque mantiene una apariencia clásica y fácil de peinar.
      </p>

      <p>
        <b>Recomendado para:</b> rostros ovalados, alargados o personas que prefieren un estilo más formal.
      </p>

      <ArticleImage
        src={fadeImages.low}
        alt="Ejemplo de Low Fade elegante con degradado bajo"
        caption="Low Fade: una transición baja, discreta y fácil de mantener."
      />

      <h3>2. Mid Fade: el equilibrio perfecto</h3>

      <p>
        El <b>Mid Fade</b> es probablemente el más versátil. El desvanecido comienza aproximadamente a la altura media de la cabeza, justo por encima de las orejas. Esto crea un contraste más visible que el Low Fade, pero sin llegar a ser tan extremo como el High Fade.
      </p>

      <p>
        Este corte funciona muy bien porque se adapta a muchos estilos: cabello corto, cabello con textura, crop, quiff, slick back o incluso cortes más urbanos. Además, ayuda a marcar mejor la forma del rostro sin endurecer demasiado las facciones.
      </p>

      <p>
        Como puedes ver en este tipo de corte, el Mid Fade deja una transición limpia en los laterales y permite conservar volumen arriba. Por eso es una de las opciones más recomendadas si quieres verte moderno, pero sin exagerar.
      </p>

      <p>
        <b>Recomendado para:</b> casi cualquier tipo de rostro, especialmente si buscas un corte moderno, equilibrado y fácil de mantener.
      </p>

      <ArticleImage
        src={fadeImages.mid}
        alt="Ejemplo de Mid Fade con laterales limpios y volumen superior"
        caption="Mid Fade: el punto medio entre un estilo discreto y uno más marcado."
      />

      <h3>3. High Fade: más contraste y actitud</h3>

      <p>
        El <b>High Fade</b> es el desvanecido más alto. La transición comienza más arriba de la cabeza, dejando los laterales muy limpios y creando un contraste fuerte con la parte superior.
      </p>

      <p>
        Es un corte con mucha presencia. Se nota más, marca mejor la estructura del rostro y suele dar una apariencia más atrevida, juvenil y urbana. Si buscas un cambio visible, este estilo puede ser una gran opción.
      </p>

      <p>
        Sin embargo, también requiere más mantenimiento. Al tener los laterales tan cortos, el crecimiento se nota más rápido, por lo que conviene retocarlo con mayor frecuencia para conservar el acabado limpio.
      </p>

      <p>
        <b>Recomendado para:</b> rostros redondos o cuadrados, personas que buscan un look más marcado, moderno y con mayor contraste.
      </p>

      <ArticleImage
        src={fadeImages.high}
        alt="Ejemplo de High Fade con contraste fuerte en laterales"
        caption="High Fade: más contraste, laterales limpios y una presencia más urbana."
      />

      <h3>¿Cuál fade deberías elegir?</h3>

      <p>
        La elección depende de tres cosas: tu tipo de rostro, tu estilo personal y qué tanto mantenimiento estás dispuesto a darle al corte.
      </p>

      <p>
        Si quieres algo elegante y discreto, el <b>Low Fade</b> es una apuesta segura. Si buscas un punto medio que se vea moderno y funcione para casi todo, el <b>Mid Fade</b> es probablemente la mejor opción. Si quieres un cambio más fuerte y llamativo, el <b>High Fade</b> puede darte ese toque más definido.
      </p>

      <p>
        Un buen barbero no solo ejecuta el corte; también analiza la forma de tu cabeza, el crecimiento de tu cabello y el estilo que quieres proyectar. Por eso, antes de elegir, vale la pena pedir una recomendación personalizada.
      </p>

      <h3>Consejo final de barbería</h3>

      <p>
        Si no estás seguro de cuál elegir, empieza con un <b>Mid Fade</b>. Es el más equilibrado, combina con muchos estilos y te permite experimentar sin irte a un extremo.
      </p>

      <p>
        Después, en tu siguiente visita, puedes decidir si quieres bajarlo para un estilo más clásico o subirlo para un look más marcado.
      </p>

      <ArticleImage
        src={fadeImages.final}
        alt="Barbero terminando un corte fade en barbería"
        caption="El mejor fade es el que se adapta a tu rostro, tu rutina y tu estilo personal."
      />
    </>
  );
}
