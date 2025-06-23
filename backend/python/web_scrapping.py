from time import sleep
from datetime import datetime
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

# Configurar opciones de Chrome
opts = Options()
opts.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.59 Safari/537.36")
opts.add_argument("--headless")
opts.add_argument("--disable-gpu")
opts.add_argument("--no-sandbox")
opts.add_argument("--disable-dev-shm-usage")
opts.binary_location = "/usr/bin/chromium"

# Inicializar el driver
driver = webdriver.Chrome(
    service=Service("/usr/bin/chromedriver"),
    options=opts
)

wait = WebDriverWait(driver, 10)
eventos = []

# Acceder al sitio
driver.get('https://cartelera.cdmx.gob.mx/')

# Obtener número total de páginas
last_button = driver.find_element(By.XPATH, '//li[@jp-role="last"]')
jp_data_value = last_button.get_attribute("jp-data")
numero_paginas = int(jp_data_value)

print(f"Número total de páginas: {numero_paginas}")
pagina_actual = 1
ID = 0

while pagina_actual <= numero_paginas:
    for i in range(9):
        ID += 1
        sleep(1)

        titulos_anuncios = driver.find_elements(By.XPATH, '//span[@class="cdmx-billboard-event-result-list-item-event-name"]')
        if i >= len(titulos_anuncios):
            print(f"Título #{i} no encontrado en la página {pagina_actual}")
            continue

        titulo_actual = titulos_anuncios[i]
        driver.execute_script("arguments[0].scrollIntoView(true);", titulo_actual)
        sleep(1)

        try:
            wait.until(EC.element_to_be_clickable(titulo_actual))
            driver.execute_script("arguments[0].click();", titulo_actual)
        except Exception as e:
            print(f"Error al hacer clic en título #{i}: {e}")
            continue

        sleep(5)

        try:
            info_evento = driver.execute_script("return window.cdmx_billboard_event_info;")

            evento = {
                "eventId": info_evento["event_id"],
                "title": info_evento["event_name"],
                "description": BeautifulSoup(info_evento["event_description"], "html.parser").get_text(separator="\n").strip(),
                "category": info_evento["event_type"]["name"],
                "duration": info_evento.get("event_duration", ""),
                "location": info_evento["event_location"]["address"],
                "latitude": info_evento["event_location"]["lat"],
                "longitude": info_evento["event_location"]["lng"],
                "imageUrl": info_evento["event_image"],
                "target": info_evento.get("event_audience", ""),
                "accessibility": info_evento.get("event_accesibility", ""),
                "organizer": info_evento.get("event_entity", ""),
                "eventUrl": info_evento.get("event_url", ""),
                "dates": [],
                "schedules": [],
                "costs": []
            }

            if "schedule" in info_evento:
                for item in info_evento["schedule"].values():
                    evento["dates"].extend(item.get("event_dates", []))
                    evento["schedules"].extend(item.get("event_hours", []))

            if "costs" in info_evento:
                for costo in info_evento["costs"].values():
                    evento["costs"].append({
                        "type": costo["cost_name"],
                        "price": costo["cost_price"]
                    })

            eventos.append(evento)

        except Exception as e:
            print(f"Error al extraer evento con ID local {ID}: {e}")

        # Intentar volver a la lista
        for intento in range(3):
            try:
                boton_volver = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "cdmx-billboard-input-button-red")))
                driver.execute_script("arguments[0].click();", boton_volver)
                break
            except Exception as e:
                print(f"Error al hacer clic en 'Volver' (intento {intento+1}): {e}")
                sleep(3)

        sleep(3)

    if pagina_actual < numero_paginas:
        try:
            driver.execute_script("window.scrollBy(0, 500);")
            sleep(2)
            boton_next = wait.until(EC.element_to_be_clickable((By.XPATH, '//li[@jp-role="next"]')))
            driver.execute_script("arguments[0].click();", boton_next)
            sleep(3)
            driver.execute_script("window.scrollBy(0, -500);")
        except Exception as e:
            print(f"Error al avanzar a la página {pagina_actual+1}: {e}")
            break

    pagina_actual += 1

# Guardar resultados
fecha_hoy = datetime.today().strftime('%Y-%m-%d')
nombre_archivo = f"web_scraping_{fecha_hoy}.json"

with open(nombre_archivo, "w", encoding="utf-8") as file:
    json.dump(eventos, file, ensure_ascii=False, indent=4)

print(f"Proceso completado. Información guardada en '{nombre_archivo}'.")

driver.quit()
