from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import unicodedata

# Configurar Selenium en modo headless
options = webdriver.ChromeOptions()
options.add_argument("--no-sandbox")  
options.add_argument("--enable-javascript")  # Asegurar que JS está habilitado
options.add_argument("--disable-dev-shm-usage")  

# Inicializar WebDriver
driver = webdriver.Chrome(service=Service(executable_path=ChromeDriverManager().install()), options=options)

def quitar_tildes(texto):
    return ''.join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')

def obtener_colegiado(valorBusqueda: str, url: str, xpath: str, loadTime: int = 2) -> BeautifulSoup:
    driver.get(url)
    time.sleep(loadTime)  # Esperar que cargue la página
    
    if "murcia" in url:
        num_sort = driver.find_element(By.XPATH, '//*[@id="myTable"]/thead/tr/th[3]')
        num_sort.click()

    search_box = driver.find_element(By.XPATH, xpath)
    search_box.send_keys(valorBusqueda)  # Ingresar valor de búsqueda (nombre o numero)
    search_box.send_keys(Keys.RETURN)
    
    # para el caso de castilla y leon, hay que hacer click en el boton de buscar
    if "cpfcyl" in url:
        search_div = driver.find_element(By.XPATH, '//*[@id="cdk-accordion-child-0"]/div/form/div/web-loading-button/button/span[1]/div')
        search_div.click()

    time.sleep(2)  # Esperar la carga de resultados

    soup = BeautifulSoup(driver.page_source, "html.parser")
    return soup

def validar_colegiacion(nombre: str, numero: str, comunidad: str):
    """
    Valida si un fisioterapeuta está colegiado en su comunidad autónoma.

    :param nombre: Nombre del fisioterapeuta
    :param apellido: Apellido del fisioterapeuta
    :param numero: Número de colegiado
    :param comunidad: Comunidad autónoma donde se quiere validar
    :return: True si el fisioterapeuta está colegiado, False si no.
    """

    match comunidad.lower():
        case "andalucia": # por numero y nombre, ver caso 00001
            url = "https://colfisio.org/registro-censo-fisioterapeutas"
            try:
                soup = obtener_colegiado(numero, url, "//*[@id='input-456']")
                resultado = soup.find("div", class_="title-of-the-card")
                if resultado:
                    datos = quitar_tildes(resultado.text.replace("\n", "").strip())
                    cadena = f"Nº {numero} - {quitar_tildes(nombre)}"
                    print(datos == cadena)
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "aragon": # por numero y nombre
            url = "https://ventanilla.colfisioaragon.org/buscador-colegiados"
            try:
                soup = obtener_colegiado(numero, url, "//*[@id='numeroColegiado']")
                resultado = soup.find("div", class_="card-body")
                if resultado:
                    datos = quitar_tildes(resultado.h4.text.strip().upper())
                    print(datos == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "asturias": # por numero y nombre
            url = "https://www.cofispa.org/censo"
            try:
                soup = obtener_colegiado(numero, url, "//*[@id='num_colegiado']")
                resultado = soup.find("tr", class_="linea_colegiado")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    datos = quitar_tildes(f"{datos[0]} {datos[1]}")
                    if "Mª" in datos: datos = datos.replace("Mª", "MARIA")
                    print(datos == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "baleares": # por numero y nombre
            url = "http://www.colfisiobalear.org/es/area-social-y-ciudadana/profesionales-colegiados/"
            try:
                soup = obtener_colegiado(numero, url, "//*[@id='student_number']")
                resultado = soup.find("div", {"data-number": numero})
                if resultado:
                    datos = resultado.div.p.text.upper().split(", ")
                    datos = quitar_tildes(f"{datos[1]} {datos[0]}")
                    print(datos == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "canarias": # por numero y nombre MIERDON, NO FUNCIONA CON HEADLESS
            url = "https://fisiocanarias.org/ventanilla-unica/censo-de-colegiados"
            try:
                soup = obtener_colegiado(numero, url, '//*[@id="mat-input-2"]')
                resultado = soup.find("td", class_="name-td")
                if resultado:
                    datos = quitar_tildes(resultado.div.text)
                    print(datos == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "cantabria": # por numero y nombre
            url = "https://colfisiocant.org/busqueda-profesionales/"
            try:
                soup = obtener_colegiado(numero, url, "//*[@id='tablepress-1_filter']/label/input")
                resultado = soup.find("tbody", class_="row-hover").tr
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    datos = quitar_tildes(f"{datos[1]} {datos[2]} {datos[3]}")
                    print(datos == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "castilla la mancha": # por numero y nombre
            url = "https://www.coficam.org/ventanilla-unica/censo-colegial"
            try:
                soup = obtener_colegiado(numero, url, '//*[@id="num_colegiado"]')
                resultado = soup.find("tr", class_="linea_colegiado")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    datos = quitar_tildes(f"{datos[1]}").split(", ")
                    cadena = f"{datos[1]} {datos[0]}"
                    print(cadena == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "castilla y leon": # por numero y nombre NO FUNCIONA CON HEADLESS
            url = "https://cpfcyl.com/ciudadanos/listado-de-colegiados"
            try:
                soup = obtener_colegiado(numero, url, '//*[@id="mat-input-3"]')
                resultado = soup.find("td", class_="name-td")
                if resultado:
                    datos = quitar_tildes(resultado.div.text)
                    if "Mª" in datos: datos = datos.replace("Mª", "MARIA")
                    print(datos == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "cataluña": # por numero y nombre
            url = "https://www.fisioterapeutes.cat/es/ciudadanos/profesionales"
            try:
                soup = obtener_colegiado(numero, url, '//*[@id="ncol"]')
                resultado = soup.find("div", class_="card-header")
                if resultado:
                    datos = quitar_tildes(resultado.text.upper())
                    if "Mª" in datos: datos = datos.replace("Mª", "MARIA")
                    print(datos == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "extremadura": # por numero y nombre
            url = "https://cofext.org/cms/colegiados.php"
            try:
                soup = obtener_colegiado(numero, url, '//*[@id="example_filter"]/label/input')
                resultado = soup.find("tr", class_="odd")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    datos = f"{datos[0]} {datos[1]}"
                    print(datos == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "galicia": # por numero y nombre
            url = "https://www.cofiga.org/ciudadanos/colegiados"
            try:
                soup = obtener_colegiado(numero, url, '//*[@id="num_colegiado"]')
                resultado = soup.find("tr", class_="linea_colegiado")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    datos = quitar_tildes(datos[1].upper()).split(", ")
                    cadena = f"{datos[1]} {datos[0]}"
                    print(cadena == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "la rioja": # por numero y nombre (lo haria por nombre pero si se rellena el numero con ceros no debe haber problema)
            url = "https://www.coflarioja.org/ciudadanos/listado-de-fisioterapeutas/buscar-colegiados"
            try:
                while len(numero) < 4:
                    numero = "0" + numero
                soup = obtener_colegiado(numero, url, '//*[@id="busqueda-colegiados-search-input"]/div/input')
                resultado = soup.find("tbody").tr
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    cadena = quitar_tildes(f"{datos[1]} {datos[2]}".upper())
                    if "Mª" in cadena: cadena = cadena.replace("Mª", "MARIA")
                    print(cadena == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "madrid": # por nombre
            url = "https://cfisiomad.com/#/ext/buscarcolegiado"
            try:
                soup = obtener_colegiado(nombre, url, "/html/body/app-root/app-externos/section/div/app-search-collegiate/div/div/form/input[1]", 10)
                resultado = soup.find("tbody").tr
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    print(numero == datos[0])
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "murcia": # por numero y nombre
            url = "https://cfisiomurcia.com/buscador-de-colegiados/"
            try:
                soup = obtener_colegiado(numero, url, '//*[@id="myTable_filter"]/label/input')
                resultado = soup.find("tr", class_="odd")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    cadena = quitar_tildes(f"{datos[0]} {datos[1]}")
                    if "Mª" in cadena: cadena = cadena.replace("Mª", "MARIA")
                    print(cadena == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "navarra": # por nombre, va regulinchi
            url = "https://cofn.net/es/listado-colegiados"
            try:
                soup = obtener_colegiado(nombre.split(" ")[0], url, '//*[@id="nombre"]')
                resultado = soup.find_all("h3", class_="title")
                if resultado:
                    for name in resultado:
                        cadena = quitar_tildes(name.a.text.replace("D. ", "").replace("Dña. ", "").replace(".", "")).split(", ")
                        cadena = f"{cadena[1]} {cadena[0]}"
                        nColegiado = name.find_next_sibling().text.split("Nº ")[1]
                        if nColegiado == numero and cadena == quitar_tildes(nombre):
                            print(True)
                            return True
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "pais vasco": # por nombre (TARDA MUCHO)
            url = "https://cofpv.org/es/colegiados.asp"
            try:
                soup = obtener_colegiado(nombre, url, '//*[@id="busqueda"]')
                resultado = soup.find("table", class_ = "tabletwo").tbody.tr
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    cadena = quitar_tildes(f"{datos[2]} {datos[1]}").upper()
                    print(cadena == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case "valencia": # por numero y nombre
            url = "https://app.colfisiocv.com/college/collegiatelist/"
            try:
                soup = obtener_colegiado(numero, url, '//*[@id="root"]/div/div[2]/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/input')
                resultado = soup.find("tr", class_="bg-white border-b")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    cadena = quitar_tildes(f"{datos[2]} {datos[3]}").upper()
                    print(cadena == quitar_tildes(nombre))
                else:
                    print("No hay resultados")
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False
        
        case _:
            print("Comunidad autónoma no reconocida.")
            return False
        
    driver.quit()

# Prueba del script con datos de ejemplo
validar_colegiacion("ELISA SANMARTÍN MORENO", "347", "valencia")
