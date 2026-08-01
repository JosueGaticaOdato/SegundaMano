import undetected_chromedriver as uc
import time

options = uc.ChromeOptions()

options.add_argument("--start-maximized")

driver = uc.Chrome(
    options=options
)

driver.get(
    "https://vivichivilcoy.com.ar/sitio/categorias"
)

time.sleep(20)

print(driver.title)

input("ENTER para salir")