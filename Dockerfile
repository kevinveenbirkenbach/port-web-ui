# Base image for Python
FROM python:slim

# Set the working directory
WORKDIR /app

# Copy and install dependencies
COPY app/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ .

CMD ["python", "app.py"]
