# Use official Python image
FROM python:3.11

# Set the working directory
WORKDIR /app

# Copy all files to the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5001 (Flask default)
EXPOSE 5001

# Run Flask app
CMD ["python", "app.py"]
