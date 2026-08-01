"""
Scraper para vivichivilcoy.com.ar -> Supabase

Recrea la estructura:
  Rubros      (nivel 1, ej: "Aberturas", "Abogados")
  Categorias  (nivel 2, ej: "Aberturas de Aluminio". Si un rubro no tiene
               categorias propias, se crea una categoria "general" que
               apunta a la misma pagina de listado del rubro)
  Negocios    (cada card dentro de una pagina de listado, con paginacion)

Uso:
    python scraper.py scrape          # scrapea todo y guarda JSON local
    python scraper.py upload          # sube los JSON generados a Supabase
    python scraper.py all             # scrape + upload

Requisitos: ver requirements.txt
Variables de entorno: ver .env.example

NOTA IMPORTANTE (leer antes de correr):
Este script fue armado a partir de:
  - el HTML de https://vivichivilcoy.com.ar/sitio/categorias
  - el HTML de listados tipo https://vivichivilcoy.com.ar/sitio/aberturas-219
No tuve acceso al HTML de una ficha de detalle de negocio (ej:
https://vivichivilcoy.com.ar/sitio/diperna-juan-carlos), asi que la
extraccion de email / web / instagram / facebook / horario es "best effort"
(busca patrones genericos: mailto:, facebook.com, instagram.com, etc).
Si al correrlo ves que faltan datos o vienen mal, pegame el HTML de una
ficha real y te ajusto los selectores exactos.
"""

import os
import re
import json
import time
import argparse
import logging
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("scraper")

BASE_URL = "https://vivichivilcoy.com.ar"
CATEGORIAS_URL = f"{BASE_URL}/sitio/categorias"

OUT_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(OUT_DIR, exist_ok=True)

RUBROS_JSON = os.path.join(OUT_DIR, "rubros.json")
CATEGORIAS_JSON = os.path.join(OUT_DIR, "categorias.json")
NEGOCIOS_JSON = os.path.join(OUT_DIR, "negocios.json")

REQUEST_DELAY = 0.8          # segundos entre requests, para no bombardear el sitio
REQUEST_TIMEOUT = 25
MAX_RETRIES = 3
MAX_PAGES_SAFETY = 300       # tope de paginas por listado, por seguridad

session = requests.Session()
session.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
})


# --------------------------------------------------------------------------
# Utilidades HTTP
# --------------------------------------------------------------------------

def get_soup(url: str) -> BeautifulSoup:
    last_err = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = session.get(url, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
            time.sleep(REQUEST_DELAY)
            return BeautifulSoup(resp.text, "html.parser")
        except requests.RequestException as e:
            last_err = e
            log.warning("Fallo request a %s (intento %d/%d): %s", url, attempt, MAX_RETRIES, e)
            time.sleep(REQUEST_DELAY * attempt)
    raise RuntimeError(f"No se pudo obtener {url}: {last_err}")


def slug_from_href(href: str) -> str:
    """/sitio/aberturas-219 -> aberturas-219 ; /sitio/aberturas-219.html -> aberturas-219"""
    path = urlparse(href).path
    slug = path.strip("/").split("/")[-1]
    slug = re.sub(r"\.html?$", "", slug)
    return slug


def clean_text(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "")).strip()


# --------------------------------------------------------------------------
# Paso 1: Rubros + Categorias desde /sitio/categorias
# --------------------------------------------------------------------------

def scrape_rubros_y_categorias():
    log.info("Scrapeando rubros y categorias desde %s", CATEGORIAS_URL)
    soup = get_soup(CATEGORIAS_URL)

    rubros = []
    categorias = []

    # Cada rubro es un <li> de primer nivel dentro de ul.list-unstyled,
    # con un <b><u><a>Nombre (N)</a></u></b> y opcionalmente un <ul> anidado
    # con las categorias.
    top_lis = soup.select("div.well ul.list-unstyled > li")

    for li in top_lis:
        rubro_a = li.select_one(":scope > b > u > a") or li.select_one(":scope > b a")
        if not rubro_a:
            continue

        rubro_href = rubro_a.get("href", "")
        rubro_slug = slug_from_href(rubro_href)
        rubro_nombre = clean_text(rubro_a.get_text())
        # Sacar el contador "(26)" del final del nombre
        rubro_nombre = re.sub(r"\(\s*\d+\s*\)\s*$", "", rubro_nombre).strip()
        rubro_id = rubro_slug

        rubros.append({
            "id": rubro_id,
            "nombre": rubro_nombre,
            "descripcion": "",
            "slug": rubro_slug,
            "imagenFondo": "",
        })

        sub_items = li.select(":scope > ul > li")

        if sub_items:
            for sub in sub_items:
                sub_a = sub.select_one("a")
                if not sub_a:
                    continue
                cat_href = sub_a.get("href", "")
                cat_slug = slug_from_href(cat_href)
                cat_nombre = clean_text(sub_a.get_text())

                categorias.append({
                    "id": cat_slug,
                    "rubroId": rubro_id,
                    "nombre": cat_nombre,
                    "slug": cat_slug,
                    "imagenFondo": "",
                    "_listing_url": urljoin(BASE_URL, cat_href),
                })
        else:
            # Rubro sin categorias propias -> el rubro mismo es la pagina
            # de listado. Creamos una categoria "placeholder" para poder
            # mantener la FK categoriaId en Negocios (ya que en el esquema
            # es un campo obligatorio). Ajustable si preferis dejar
            # categoriaId nulo en estos casos.
            categorias.append({
                "id": f"{rubro_id}-general",
                "rubroId": rubro_id,
                "nombre": rubro_nombre,
                "slug": rubro_slug,
                "imagenFondo": "",
                "_listing_url": urljoin(BASE_URL, rubro_href),
            })

    log.info("Encontrados %d rubros y %d categorias", len(rubros), len(categorias))
    return rubros, categorias


# --------------------------------------------------------------------------
# Paso 2: Negocios de cada pagina de listado (con paginacion)
# --------------------------------------------------------------------------

def find_next_page_url(soup: BeautifulSoup, current_url: str, page_num: int):
    """
    Intenta encontrar el link a la pagina siguiente dentro de un bloque de
    paginacion estandar (ul.pagination / nav). Si no encuentra nada,
    devuelve None (se corta la paginacion).
    """
    pagination = soup.select_one("ul.pagination, .pagination, nav[aria-label*='page' i]")
    if not pagination:
        return None

    # Buscar un link "Siguiente" / "Next" / ">>" explicito
    for a in pagination.select("a"):
        text = clean_text(a.get_text()).lower()
        rel = (a.get("rel") or [""])[0]
        if text in (">", ">>", "siguiente", "next", "»") or rel == "next":
            href = a.get("href")
            if href:
                return urljoin(current_url, href)

    # Si no hay boton "siguiente" explicito, buscar el link numerico
    # correspondiente a page_num + 1
    for a in pagination.select("a"):
        text = clean_text(a.get_text())
        if text.isdigit() and int(text) == page_num + 1:
            href = a.get("href")
            if href:
                return urljoin(current_url, href)

    return None


def parse_negocio_card(section, rubro_id: str, categoria_id: str):
    nombre_a = section.select_one("h3 a")
    if not nombre_a:
        return None

    detail_href = nombre_a.get("href", "")
    detail_url = urljoin(BASE_URL, detail_href)
    negocio_id = slug_from_href(detail_href)
    nombre = clean_text(nombre_a.get_text())

    desc_tag = section.select_one(".summary-desc")
    descripcion = clean_text(desc_tag.get_text()) if desc_tag else ""

    address_tag = section.select_one("address")
    direccion = ""
    if address_tag:
        # Las direcciones vienen con <br> y mucho whitespace; unimos
        # las lineas no vacias con ", "
        lines = [clean_text(t) for t in address_tag.get_text("\n").split("\n")]
        direccion = ", ".join([l for l in lines if l])

    tel_tag = section.select_one(".contact-info a")
    telefono = clean_text(tel_tag.get_text()) if tel_tag else None

    img_tag = section.select_one(".media-left img")
    imagen = img_tag.get("src") if img_tag else None
    if imagen:
        imagen = urljoin(BASE_URL, imagen)

    return {
        "id": negocio_id,
        "categoriaId": categoria_id,
        "rubroId": rubro_id,
        "nombre": nombre,
        "descripcion": descripcion,
        "direccion": direccion,
        "telefono": telefono,
        "email": None,       # se completa en enrich_negocio_detalle()
        "web": None,          # idem
        "instagram": None,    # idem
        "facebook": None,     # idem
        "verificado": False,  # No detecte una senal clara de "verificado" en
                               # el listado (ej. un badge). Ajustar si existe.
        "imagen": imagen,
        "horario": None,      # se completa en enrich_negocio_detalle()
        "_detail_url": detail_url,
    }


def scrape_negocios_de_listado(listing_url: str, rubro_id: str, categoria_id: str):
    negocios = []
    url = listing_url
    page_num = 1
    seen_urls = set()

    while url and url not in seen_urls and page_num <= MAX_PAGES_SAFETY:
        seen_urls.add(url)
        log.info("  Pagina %d: %s", page_num, url)
        soup = get_soup(url)

        cards = soup.select("section.summary-box")
        if not cards:
            break

        for card in cards:
            neg = parse_negocio_card(card, rubro_id, categoria_id)
            if neg:
                negocios.append(neg)

        next_url = find_next_page_url(soup, url, page_num)
        if not next_url:
            # Fallback: probar con ?page=N por si el sitio pagina asi
            # y no encontramos el bloque de paginacion.
            parsed = urlparse(url)
            if "page=" not in parsed.query:
                candidate = f"{url}{'&' if parsed.query else '?'}page={page_num + 1}"
                try:
                    test_soup = get_soup(candidate)
                    if test_soup.select("section.summary-box"):
                        next_url = candidate
                except RuntimeError:
                    next_url = None

        url = next_url
        page_num += 1

    return negocios


# --------------------------------------------------------------------------
# Paso 3 (best effort): enriquecer con datos de la ficha de detalle
# --------------------------------------------------------------------------

def enrich_negocio_detalle(negocio: dict):
    """
    Visita la ficha de detalle del negocio para intentar sacar
    email / web / instagram / facebook / horario.

    ADVERTENCIA: no tuve una ficha de detalle real para basar los
    selectores, asi que esto es heuristico (busca por patrones de href
    y texto). Revisar y ajustar con un ejemplo real si hace falta.
    """
    detail_url = negocio.get("_detail_url")
    if not detail_url:
        return negocio

    try:
        soup = get_soup(detail_url)
    except RuntimeError as e:
        log.warning("No se pudo abrir ficha de detalle %s: %s", detail_url, e)
        return negocio

    for a in soup.select("a[href]"):
        href = a.get("href", "")
        low = href.lower()

        if low.startswith("mailto:") and not negocio.get("email"):
            negocio["email"] = href.replace("mailto:", "").strip()
        elif "facebook.com" in low and not negocio.get("facebook"):
            negocio["facebook"] = href
        elif "instagram.com" in low and not negocio.get("instagram"):
            negocio["instagram"] = href
        elif (
            not negocio.get("web")
            and low.startswith("http")
            and "vivichivilcoy.com.ar" not in low
            and "facebook.com" not in low
            and "instagram.com" not in low
            and "twitter.com" not in low
            and "google.com" not in low
        ):
            negocio["web"] = href

    # Horario: buscamos algun bloque de texto que contenga la palabra
    # "Horario" cerca (heuristico, ajustar con HTML real).
    horario_tag = soup.find(string=re.compile(r"horario", re.IGNORECASE))
    if horario_tag:
        parent = horario_tag.parent
        texto = clean_text(parent.get_text()) if parent else clean_text(str(horario_tag))
        negocio["horario"] = texto or None

    return negocio


# --------------------------------------------------------------------------
# Orquestacion del scraping completo
# --------------------------------------------------------------------------

def run_scrape(enrich: bool = True):
    rubros, categorias = scrape_rubros_y_categorias()

    all_negocios = []
    seen_negocio_ids = set()

    for cat in categorias:
        listing_url = cat.pop("_listing_url")
        log.info("Categoria '%s' (%s) -> %s", cat["nombre"], cat["id"], listing_url)
        negocios = scrape_negocios_de_listado(listing_url, cat["rubroId"], cat["id"])

        for neg in negocios:
            if neg["id"] in seen_negocio_ids:
                # Mismo negocio listado en mas de una categoria: nos
                # quedamos con la primera ocurrencia para no duplicar la
                # fila en la tabla negocios (podrias en cambio armar una
                # tabla puente negocios_categorias si un negocio puede
                # pertenecer a varias categorias).
                continue
            seen_negocio_ids.add(neg["id"])
            all_negocios.append(neg)

    if enrich:
        log.info("Enriqueciendo %d negocios con datos de la ficha de detalle...", len(all_negocios))
        for i, neg in enumerate(all_negocios, 1):
            enrich_negocio_detalle(neg)
            if i % 25 == 0:
                log.info("  ...%d/%d", i, len(all_negocios))

    for neg in all_negocios:
        neg.pop("_detail_url", None)

    with open(RUBROS_JSON, "w", encoding="utf-8") as f:
        json.dump(rubros, f, ensure_ascii=False, indent=2)
    with open(CATEGORIAS_JSON, "w", encoding="utf-8") as f:
        json.dump(categorias, f, ensure_ascii=False, indent=2)
    with open(NEGOCIOS_JSON, "w", encoding="utf-8") as f:
        json.dump(all_negocios, f, ensure_ascii=False, indent=2)

    log.info(
        "Listo. %d rubros, %d categorias, %d negocios guardados en %s",
        len(rubros), len(categorias), len(all_negocios), OUT_DIR,
    )


# --------------------------------------------------------------------------
# Carga a Supabase
# --------------------------------------------------------------------------

def get_supabase_client():
    from supabase import create_client

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")  # usar la service_role key para carga masiva
    if not url or not key:
        raise RuntimeError(
            "Faltan las variables de entorno SUPABASE_URL y/o SUPABASE_KEY. "
            "Ver .env.example"
        )
    return create_client(url, key)


def upsert_batches(client, table: str, rows: list, batch_size: int = 200):
    if not rows:
        log.info("Nada para subir en '%s'", table)
        return
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        client.table(table).upsert(batch, on_conflict="id").execute()
        log.info("  %s: subidas filas %d-%d de %d", table, i + 1, i + len(batch), len(rows))


def run_upload():
    with open(RUBROS_JSON, encoding="utf-8") as f:
        rubros = json.load(f)
    with open(CATEGORIAS_JSON, encoding="utf-8") as f:
        categorias = json.load(f)
    with open(NEGOCIOS_JSON, encoding="utf-8") as f:
        negocios = json.load(f)

    client = get_supabase_client()

    log.info("Subiendo rubros...")
    upsert_batches(client, "rubros", rubros)

    log.info("Subiendo categorias...")
    upsert_batches(client, "categorias", categorias)

    log.info("Subiendo negocios...")
    upsert_batches(client, "negocios", negocios)

    log.info("Carga a Supabase finalizada.")


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Scraper vivichivilcoy.com.ar -> Supabase")
    parser.add_argument(
        "accion",
        choices=["scrape", "upload", "all"],
        help="scrape: solo scrapea y guarda JSON local. "
             "upload: solo sube los JSON ya generados a Supabase. "
             "all: hace ambas cosas.",
    )
    parser.add_argument(
        "--no-enrich",
        action="store_true",
        help="No visitar las fichas de detalle (mas rapido, pero sin email/web/instagram/facebook/horario)",
    )
    args = parser.parse_args()

    if args.accion in ("scrape", "all"):
        run_scrape(enrich=not args.no_enrich)
    if args.accion in ("upload", "all"):
        run_upload()


if __name__ == "__main__":
    main()
