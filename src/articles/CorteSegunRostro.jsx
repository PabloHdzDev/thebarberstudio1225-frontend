import React from 'react';
import rostrosImg from "../assets/blog/CorteSegunRostro/Rostros.webp"
import rostroOvaladoImg from "../assets/blog/CorteSegunRostro/RostroOvalado.webp"
import rostroCuadradoImg from "../assets/blog/CorteSegunRostro/RostroCuadrado.webp"
import rostroRedondoImg from "../assets/blog/CorteSegunRostro/RostroRedondo.webp"
import rostroAlargadoImg from "../assets/blog/CorteSegunRostro/RostroAlargado.webp"
import rostroTriangularImg from "../assets/blog/CorteSegunRostro/RostroTriangular.webp"
import finalImg from "../assets/blog/CorteSegunRostro/Final.webp"

export const meta = {
  id: "corte-segun-tu-rostro",
  titulo: "Qué corte te queda según tu rostro",
  resumen: "Aprende a identificar la forma de tu rostro y descubre qué cortes pueden ayudarte a equilibrar tus facciones y resaltar mejor tu estilo.",
  imagenMiniatura: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=60",
  imagenPortada: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200",
};

const rostrosImages = {
  rostros: rostrosImg,
  ovalado: rostroOvaladoImg,
  cuadrado: rostroCuadradoImg,
  redondo: rostroRedondoImg,
  alargado: rostroAlargadoImg,
  triangular: rostroTriangularImg,
  final: finalImg,
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

export default function CorteSegunRostro() {

  return (
    <>
      <p>
        Elegir un corte de cabello no debería depender únicamente de la moda o de una foto que viste en redes. Un buen corte debe adaptarse a tu <b>tipo de rostro</b>, a la forma de tu cabeza, a tu tipo de cabello y al estilo que quieres proyectar.
      </p>

      <p>
        En barbería, uno de los errores más comunes es pedir un corte solo porque se ve bien en otra persona. La realidad es que el mismo corte puede verse muy diferente dependiendo de tus facciones. Por eso, antes de elegir, conviene entender qué forma tiene tu rostro y qué efecto visual necesitas crear.
      </p>

      <p>
        El objetivo de un buen corte no es cambiar tu cara, sino <b>equilibrar tus proporciones</b>: alargar donde hace falta, suavizar facciones muy marcadas o destacar rasgos fuertes como la mandíbula.
      </p>

      <ArticleImage
        src={rostrosImages.rostros}
        alt="Tipos de rostro masculino: ovalado, cuadrado, redondo, alargado, triangular"
        caption="Tipos de rostro masculino: ovalado, cuadrado, redondo, alargado, triangular"
      />

      <h3>Cómo identificar la forma de tu rostro</h3>

      <p>
        Una forma sencilla de hacerlo es mirarte de frente al espejo y observar tres zonas: <b>frente, pómulos y mandíbula</b>. También fíjate si tu rostro se ve más largo que ancho, si tu mandíbula es marcada o si tus facciones son más suaves y redondeadas.
      </p>

      <p>
        No necesitas medir perfecto. Basta con identificar qué zona domina más visualmente. Con eso puedes darte una idea clara de qué cortes te favorecen más.
      </p>

      <h3>1. Rostro ovalado: el más versátil</h3>

      <p>
        El <b>rostro ovalado</b> suele tener proporciones equilibradas: la frente es ligeramente más ancha que la mandíbula y el rostro se ve un poco más largo que ancho. Por eso, es uno de los tipos de rostro más fáciles de trabajar.
      </p>

      <p>
        Si tienes rostro ovalado, prácticamente puedes usar muchos estilos: <b>fade, taper, crop, quiff, slick back o cortes clásicos</b>. La clave está en no tapar demasiado la frente, porque eso puede hacer que tu cara se vea más corta o pesada.
      </p>

      <p>
        Para este tipo de rostro, suelen funcionar muy bien los cortes con laterales limpios y volumen moderado arriba. No necesitas exagerar demasiado el alto ni marcar excesivamente los lados.
      </p>

      <p>
        <b>Recomendado para rostro ovalado:</b> Mid Fade, Taper Fade, corte clásico con textura, Slick Back suave o Textured Crop.
      </p>

      <ArticleImage
        src={rostrosImages.ovalado}
        alt="Ejemplo de corte para rostro ovalado: Mid Fade con textura arriba"
        caption="Rostro ovalado: casi cualquier corte te quedará bien, solo evita tapar la frente."
      />

      <h3>2. Rostro cuadrado: mandíbula fuerte y presencia</h3>

      <p>
        El <b>rostro cuadrado</b> se reconoce por una mandíbula marcada, frente amplia y líneas faciales más rectas. Es un rostro con mucha presencia, por eso muchos cortes masculinos le favorecen bastante.
      </p>

      <p>
        Aquí puedes aprovechar los laterales cortos para resaltar la estructura del rostro. Un <b>High Fade</b>, un <b>Mid Fade</b> o un corte con textura arriba pueden hacer que la mandíbula se vea todavía más definida.
      </p>

      <p>
        Si quieres un estilo más elegante, puedes optar por un corte clásico con volumen controlado. Si prefieres algo más moderno, un fade marcado con textura superior puede darte un look fuerte, limpio y actual.
      </p>

      <p>
        En este tipo de rostro, lo más importante es no perder la forma natural de la mandíbula. Un corte demasiado redondeado puede suavizar demasiado las facciones, mientras que uno bien definido puede reforzar la apariencia masculina.
      </p>

      <p>
        <b>Recomendado para rostro cuadrado:</b> High Fade, Mid Fade, Buzz Cut, Quiff texturizado o corte clásico con laterales cortos.
      </p>

      <ArticleImage
        src={rostrosImages.cuadrado}
        alt="Ejemplo de corte para rostro cuadrado: High Fade con textura arriba"
        caption="Rostro cuadrado: los laterales cortos resaltan la estructura del rostro."
      />

      <h3>3. Rostro redondo: crear altura y definición</h3>

      <p>
        El <b>rostro redondo</b> suele tener medidas similares de ancho y alto, con facciones más suaves y menos ángulos marcados. En este caso, el objetivo del corte es crear la ilusión de un rostro más alargado y definido.
      </p>

      <p>
        Para lograrlo, conviene mantener los laterales bien pulidos y dejar más volumen en la parte superior. Cortes como el <b>Quiff</b>, el <b>Pompadour</b>, el <b>Textured Crop alto</b> o un <b>Mid Fade</b> con volumen arriba pueden funcionar muy bien.
      </p>

      <p>
        Lo que normalmente se debe evitar son cortes demasiado redondos o con mucho volumen en los costados, porque pueden hacer que el rostro se vea todavía más ancho.
      </p>

      <p>
        <b>Recomendado para rostro redondo:</b> Mid Fade, High Fade, Quiff, Pompadour, Faux Hawk o cortes con textura vertical.
      </p>

      <ArticleImage
        src={rostrosImages.redondo}
        alt="Ejemplo de corte para rostro redondo: Quiff con volumen arriba"
        caption="Rostro redondo: los cortes con volumen en la parte superior ayudan a crear altura."
      />

      <h3>4. Rostro alargado: controlar el volumen superior</h3>

      <p>
        El <b>rostro alargado</b> se caracteriza porque la cara se ve más larga que ancha. En este caso, el objetivo es no agregar demasiada altura arriba, porque eso puede hacer que el rostro se vea todavía más largo.
      </p>

      <p>
        Para este tipo de rostro funcionan mejor los cortes con volumen moderado, laterales no demasiado pegados y estilos que mantengan cierto equilibrio horizontal. Un <b>Taper Fade bajo</b>, un corte clásico o un estilo con textura natural pueden ser buenas opciones.
      </p>

      <p>
        Si usas barba, también puede ayudarte a equilibrar la forma del rostro. Una barba corta y bien delineada puede aportar más estructura en la zona de la mandíbula.
      </p>

      <p>
        <b>Recomendado para rostro alargado:</b> Low Fade, Taper Fade, corte clásico, French Crop o estilos con caída ligera hacia el frente.
      </p>

      <ArticleImage
        src={rostrosImages.alargado}
        alt="Ejemplo de corte para rostro alargado: Corte clásico con textura moderada"
        caption="Rostro alargado: los cortes con volumen moderado ayudan a equilibrar la forma del rostro."
      />

      <h3>5. Rostro triangular o diamante: equilibrar frente y mandíbula</h3>

      <p>
        En algunos rostros, la mandíbula o los pómulos destacan más que la frente. Esto puede verse en rostros triangulares o tipo diamante. Aquí el objetivo es equilibrar visualmente la parte superior con la inferior.
      </p>

      <p>
        Los cortes con algo de volumen en la parte superior y laterales no demasiado rapados pueden ayudar a que el rostro se vea más proporcionado. También funcionan muy bien los estilos con textura, porque aportan movimiento sin endurecer demasiado las facciones.
      </p>

      <p>
        Si la mandíbula es muy marcada, una barba bien trabajada puede ayudar a dar simetría, siempre y cuando esté delineada correctamente.
      </p>

      <p>
        <b>Recomendado para rostro triangular o diamante:</b> Taper Fade, cortes con textura arriba, volumen medio, flequillo ligero o barba delineada.
      </p>

      <ArticleImage
        src={rostrosImages.triangular}
        alt="Ejemplo de corte para rostro triangular: Taper Fade con textura arriba"
        caption="Rostro triangular o diamante: los cortes con volumen moderado ayudan a equilibrar la forma del rostro."
      />

      <h3>Entonces, ¿qué corte deberías pedir?</h3>

      <p>
        Si todavía no estás seguro de tu tipo de rostro, no pasa nada. La mejor opción es llegar con una idea general y dejar que el barbero te oriente. Puedes mencionar si buscas algo más clásico, más moderno, más discreto o más marcado.
      </p>

      <p>
        Un barbero con experiencia no solo ve la foto que llevas; también analiza tu cabello, tus entradas, la dirección del crecimiento, tu mandíbula, tu frente y hasta qué tanto tiempo quieres dedicarle al peinado diario.
      </p>

      <p>
        Por eso, más que copiar un corte, lo ideal es <b>adaptarlo a ti</b>. Esa es la diferencia entre un corte normal y un corte que realmente te favorece.
      </p>

      <h3>Consejo final de barbería</h3>

      <p>
        Si quieres verte más estilizado, pide laterales más limpios y algo de volumen arriba. Si quieres verte más formal, elige transiciones suaves como un Low Fade o Taper Fade. Si buscas un cambio fuerte, un Mid Fade o High Fade puede transformar bastante tu imagen.
      </p>

      <p>
        Lo más importante es que el corte se sienta cómodo para tu día a día. Un buen estilo no solo debe verse bien al salir de la barbería, también debe ser fácil de mantener en casa.
      </p>

      <ArticleImage
        src={rostrosImages.final}
        alt="Consejo final de barbería: elige un corte que te favorezca"
        caption="Consejo final: adapta el corte a tu rostro y estilo de vida."
      />
    </>
  );
}