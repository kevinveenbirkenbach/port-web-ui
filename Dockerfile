# Basis-Image für Python
FROM python:slim

# Arbeitsverzeichnis festlegen
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY app/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Anwendungscode kopieren
COPY app/ .

# Port freigeben
EXPOSE 5000

# Startbefehl
CMD ["python", "app.py"]
