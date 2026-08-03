from scraper import BRAVE_EXE, BRAVE_SESSION_DIR, CATEGORIAS_URL, PlaywrightFetcher


with PlaywrightFetcher(BRAVE_SESSION_DIR, BRAVE_EXE, headless=False) as fetcher:
    soup = fetcher.get_soup(CATEGORIAS_URL)
    print(soup.title.get_text(strip=True) if soup.title else "Sin titulo")

    with open("categorias.html", "w", encoding="utf-8") as f:
        f.write(str(soup))
