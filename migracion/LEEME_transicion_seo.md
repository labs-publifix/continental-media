# Transición SEO del sitio viejo al nuevo · Continental Media

Documento de contexto para Claude Code. Léelo completo antes de tocar el proyecto. Fecha de redacción: 26 de octubre de 2026.

## 1. Qué se decidió y por qué

El sitio viejo (WordPress, `www.continentalmedia.com.mx`) deja de servirse cuando el DNS apunte al sitio nuevo. El sitio nuevo publica contenido desde cero y actualizado a 2026, así que **no se migran los 969 URLs indexados**. Se aplica un plan reducido basado en datos reales de Search Console (16 meses, exportados el 26-oct-2026):

- El sitio viejo tuvo 725 clics en 16 meses repartidos en 424 URLs. Las 25 URLs principales concentran el 89 % de los clics.
- Solo 38 URLs se atienden en el corte (hoja **Lista corta** del Excel y `redirects_lista_corta.csv`): 36 con redirect 301 y 2 que se conservan en su misma ruta. Cubren el 60 % de los clics; el home (sin redirect) aporta otro 31 %.
- Todo lo demás (929 URLs, incluidas casi todas las 516 imágenes) responde **404 real** con una página 404 útil. No se redirige en masa al home.
- Mandar indexar el sitio nuevo en Search Console NO transfiere señales del sitio viejo; solo los redirects lo hacen.

## 2. Archivos del paquete

- `Plan_Transicion_SEO_URLs_Continental_Media_v2_lista_corta.xlsx`: fuente de verdad. Hoja `Mapa maestro` (969 URLs, columnas T y U = lista corta y acción final), hoja `Lista corta`, hoja `Destinos` (host canónico y fecha de corte editables).
- `redirects_lista_corta.csv`: la lista corta lista para generar reglas. Columnas: `ruta_origen, accion_final, ruta_destino_al_corte, destino_final, fecha_cambio_destino_final, clics_16m`.
- `Backlog_Blog_Continental_Media_FINAL_calendarizado.xlsx`: backlog de 100 temas con fechas (8 iniciales el 19-oct-2026, luego martes y jueves). Hoja `Posts actuales` = decisión por cada post viejo.
- El XML de exportación de WordPress y el `.sql` (respaldo del sitio viejo) los pone el usuario en `migracion/respaldo/`. **No subas al repositorio** el respaldo completo de 1.8 GB ni `wp-content/uploads`.

## 3. Reglas de redirect (lista corta)

1. Un solo salto, nunca cadenas. Ruta de origen sin host; funciona igual para `www` y sin `www`. En GitHub Pages no existe el 301 de servidor, así que cada redirect es una página stub (ver punto 7); si algún día el sitio pasa a un hosting con 301 real, la lista y el generador se reutilizan tal cual.
2. Destino de cada redirect de blog: el artículo nuevo si su fecha de publicación es ≤ fecha de corte; si no, la categoría pilar si ya tiene artículos publicados; si no, `/blog/`. El destino se recalcula al publicar cada artículo (artefacto de build: lee `fecha_cambio_destino_final` del CSV y el estado de publicación).
3. Portafolio viejo (`/portfolio/*`, `/portafolio/`) → `/proyectos/`. Esa página debe existir como página real antes del corte (hoy el sitio nuevo solo tiene sección ancla `#proyectos`).
4. `/contacto/` → `/#contacto`, `/nuestros-servicios/` → `/#servicios`, `/agencia-de-publicidad/` y `/usa/` → `/`.
5. Los redirects viven como mínimo un año. No bloquear las URLs viejas en `robots.txt`.
6. Las 2 URLs que se conservan (sección 5) NO redirigen: responden 200 con contenido nuevo.
7. **Hosting decidido: el sitio se lanza en GitHub Pages**, sin backend; los artículos se publican haciendo commit desde Claude Code. Como GitHub Pages no hace 301, genera los redirects con un script (`scripts/generar_redirects.mjs` o similar) a partir del CSV, no a mano, como **páginas stub estáticas**: para cada `ruta_origen` crea `<ruta>/index.html` con `<meta http-equiv="refresh" content="0; url=DESTINO">` (cero segundos, que Google interpreta como redirect permanente), `<link rel="canonical" href="DESTINO">`, un enlace visible al destino y un respaldo con `location.replace`. No pongas `noindex` en los stubs. Rutas con caracteres especiales (por ejemplo `ñ`) deben probarse con su forma codificada en URL. El destino de cada stub se regenera en cada publicación de artículo, en el mismo commit. Mantén el generador desacoplado con un adaptador de salida, para poder emitir `vercel.json` (`statusCode: 301`) o `_redirects` si algún día se cambia de hosting. `404.html` en la raíz: GitHub Pages lo sirve con estado 404 real para cualquier ruta inexistente. No cambies DNS ni conectes dominios: eso lo hace el usuario.

## 4. Página 404

- Estado HTTP 404 real (no 200), `noindex`, fuera del sitemap. Archivo `404.html` con la identidad de marca.
- Contenido: mensaje claro (esta página ya no existe, el sitio se renovó), botones a Servicios, Proyectos, Blog y Contacto, WhatsApp, los 3 artículos más recientes del blog (generados en el build), y un bloque de sugerencias del lado del cliente que lee la ruta pedida y propone el servicio o la categoría más cercana por palabras clave (`seo`, `redes`, `video`, `branding`, `evento`, `radio`, `diseno`, `logo`...).
- Evento de analítica `404` con ruta y referer.

## 5. Los dos posts que se conservan en su misma URL

Son el 34 % de los clics del sitio viejo, y los únicos con posicionamiento propio. Se **republican en el blog nuevo en la misma ruta, con versión 2026 del mismo tema**. No se copia el texto viejo tal cual y no se cambia el tema.

| | Historia de la publicidad en México | Pioneros de la publicidad en México |
|---|---|---|
| URL a conservar | `/2013/04/historia-de-la-publicidad-en-mexico/` | `/2014/02/pioneros-de-la-publicidad-en-mexico/` |
| Publicado originalmente | 25-abr-2013 (última modificación 22-oct-2019) | 20-feb-2014 |
| Autor original | rafaaguirre1 (Rafael Aguirre) | rafaaguirre1 (Rafael Aguirre) |
| Clics 16 m / impresiones / posición media | 202 / 9,409 / 14.1 | 48 / 2,209 / 9.0 |
| Consulta que ya posiciona | "historia de la publicidad en mexico": 22 clics, posición 6.3 | cercanas: "publicistas", "publicistas famosos" (poca demanda) |

Estado del texto actual (leído del sitio viejo; el texto literal sale del XML de WordPress):
- Ambos son cortos, sin subtítulos (solo el título), sin imágenes y con comentarios cerrados.
- *Historia*: cronología. Pochtecas prehispánicos; primer volante, primer periódico, primer diario con anuncios, *El Despertador Americano*; primeras marcas anunciantes; siglo XIX (anuncios gratuitos, primera campaña y tarifa en 1850, Agencia General de Anuncios en 1865); siglo XX: prensa, radio desde 1925, XEU en 1930, Grand Advertising en 1940, AMAP en 1950, Medios Publicitarios Mexicanos en 1959, televisión comercial desde 1951 y cable en 1969.
- *Pioneros*: fundación de la Asociación Nacional de Publicistas (1923, Fernando Bolaños Cacho, Escuela Técnica de Publicidad) y cuatro perfiles: José Alberto Terán, Carlos Alazraki, José Manuel Montalvo, Ana María Olabuenaga.

Cómo escribir la versión 2026:
- Conserva el tema, el título casi igual (la palabra clave exacta "historia de la publicidad en México" en `<title>`, H1 y primer párrafo) y la intención de búsqueda. Si el título cambia, que sea para añadir "(de los pochtecas a la IA)" o similar, no para cambiar el tema.
- Estructura con H2/H3 (hoy no tienen), TL;DR al inicio, línea de tiempo por épocas, y una sección nueva que cubra las décadas que faltan (digital, redes, IA). En *Pioneros*, perfiles actualizados y una sección sobre cómo cambió la profesión.
- **Verifica cada dato histórico contra fuentes citables antes de publicar** (fechas, nombres, cargos). Varios datos del texto viejo son de 2013-2014 y pueden estar desactualizados, sobre todo los cargos y trayectorias de los perfiles de *Pioneros*. No inventes: si un dato no se puede verificar, quítalo o márcalo.
- Cierre con una conexión natural a los servicios de la agencia (sin forzarla) y enlaces internos a artículos y categorías del blog nuevo.
- Sin fotografías: bloques de color de la paleta del sitio, igual que el resto del blog.
- Firma: Rafael Aguirre (autor original). Es la excepción a la firma aleatoria Pepe/Rafa.
- Metadatos: la ruta heredada es la URL canónica (no `/blog/<slug>/`). `datePublished` = fecha original; `dateModified` = fecha de publicación de la versión 2026. Mostrar "Actualizado el …" en pantalla. JSON-LD `Article` con ambas fechas. El blog nuevo debe aceptar un campo de front matter `ruta_heredada` que genere la página en esa ruta y la incluya en el sitemap y en los listados de `/blog/` y de su categoría.
- Categoría sugerida: "Estrategia de marketing y contenidos" (`/blog/categoria/estrategia-de-marketing/`, ya existe desde el 19-oct-2026). Confirmar con el usuario.

Flujo de autorización (regla permanente del usuario): para cada artículo se entrega primero el **PDF de vista previa** y el **artículo** para que el usuario autorice; nada pasa a producción sin su visto bueno. Estos dos deben quedar autorizados y publicados en el sitio nuevo **antes del cambio de DNS**.

## 6. Actualización del backlog

En `Backlog_Blog_Continental_Media_FINAL_calendarizado.xlsx`:
- Hoja `Posts actuales`: las filas de estas dos URLs hoy dicen `Descartar`. Cambiar a `Actualizar v2026 (misma URL)`, con "Qué hacer con la URL" = `Conservar ruta; sin 301`, y marcar que la columna "Fecha de activación del 301" no aplica.
- Hoja `Backlog`: agregar dos filas nuevas con IDs fuera del esquema actual (por ejemplo `H-01` y `H-02`), tipo Editorial, pilar "Estrategia de marketing y contenidos", fecha de publicación = antes del corte (no entran al calendario martes/jueves; no se recorre ninguna otra fecha). Si una fórmula o el conteo de la hoja `Resumen` deja de cuadrar, ajustarlo y verificar que no haya errores de fórmula.
- Otras tres URLs descartadas pero con clics pasan a 301 → `/blog/` (ya reflejado en el CSV): `/2012/12/campanas-exitosas-del-2012/`, `/2022/05/que-es-uber-one-nosotros-te-lo-explicamos/`, `/2013/12/las-campanas-mexicanas-mas-premiadas-de-2013/`. Reflejarlo en la hoja `Posts actuales`.

## 7. Qué dejar preparado para publicar el sitio

1. `sitemap.xml` solo con URLs canónicas que responden 200 (incluye las dos rutas heredadas). **Sin** sitemap de migración de URLs viejas en este plan reducido. `robots.txt` apuntando al sitemap.
2. Host canónico único (la decisión www/sin www está abierta; la hoja `Destinos` asume el dominio sin www). Canonicals, Open Graph y JSON-LD con ese host. Redirect del otro host al canónico, en una sola regla.
3. Página real `/proyectos/` (los 12 redirects del portafolio, incluida una página de imagen de proyecto, apuntan ahí) o aviso explícito de que falta.
4. Script de pruebas: para cada fila de la lista corta confirma que la ruta responde 200 con el stub, que el `meta refresh` es de 0 segundos y que el destino (y el canonical) coincide exactamente con el CSV, cero cadenas (el destino no puede ser otro stub); confirma 200 en las dos rutas conservadas y 404 real (con el cuerpo de la página personalizada) en una muestra de URLs descartadas.
5. Lista final de pendientes del usuario: decidir el host canónico (con o sin www; en GitHub Pages se configura el dominio personalizado y el otro host redirige solo si ambos registros DNS están puestos), autorizar los dos artículos, cambiar DNS, enviar el sitemap nuevo y solicitar indexación en Search Console, y monitorear 404 durante 90 días.

## 8. Lo que NO se debe hacer

- No redirigir todo al home; no encadenar redirects; no bloquear las URLs viejas en `robots.txt`; no servir la 404 con estado 200; no usar JavaScript como redirect cuando exista opción de servidor.
- No publicar ni desplegar a producción sin autorización explícita del usuario. No tocar DNS, correo (MX/SPF/DKIM) ni el sitio viejo.
- No inventar datos históricos ni cifras.
