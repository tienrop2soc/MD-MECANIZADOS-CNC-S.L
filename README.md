# MD Mecanizados CNC · Web corporativa

Web corporativa orientada a empresas (B2B) para un taller de mecanizado de precisión en Móstoles (Madrid).
Presenta los servicios de mecanizado CNC, medición 3D por láser, verificación con MMC, soldadura e ingeniería de desarrollo de producto.
No muestra precios: todo el recorrido lleva a pedir presupuesto por teléfono o email.

Es una web estática con HTML, CSS y JavaScript sin dependencias ni proceso de compilación.

## Estructura

```
index.html            Página principal
legal.html            Aviso legal, privacidad y cookies
assets/css/styles.css Estilos y fuentes
assets/js/main.js     Menú móvil, animaciones y formulario de presupuesto
assets/img/           Fotografías (WebP) y favicon
assets/fonts/         Fuentes Barlow y Barlow Condensed alojadas localmente
```

## Secciones de la página principal

1. Barra superior y cabecera con teléfono, email y botón "Solicitar presupuesto" siempre visibles.
2. Portada con mensaje principal y tarjeta de contacto directo.
3. Quiénes somos.
4. Servicios, con un botón por servicio que lo preselecciona en el formulario.
5. Cómo trabajamos: proceso de pedido en cinco pasos.
6. Capacidades: materiales, formatos de archivo, tipos de pedido y documentación.
7. Sectores atendidos.
8. Calidad y metrología.
9. Galería del taller.
10. Llamada a la acción para enviar planos.
11. Preguntas frecuentes para compras e ingeniería.
12. Contacto con teléfono, email, ubicación, horario, mapa y formulario.

En móvil aparece una barra fija inferior con los botones Llamar, Email y Presupuesto.

## Formulario de presupuesto

La web no necesita servidor.
Al enviar el formulario se abre el programa de correo del visitante con la solicitud ya redactada y dirigida a la empresa, para que adjunte sus planos.
Si el correo no se abre, el visitante puede copiar la solicitud con un botón.

La dirección de destino está en la constante `CONTACT_EMAIL` de `assets/js/main.js`.

## Datos que hay que sustituir antes de publicar

El teléfono, el email y el dominio son **provisionales**.
Sustitúyalos en todos los archivos con estos comandos, cambiando los valores de la derecha:

```bash
grep -rl "910 000 000\|910000000\|mdmecanizadoscnc.es" --include=*.html --include=*.js . \
  | xargs sed -i \
    -e 's/+34 910 000 000/+34 XXX XXX XXX/g' \
    -e 's/910 000 000/XXX XXX XXX/g' \
    -e 's/+34910000000/+34XXXXXXXXX/g' \
    -e 's/info@mdmecanizadoscnc.es/correo@sudominio.es/g' \
    -e 's#https://www.mdmecanizadoscnc.es/#https://www.sudominio.es/#g'
```

Revise además:

- **Dirección exacta.** Ahora solo figura "Móstoles, Madrid". Puede añadirla en la sección de contacto y en el mapa de `index.html`.
- **Horario.** Figura de lunes a viernes de 8:00 a 18:00.
- **Datos legales.** Los campos entre corchetes de `legal.html` (CIF, domicilio, datos registrales) son obligatorios por la LSSI.
- **Afirmaciones técnicas.** Los procesos de soldadura (TIG, MIG/MAG), materiales, sectores y documentación de entrega se han redactado de forma genérica. Ajústelos a la capacidad real del taller.

## Ver la web en local

Abra `index.html` en el navegador, o sirva la carpeta:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Publicación

Al ser estática, puede alojarse en cualquier hosting, en GitHub Pages, Netlify o Cloudflare Pages subiendo la carpeta tal cual.

## Créditos

- Fotografías de [Unsplash](https://unsplash.com), bajo la [licencia Unsplash](https://unsplash.com/license), que permite uso comercial sin atribución. Se recomienda sustituirlas por fotos reales del taller cuando estén disponibles, conservando los nombres de archivo.
- Fuentes Barlow y Barlow Condensed de Jeremy Tribby, bajo licencia SIL Open Font License 1.1.
