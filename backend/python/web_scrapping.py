#test
from time import sleep
from datetime import datetime, timezone
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
import json


opts = Options()
opts.add_argument("--headless=new")  # Chrome 109+ usa '--headless=new'
opts.add_argument("--no-sandbox")
opts.add_argument("--disable-dev-shm-usage")
opts.add_argument("--disable-gpu")
opts.add_argument("--window-size=1920,1080")
opts.add_argument("--disable-infobars")
opts.add_argument("--disable-extensions")
opts.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.59 Safari/537.36")

# Inicializar el driver
try:
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=opts
    )
except Exception as e:
    print("Error inicializando el navegador:", e)
    raise



#Parte para saber cuantas paginas hay
driver.get('https://cartelera.cdmx.gob.mx/')
eventos = []
last_button = driver.find_element(By.XPATH, '//li[@jp-role="last"]')
jp_data_value = last_button.get_attribute("jp-data")
numero_paginas = int(jp_data_value)

print(f"Número total de páginas: {numero_paginas}")

#numero_paginas = 30


#print(numero_paginas)

numero_paginas = 1

pagina_actual = 1  # Inicializa el número de página

ID = 0

while pagina_actual <= numero_paginas:
  
    # Iterar sobre los primeros 9 títulos
    i=8
    for i in range(9):
        ID = ID +1
        driver.execute_script("window.scrollBy(0, 500);")
        sleep(1)
        titulos_anuncios = driver.find_elements(By.XPATH, '//span[@class="cdmx-billboard-event-result-list-item-event-name"]')
        titulo_actual = titulos_anuncios[i]
        titulo_actual.click()

        # Esperar a que cargue la nueva página
        sleep(5)

        # Extraer información del evento
          
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

            # Fechas y horarios
            fechas = []
            horarios = []

            if "schedule" in info_evento:
                for item in info_evento["schedule"].values():
                    fechas.extend(item.get("event_dates", []))
                    horarios.extend(item.get("event_hours", []))

            # Costos
            costos = []
            if "costs" in info_evento:
                for costo in info_evento["costs"].values():
                    costos.append({
                        "type": costo["cost_name"],
                        "price": costo["cost_price"]
                    })

            # Guardar evento como diccionario
            """"
            evento = {
                "id_local": ID,
                "eventId": id_evento_real,
                "nombre": nombre,
                "descripcion": descripcion,
                "tipo": tipo,
                "duracion": duracion,
                "direccion": direccion,
                "lat": lat,
                "lng": lng,
                "imagen": imagen,
                "publico": publico,
                "accesibilidad": accesibilidad,
                "organizador": organizador,
                "url": url_evento,
                "fechas": fechas,
                "horarios": horarios,
                "costos": costos
            }
                """
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
               



        # Intentar hacer clic en el botón "Volver" con reintentos
        max_reintentos = 3  # Número máximo de reintentos
        reintentos = 0

        while reintentos < max_reintentos:
            try:
                boton_volver = driver.find_element(By.CLASS_NAME, "cdmx-billboard-input-button-red")
                boton_volver.click()
                break  # Salir del ciclo si el clic es exitoso
            except Exception:
                reintentos += 1
                if reintentos < max_reintentos:
                    sleep(5)    
                
        # Esperar un momento para asegurar que la página principal cargue correctamente
        sleep(3)
        # Si no es la última página, haz clic en el botón "next"
    if pagina_actual <= numero_paginas:
    # Encuentra el botón "next" específicamente
        driver.execute_script("window.scrollBy(0, 500);")
        boton_next = driver.find_element(By.XPATH, '//li[@jp-role="next"]')

        
        sleep(3)
        # Haz clic en el botón
        boton_next.click()
        sleep(3)
        driver.execute_script("window.scrollBy(0, -500);")
        sleep(3)
    
    pagina_actual += 1  # Incrementa el número de página

# Guardar la información en un archivo JSON
fecha_hoy = datetime.now(timezone.utc).strftime('%Y-%m-%d')
nombre_archivo = f"web_scraping_{fecha_hoy}.json"

with open(nombre_archivo, "w", encoding="utf-8") as file:
    json.dump(eventos, file, ensure_ascii=False, indent=4)

print(f"Proceso completado. La información se guardó en {nombre_archivo}.")

driver.quit()
