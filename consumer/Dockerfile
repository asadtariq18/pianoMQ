# Use official Python image
FROM python:3.11

# Set working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y \
    libasound2 libasound2-dev alsa-utils pulseaudio
# Copy the consumer script into the container
COPY . .

# Run the consumer
CMD ["python", "consumer.py"]
