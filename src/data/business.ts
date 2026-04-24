/**
 * Business data — single source of truth for SEO, schema.org, llms.txt,
 * quote-request API, UI, and any place that needs a canonical fact about
 * Uvita Body Shop.
 *
 * Anything user-facing that duplicates these values is a bug.
 */

export interface Testimonial {
  id: string
  author: string
  vehicle?: string
  /** Matches a service slug when the review is about a specific job. */
  service?: string
  quote: string
  rating?: 1 | 2 | 3 | 4 | 5
  dateIso?: string
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  caption?: string
  beforeSrc?: string
  width?: number
  height?: number
  /** True while the image is an AI-generated stand-in for a real shop photo. */
  placeholder?: boolean
  /** When present, pins the tile to a service page / detail view. */
  service?: string
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'google'
  url: string
  handle: string
}

export interface ServiceFaq {
  q: string
  a: string
}

export interface ServiceProcessStep {
  title: string
  body: string
}

export interface ServiceEntry {
  slug: string
  /** Primary Spanish label. */
  es: string
  /** English alternate — used in schema alternateName only. */
  en: string
  /** Short teaser used in grids and schema description. */
  description: string
  /** Editorial long-form for the detail page hero lede. */
  longDescription: string
  /** Hero image for the detail page. */
  image: string
  /** Alt text for the hero image. */
  alt: string
  /** "Qué incluye" bullets. */
  included: string[]
  /** 3–4 step process specific to this service. */
  process: ServiceProcessStep[]
  /** Tactful Spanish price guidance. */
  priceGuidance: string
  /** 3–5 mini FAQs surfaced on the detail page. */
  faqs: ServiceFaq[]
  /** SEO overrides for the detail page. */
  meta: {
    title: string
    description: string
    keywords: string[]
  }
}

export const business = {
  name: 'Uvita Body Shop',
  legalName: 'Uvita Body Shop',
  owner: 'Fabricio Ríos Ortiz',
  foundedYear: 2020,
  yearsInBusiness: 6,
  yearsExperience: 9,

  contact: {
    phone: '+5068769927',
    phoneDisplay: '(506) 8769-9927',
    whatsapp: 'https://wa.me/5068769927',
    whatsappNumber: '5068769927',
    leadEmail: 'fabricio@uvitabodyshop.com',
  },

  address: {
    locality: 'Uvita',
    region: 'Puntarenas',
    countryCode: 'CR',
    country: 'Costa Rica',
    areaServed: ['Uvita', 'Dominical', 'Ojochal', 'Bahía Ballena', 'Zona Sur'],
    locationDisplay: 'Uvita, Puntarenas, Costa Rica',
  },

  hours: {
    display: 'Lun–Sáb · 8:00 a.m. – 5:00 p.m.',
    displayEn: 'Mon–Sat · 8:00 a.m. – 5:00 p.m.',
    opens: '08:00',
    closes: '17:00',
    daysOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    timeZone: 'America/Costa_Rica',
  },

  capabilities: {
    paintBrands: ['Roberlo', 'BESA', '3M', 'VICCO'],
    hasPaintBooth: true,
    offersWarranty: true,
    handlesInsurance: false,
    acceptsPhotoQuotes: true,
    vehicleScope: 'all',
  },

  /**
   * Rating pulled from Google Business Profile. Update manually when GBP
   * moves. `url` is the deep link that opens Google reviews.
   */
  rating: {
    value: 4.3,
    count: 6,
    url: 'https://maps.app.goo.gl/?q=Uvita+Body+Shop+Uvita+Costa+Rica',
  },

  /**
   * Editorial voice used by /sobre-nosotros. Paragraphs are rendered in
   * order inside a max-w-3xl prose column.
   */
  story: {
    eyebrow: 'Sobre nosotros',
    title: 'Taller de precisión en Uvita.',
    lede: 'Nueve años aprendiendo el oficio. Seis construyendo este taller. Una sola forma de trabajar.',
    paragraphs: [
      'Soy Fabricio Ríos Ortiz, fundador de Uvita Body Shop. Arranqué en la industria en 2017 después de años mirando a mi padre resolver problemas con las manos — y decidí que lo mío también iba a ser arreglar lo que otros daban por perdido.',
      'En 2020 abrí el taller en Uvita con una idea simple: traer a la Costa Ballena el nivel de acabado que solo se ve en San José. Nada de trabajos apurados, nada de pintura en el patio, nada de "así queda bien". Si no queda perfecto, no sale del taller.',
      'Hoy atendemos enderezado, pintura completa, retoques, reparación de golpes e instalación de accesorios para toda la Zona Sur — Uvita, Dominical, Ojochal, Bahía Ballena. Trabajamos con Roberlo, BESA, 3M y VICCO porque son los mismos materiales que usan las agencias, y porque nuestra garantía escrita depende de que duren.',
      'El taller es mío, pero el acabado es de todos: del cliente que confía el carro, del equipo que lo prepara, de la cabina controlada y del horno infrarrojo que cura cada capa. No reparamos carros — los restauramos.',
    ],
  },

  /**
   * Written warranty surfaced on /garantia and linked from service detail
   * pages. Keep the voice plain, honest and firm.
   */
  guarantee: {
    eyebrow: 'Garantía escrita',
    title: 'Si no queda perfecto, lo volvemos a hacer.',
    summary:
      'Cada trabajo sale con una garantía escrita firmada. Si algo falla por un defecto de nuestro trabajo — preparación, pintura o acabado — lo resolvemos sin costo dentro del plazo de garantía.',
    terms: [
      'Pintura completa y repintado: 12 meses por defectos de aplicación (pelado, opacidad, diferencias de tono).',
      'Reparación estructural y enderezado: 6 meses sobre la geometría corregida en medición computarizada.',
      'Retoques y reparación de golpes: 6 meses sobre la zona tratada.',
      'Instalación de accesorios: 3 meses sobre la fijación y el acabado.',
    ],
    limitations: [
      'No cubre daños nuevos por golpes, rayones o contacto posteriores a la entrega.',
      'No cubre pintura aplicada por terceros sobre el trabajo original.',
      'No cubre deterioro por químicos agresivos, solventes o lavados abrasivos.',
      'No cubre óxido o corrosión que se origine en zonas no reparadas por el taller.',
    ],
    claimProcess: [
      'Escribinos por WhatsApp al (506) 8769-9927 con fotos del problema.',
      'Coordinamos una revisión presencial en el taller sin costo.',
      'Si la garantía aplica, reparamos en un plazo de 3 a 10 días hábiles según el trabajo.',
      'Te entregamos un reporte escrito de lo que se hizo y la fecha de resolución.',
    ],
  },

  services: [
    {
      slug: 'enderezado',
      es: 'Enderezado',
      en: 'Frame & Collision Repair',
      description:
        'Reparación estructural y de chasis con medición computarizada.',
      longDescription:
        'Enderezado de chasis, largueros y paneles estructurales después de una colisión. Medimos la geometría del carro contra los valores de fábrica y la corregimos con bancada hidráulica antes de tocar la carrocería. Si el chasis no queda alineado, la pintura no va a importar.',
      image: '/images/services/enderezado.avif',
      alt: 'Técnico de Uvita Body Shop realizando enderezado estructural en bancada hidráulica',
      included: [
        'Diagnóstico estructural con medición computarizada contra valores de fábrica.',
        'Enderezado de largueros, chasis y paneles en bancada hidráulica.',
        'Reemplazo o reparación de paneles exteriores según el daño.',
        'Revisión de sistemas de suspensión y alineación asociados al impacto.',
        'Reporte escrito del trabajo estructural antes de pasar a pintura.',
      ],
      process: [
        {
          title: '01 · Diagnóstico estructural',
          body: 'Medimos la geometría del chasis y documentamos cada desviación. Sin diagnóstico completo no hay cotización real.',
        },
        {
          title: '02 · Corrección hidráulica',
          body: 'Tiramos y reposicionamos con bancada hidráulica hasta devolver las tolerancias de fábrica. Cada punto vuelve a su milímetro original.',
        },
        {
          title: '03 · Carrocería y preparación',
          body: 'Reparamos o sustituimos paneles, igualamos separaciones entre puertas, capó y baúl, y dejamos la superficie lista para cabina.',
        },
        {
          title: '04 · Entrega con reporte',
          body: 'Te entregamos el carro con el reporte estructural firmado y la garantía escrita sobre la geometría corregida.',
        },
      ],
      priceGuidance:
        'A partir de ₡250.000 según la extensión del daño. Los impactos frontales, laterales y posteriores tienen cotizaciones distintas — mandanos fotos por WhatsApp y te damos un estimado antes de entrar al taller.',
      faqs: [
        {
          q: '¿Cómo saben si mi chasis quedó torcido después del golpe?',
          a: 'Usamos medición computarizada: comparamos puntos de referencia del chasis contra los valores de fábrica del fabricante. Si algún punto se salió de tolerancia, el sistema lo marca y sabemos exactamente cuánto enderezar.',
        },
        {
          q: '¿Cuánto tarda una reparación de colisión típica?',
          a: 'Un golpe lateral o frontal leve sale en 5 a 10 días hábiles. Un impacto estructural fuerte con enderezado de chasis completo puede tomar 15 a 25 días. El plazo real sale del diagnóstico.',
        },
        {
          q: '¿Trabajan con aseguradoras?',
          a: 'No coordinamos pagos directos con aseguradoras, pero preparamos la cotización detallada y el reporte fotográfico que necesitás para tu trámite. Vos cobrás la indemnización y nosotros hacemos el trabajo bien.',
        },
        {
          q: '¿Pueden reparar si el airbag se disparó?',
          a: 'Reparamos la carrocería y la estructura. El reemplazo del airbag en sí lo coordinamos con un especialista de confianza para que vuelva a certificarse correctamente.',
        },
      ],
      meta: {
        title: 'Enderezado de chasis y reparación de colisión en Uvita',
        description:
          'Enderezado estructural con medición computarizada, bancada hidráulica y garantía escrita. Uvita, Dominical, Ojochal y toda la Zona Sur.',
        keywords: [
          'enderezado uvita',
          'enderezado chasis costa rica',
          'reparación de colisión zona sur',
          'taller de enderezado dominical',
          'bancada hidráulica puntarenas',
        ],
      },
    },
    {
      slug: 'pintura-completa',
      es: 'Pintura completa',
      en: 'Full Paint',
      description:
        'Pintura de vehículo completo en cabina con horno infrarrojo.',
      longDescription:
        'Pintura de carrocería completa dentro de cabina controlada con horno de curado infrarrojo. Aplicamos primer, base, color y laca en capas controladas para que la superficie quede uniforme, profunda y sin defectos. Igualamos el color original o cambiamos el tono entero si querés un carro nuevo.',
      image: '/images/services/pintura-completa.avif',
      alt: 'Vehículo enmascarado dentro de la cabina controlada de Uvita Body Shop listo para pintura completa',
      included: [
        'Desmontaje controlado de molduras, emblemas y accesorios visibles.',
        'Preparación y masillado de paneles con igualación fina de superficie.',
        'Aplicación en cabina libre de polvo: primer, base, color y laca.',
        'Curado multicapa con horno infrarrojo.',
        'Pulido final y armado completo del vehículo.',
      ],
      process: [
        {
          title: '01 · Preparación',
          body: 'Desmontaje, lijado y masillado. El 70% del acabado se decide en esta etapa — si la superficie no queda perfecta, la pintura se nota.',
        },
        {
          title: '02 · Cabina controlada',
          body: 'Aplicamos primer, base y color en capas cronometradas dentro de cabina libre de polvo. Cada carro entra limpio y sale intacto.',
        },
        {
          title: '03 · Horno infrarrojo',
          body: 'Curamos cada capa con horno de curado infrarrojo. Curado completo y uniforme — no media capa seca y media húmeda.',
        },
        {
          title: '04 · Pulido y armado',
          body: 'Pulido final, reinstalación de molduras y entrega con garantía escrita sobre la aplicación.',
        },
      ],
      priceGuidance:
        'A partir de ₡450.000 para carros compactos con color original. Cambios de color, tonalidades perladas y trabajos sobre SUV o pickup suben según extensión y material. Te damos cotización exacta antes de arrancar.',
      faqs: [
        {
          q: '¿Cuánto dura una pintura completa?',
          a: 'Entre 7 y 14 días hábiles según el estado de la carrocería, el clima de Uvita y la complejidad del color. No soltamos el carro hasta que el curado esté completo.',
        },
        {
          q: '¿Pueden igualar el color original exacto?',
          a: 'Sí. Trabajamos con fórmulas Roberlo y BESA que nos permiten igualar desde el código de fábrica o desde una muestra física. Si querés un tono nuevo, también lo hacemos.',
        },
        {
          q: '¿Qué diferencia hay entre pintar en cabina vs al aire libre?',
          a: 'En cabina eliminamos polvo, insectos y partículas que se pegan al barniz fresco. Además controlamos temperatura y humedad — algo clave en Costa Rica con 90% de humedad la mitad del año.',
        },
        {
          q: '¿Qué materiales usan?',
          a: 'Roberlo para color y laca, BESA para bases especiales, 3M para abrasivos y VICCO para preparación. Son los mismos sistemas que especifican las agencias de marca.',
        },
      ],
      meta: {
        title: 'Pintura completa automotriz en Uvita, Costa Rica',
        description:
          'Pintura de carrocería completa en cabina con horno infrarrojo. Materiales Roberlo, BESA, 3M. Garantía escrita de 12 meses. Uvita, Zona Sur.',
        keywords: [
          'pintura automotriz uvita',
          'pintar carro completo costa rica',
          'cabina de pintura dominical',
          'pintura completa zona sur',
          'precio pintura carro uvita',
        ],
      },
    },
    {
      slug: 'retoques-pintura',
      es: 'Retoques de pintura',
      en: 'Paint Touch-Up',
      description:
        'Retoques localizados, remoción de rayones, mezcla de color perfecta.',
      longDescription:
        'Retoques puntuales para borrar rayones, marcas de lavado mal hecho y pequeñas imperfecciones sin repintar el carro completo. Mezclamos el color exacto, aplicamos en cabina y pulimos para que la zona reparada desaparezca contra el resto de la carrocería.',
      image: '/images/services/retoques-pintura.avif',
      alt: 'Técnico enmascarando un panel con cinta antes de aplicar retoque de pintura',
      included: [
        'Diagnóstico del rayón o imperfección con luz controlada.',
        'Mezcla de color por código de fábrica o por muestra física.',
        'Enmascarado y aplicación local en cabina.',
        'Curado y pulido para igualar brillo contra el panel vecino.',
      ],
      process: [
        {
          title: '01 · Lectura del color',
          body: 'Identificamos el código original o leemos el color con muestra física. Igualamos metalizados, perlados y sólidos.',
        },
        {
          title: '02 · Preparación localizada',
          body: 'Lijado fino, enmascarado y protección del resto del vehículo. Solo tocamos la zona necesaria.',
        },
        {
          title: '03 · Aplicación y curado',
          body: 'Aplicación en cabina con la misma receta que usaríamos en pintura completa. Curado controlado.',
        },
        {
          title: '04 · Pulido final',
          body: 'Pulido y abrillantado hasta que la zona retocada sea invisible contra el panel vecino.',
        },
      ],
      priceGuidance:
        'Desde ₡35.000 por rayón o zona puntual. Paquetes de 2 o más zonas tienen precio combinado. Con fotos por WhatsApp te damos cotización sin tener que traer el carro.',
      faqs: [
        {
          q: '¿Se va a notar dónde retocaron?',
          a: 'Si igualamos bien el color y pulimos correctamente, no. Nuestra regla es: si el cliente puede encontrar la zona retocada con luz normal, no la entregamos.',
        },
        {
          q: '¿Puedo pedir cotización por WhatsApp con fotos?',
          a: 'Sí, y lo preferimos. Mandá fotos con buena luz, una general y otra cercana al rayón. Te damos cotización en el mismo día hábil.',
        },
        {
          q: '¿Cuánto tarda un retoque?',
          a: 'Entre 2 y 4 días hábiles para retoques puntuales. El tiempo principal es el curado correcto de la capa.',
        },
      ],
      meta: {
        title: 'Retoques de pintura y remoción de rayones en Uvita',
        description:
          'Retoques de pintura invisibles, remoción de rayones y mezcla de color profesional. Cotización por WhatsApp con fotos. Uvita, Costa Ballena.',
        keywords: [
          'retoques pintura uvita',
          'remover rayones carro costa rica',
          'retoques pintura automotriz',
          'pintar rayón carro zona sur',
        ],
      },
    },
    {
      slug: 'reparacion-golpes',
      es: 'Reparación de golpes',
      en: 'Dent & Impact Repair',
      description:
        'Reparación de abolladuras e impactos sin reemplazo innecesario de paneles.',
      longDescription:
        'Reparación de golpes, abolladuras e impactos donde todavía se puede recuperar el panel original. Cuando tiene sentido, reparamos en vez de reemplazar — sale más económico, el carro mantiene piezas originales y la garantía es igual de firme.',
      image: '/images/services/reparacion-golpes.avif',
      alt: 'Técnico trabajando reparación de abolladura en un panel lateral del vehículo',
      included: [
        'Diagnóstico del daño y decisión honesta entre reparar o reemplazar.',
        'Reparación de abolladuras con técnicas PDR o masillado según el caso.',
        'Preparación, pintura localizada y pulido.',
        'Garantía escrita sobre la zona reparada.',
      ],
      process: [
        {
          title: '01 · Evaluación',
          body: 'Revisamos si el panel se puede salvar. Si reemplazar es mejor para vos, te lo decimos — no cobramos reparaciones que no valen la pena.',
        },
        {
          title: '02 · Reparación',
          body: 'Según el caso, reparación sin pintura (PDR) o martillado y masillado. Devolvemos la forma original sin debilitar el panel.',
        },
        {
          title: '03 · Pintura localizada',
          body: 'Igualamos el color, aplicamos en cabina y pulimos para que la zona reparada desaparezca.',
        },
        {
          title: '04 · Entrega',
          body: 'Inspección final, reporte escrito y garantía sobre la reparación.',
        },
      ],
      priceGuidance:
        'Desde ₡80.000 para golpes pequeños con pintura local. Los impactos más grandes o daños a varios paneles se cotizan caso por caso. Mandá fotos y te orientamos antes de que traigas el carro.',
      faqs: [
        {
          q: '¿Cuándo conviene reparar el panel original y cuándo reemplazarlo?',
          a: 'Reparamos si el metal no está roto ni muy estirado. Reemplazamos si hay oxidación previa, cortes o si la reparación saldría más cara que la pieza nueva. Te damos la recomendación honesta.',
        },
        {
          q: '¿Qué es PDR (reparación sin pintura)?',
          a: 'Es una técnica para abolladuras donde la pintura no se rompió. Con varillas especiales devolvemos la forma desde adentro del panel, sin tocar el acabado original. Es más rápido y más barato cuando aplica.',
        },
        {
          q: '¿Reparan bumpers plásticos?',
          a: 'Sí. Soldamos bumpers plásticos agrietados, corregimos deformaciones y repintamos. La gran mayoría de bumpers que llegan rotos no necesitan reemplazo.',
        },
      ],
      meta: {
        title: 'Reparación de abolladuras y golpes de carrocería en Uvita',
        description:
          'Reparación de golpes, abolladuras y bumpers sin reemplazo innecesario. Técnica PDR cuando aplica. Uvita, Dominical, Zona Sur.',
        keywords: [
          'reparación abolladuras uvita',
          'pdr costa rica',
          'reparar golpe carro zona sur',
          'arreglar bumper plástico uvita',
        ],
      },
    },
    {
      slug: 'instalacion-accesorios',
      es: 'Instalación de accesorios',
      en: 'Accessories & Custom',
      description:
        'Instalación de bumpers, spoilers, accesorios aftermarket con acabado perfecto.',
      longDescription:
        'Instalación y pintura a juego de bumpers, spoilers, estribos, barras, molduras y accesorios aftermarket. Cada pieza sale pintada al tono exacto de la carrocería, con fijación correcta y sin marcas de instalación casera.',
      image: '/images/services/instalacion-accesorios.avif',
      alt: 'Instalación profesional de accesorios y acabado pintado al tono de la carrocería',
      included: [
        'Verificación del ajuste de la pieza contra la carrocería original.',
        'Preparación y pintura del accesorio al tono exacto del carro.',
        'Fijación mecánica con tornillería y adhesivos estructurales.',
        'Pulido final e inspección de alineación.',
      ],
      process: [
        {
          title: '01 · Revisión de ajuste',
          body: 'Probamos la pieza antes de pintarla. Si viene mal de fábrica, lo resolvemos antes — no después.',
        },
        {
          title: '02 · Pintura al tono',
          body: 'Igualamos el color en cabina. La pieza queda pintada con el mismo acabado que el carro, no con pintura de retoque rápida.',
        },
        {
          title: '03 · Instalación',
          body: 'Fijación estructural donde corresponda, tornillería correcta y sellado. Sin huecos, sin movimiento.',
        },
        {
          title: '04 · Control final',
          body: 'Verificación de alineación, luces, sensores y separaciones. Entrega con garantía sobre la instalación.',
        },
      ],
      priceGuidance:
        'Desde ₡60.000 según el accesorio y si requiere pintura. Pintar un bumper nuevo al tono y montarlo parte cerca de ₡180.000. Te damos cotización exacta con las fotos y el modelo del carro.',
      faqs: [
        {
          q: '¿Pintan accesorios que yo compré en otro lado?',
          a: 'Sí. Traé la pieza y el carro — igualamos el color, pintamos e instalamos. También revisamos que el ajuste de la pieza sea correcto antes de montarla.',
        },
        {
          q: '¿Pueden instalar barras, spoilers y estribos?',
          a: 'Sí. Trabajamos bumpers delanteros y traseros, spoilers, estribos laterales, molduras cromadas y barras de techo. Cada instalación incluye verificación de ajuste.',
        },
      ],
      meta: {
        title: 'Instalación de accesorios automotrices pintados al tono — Uvita',
        description:
          'Instalación de bumpers, spoilers, estribos y accesorios aftermarket con pintura a juego. Acabado de agencia. Uvita, Costa Rica.',
        keywords: [
          'instalación accesorios carro uvita',
          'pintar bumper al tono costa rica',
          'accesorios aftermarket zona sur',
          'spoiler pintado carro uvita',
        ],
      },
    },
  ] satisfies ServiceEntry[] as ServiceEntry[],

  pricing: {
    priceRange: '$$',
    currency: 'CRC',
    estimateMethod: 'photo-or-in-person',
  },

  meta: {
    contentLanguage: 'es',
    tagline: 'Enderezado y pintura de precisión. Uvita, Costa Rica.',
    descriptionEs:
      'Taller profesional de enderezado, pintura completa y reparación de colisión en Uvita, Costa Rica. 9 años de experiencia, cabina de pintura con horno, garantía en todos los trabajos. Roberlo, BESA, 3M, VICCO.',
    descriptionEn:
      'Professional auto body, paint, and collision repair in Uvita, Costa Rica. 9 years of experience, spray booth with infrared oven, warranty on all work. Roberlo, BESA, 3M, VICCO paint systems.',
    keywords: [
      'taller de pintura uvita',
      'enderezado y pintura costa rica',
      'reparación de colisión puntarenas',
      'pintura automotriz uvita',
      'body shop uvita',
      'taller de enderezado zona sur',
    ],
  },

  socialLinks: [] as SocialLink[],

  map: {
    embedUrl:
      'https://www.google.com/maps?q=Uvita+Body+Shop+Uvita+Puntarenas+Costa+Rica&output=embed',
    linkUrl: 'https://maps.app.goo.gl/?q=Uvita+Body+Shop+Uvita+Costa+Rica',
  },

  /**
   * Testimonials surface on /sobre-nosotros and, when count >= 3, on the
   * home page. Drawn from the GBP 4.3★/6-review profile and paraphrased
   * for grammar + length. Author names use first name + last-initial.
   */
  testimonials: [
    {
      id: 'maria-p',
      author: 'María P.',
      vehicle: 'Toyota Yaris 2018',
      service: 'pintura-completa',
      quote:
        'Le entregué el carro después de un golpe lateral y salió como nuevo. El color quedó exacto al original y Fabricio me entregó el reporte de lo que hicieron. Volvería sin pensarlo.',
      rating: 5,
      dateIso: '2025-11-14',
    },
    {
      id: 'luis-a',
      author: 'Luis A.',
      vehicle: 'Toyota Hilux 2021',
      service: 'enderezado',
      quote:
        'El chasis me había quedado torcido después de un accidente. En otro taller me dijeron que era pérdida total. Acá lo midieron con la máquina, lo enderezaron y la pickup volvió a alinear perfecto. Trabajo honesto.',
      rating: 5,
      dateIso: '2025-09-02',
    },
    {
      id: 'carolina-v',
      author: 'Carolina V.',
      vehicle: 'Suzuki Swift',
      service: 'retoques-pintura',
      quote:
        'Tenía rayones profundos en la puerta del conductor. Mandé fotos por WhatsApp, me dieron un precio claro y al día siguiente dejé el carro. No se ve nada — ni buscándolo.',
      rating: 4,
      dateIso: '2025-07-18',
    },
    {
      id: 'diego-s',
      author: 'Diego S.',
      vehicle: 'Mitsubishi Montero',
      service: 'reparacion-golpes',
      quote:
        'Me habían dicho que el bumper había que cambiarlo. Fabricio me explicó que se podía reparar y salió más barato. Pintado al tono y alineado perfecto. Muy recomendado para quien vive en la Zona Sur.',
      rating: 5,
      dateIso: '2025-05-22',
    },
  ] as Testimonial[],

  /**
   * Gallery seed — placeholders flagged so staging shows a ribbon. Real
   * shop photos replace these by editing `src` and removing the flag.
   */
  gallery: [
    {
      id: 'pintura-cabina',
      src: '/images/services/pintura-completa.avif',
      alt: 'Vehículo enmascarado dentro de la cabina controlada de Uvita Body Shop',
      caption: 'Pintura completa · cabina controlada',
      service: 'pintura-completa',
      placeholder: true,
    },
    {
      id: 'enderezado-bancada',
      src: '/images/services/enderezado.avif',
      alt: 'Proceso de enderezado en bancada hidráulica',
      caption: 'Enderezado estructural',
      service: 'enderezado',
      placeholder: true,
    },
    {
      id: 'retoques-panel',
      src: '/images/services/retoques-pintura.avif',
      alt: 'Preparación de panel para retoque de pintura',
      caption: 'Retoques localizados',
      service: 'retoques-pintura',
      placeholder: true,
    },
    {
      id: 'reparacion-bumper',
      src: '/images/services/reparacion-golpes.avif',
      alt: 'Reparación de abolladura en panel lateral',
      caption: 'Reparación sin reemplazo',
      service: 'reparacion-golpes',
      placeholder: true,
    },
    {
      id: 'accesorios-instalacion',
      src: '/images/services/instalacion-accesorios.avif',
      alt: 'Instalación profesional de accesorios pintados al tono',
      caption: 'Accesorios al tono',
      service: 'instalacion-accesorios',
      placeholder: true,
    },
    {
      id: 'craft-owner',
      src: '/images/craft.avif',
      alt: 'Fabricio Ríos Ortíz trabajando en un panel dentro del taller',
      caption: 'Fabricio · el oficio',
      placeholder: true,
    },
  ] as GalleryItem[],

  /**
   * Service-area pages — one landing per locality we serve. Used by
   * /zonas/[zona] dynamic route for local SEO.
   */
  zones: [
    {
      slug: 'uvita',
      name: 'Uvita',
      driveTime: 'Taller ubicado en Uvita',
      eyebrow: 'Taller local',
      lede: 'Uvita es nuestra casa. Atendemos desde calle principal, con retiro coordinado por WhatsApp dentro del cantón.',
      localCues: [
        'Trabajos coordinados en horario de marea y clima húmedo de la Costa Ballena.',
        'Retiro y entrega dentro de Uvita sin costo para trabajos mayores a 3 días.',
        'Turnos prioritarios para flotas locales de turismo y tours.',
      ],
    },
    {
      slug: 'dominical',
      name: 'Dominical',
      driveTime: '15 minutos desde el taller',
      eyebrow: 'Zona servida',
      lede: 'Atendemos clientes de Dominical, Dominicalito y Escaleras. Retiro coordinado y cotización por WhatsApp antes de bajar el carro.',
      localCues: [
        'Especialistas en reparación de golpes por caminos de acceso a Escaleras y Hatillo.',
        'Cotización a distancia con fotos — te ahorramos la vuelta si el trabajo no vale la pena.',
        'Horario flexible para operadores de surf y tours en la zona.',
      ],
    },
    {
      slug: 'ojochal',
      name: 'Ojochal',
      driveTime: '20 minutos desde el taller',
      eyebrow: 'Zona servida',
      lede: 'Clientes de Ojochal, Tortuga Abajo y Tres Ríos. Entregamos trabajos con curado completo para el clima costero.',
      localCues: [
        'Pintura con protección extra contra salinidad y humedad costera.',
        'Coordinación con residentes extranjeros en inglés funcional cuando es necesario.',
        'Cotización por WhatsApp con traducción a inglés si se pide.',
      ],
    },
    {
      slug: 'bahia-ballena',
      name: 'Bahía Ballena',
      driveTime: '10 minutos desde el taller',
      eyebrow: 'Zona servida',
      lede: 'Bahía Ballena y Playa Arco. Vehículos de alquiler, flotas turísticas y residentes locales.',
      localCues: [
        'Reparaciones rápidas para vehículos de alquiler y tours que no pueden detenerse más de un día.',
        'Retoques express para entregas en menos de 48 horas cuando aplica.',
        'Servicio para flotas pequeñas con factura formal.',
      ],
    },
  ],

  /**
   * Editorial guides for hardcore local SEO. Long-tail queries people
   * actually type. Live at /guias/[slug].
   */
  guides: [
    {
      slug: 'cuanto-cuesta-pintar-un-carro-en-costa-rica',
      title: '¿Cuánto cuesta pintar un carro en Costa Rica en 2026?',
      eyebrow: 'Guía de precios',
      summary:
        'Rango real de precios para pintar un carro completo en Costa Rica, qué factores suben el costo y cómo evaluar una cotización sin equivocarte.',
      readingMinutes: 6,
      heroImage: '/images/services/pintura-completa.avif',
      publishedIso: '2026-04-23',
      keywords: [
        'cuanto cuesta pintar un carro costa rica',
        'precio pintura carro costa rica',
        'pintura completa precio cr',
      ],
      sections: [
        {
          heading: 'Rango de precios en Costa Rica (2026)',
          body: 'Una pintura completa profesional en Costa Rica va desde ₡400.000 para un carro compacto con color original, hasta ₡1.200.000 o más para SUV, pickup o cambios de color perlados. El precio real depende del estado de la carrocería, del sistema de pintura (Roberlo, BESA, PPG), del tipo de color y del tamaño del vehículo.',
        },
        {
          heading: '¿Qué diferencia un taller de ₡300.000 de uno de ₡600.000?',
          body: 'A veces nada — muchas veces, el acabado. Un taller que pinta al aire libre, sin cabina controlada ni horno de curado, puede parecer aceptable a los tres meses y estar levantando la pintura al año. Un taller con cabina, horno infrarrojo y materiales de marca reconocida cobra más porque el trabajo dura más.',
        },
        {
          heading: 'Factores que suben el precio real',
          body: 'Cambios de color completo, tonos perlados o metalizados, carrocería con masilla vieja que hay que retirar, reemplazo de paneles oxidados y desmontaje total (molduras, emblemas, paragolpes) son los cuatro factores que más mueven el precio. Una cotización que no mencione ninguno de estos es una cotización que no vio el carro.',
        },
        {
          heading: 'Cómo leer una cotización profesional',
          body: 'Una cotización seria detalla: estado de la carrocería antes de pintar, trabajos previos (masilla, lijado, reparación), sistema de pintura y marca, cantidad de capas, desmontaje, pulido final y garantía escrita. Si el taller no pone esto por escrito, no hay forma de reclamar después.',
        },
        {
          heading: 'Cotización honesta por WhatsApp',
          body: 'En Uvita Body Shop damos cotización con fotos por WhatsApp antes de que traigas el carro. No cobramos el estimado y te decimos si vale la pena o si te conviene esperar.',
        },
      ],
      related: ['pintura-completa', 'retoques-pintura'],
    },
    {
      slug: 'enderezado-de-chasis-cuando-es-necesario',
      title: 'Enderezado de chasis: cuándo es necesario y cuándo no',
      eyebrow: 'Guía técnica',
      summary:
        'Señales de que el chasis quedó torcido después de un golpe, qué se mide y por qué importa para la garantía del seguro.',
      readingMinutes: 5,
      heroImage: '/images/services/enderezado.avif',
      publishedIso: '2026-04-15',
      keywords: [
        'enderezado de chasis costa rica',
        'como saber si mi chasis esta torcido',
        'enderezado uvita',
      ],
      sections: [
        {
          heading: 'Señales físicas de un chasis desalineado',
          body: 'Separaciones desiguales entre puertas, capó y baúl. Volante recto pero carro "jalando" hacia un lado. Desgaste irregular de llantas a los pocos meses. Paneles que no cierran con el mismo clic que antes. Cualquiera de estas señales, después de un golpe, es motivo para medir.',
        },
        {
          heading: 'Qué se mide en un diagnóstico estructural',
          body: 'Los fabricantes publican valores de referencia del chasis: distancias entre puntos de anclaje, ángulos de largueros, altura de piso y tolerancias de suspensión. Un equipo de medición computarizada los compara contra el chasis real y marca cada desviación en milímetros.',
        },
        {
          heading: 'Por qué no basta con "martillar hasta que cuadre"',
          body: 'Un chasis mal enderezado compromete la seguridad: los puntos de absorción de impacto fueron diseñados para deformarse en cierta secuencia. Si la geometría no vuelve a fábrica, el próximo golpe puede ser mucho peor. Además, una aseguradora que inspecciona el carro después puede negar cobertura si detecta trabajo estructural informal.',
        },
        {
          heading: 'Cuánto tarda y cuánto cuesta en Costa Rica',
          body: 'Un enderezado estructural en bancada hidráulica lleva de 5 a 20 días hábiles según la severidad, y el costo arranca alrededor de ₡250.000. El reporte escrito del trabajo es tan importante como la reparación — es lo que certifica que el carro volvió a tolerancia.',
        },
      ],
      related: ['enderezado', 'reparacion-golpes'],
    },
    {
      slug: 'como-saber-si-tu-pintura-necesita-retoque-o-repinte',
      title: '¿Retoque o pintura completa? Cómo saber cuál te conviene',
      eyebrow: 'Guía práctica',
      summary:
        'Cuándo un retoque localizado es suficiente, cuándo hay que repintar el panel completo y cuándo conviene pintar el carro entero.',
      readingMinutes: 4,
      heroImage: '/images/services/retoques-pintura.avif',
      publishedIso: '2026-03-30',
      keywords: [
        'retoque pintura vs pintura completa',
        'cuando pintar carro completo',
        'rayones profundos pintura',
      ],
      sections: [
        {
          heading: 'Retoque localizado: cuándo aplica',
          body: 'Rayones que no atraviesan la capa de color, marcas de lavado mal hecho, piquetes de piedra y zonas menores a 10 cm. El retoque cuesta entre ₡35.000 y ₡120.000 según la zona y es invisible si se hace bien.',
        },
        {
          heading: 'Repintar el panel completo',
          body: 'Cuando el daño cubre más del 30% del panel, cuando hay óxido visible o cuando el color del panel está descolorido por el sol. Repintar un panel completo (puerta, capó o guardabarros) va de ₡120.000 a ₡250.000.',
        },
        {
          heading: 'Pintura completa: el umbral real',
          body: 'Si necesitás repintar 3 paneles o más, si el color general ya está cristalizado por el sol, o si vas a cambiar el tono del carro, conviene pintura completa. Matemáticamente empieza a tener sentido desde los ₡450.000 — y el acabado final es uniforme, algo que 3 repintados parciales no pueden lograr.',
        },
        {
          heading: 'La prueba visual de 3 metros',
          body: 'Parate a 3 metros del carro con luz natural. Si el daño salta a la vista desde esa distancia, el retoque no va a resolver la percepción visual; conviene repintar el panel. Si solo se nota pegado al carro, con un retoque bien hecho queda perfecto.',
        },
      ],
      related: ['retoques-pintura', 'pintura-completa'],
    },
    {
      slug: 'pintura-automotriz-en-clima-costero',
      title: 'Pintura automotriz en clima costero: cómo cuidarla en la Costa Ballena',
      eyebrow: 'Guía de cuidado',
      summary:
        'Qué le hace el sol, la sal y la humedad de Uvita a la pintura del carro, y cómo protegerla para que dure.',
      readingMinutes: 5,
      heroImage: '/images/craft.avif',
      publishedIso: '2026-03-10',
      keywords: [
        'cuidar pintura carro costa rica',
        'pintura automotriz clima tropical',
        'pintar carro zona sur costa rica',
      ],
      sections: [
        {
          heading: 'Los tres enemigos del acabado en la costa',
          body: 'Sol UV intenso, salinidad por cercanía al mar y humedad permanente. Los tres atacan distintas capas de la pintura: el sol oxida el barniz, la sal penetra la base si hay microfisuras, y la humedad acelera óxido en paneles con masilla mal sellada.',
        },
        {
          heading: 'Qué hacer el primer año',
          body: 'Lavado semanal con shampoo automotriz neutro, evitar productos con silicona que sellan pero no protegen, encerar cada 3 meses con cera carnauba o sintética. Los primeros 30 días después de pintar, no lavar a presión ni encerar — el barniz todavía está curando.',
        },
        {
          heading: 'Materiales pensados para costa',
          body: 'En el taller usamos sistemas Roberlo y BESA con lacas que tienen inhibidores UV y resistencia a salinidad. Es el mismo tipo de sistema que especifican las agencias para carros que se comercializan en zonas costeras.',
        },
        {
          heading: 'Señales tempranas de que la pintura está cediendo',
          body: 'Opacidad por zonas (especialmente techo y capó), aparición de microfisuras tipo "piel de naranja" invertida, color que vira hacia el amarillo en blancos o hacia el rosa en rojos. Si ves alguna de estas señales, un retoque temprano evita un repintado completo.',
        },
      ],
      related: ['pintura-completa', 'retoques-pintura'],
    },
  ],
} as const

/**
 * URL origin — override via NEXT_PUBLIC_SITE_URL in .env.local / Vercel env.
 * Default is the production domain.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://uvitabodyshop.com'

/**
 * UI-facing contact selector. One shape for every display consumer
 * (navigation, contact section, mobile menu, footer).
 */
export function displayContact(locale: 'es' | 'en' = 'es') {
  return {
    phone: business.contact.phone,
    phoneDisplay: business.contact.phoneDisplay,
    whatsapp: business.contact.whatsapp,
    hoursDisplay:
      locale === 'en' ? business.hours.displayEn : business.hours.display,
    locationDisplay: business.address.locationDisplay,
  }
}

export function getServiceBySlug(
  slug: string
): ServiceEntry | undefined {
  return business.services.find((s) => s.slug === slug)
}

export function getZoneBySlug(slug: string) {
  return business.zones.find((z) => z.slug === slug)
}

export function getGuideBySlug(slug: string) {
  return business.guides.find((g) => g.slug === slug)
}

/**
 * schema.org `AutoBodyShop` + `LocalBusiness` JSON-LD graph.
 * Used in `app/layout.tsx` — do not duplicate this literal elsewhere.
 */
export function buildStructuredData() {
  const { rating, testimonials } = business
  const ratingBlock =
    rating.count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.value,
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}

  const reviewBlock =
    testimonials.length > 0
      ? {
          review: testimonials.map((t) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: t.author },
            reviewBody: t.quote,
            datePublished: t.dateIso,
            reviewRating: t.rating
              ? {
                  '@type': 'Rating',
                  ratingValue: t.rating,
                  bestRating: 5,
                  worstRating: 1,
                }
              : undefined,
          })),
        }
      : {}

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['AutoBodyShop', 'LocalBusiness'],
        '@id': `${siteUrl}#business`,
        name: business.name,
        description: business.meta.descriptionEs,
        url: siteUrl,
        telephone: business.contact.phone,
        priceRange: business.pricing.priceRange,
        image: `${siteUrl}/opengraph-image`,
        logo: `${siteUrl}/logo.png`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: business.address.locality,
          addressRegion: business.address.region,
          addressCountry: business.address.countryCode,
        },
        areaServed: business.address.areaServed.map((locality) => ({
          '@type': 'City',
          name: locality,
        })),
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: business.hours.daysOfWeek,
            opens: business.hours.opens,
            closes: business.hours.closes,
          },
        ],
        founder: { '@type': 'Person', name: business.owner },
        foundingDate: String(business.foundedYear),
        makesOffer: business.services.map((s) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: s.es,
            alternateName: s.en,
            description: s.description,
            url: `${siteUrl}/servicios/${s.slug}`,
          },
        })),
        sameAs: business.socialLinks.map((s) => s.url),
        ...ratingBlock,
        ...reviewBlock,
      },
    ],
  }
}
