# Activa el entorno virtual
Write-Output "Activando entorno virtual..."
& ".\venv\Scripts\activate"

# Verifica si se activó correctamente
if ($env:VIRTUAL_ENV) {
    Write-Output "Entorno virtual activado correctamente."
} else {
    Write-Output "Error: No se pudo activar el entorno virtual."
    exit 1
}

cd .\fisio_find

# Ejecutar makemigrations
Write-Output "Ejecutando makemigrations..."
python .\manage.py makemigrations

# Ejecutar migrate
Write-Output "Ejecutando migrate..."
python .\manage.py migrate

Write-Output "Backend preparado correctamente, lanzando servidor backend."
python .\manage.py runserver
