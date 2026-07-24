import React from 'react';
import { Link } from 'react-router-dom';
import productosImg from '../assets/blog/ProductosParaBarba/Productos.webp';
import aceiteImg from '../assets/blog/ProductosParaBarba/Aceite.webp';
import balsamoImg from '../assets/blog/ProductosParaBarba/Balsamo.webp';
import shampooImg from '../assets/blog/ProductosParaBarba/Shampoo.webp';
import ceraBigoteImg from '../assets/blog/ProductosParaBarba/CeraBigote.webp';
import cepilloPeineImg from '../assets/blog/ProductosParaBarba/CepilloPeine.webp';
import herramientasImg from '../assets/blog/ProductosParaBarba/Herramientas.webp';
import final from '../assets/blog/ProductosParaBarba/Final.webp';

export const meta = {
  id: "productos-para-barba",
  titulo: "Productos para barba: cuáles necesitas de verdad",
  resumen: "Aceite, bálsamo, shampoo, cera y cepillo. Te explicamos para qué sirve cada producto de barba, cuáles son realmente indispensables y cómo elegirlos según tu tipo de barba.",
  imagenMiniatura: productosImg,
  imagenPortada: productosImg,
};

const productosImages = {
  productos: productosImg,
  aceite: aceiteImg,
  balsamo: balsamoImg,
  shampoo: shampooImg,
  ceraBigote: ceraBigoteImg,
  cepilloPeine: cepilloPeineImg,
  herramientas: herramientasImg,
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

export default function ProductosParaBarba() {

  return (
    <>
      <p>
        Cuando entras a una tienda o buscas en internet, encontrarás decenas de productos para barba: aceites, bálsamos, ceras, shampoos, serums, tónicos y cremas. Es fácil terminar comprando cosas que no necesitas y dejando fuera lo que realmente hace la diferencia.
      </p>

      <p>
        La verdad es que no necesitas diez productos. Con <b>dos o tres bien elegidos</b> puedes tener una barba limpia, suave y con forma. Todo lo demás es opcional y depende de qué tan larga sea tu barba y qué tanto quieras trabajarla.
      </p>

      <p>
        En esta guía te explicamos qué hace cada producto, cuándo vale la pena comprarlo y cómo armar tu rutina sin gastar de más.
      </p>

      <ArticleImage
        src={productosImages.productos}
        alt="Productos para el cuidado de la barba sobre una mesa"
        caption="Los productos básicos para barba: aceite, bálsamo, shampoo y herramientas de peinado."
      />

      <h3>1. Aceite para barba: el más importante</h3>

      <p>
        Si solo pudieras comprar un producto, tendría que ser el <b>aceite para barba</b>. Es el que más impacto tiene en cómo se ve y se siente tu barba desde el primer día.
      </p>

      <p>
        Su función principal es hidratar el vello y la piel que está debajo. La comezón, la resequedad y esa sensación de barba áspera casi siempre se solucionan con aceite. Además le da un brillo natural que hace que se vea más saludable.
      </p>

      <p>
        Los buenos aceites suelen tener una base de <b>jojoba</b>, <b>argán</b>, <b>almendras dulces</b> o <b>semilla de uva</b>. Estos aceites se absorben bien y no dejan sensación grasosa. Evita los que tengan alcohol en los primeros ingredientes, porque resecan.
      </p>

      <p>
        Se aplica con la barba limpia y ligeramente húmeda, justo después de bañarte. Para barba corta bastan <b>2 o 3 gotas</b>; para barba mediana o larga, entre <b>4 y 6 gotas</b>.
      </p>

      <ArticleImage
        src={productosImages.aceite}
        alt="Frasco de aceite para barba con gotero"
        caption="El aceite para barba hidrata el vello y la piel debajo, evitando comezón y resequedad."
      />

      <h3>2. Bálsamo para barba: forma y control</h3>

      <p>
        El <b>bálsamo</b> se parece al aceite en que hidrata, pero tiene una diferencia clave: contiene cera y manteca, lo que le da poder de fijación. Sirve para controlar el volumen y mantener la barba en su lugar.
      </p>

      <p>
        Si tu barba es corta y se acomoda sola, probablemente no lo necesites. Pero si se te esponja, si tienes pelos que apuntan hacia los lados o si quieres una forma más definida durante el día, el bálsamo es tu producto.
      </p>

      <p>
        Se aplica frotando una pequeña cantidad entre las palmas hasta que se derrita, y luego se distribuye desde la raíz hacia las puntas. Después se peina para darle dirección.
      </p>

      <p>
        Un consejo: el bálsamo no reemplaza al aceite. Si tienes barba larga, lo ideal es usar <b>aceite primero y bálsamo después</b>. El aceite nutre, el bálsamo da forma.
      </p>

      <ArticleImage
        src={productosImages.balsamo}
        alt="Lata de bálsamo para barba abierta"
        caption="El bálsamo aporta fijación ligera y controla el volumen de barbas medianas y largas."
      />

      <h3>3. Shampoo o jabón para barba</h3>

      <p>
        El vello facial es más grueso que el del cabello y la piel del rostro es más sensible. Por eso el shampoo normal puede resecar demasiado, sobre todo si lo usas a diario.
      </p>

      <p>
        Un <b>shampoo específico para barba</b> limpia sin quitar todos los aceites naturales. Existen en versión líquida y en barra; ambas funcionan bien, la barra suele rendir más y ser más económica a largo plazo.
      </p>

      <p>
        No necesitas usarlo todos los días. Con <b>2 o 3 veces por semana</b> es suficiente para la mayoría. Los demás días, enjuagar con agua es más que suficiente.
      </p>

      <p>
        Si tu barba es muy corta (menos de un centímetro), honestamente puedes saltarte este producto y usar tu limpiador facial. El shampoo de barba empieza a valer la pena cuando el vello ya tiene cuerpo.
      </p>

      <ArticleImage
        src={productosImages.shampoo}
        alt="Shampoo para barba y espuma en las manos"
        caption="El shampoo para barba limpia sin resecar, a diferencia del shampoo de cabello."
      />

      <h3>4. Cera para bigote: solo si la necesitas</h3>

      <p>
        La <b>cera para bigote</b> es un producto muy específico. Su única función es fijar el bigote, sobre todo cuando es largo y tiende a caer sobre el labio.
      </p>

      <p>
        Tiene una consistencia mucho más firme que el bálsamo, porque está hecha para aguantar todo el día sin moverse. Se aplica en cantidades muy pequeñas, calentándola entre los dedos.
      </p>

      <p>
        Si tu bigote es corto o lo mantienes recortado por encima del labio, no la necesitas. Este producto es para quien trae bigote largo o quiere estilos definidos tipo <b>handlebar</b>.
      </p>

      <ArticleImage
        src={productosImages.ceraBigote}
        alt="Cera para bigote en lata pequeña"
        caption="La cera de bigote fija el vello largo; innecesaria si mantienes el bigote recortado."
      />

      <h3>5. Cepillo y peine: baratos pero clave</h3>

      <p>
        Muchos se enfocan en los productos líquidos y olvidan las herramientas. Sin embargo, un buen cepillo puede mejorar tu barba tanto como un buen aceite.
      </p>

      <p>
        El <b>cepillo de cerdas de jabalí</b> (o cerdas naturales) sirve para distribuir los aceites desde la raíz hasta las puntas, exfoliar suavemente la piel y entrenar la dirección del crecimiento. Es especialmente útil en barbas cortas y medianas.
      </p>

      <p>
        El <b>peine</b> funciona mejor en barbas largas, donde el cepillo puede jalar demasiado. Busca uno de dientes anchos y, si puedes, de madera o asta: los de plástico barato generan estática y esponjan el vello.
      </p>

      <p>
        Ambos son productos que compras una vez y te duran años. Es de las mejores inversiones en la rutina.
      </p>

      <ArticleImage
        src={productosImages.cepilloPeine}
        alt="Cepillo de cerdas naturales y peine de madera para barba"
        caption="Cepillo de cerdas naturales y peine de madera: herramientas que duran años."
      />

      <h3>6. Tijeras y recortadora para mantenimiento</h3>

      <p>
        Aunque vayas al barbero regularmente, tener unas <b>tijeras de barbería</b> en casa te permite cortar ese pelo suelto que se sale de la forma sin tener que esperar a tu próxima cita.
      </p>

      <p>
        Una <b>recortadora con guías</b> también ayuda para mantener el largo parejo entre visitas. Eso sí, ten cuidado: la mayoría de los desastres de barba en casa pasan por querer delinear el cuello o las mejillas uno mismo.
      </p>

      <p>
        Nuestra recomendación honesta: usa la recortadora solo para <b>controlar el largo</b>, y deja el delineado y la forma en manos del barbero. Un mal trazo tarda semanas en corregirse.
      </p>

      <ArticleImage
        src={productosImages.herramientas}
        alt="Tijeras de barbería y recortadora sobre superficie de madera"
        caption="Tijeras y recortadora sirven para mantener el largo entre citas, no para delinear."
      />

      <h3>Qué productos NO necesitas</h3>

      <p>
        Hay mucho producto en el mercado que promete más de lo que puede dar. Los <b>serums de crecimiento</b> son el ejemplo más común: si genéticamente no tienes densidad en cierta zona, ningún aceite la va a crear.
      </p>

      <p>
        Lo mismo pasa con los kits gigantes de diez piezas. Suelen incluir productos de baja calidad para justificar el precio. Es mejor comprar dos productos buenos que ocho mediocres.
      </p>

      <p>
        Tampoco necesitas acondicionador de barba si ya usas aceite. Cumplen funciones muy parecidas y terminarás sobrecargando el vello.
      </p>

      <h3>Cómo armar tu rutina según tu barba</h3>

      <p>
        <b>Barba corta (menos de 2 cm):</b> aceite y cepillo. Con eso resuelves hidratación y orden. Puedes usar tu limpiador facial normal.
      </p>

      <p>
        <b>Barba mediana (2 a 5 cm):</b> aceite, shampoo de barba y cepillo. Si se te esponja, suma bálsamo.
      </p>

      <p>
        <b>Barba larga (más de 5 cm):</b> shampoo de barba, aceite, bálsamo y peine de dientes anchos. Aquí el bálsamo deja de ser opcional.
      </p>

      <p>
        Si quieres profundizar en la técnica de aplicación y la frecuencia de cada paso, puedes leer nuestra guía completa de{' '}
        <Link to="/blog/como-cuidar-tu-barba" className="text-marron font-bold underline underline-offset-4 hover:text-dorado transition-colors">
          cómo cuidar tu barba correctamente
        </Link>.
      </p>

      <h3>Cómo elegir sin gastar de más</h3>

      <p>
        Empieza con el aceite. Compra uno de calidad media y úsalo un mes completo antes de agregar otra cosa. Así vas a saber qué le hace falta realmente a tu barba.
      </p>

      <p>
        Revisa siempre la lista de ingredientes. Los aceites buenos son transparentes con su fórmula. Si el frasco solo dice "aceite para barba" sin especificar, desconfía.
      </p>

      <p>
        Y no te dejes llevar solo por el aroma. Un producto puede oler increíble y no hidratar nada. El olor es lo último que deberías considerar.
      </p>

      <h3>Consejo final de barbería</h3>

      <p>
        Los productos mantienen tu barba saludable, pero no le dan forma. Esa parte le toca al barbero. Puedes tener el mejor aceite del mercado y aún así verte descuidado si las líneas del cuello y las mejillas están fuera de lugar.
      </p>

      <p>
        La combinación que sí funciona es simple: <b>rutina constante en casa</b> más <b>mantenimiento profesional cada 2 a 4 semanas</b>. Uno cuida la salud del vello, el otro cuida la estructura.
      </p>

      <ArticleImage
        src={productosImages.final}
        alt="Barba cuidada con productos aplicados correctamente"
        caption="Resultado de una rutina bien armada: barba hidratada, con forma y sin exceso de producto."
      />
    </>
  );
}
