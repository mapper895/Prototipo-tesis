#test
from time import sleep
from datetime import datetime
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import json
import os

# Configurar opciones para Render (entorno sin interfaz gráfica)
opts = Options()
opts.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.59 Safari/537.36")
opts.add_argument("--headless")
opts.add_argument("--disable-gpu")
opts.add_argument("--no-sandbox")
opts.add_argument("--disable-dev-shm-usage")
opts.binary_location = "/usr/bin/chromium"

# Inicializar el driver (con ruta fija a chromedriver en Render)
driver = webdriver.Chrome(
    service=Service("/usr/bin/chromedriver"),
    options=opts
)

# Parte para saber cuántas páginas hay
driver.get('https://cartelera.cdmx.gob.mx/')
eventos = []
last_button = driver.find_element(By.XPATH, '//li[@jp-role="last"]')
jp_data_value = last_button.get_attribute("jp-data")
numero_paginas = int(jp_data_value)

print(f"Número total de páginas: {numero_paginas}")

# Para pruebas, puedes limitar esto:
numero_paginas = 3

pagina_actual = 1  # Inicializa el número de página
ID = 0

while pagina_actual <= numero_paginas:
    for i in range(9):
        ID += 1
        driver.execute_script("window.scrollBy(0, 500);")
        sleep(1)

        titulos_anuncios = driver.find_elements(By.XPATH, '//span[@class="cdmx-billboard-event-result-list-item-event-name"]')
        if i >= len(titulos_anuncios):
            print(f"No se encontró el título #{i}")
            continue

        titulo_actual = titulos_anuncios[i]
        titulo_actual.click()

        sleep(5)

        try:
            info_evento = driver.execute_script("return window.cdmx_billboard_event_info;")

            id_evento_real = info_evento["event_id"]
            nombre = info_evento["event_name"]
            descripcion_html = info_evento["event_description"]
            soup = BeautifulSoup(descripcion_html, "html.parser")
            descripcion = soup.get_text(separator="\n").strip()
            duracion = info_evento.get("event_duration", "")
            tipo = info_evento["event_type"]["name"]
            direccion = info_evento["event_location"]["address"]
            lat = info_evento["event_location"]["lat"]
            lng = info_evento["event_location"]["lng"]
            imagen = info_evento["event_image"]
            publico = info_evento.get("event_audience", "")
            accesibilidad = info_evento.get("event_accesibility", "")
            organizador = info_evento.get("event_entity", "")
            url_evento = info_evento.get("event_url", "")

            fechas = []
            horarios = []
            if "schedule" in info_evento:
                for item in info_evento["schedule"].values():
                    fechas.extend(item.get("event_dates", []))
                    horarios.extend(item.get("event_hours", []))

            costos = []
            if "costs" in info_evento:
                for costo in info_evento["costs"].values():
                    costos.append({
                        "type": costo["cost_name"],
                        "price": costo["cost_price"]
                    })

            evento = {
                "eventId": id_evento_real,
                "title": nombre,
                "description": descripcion,
                "category": tipo,
                "duration": duracion,
                "location": direccion,
                "latitude": lat,
                "longitude": lng,
                "imageUrl": imagen,
                "target": publico,
                "accessibility": accesibilidad,
                "organizer": organizador,
                "eventUrl": url_evento,
                "dates": fechas,
                "schedules": horarios,
                "costs": costos
            }

            eventos.append(evento)

        except Exception as e:
            print(f"Error al extraer el evento con ID local {ID}: {e}")

        # Intentar volver con botón "Volver"
        max_reintentos = 3
        reintentos = 0
        while reintentos < max_reintentos:
            try:
                boton_volver = driver.find_element(By.CLASS_NAME, "cdmx-billboard-input-button-red")
                boton_volver.click()
                break
            except Exception:
                reintentos += 1
                if reintentos < max_reintentos:
                    sleep(5)

        sleep(3)

    if pagina_actual < numero_paginas:
        driver.execute_script("window.scrollBy(0, 500);")
        boton_next = driver.find_element(By.XPATH, '//li[@jp-role="next"]')
        sleep(3)
        boton_next.click()
        sleep(3)
        driver.execute_script("window.scrollBy(0, -500);")
        sleep(3)

    pagina_actual += 1

# Guardar la información en un archivo JSON
fecha_hoy = datetime.today().strftime('%Y-%m-%d')
nombre_archivo = os.path.join(os.getcwd(), f"web_scraping_{fecha_hoy}.json")

with open(nombre_archivo, "w", encoding="utf-8") as file:
    json.dump(eventos, file, ensure_ascii=False, indent=4)

print(f"✅ Proceso completado. {len(eventos)} eventos guardados en '{nombre_archivo}'")

driver.quit()
