from time import sleep
from datetime import datetime
import json
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configurar Chrome para headless en Render
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
wait = WebDriverWait(driver, 15)
eventos = []

# Cargar la página
try:
    print("Cargando sitio...")
    driver.get("https://cartelera.cdmx.gob.mx/")
    print("Sitio cargado.")
except Exception as e:
    print(f"Error al cargar la página: {e}")
    driver.quit()
    exit(1)

# Obtener número total de páginas
try:
    last_button = driver.find_element(By.XPATH, '//li[@jp-role="last"]')
    numero_paginas = int(last_button.get_attribute("jp-data"))
    print(f"Total de páginas: {numero_paginas}")
except Exception as e:
    print(f"Error al obtener número de páginas: {e}")
    driver.quit()
    exit(1)

pagina_actual = 1
ID = 0

while pagina_actual <= numero_paginas:
    for i in range(9):
        ID += 1
        sleep(1)

        titulos_anuncios = driver.find_elements(By.XPATH, '//span[@class="cdmx-billboard-event-result-list-item-event-name"]')
        if i >= len(titulos_anuncios):
            print(f"No hay título #{i} en la página {pagina_actual}")
            continue

        titulo = titulos_anuncios[i]
        driver.execute_script("arguments[0].scrollIntoView(true);", titulo)
        sleep(1)

        try:
            wait.until(EC.element_to_be_clickable(titulo))
            driver.execute_script("arguments[0].click();", titulo)
        except Exception as e:
            print(f"Error al hacer clic en título #{i}: {e}")
            continue

        sleep(5)

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
                for item in info["schedule"].values():
                    evento["dates"].extend(item.get("event_dates", []))
                    evento["schedules"].extend(item.get("event_hours", []))

            if "costs" in info:
                for costo in info["costs"].values():
                    evento["costs"].append({
                        "type": costo["cost_name"],
                        "price": costo["cost_price"]
                    })

            eventos.append(evento)

        except Exception as e:
            print(f"Error al extraer evento {ID}: {e}")

        # Volver a la lista
        for intento in range(3):
            try:
                volver = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "cdmx-billboard-input-button-red")))
                driver.execute_script("arguments[0].click();", volver)
                break
            except Exception as e:
                print(f"Reintento {intento+1} al volver: {e}")
                sleep(3)

        sleep(3)

    # Ir a siguiente página
    if pagina_actual < numero_paginas:
        try:
            driver.execute_script("window.scrollBy(0, 500);")
            sleep(2)
            siguiente = wait.until(EC.element_to_be_clickable((By.XPATH, '//li[@jp-role="next"]')))
            driver.execute_script("arguments[0].click();", siguiente)
            sleep(3)
            driver.execute_script("window.scrollBy(0, -500);")
        except Exception as e:
            print(f"Error al pasar a página {pagina_actual+1}: {e}")
            break

    pagina_actual += 1

# Guardar archivo JSON
nombre_archivo = f"web_scraping_{datetime.today().strftime('%Y-%m-%d')}.json"
try:
    with open(nombre_archivo, "w", encoding="utf-8") as f:
        json.dump(eventos, f, ensure_ascii=False, indent=4)
    print(f"✅ {len(eventos)} eventos guardados en '{nombre_archivo}'")
except Exception as e:
    print(f"Error al guardar JSON: {e}")

driver.quit()
