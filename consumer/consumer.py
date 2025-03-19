import pika
import json
import pygame
import os

# Initialize pygame mixer
pygame.mixer.init()

RABBITMQ_HOST = "localhost" # Use "localhost" if running without Docker

QUEUE_NAME = "piano_sounds"

def play_sound(note):
    """Plays the corresponding piano sound."""
    sound_file = f"sounds/{note}.mp3"
    try:
        pygame.mixer.music.load(sound_file)
        pygame.mixer.music.play()
        print(f"Playing: {note}")
    except Exception as e:
        print(f"Error playing sound {note}: {e}")

def callback(ch, method, properties, body):
    """Handles incoming messages from RabbitMQ."""
    data = json.loads(body)
    note = data.get("note")

    if note:
        play_sound(note)

    ch.basic_ack(delivery_tag=method.delivery_tag)

# RabbitMQ Connection
connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
channel = connection.channel()
channel.queue_declare(queue=QUEUE_NAME, durable=True)

# Consume messages
channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)

print("Waiting for piano key presses... 🎵")
channel.start_consuming()
