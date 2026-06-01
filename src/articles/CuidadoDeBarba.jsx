import React from 'react';
import barbaArregladaImg from "../assets/blog/CuidadoDeBarba/BarbaArreglada.webp"
import lavadoImg from "../assets/blog/CuidadoDeBarba/LavadoBarba.webp"
import aceiteImg from "../assets/blog/CuidadoDeBarba/AceiteBarba.webp"
import peinadoImg from "../assets/blog/CuidadoDeBarba/PeinadoBarba.webp"
import delineadoImg from "../assets/blog/CuidadoDeBarba/DelineadoBarba.webp"
import recorteImg from "../assets/blog/CuidadoDeBarba/RecorteBarba.webp"
import final from "../assets/blog/CuidadoDeBarba/Final.webp"

export const meta = {
  id: "como-cuidar-tu-barba",
  titulo: "Cómo cuidar tu barba correctamente",
  resumen: "Aprende a mantener tu barba limpia, suave, hidratada y bien definida con una rutina sencilla que puedes aplicar todos los días.",
  imagenMiniatura: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&auto=format&fit=crop&q=60",
  imagenPortada: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200"
};

const barbaImages = {
  tipos: barbaArregladaImg,
  lavado: lavadoImg,
  aceite: aceiteImg,
  peinado: peinadoImg,
  delineado: delineadoImg,
  recorte: recorteImg,
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

export default function CuidadoDeBarba() {

  return (
    <>
      <p>
        Tener una barba atractiva no se trata solo de dejarla crecer. Una barba bien cuidada necesita limpieza, hidratación, forma y mantenimiento constante. De lo contrario, puede verse seca, desordenada o causar comezón en la piel.
      </p>

      <p>
        La diferencia entre una barba descuidada y una barba con estilo está en los detalles: cómo la lavas, cómo la hidratas, cómo la peinas y cada cuánto la perfilas. Incluso una barba corta puede verse mucho mejor si tiene una línea limpia y una textura saludable.
      </p>

      <p>
        En barbería, una buena barba siempre debe cumplir tres cosas: verse <b>limpia</b>, sentirse <b>suave</b> y tener una <b>forma definida</b>. Para lograrlo, no necesitas una rutina complicada, solo constancia y los productos correctos.
      </p>

      <ArticleImage
        src={barbaImages.tipos}
        alt="Barba bien arreglada"
        caption="Barba bien arreglada: limpia, suave y con forma definida."
      />

      <h3>Paso 1: Lava tu barba correctamente</h3>

      <p>
        El primer error común es lavar la barba con el mismo shampoo del cabello. Aunque parezca práctico, no siempre es lo ideal. El vello facial suele ser más grueso y la piel del rostro puede resecarse con facilidad.
      </p>

      <p>
        Lo mejor es usar un <b>jabón o shampoo especial para barba</b>, ya que limpia sin dejar la piel demasiado seca. Esto ayuda a eliminar sudor, grasa, polvo, restos de comida y células muertas que se acumulan durante el día.
      </p>

      <p>
        No necesitas lavarla con producto todos los días. En la mayoría de los casos, con hacerlo <b>2 o 3 veces por semana</b> es suficiente. Los demás días puedes enjuagarla con agua y mantenerla fresca.
      </p>

      <p>
        Si tu barba es muy grasa, trabajas al aire libre o sudas mucho, puedes lavarla con mayor frecuencia, pero siempre cuidando que no se reseque.
      </p>

      <ArticleImage
        src={barbaImages.lavado}
        alt="Barba siendo lavada con espuma"
        caption="Barba siendo lavada con espuma: enfoque en higiene y cuidado."
      />

      <h3>Paso 2: Hidrata la piel debajo de la barba</h3>

      <p>
        La comezón en la barba casi siempre aparece porque la piel debajo está seca. Muchas personas se enfocan solo en el vello, pero olvidan que debajo de la barba hay piel que también necesita cuidado.
      </p>

      <p>
        El <b>aceite para barba</b> ayuda a hidratar tanto el vello como la piel. También aporta brillo natural, suavidad y mejora la apariencia general de la barba. No se trata de dejarla grasosa, sino de darle nutrición.
      </p>

      <p>
        La mejor forma de aplicarlo es después de bañarte, cuando la barba está limpia y ligeramente húmeda. Coloca unas gotas en la palma de tu mano, frótalas y distribúyelas desde la raíz hasta las puntas.
      </p>

      <p>
        Para una barba corta suelen bastar <b>2 o 3 gotas</b>. Para una barba mediana o abundante puedes usar <b>4 o 5 gotas</b>, dependiendo de qué tan seca se sienta.
      </p>

      <ArticleImage
        src={barbaImages.aceite}
        alt="Aplicación de aceite para barba con las manos"
        caption="Aplicación de aceite para barba: hidratación y cuidado."
      />

      <h3>Paso 3: Cepilla y acomoda la barba todos los días</h3>

      <p>
        Cepillar la barba no es solo para que se vea ordenada. También ayuda a distribuir los aceites naturales, eliminar polvo, deshacer nudos y entrenar el vello para que crezca en una dirección más uniforme.
      </p>

      <p>
        Lo ideal es usar un <b>cepillo de cerdas naturales</b> o un peine adecuado para barba. Evita jalar demasiado fuerte, especialmente si tienes barba larga o zonas donde el vello se enreda fácilmente.
      </p>

      <p>
        Cepíllala hacia abajo o hacia la dirección en la que quieres que tome forma. Si tienes barba más larga, puedes ayudarte con bálsamo para controlar volumen y evitar que se esponje.
      </p>

      <ArticleImage
        src={barbaImages.peinado}
        alt="Hombre cepillando su barba frente al espejo"
        caption="Barba siendo cepillada: cuidado diario para mantenerla ordenada y saludable."
      />

      <h3>Paso 4: Mantén líneas limpias</h3>

      <p>
        Una barba puede estar hidratada y suave, pero si no tiene forma, se verá descuidada. Por eso es importante mantener limpias las zonas del cuello, mejillas y bigote.
      </p>

      <p>
        La línea del cuello no debe quedar demasiado arriba, porque puede hacer que la barba se vea artificial. Tampoco debe bajar demasiado, porque da una apariencia desordenada. Lo ideal es buscar un punto natural que acompañe la mandíbula.
      </p>

      <p>
        En las mejillas, algunos prefieren una línea más natural y otros una línea más marcada. La elección depende del estilo de cada persona, pero en ambos casos debe verse intencional y bien trabajada.
      </p>

      <p>
        Si no tienes mucha práctica, lo mejor es dejar el <b>delineado de barba</b> en manos del barbero. Un mal trazo puede cambiar por completo la forma del rostro.
      </p>

      <ArticleImage
        src={barbaImages.delineado}
        alt="Barbero delineando barba con navaja"
        caption="Barbero delineando barba con navaja: precisión y técnica para un acabado limpio."
      />

      <h3>Paso 5: Recorta antes de que pierda forma</h3>

      <p>
        Aunque quieras dejar crecer la barba, eso no significa dejarla sin tocar durante meses. Recortar puntas y controlar volumen ayuda a que crezca con mejor forma.
      </p>

      <p>
        Las puntas abiertas, zonas disparejas o vellos demasiado largos pueden hacer que la barba se vea descuidada. Un mantenimiento ligero cada cierto tiempo mejora la apariencia sin afectar el largo general.
      </p>

      <p>
        Para barbas cortas, un retoque cada <b>1 o 2 semanas</b> puede ser suficiente. Para barbas medianas o largas, conviene revisar forma y volumen cada <b>2 o 4 semanas</b>, dependiendo del crecimiento.
      </p>

      <ArticleImage
        src={barbaImages.recorte}
        alt="Barbero recortando una barba con tijera y peine"
        caption="Barbero recortando una barba con tijera y peine: enfoque en precisión, barbería moderna, colores tierra y negro."
      />

      <h3>Errores comunes al cuidar la barba</h3>

      <p>
        Uno de los errores más frecuentes es aplicar demasiado producto. Más aceite no significa mejor cuidado; si usas demasiado, la barba puede verse pesada o grasosa.
      </p>

      <p>
        Otro error es rasurar la línea del cuello demasiado arriba. Esto puede hacer que la barba se vea pequeña y poco natural. También es común descuidar el bigote, dejando que cubra demasiado el labio superior.
      </p>

      <p>
        Finalmente, muchos dejan pasar demasiado tiempo sin perfilar. Una barba crece de forma irregular, por eso necesita mantenimiento para conservar una forma limpia.
      </p>

      <h3>Rutina rápida para todos los días</h3>

      <p>
        Si quieres algo simple, quédate con esta rutina: enjuaga tu barba, sécala sin tallar demasiado, aplica unas gotas de aceite y cepíllala para acomodarla.
      </p>

      <p>
        Con esos pasos básicos, tu barba puede verse más suave, ordenada y saludable durante el día.
      </p>

      <h3>Consejo final de barbería</h3>

      <p>
        La barba debe complementar tu rostro, no cubrirlo sin forma. Un buen delineado puede marcar la mandíbula, mejorar tus facciones y darte una imagen más limpia.
      </p>

      <p>
        Si quieres que tu barba se vea realmente bien, combina el cuidado en casa con un mantenimiento profesional. La rutina diaria conserva la salud de la barba, pero el barbero se encarga de darle estructura, simetría y estilo.
      </p>

      <ArticleImage
        src={barbaImages.final}
        alt="Resultado final de barba arreglada y delineada"
        caption="Resultado final: barba arreglada, hidratada y con forma definida, estilo moderno y cuidado profesional."
      />
    </>
  );
}