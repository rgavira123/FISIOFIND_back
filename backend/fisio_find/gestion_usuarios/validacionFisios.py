import asyncio
from pyppeteer import launch
from bs4 import BeautifulSoup
import unicodedata
import sys

def quitar_tildes(texto):
    return ''.join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')

class PyppeteerScraper:
    def __init__(self, headless=True):
        self.headless = headless
        self.browser = None
        self.page = None

    async def init_browser(self):
        self.browser = await launch(headless=self.headless, args=[
            '--no-sandbox',
            '--disable-dev-shm-usage'
        ])
        self.page = await self.browser.newPage()

    async def obtener_colegiado(self, valorBusqueda: str, url: str, xpath: str, loadTime: int = 2) -> BeautifulSoup:
        if self.browser is None or self.page is None:
            await self.init_browser()
        await self.page.goto(url, {'waitUntil': 'networkidle2'})
        await asyncio.sleep(loadTime)

        # Casos especiales para interactuar con la página
        if "murcia" in url:
            elements = await self.page.xpath('//*[@id="myTable"]/thead/tr/th[3]')
            if elements:
                await elements[0].click()

        if "consejo-fisioterapia" in url:
            elements = await self.page.xpath('//*[@id="colegio"]/option[16]')
            if elements:
                await elements[0].click()

        # Buscar el input de búsqueda mediante el xpath proporcionado
        search_elements = await self.page.xpath(xpath)
        if search_elements:
            await search_elements[0].click()
            await search_elements[0].type(valorBusqueda)
            await self.page.keyboard.press('Enter')
        else:
            print("No se encontró el elemento con xpath:", xpath)

        if "cpfcyl" in url:
            elements = await self.page.xpath('//*[@id="cdk-accordion-child-0"]/div/form/div/web-loading-button/button/span[1]/div')
            if elements:
                await elements[0].click()

        await asyncio.sleep(2)
        html = await self.page.content()
        soup = BeautifulSoup(html, "html.parser")
        return soup

    async def cerrar(self):
        if self.browser:
            await self.browser.close()

async def validar_colegiacion(nombre: str, numero: str, comunidad: str) -> bool:
    scraper = PyppeteerScraper(headless=True)
    await scraper.init_browser()
    try:
        comunidad_lower = comunidad.lower()
        if comunidad_lower == "andalucia":
            url = "https://colfisio.org/registro-censo-fisioterapeutas"
            try:
                soup = await scraper.obtener_colegiado(nombre, url, '//*[@id="input-458"]')
                resultado = soup.find("div", class_="title-of-the-card")
                if resultado:
                    datos = quitar_tildes(resultado.text.replace("\n", "").strip())
                    partes = datos.split(" ")
                    if len(partes) > 1:
                        num = partes[1]
                        return numero == num
                    else:
                        return False
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "aragon":
            url = "https://ventanilla.colfisioaragon.org/buscador-colegiados"
            try:
                soup = await scraper.obtener_colegiado(numero, url, "//*[@id='numeroColegiado']")
                resultado = soup.find("div", class_="card-body")
                if resultado:
                    datos = quitar_tildes(resultado.h4.text.strip().upper())
                    return datos == quitar_tildes(nombre)
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "asturias":
            url = "https://www.cofispa.org/censo-colegiados"
            try:
                soup = await scraper.obtener_colegiado(numero, url, '//*[@id="number"]')
                tbody = soup.find("tbody")
                if tbody and tbody.tr:
                    datos = [td.text.strip() for td in tbody.tr.find_all("td")]
                    datos_str = quitar_tildes(f"{datos[1]} {datos[2]} {datos[3]}")
                    if "Mª" in datos_str:
                        datos_str = datos_str.replace("Mª", "MARIA")
                    return datos_str == quitar_tildes(nombre)
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "baleares":
            url = "http://www.colfisiobalear.org/es/area-social-y-ciudadana/profesionales-colegiados/"
            try:
                soup = await scraper.obtener_colegiado(numero, url, "//*[@id='student_number']")
                resultado = soup.find("div", {"data-number": numero})
                if resultado:
                    datos = resultado.div.p.text.upper().split(", ")
                    datos_str = quitar_tildes(f"{datos[1]} {datos[0]}")
                    return datos_str == quitar_tildes(nombre)
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "canarias":
            url = "https://fisiocanarias.org/ventanilla-unica/censo-de-colegiados"
            try:
                soup = await scraper.obtener_colegiado(numero, url, '//*[@id="mat-input-2"]')
                resultado = soup.find("td", class_="name-td")
                if resultado:
                    datos = quitar_tildes(resultado.div.text)
                    return datos == quitar_tildes(nombre)
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "cantabria":
            url = "https://colfisiocant.org/busqueda-profesionales/"
            try:
                soup = await scraper.obtener_colegiado(nombre, url, "//*[@id='tablepress-1_filter']/label/input")
                tbody = soup.find("tbody", class_="row-hover")
                if tbody and tbody.tr:
                    datos = [td.text.strip() for td in tbody.tr.find_all("td")]
                    while len(numero) < 3:
                        numero = "0" + numero
                    return numero == datos[0].replace("39/", "")
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "castilla-la mancha":
            url = "https://www.coficam.org/ventanilla-unica/censo-colegial"
            try:
                soup = await scraper.obtener_colegiado(numero, url, '//*[@id="num_colegiado"]')
                resultado = soup.find("tr", class_="linea_colegiado")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    datos_list = quitar_tildes(datos[1]).split(", ")
                    if len(datos_list) > 1:
                        cadena = f"{datos_list[1]} {datos_list[0]}"
                        return cadena == quitar_tildes(nombre)
                    else:
                        return False
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "castilla y leon":
            url = "https://cpfcyl.com/ciudadanos/listado-de-colegiados"
            try:
                soup = await scraper.obtener_colegiado(numero, url, '//*[@id="mat-input-3"]')
                resultado = soup.find("td", class_="name-td")
                if resultado:
                    datos = quitar_tildes(resultado.div.text)
                    if "Mª" in datos:
                        datos = datos.replace("Mª", "MARIA")
                    return datos == quitar_tildes(nombre)
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "cataluña":
            url = "https://www.fisioterapeutes.cat/es/ciudadanos/profesionales"
            try:
                soup = await scraper.obtener_colegiado(numero, url, '//*[@id="ncol"]')
                resultado = soup.find("div", class_="card-header")
                if resultado:
                    datos = quitar_tildes(resultado.text.upper())
                    if "Mª" in datos:
                        datos = datos.replace("Mª", "MARIA")
                    return datos == quitar_tildes(nombre)
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "extremadura":
            url = "https://cofext.org/cms/colegiados.php"
            try:
                soup = await scraper.obtener_colegiado(quitar_tildes(nombre), url, '//*[@id="example_filter"]/label/input')
                resultado = soup.find("tr", class_="odd")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    return numero == datos[2]
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "galicia":
            url = "https://www.cofiga.org/ciudadanos/colegiados"
            try:
                soup = await scraper.obtener_colegiado(numero, url, '//*[@id="num_colegiado"]')
                resultado = soup.find("tr", class_="linea_colegiado")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    datos_list = quitar_tildes(datos[1].upper()).split(", ")
                    cadena = f"{datos_list[1]} {datos_list[0]}"
                    return cadena == quitar_tildes(nombre)
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "la rioja":
            url = "https://www.coflarioja.org/ciudadanos/listado-de-fisioterapeutas/buscar-colegiados"
            try:
                while len(numero) < 4:
                    numero = "0" + numero
                soup = await scraper.obtener_colegiado(numero, url, '//*[@id="busqueda-colegiados-search-input"]/div/input')
                resultado = soup.find("tbody").tr
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    cadena = quitar_tildes(f"{datos[1]} {datos[2]}".upper())
                    if "Mª" in cadena:
                        cadena = cadena.replace("Mª", "MARIA")
                    return cadena == quitar_tildes(nombre)
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "madrid":
            url = "https://cfisiomad.com/#/ext/buscarcolegiado"
            try:
                # En este caso usamos un loadTime mayor (10 segundos)
                soup = await scraper.obtener_colegiado(nombre, url, "/html/body/app-root/app-externos/section/div/app-search-collegiate/div/div/form/input[1]", 10)
                resultado = soup.find("tbody").tr
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    return numero == datos[0]
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "murcia":
            url = "https://cfisiomurcia.com/buscador-de-colegiados/"
            try:
                soup = await scraper.obtener_colegiado(numero, url, '//*[@id="myTable_filter"]/label/input')
                resultado = soup.find("tr", class_="odd")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    cadena = quitar_tildes(f"{datos[0]} {datos[1]}")
                    if "Mª" in cadena:
                        cadena = cadena.replace("Mª", "MARIA")
                    return cadena == quitar_tildes(nombre)
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "navarra":
            url = "https://www.consejo-fisioterapia.org/vu_colegiados.html"
            try:
                soup = await scraper.obtener_colegiado(nombre, url, '//*[@id="nombre"]')
                resultado = soup.find("tr", class_="colegiado")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    return numero == datos[1]
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "pais vasco":
            url = "https://cofpv.org/es/colegiados.asp"
            try:
                soup = await scraper.obtener_colegiado(nombre, url, '//*[@id="busqueda"]')
                table = soup.find("table", class_="tabletwo")
                if table and table.tbody and table.tbody.tr:
                    datos = [td.text.strip() for td in table.tbody.tr.find_all("td")]
                    return numero == datos[0]
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        elif comunidad_lower == "comunidad valenciana":
            url = "https://app.colfisiocv.com/college/collegiatelist/"
            try:
                soup = await scraper.obtener_colegiado(numero, url, '//*[@id="root"]/div/div[2]/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/input')
                resultado = soup.find("tr", class_="bg-white border-b")
                if resultado:
                    datos = [td.text.strip() for td in resultado.find_all("td")]
                    cadena = quitar_tildes(f"{datos[2]} {datos[3]}").upper()
                    return cadena == quitar_tildes(nombre)
                else:
                    return False
            except Exception as e:
                print(f"⚠️ Error durante la validación en {comunidad}: {e}")
                return False

        else:
            return False

    finally:
        await scraper.cerrar()

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Uso: python pyppeteer_scraper.py <nombre> <numero> <comunidad>")
        sys.exit(1)
    nombre = sys.argv[1]
    numero = sys.argv[2]
    comunidad = sys.argv[3]
    resultado = asyncio.get_event_loop().run_until_complete(
        validar_colegiacion(nombre, numero, comunidad)
    )
    print("Validación:", resultado)
