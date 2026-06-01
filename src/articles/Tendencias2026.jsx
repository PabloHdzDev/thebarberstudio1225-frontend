import React from 'react';
import cortesImg from '../assets/blog/Tendencias2026/Cortes.webp';
import texturedCropImg from '../assets/blog/Tendencias2026/TexturedCrop.webp';
import modernMulletImg from '../assets/blog/Tendencias2026/ModernMullet.webp';
import taperFadeImg from '../assets/blog/Tendencias2026/TaperFade.webp';
import buzzCutImg from '../assets/blog/Tendencias2026/BuzzCut.webp';
import quiffModernoImg from '../assets/blog/Tendencias2026/QuiffModerno.webp';
import corteClasicoImg from '../assets/blog/Tendencias2026/CorteClasico.webp';
import final from '../assets/blog/Tendencias2026/Final.webp';

export const meta = {
  id: "tendencias-cortes-2026",
  titulo: "Tendencias de cortes para hombre 2026",
  resumen: "Conoce los cortes masculinos que están marcando tendencia en 2026: estilos con textura, fades limpios, mullets modernos y looks fáciles de mantener.",
  imagenMiniatura: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&auto=format&fit=crop&q=60",
  imagenPortada: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200",
};

const tendenciasImages = {
  cortes: cortesImg,
  texturedCrop: texturedCropImg,
  modernMullet: modernMulletImg,
  taperFade: taperFadeImg,
  buzzCut: buzzCutImg,
  quiffModerno: quiffModernoImg,
  corteClasico: corteClasicoImg,
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

export default function Tendencias2026() {

  return (
    <>
      <p>
        Las tendencias de cortes para hombre en <b>2026</b> vienen con una idea clara: menos rigidez y más personalidad. Los peinados demasiado cargados de gel están quedando atrás, mientras que los cortes con textura, movimiento natural y acabados limpios siguen ganando fuerza.
      </p>

      <p>
        Este año no se trata solo de traer el corte de moda, sino de elegir un estilo que se adapte a tu rostro, tu tipo de cabello y tu rutina diaria. Un buen corte debe verse bien al salir de la barbería, pero también debe ser fácil de acomodar en casa.
      </p>

      <p>
        En barbería, las tendencias más fuertes combinan tres elementos: <b>laterales limpios</b>, <b>textura en la parte superior</b> y <b>acabados personalizados</b>. Desde un fade bien trabajado hasta un mullet moderno, la clave está en que el corte tenga intención.
      </p>

      <ArticleImage
        src={tendenciasImages.cortes}
        alt="Tendencias de cortes para hombre 2026"
        caption="Tendencias de cortes para hombre 2026: Textured Crop, Modern Mullet, Taper Fade, Buzz Cut con diseño y Quiff moderno."
        contain
      />

      <h3>1. Textured Crop: práctico, moderno y con mucha textura</h3>

      <p>
        El <b>Textured Crop</b> sigue siendo uno de los cortes más fuertes para hombre. Se caracteriza por llevar los laterales cortos y la parte superior con capas pequeñas, textura marcada y caída natural hacia el frente.
      </p>

      <p>
        Es un corte ideal para quienes quieren verse modernos sin tener que peinarse demasiado. Funciona muy bien con cabello lacio, ondulado o ligeramente grueso, ya que la textura permite que el corte tenga forma sin verse rígido.
      </p>

      <p>
        Para mantenerlo, normalmente basta con usar una cera mate o polvo texturizante. La idea no es dejarlo perfecto, sino darle un aspecto natural, con movimiento y volumen controlado.
      </p>

      <p>
        <b>Recomendado para:</b> hombres que buscan un corte moderno, fácil de peinar y con poco mantenimiento diario.
      </p>

      <ArticleImage
        src={tendenciasImages.texturedCrop}
        alt="Textured Crop: corte con textura marcada, laterales cortos y caída natural hacia el frente"
        caption="Textured Crop: corte con textura marcada, laterales cortos y caída natural hacia el frente."
      />

      <h3>2. Modern Mullet: el regreso con más estilo</h3>

      <p>
        El <b>Modern Mullet</b> sigue presente, pero ya no se lleva como antes. La versión actual es más limpia, más controlada y mucho más estilizada. Mantiene la idea de dejar más largo atrás, pero con laterales trabajados y textura en la parte superior.
      </p>

      <p>
        Lo interesante de este corte es que tiene mucha personalidad. Puede verse urbano, alternativo o elegante dependiendo de qué tan marcado lo quieras. Cuando se combina con un <b>Drop Fade</b> o un <b>Taper Fade</b>, el resultado se ve mucho más moderno.
      </p>

      <p>
        Es un corte que no es para todos, pero cuando se adapta bien al rostro y al estilo de la persona, puede destacar muchísimo.
      </p>

      <p>
        <b>Recomendado para:</b> personas que quieren un cambio visible, un estilo más atrevido y un corte con personalidad.
      </p>

      <ArticleImage
        src={tendenciasImages.modernMullet}
        alt="Modern Mullet: corte con estilo urbano, laterales con Drop Fade y textura en la parte superior"
        caption="Modern Mullet: corte con estilo urbano, laterales con Drop Fade y textura en la parte superior."
      />

      <h3>3. Taper Fade: limpio, elegante y muy versátil</h3>

      <p>
        El <b>Taper Fade</b> es una de las tendencias más fuertes porque combina elegancia y comodidad. A diferencia de otros fades más marcados, el taper trabaja principalmente la zona de patillas y nuca, dejando una transición limpia sin rapar demasiado los laterales.
      </p>

      <p>
        Este corte es perfecto si quieres verte arreglado sin cambiar radicalmente tu estilo. Se puede combinar con cabello largo, medio o corto, y funciona tanto para looks formales como casuales.
      </p>

      <p>
        Otra ventaja es que crece de forma más natural. Por eso, muchas personas lo prefieren cuando buscan un corte moderno, pero fácil de mantener durante más días.
      </p>

      <p>
        <b>Recomendado para:</b> quienes buscan un corte limpio, discreto, profesional y adaptable a casi cualquier estilo.
      </p>

      <ArticleImage
        src={tendenciasImages.taperFade}
        alt="Taper Fade: transición limpia desde patillas hasta laterales"
        caption="Taper Fade: transición limpia desde patillas hasta laterales."
      />

      <h3>4. Buzz Cut con diseño: simple, fuerte y personalizado</h3>

      <p>
        El <b>Buzz Cut</b> es un corte corto, directo y con mucha presencia. En 2026 sigue fuerte, pero ahora se combina con líneas, diseños o detalles personalizados en los laterales.
      </p>

      <p>
        Este estilo funciona muy bien para quienes quieren algo práctico y fresco. Además, al ser tan corto, resalta mucho la forma del rostro, la mandíbula y la estructura de la cabeza.
      </p>

      <p>
        Los diseños pueden ser sutiles, como una línea limpia, o más creativos, como figuras geométricas o trazos más marcados. La clave está en no saturarlo: un buen diseño debe verse limpio, preciso y bien integrado al corte.
      </p>

      <p>
        <b>Recomendado para:</b> hombres que buscan un look fresco, práctico, con actitud y fácil de mantener.
      </p>

      <ArticleImage
        src={tendenciasImages.buzzCut}
        alt="Buzz Cut con diseño: corte corto y práctico con detalles personalizados"
        caption="Buzz Cut con diseño: corte corto y práctico con detalles personalizados."
      />

      <h3>5. Quiff moderno: volumen con acabado natural</h3>

      <p>
        El <b>Quiff</b> es un clásico que sigue evolucionando. La versión moderna ya no se peina tan rígida ni tan brillante; ahora se busca más textura, volumen natural y movimiento.
      </p>

      <p>
        Este corte levanta visualmente el rostro, por eso favorece mucho a rostros redondos o facciones suaves. También funciona bien si quieres un estilo que se vea más producido sin perder naturalidad.
      </p>

      <p>
        Para peinarlo, lo ideal es usar productos con acabado mate o medio, evitando el exceso de gel. El objetivo es que tenga forma, pero que no se vea duro.
      </p>

      <p>
        <b>Recomendado para:</b> quienes buscan un corte con volumen, presencia y estilo sin caer en un peinado demasiado formal.
      </p>

      <ArticleImage
        src={tendenciasImages.quiffModerno}
        alt="Quiff moderno: corte con volumen natural y textura suave"
        caption="Quiff moderno: corte con volumen natural y textura suave."
      />

      <h3>6. Corte clásico con textura: elegante sin verse anticuado</h3>

      <p>
        Los cortes clásicos nunca desaparecen, pero sí se actualizan. En 2026, el corte clásico se lleva con textura más natural, laterales limpios y menos producto brillante.
      </p>

      <p>
        Es una gran opción para quienes quieren verse bien arreglados sin entrar en estilos demasiado llamativos. Funciona excelente para trabajo, eventos, escuela o simplemente para mantener una imagen pulida.
      </p>

      <p>
        La diferencia está en el acabado. En lugar de peinar todo perfectamente hacia un lado, se puede dejar un poco de movimiento para que el corte se vea más actual.
      </p>

      <p>
        <b>Recomendado para:</b> hombres que prefieren un estilo elegante, limpio y fácil de adaptar a diferentes ocasiones.
      </p>

      <ArticleImage
        src={tendenciasImages.corteClasico}
        alt="Corte clásico moderno: estilo elegante con textura natural y laterales limpios"
        caption="Corte clásico moderno: estilo elegante con textura natural y laterales limpios."
      />

      <h3>¿Qué tendencia elegir?</h3>

      <p>
        La mejor tendencia no siempre es la más llamativa, sino la que mejor se adapta a ti. Antes de elegir un corte, piensa en tres cosas: cuánto tiempo quieres dedicarle al peinado, qué tan seguido puedes retocarlo y qué imagen quieres proyectar.
      </p>

      <p>
        Si quieres algo práctico y moderno, el <b>Textured Crop</b> o el <b>Taper Fade</b> son excelentes opciones. Si buscas algo con más personalidad, el <b>Modern Mullet</b> o el <b>Buzz Cut con diseño</b> pueden ser una buena elección. Si prefieres un estilo con más presencia, el <b>Quiff moderno</b> puede ayudarte a destacar.
      </p>

      <h3>Consejo final de barbería</h3>

      <p>
        No llegues a la barbería solo con una foto. Lleva una idea, pero permite que el barbero adapte el corte a tu rostro, tipo de cabello y estilo de vida. Muchas veces, pequeños ajustes hacen que una tendencia se vea mucho mejor en ti.
      </p>

      <p>
        Un buen corte no solo debe verse actual. Debe hacerte sentir cómodo, seguro y listo para tu día a día.
      </p>

      <ArticleImage
        src={tendenciasImages.final}
        alt="Barbero terminando un corte moderno frente al espejo"
        caption="Barbero terminando un corte moderno frente al espejo, cliente viendo el resultado, ambiente premium, tonos negro, camel y dorado."
      />
    </>
  );
}