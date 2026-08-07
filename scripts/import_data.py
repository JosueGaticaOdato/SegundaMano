import os
import re
import json
import sys
import unicodedata
import urllib.request
import urllib.parse
import urllib.error

# 1. Load environment variables from .env.local
def load_env():
    env_path = os.path.join(os.getcwd(), '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                parts = line.split('=', 1)
                if len(parts) == 2:
                    key = parts[0].strip()
                    val = parts[1].strip()
                    # Strip surrounding quotes if present
                    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                        val = val[1:-1]
                    os.environ[key] = val
    else:
        print("Advertencia: No se encontró el archivo .env.local. Se utilizarán las variables de entorno del sistema.")

# 2. Slug generator helper
def slugify(text):
    if not text:
        return "sin-nombre"
    text = str(text).lower()
    text = unicodedata.normalize('NFD', text)
    text = "".join(c for c in text if unicodedata.category(c) != 'Mn')
    text = text.strip()
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'[^\w\-]+', '', text)
    text = re.sub(r'\-+', '-', text)
    return text or "sin-nombre"

# 3. HTTP Request helper
def make_request(url, method='GET', data=None, headers=None):
    if headers is None:
        headers = {}
    
    supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    if not supabase_key:
        print("Error: SUPABASE_SERVICE_ROLE_KEY no está definida en las variables de entorno.")
        sys.exit(1)
        
    req_headers = {
        'apikey': supabase_key,
        'Authorization': f"Bearer {supabase_key}",
        'Content-Type': 'application/json'
    }
    req_headers.update(headers)
    
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode('utf-8')
        
    req = urllib.request.Request(
        url,
        data=req_data,
        headers=req_headers,
        method=method
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read()
            if res_data:
                return json.loads(res_data.decode('utf-8'))
            return None
    except urllib.error.HTTPError as e:
        err_content = e.read().decode('utf-8')
        print(f"\nHTTP Error {e.code}: {e.reason}")
        print("Response body:", err_content)
        raise e
    except Exception as e:
        print(f"\nError de red/conexión: {str(e)}")
        raise e

# Main logic
def main():
    # Load .env.local file
    load_env()
    
    supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    if not supabase_url:
        print("Error: NEXT_PUBLIC_SUPABASE_URL no está definida en las variables de entorno.")
        sys.exit(1)
        
    # Check command-line arguments
    clear_flag = '--clear' in sys.argv or '-c' in sys.argv
    
    # Load JSON file
    json_path = os.path.join(os.getcwd(), 'datos.json')
    if not os.path.exists(json_path):
        print(f"Error: No se encontró el archivo datos.json en {json_path}")
        sys.exit(1)
        
    print(f"Leyendo archivo {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # If clear flag is set, clean the database tables first (respecting relationships order)
    if clear_flag:
        print("\n--- LIMPIEZA DE BASE DE DATOS ACTIVA ---")
        try:
            print("Eliminando negocios...")
            make_request(f"{supabase_url}/rest/v1/negocios?id=not.is.null", method='DELETE')
            print("Eliminando categorias...")
            make_request(f"{supabase_url}/rest/v1/categorias?id=not.is.null", method='DELETE')
            print("Eliminando rubros...")
            make_request(f"{supabase_url}/rest/v1/rubros?id=not.is.null", method='DELETE')
            print("Tablas limpiadas exitosamente.\n")
        except Exception as e:
            print(f"Error limpiando tablas: {e}")
            sys.exit(1)

    # Initialize mappings and tracking sets
    existing_rubros = {}      # slug -> UUID
    existing_categories = {}  # (rubro_UUID, slug) -> UUID
    used_category_slugs = set() # (rubro_UUID, slug)
    
    # If not clearing, fetch existing data to prevent unique constraints violations
    if not clear_flag:
        print("Consultando datos existentes en Supabase para evitar duplicados...")
        try:
            # Rubros
            rubros_data = make_request(f"{supabase_url}/rest/v1/rubros?select=id,slug")
            if rubros_data:
                for r in rubros_data:
                    existing_rubros[r['slug']] = r['id']
            
            # Categorias
            cat_data = make_request(f"{supabase_url}/rest/v1/categorias?select=id,rubro_id,slug")
            if cat_data:
                for c in cat_data:
                    existing_categories[(c['rubro_id'], c['slug'])] = c['id']
                    used_category_slugs.add((c['rubro_id'], c['slug']))
            
            print(f"Encontrados en BD: {len(existing_rubros)} rubros y {len(existing_categories)} categorías.")
        except Exception as e:
            print(f"Error consultando datos existentes: {e}")
            sys.exit(1)

    print("\nProcesando Rubros...")
    new_rubros_to_insert = []
    
    for rubro_name, rubro_content in data.items():
        slug = slugify(rubro_name)
        if slug not in existing_rubros:
            new_rubros_to_insert.append({
                "nombre": rubro_name,
                "slug": slug,
                "descripcion": "",
                "imagen_fondo": rubro_content.get("cover") or ""
            })
            
    if new_rubros_to_insert:
        print(f"Insertando {len(new_rubros_to_insert)} nuevos rubros...")
        try:
            inserted = make_request(
                f"{supabase_url}/rest/v1/rubros",
                method='POST',
                data=new_rubros_to_insert,
                headers={'Prefer': 'return=representation'}
            )
            if inserted:
                for r in inserted:
                    existing_rubros[r['slug']] = r['id']
        except Exception as e:
            print(f"Error al insertar rubros: {e}")
            sys.exit(1)
    else:
        print("No se encontraron rubros nuevos para insertar.")

    print("\nProcesando Categorías...")
    new_categories_to_insert = []
    
    # We iterate over the JSON data to build the categories list
    for rubro_name, rubro_content in data.items():
        rubro_slug = slugify(rubro_name)
        rubro_id = existing_rubros.get(rubro_slug)
        if not rubro_id:
            print(f"Advertencia: No se encontró ID para el rubro '{rubro_name}'")
            continue
            
        subcategorias = rubro_content.get("subcategories") or {}
        for cat_name, cat_content in subcategorias.items():
            # Slug generation with collision resolution inside the same rubro
            base_cat_slug = slugify(cat_name)
            cat_slug = base_cat_slug
            counter = 1
            while (rubro_id, cat_slug) in used_category_slugs:
                cat_slug = f"{base_cat_slug}-{counter}"
                counter += 1
                
            if (rubro_id, cat_slug) not in existing_categories:
                new_categories_to_insert.append({
                    "rubro_id": rubro_id,
                    "nombre": cat_name,
                    "slug": cat_slug,
                    "imagen_fondo": cat_content.get("img") or ""
                })
                # Add to set so subsequent duplicates in the JSON get incremented slugs
                used_category_slugs.add((rubro_id, cat_slug))

    if new_categories_to_insert:
        print(f"Insertando {len(new_categories_to_insert)} nuevas categorías...")
        try:
            inserted_cats = make_request(
                f"{supabase_url}/rest/v1/categorias",
                method='POST',
                data=new_categories_to_insert,
                headers={'Prefer': 'return=representation'}
            )
            if inserted_cats:
                for c in inserted_cats:
                    existing_categories[(c['rubro_id'], c['slug'])] = c['id']
        except Exception as e:
            print(f"Error al insertar categorías: {e}")
            sys.exit(1)
    else:
        print("No se encontraron categorías nuevas para insertar.")

    print("\nProcesando Negocios...")
    negocios_to_insert = []
    
    # Trace through JSON again to match shops to their IDs
    for rubro_name, rubro_content in data.items():
        rubro_slug = slugify(rubro_name)
        rubro_id = existing_rubros.get(rubro_slug)
        if not rubro_id:
            continue
            
        subcategorias = rubro_content.get("subcategories") or {}
        for cat_name, cat_content in subcategorias.items():
            # Find the correct category id by traversing exactly like we did above
            # We must compute the exact slug we assigned to it
            base_cat_slug = slugify(cat_name)
            cat_slug = base_cat_slug
            counter = 1
            
            # Since we added categories to used_category_slugs in order, we can look up what matches
            # Let's search inside existing_categories to find which ID fits
            # The category key is (rubro_id, cat_slug)
            cat_id = None
            while (rubro_id, cat_slug) in used_category_slugs or (rubro_id, cat_slug) in existing_categories:
                if (rubro_id, cat_slug) in existing_categories:
                    cat_id = existing_categories[(rubro_id, cat_slug)]
                    break
                cat_slug = f"{base_cat_slug}-{counter}"
                counter += 1
                
            if not cat_id:
                print(f"Advertencia: No se encontró ID de categoría para '{cat_name}' bajo el rubro '{rubro_name}'")
                continue
                
            shops = cat_content.get("shops") or []
            for shop in shops:
                shop_name = shop.get("name") or "Sin nombre"
                shop_desc = shop.get("desc") or shop.get("descr") or ""
                
                negocios_to_insert.append({
                    "categoria_id": cat_id,
                    "rubro_id": rubro_id,
                    "nombre": shop_name,
                    "slug": slugify(shop_name),
                    "descripcion": shop_desc,
                    "direccion": shop.get("dir") or "",
                    "telefono": str(shop.get("tel") or ""),
                    "verificado": bool(shop.get("verified") or False),
                    "imagen": shop.get("img") or "",
                    "email": None,
                    "web": None,
                    "instagram": None,
                    "facebook": None,
                    "horario": None
                })

    # Batch insert shops in chunks of 500
    total_shops = len(negocios_to_insert)
    if total_shops > 0:
        print(f"Insertando {total_shops} negocios en lotes de 500...")
        chunk_size = 500
        inserted_count = 0
        
        for i in range(0, total_shops, chunk_size):
            chunk = negocios_to_insert[i:i+chunk_size]
            try:
                make_request(
                    f"{supabase_url}/rest/v1/negocios",
                    method='POST',
                    data=chunk
                )
                inserted_count += len(chunk)
                print(f"  -> Insertados {inserted_count}/{total_shops} negocios...")
            except Exception as e:
                print(f"Error al insertar lote de negocios comenzando en índice {i}: {e}")
                print("El proceso continuará con el siguiente lote si es posible.")
                
        print("\n¡Importación completada con éxito!")
    else:
        print("\nNo se encontraron negocios nuevos para insertar.")

if __name__ == "__main__":
    main()
