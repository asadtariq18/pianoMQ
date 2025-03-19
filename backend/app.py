from flask import Flask, request, jsonify
import pika
import json
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# RabbitMQ Connection
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq") # Use "localhost" if running without Docker
QUEUE_NAME = "piano_sounds"

def publish_to_queue(note):
    """Publishes the piano key press event to RabbitMQ."""
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME, durable=True)

        message = json.dumps({"note": note})
        channel.basic_publish(
            exchange='',
            routing_key=QUEUE_NAME,
            body=message,
            properties=pika.BasicProperties(delivery_mode=2)  # Makes the message persistent
        )

        connection.close()
        return True
    except Exception as e:
        print(f"Error publishing message: {e}")
        return False

@app.route('/play', methods=['POST'])
def play_note():
    """API endpoint to send a note to RabbitMQ."""
    data = request.json
    note = data.get("note")

    if not note:
        return jsonify({"error": "Missing note"}), 400

    success = publish_to_queue(note)
    if success:
        return jsonify({"message": f"Note {note} sent to queue"}), 200
    else:
        return jsonify({"error": "Failed to send message"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
