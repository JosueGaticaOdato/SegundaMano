# Scraper vivichivilcoy.com.ar → Supabase

## Qué hace
1. Lee `https://vivichivilcoy.com.ar/sitio/categorias` y arma **Rubros** y **Categorias**.
   - Si un rubro no tiene categorías propias (ej. "Abogados"), se crea una
     categoría "general" (`{rubro}-general`) que apunta a la misma página
     de listado del rubro, para poder mantener `categoriaId` en Negocios.
2. Recorre cada página de listado (con paginación) y arma **Negocios** a
   partir de cada `<section class="summary-box">`.
3. (Opcional, activado por defecto) Visita la ficha de detalle de cada
   negocio para intentar completar `email`, `web`, `instagram`, `facebook`
   y `horario`.
4. Guarda todo en `data/rubros.json`, `data/categorias.json`,
   `data/negocios.json`.
5. Sube (upsert por `id`) todo a Supabase.

## ⚠️ Cosas para revisar antes de correrlo en serio
No tuve acceso al HTML de una ficha de detalle real (solo a la página de
categorías y a los listados). Por eso:
- La extracción de `email` / `web` / `instagram` / `facebook` en la ficha
  de detalle es heurística (busca `mailto:`, `facebook.com`,
  `instagram.com`, o el primer link externo como "web").
- `horario` busca un bloque de texto cerca de la palabra "Horario".
- `verificado` queda siempre en `false` porque no vi ninguna señal clara
  (badge, ícono, etc.) en el listado que indique "negocio verificado".
- La paginación intenta detectar `ul.pagination` / `nav`, y si no la
  encuentra prueba con `?page=N` como fallback.

Corré el script primero con pocos rubros (podés cortar la lista de
`categorias` en `run_scrape` para probar) y si algo no sale bien, mandame
el HTML de una ficha de detalle real y te ajusto los selectores exactos.

## Instalación

```bash
python -m venv venv
source venv/bin/activate   # en Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# completar .env con tu SUPABASE_URL y SUPABASE_KEY (service_role)
```

## Crear las tablas en Supabase
Correr el contenido de `schema.sql` en el SQL Editor de tu proyecto Supabase.

## Uso

```bash
# Solo scrapear y guardar JSON local (no toca Supabase)
python scraper.py scrape

# Scrapear sin visitar fichas de detalle (más rápido, sin email/web/redes/horario)
python scraper.py scrape --no-enrich

# Solo subir los JSON ya generados a Supabase
python scraper.py upload

# Todo junto: scrapear + subir
python scraper.py all
```

Los JSON quedan en `data/` por si querés inspeccionarlos o corregirlos a
mano antes de subir.

## Notas de diseño
- Se usa `on_conflict="id"` en el upsert, así podés volver a correr el
  scraper (por ejemplo semanalmente) sin duplicar filas.
- Si un mismo negocio aparece en más de una categoría del sitio, el
  script se queda con la primera categoría encontrada (para no duplicar
  la fila en `negocios`, ya que el esquema tiene una sola `categoriaId`
  por negocio). Si preferís que un negocio pueda pertenecer a varias
  categorías, la solución correcta sería una tabla puente
  `negocios_categorias (negocio_id, categoria_id)` en vez de la columna
  `categoriaId` — avisame si querés que lo arme así.
- El delay entre requests (`REQUEST_DELAY = 0.8`) es para no sobrecargar
  el sitio; podés ajustarlo, pero no lo bajes demasiado.
