from time import sleep
from datetime import datetime
import json
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configurar Chrome para entorno headless (Render)
opts = Options()
opts.add_argument("user-agent=Mozilla/5.0")
opts.add_argument("--headless")
opts.add_argument("--disable-gpu")
opts.add_argument("--no-sandbox")
opts.add_argument("--disable-dev-shm-usage")
opts.binary_location = "/usr/bin/chromium"

driver = webdriver.Chrome(
    service=Service("/usr/bin/chromedriver"),
    options=opts
)

driver.set_page_load_timeout(180)
wait = WebDriverWait(driver, 30)
eventos = []

# Cargar página
try:
    print("🔄 Cargando sitio...")
    driver.get("https://cartelera.cdmx.gob.mx/")
    print("✅ Sitio cargado.")
except Exception as e:
    print(f"❌ Error al cargar la página: {e}")
    driver.quit()
    exit(1)

# Total de páginas
try:
    last_button = driver.find_element(By.XPATH, '//li[@jp-role="last"]')
    numero_paginas = int(last_button.get_attribute("jp-data"))
    print(f"📄 Total de páginas: {numero_paginas}")
except Exception as e:
    print(f"❌ Error al obtener número de páginas: {e}")
    driver.quit()
    exit(1)

pagina_actual = 1
ID = 0

while pagina_actual <= numero_paginas:
    print(f"➡️ Procesando página {pagina_actual}...")
    for i in range(9):
        ID += 1
        sleep(1)
        titulos = driver.find_elements(By.XPATH, '//span[@class="cdmx-billboard-event-result-list-item-event-name"]')
        if i >= len(titulos):
            print(f"⚠️ Título {i} no disponible en página {pagina_actual}")
            continue

        titulo = titulos[i]
        try:
            driver.execute_script("arguments[0].scrollIntoView(true);", titulo)
            wait.until(EC.element_to_be_clickable(titulo))
            driver.execute_script("arguments[0].click();", titulo)
        except Exception as e:
            print(f"❌ Error al hacer clic en título #{i}: {type(e).__name__}: {e}")
            continue

        sleep(4)
        try:
            info = driver.execute_script("return window.cdmx_billboard_event_info;")
            evento = {
                "eventId": info["event_id"],
                "title": info["event_name"],
                "description": BeautifulSoup(info["event_description"], "html.parser").get_text(separator="\n").strip(),
                "category": info["event_type"]["name"],
                "duration": info.get("event_duration", ""),
                "location": info["event_location"]["address"],
                "latitude": info["event_location"]["lat"],
                "longitude": info["event_location"]["lng"],
                "imageUrl": info["event_image"],
                "target": info.get("event_audience", ""),
                "accessibility": info.get("event_accesibility", ""),
                "organizer": info.get("event_entity", ""),
                "eventUrl": info.get("event_url", ""),
                "dates": [],
                "schedules": [],
                "costs": []
            }

            if "schedule" in info:
                for s in info["schedule"].values():
                    evento["dates"].extend(s.get("event_dates", []))
                    evento["schedules"].extend(s.get("event_hours", []))

            if "costs" in info:
                for costo in info["costs"].values():
                    evento["costs"].append({
                        "type": costo["cost_name"],
                        "price": costo["cost_price"]
                    })

            eventos.append(evento)
        except Exception as e:
            print(f"❌ Error extrayendo evento {ID}: {type(e).__name__}: {e}")

        for intento in range(3):
            try:
                volver = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "cdmx-billboard-input-button-red")))
                driver.execute_script("arguments[0].click();", volver)
                break
            except Exception as e:
                print(f"🔁 Reintento {intento+1} al volver: {type(e).__name__}: {e}")
                sleep(3)

        sleep(2)

    # Siguiente página
    if pagina_actual < numero_paginas:
        driver.execute_script("window.scrollBy(0, 500);")
        boton_next = driver.find_element(By.XPATH, '//li[@jp-role="next"]')
        sleep(3)
        boton_next.click()
        sleep(3)
        driver.execute_script("window.scrollBy(0, -500);")
        sleep(3)

    pagina_actual += 1

# Guardar JSON
archivo = f"web_scraping_{datetime.today().strftime('%Y-%m-%d')}.json"
try:
    with open(archivo, "w", encoding="utf-8") as f:
        json.dump(eventos, f, ensure_ascii=False, indent=4)
    print(f"✅ {len(eventos)} eventos guardados en '{archivo}'")
except Exception as e:
    print(f"❌ Error al guardar JSON: {e}")

driver.quit()
