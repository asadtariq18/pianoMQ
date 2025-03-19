import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connection } from "rabbitmq-client";

export default function Piano() {
  const [waves, setWaves] = useState([]);
  const navigate = useNavigate();

  const notes = [
    { note: "C", key: "C", color: "white" },
    { note: "C#", key: "CC", color: "black" },
    { note: "D", key: "D", color: "white" },
    { note: "D#", key: "DD", color: "black" },
    { note: "E", key: "E", color: "white" },
    { note: "F", key: "F", color: "white" },
    { note: "F#", key: "FF", color: "black" },
    { note: "G", key: "G", color: "white" },
    { note: "G#", key: "GG", color: "black" },
    { note: "A", key: "A", color: "white" },
    { note: "A#", key: "AA", color: "black" },
    { note: "B", key: "B", color: "white" },
  ];

  const send = async (note) => {
    const rabbit = new Connection("amqp://guest:guest@localhost:5672");
    rabbit.on("error", (err) => {
      console.log("RabbitMQ connection error", err);
    });
    rabbit.on("connection", () => {
      console.log("Connection successfully (re)established");
    });

    const pub = rabbit.createPublisher({
      confirm: true,
      maxAttempts: 2,
    })

    await pub.send('piano_sounds', note)

    async function onShutdown() {
      await pub.close()
      await rabbit.close()
    }
    process.on('SIGINT', onShutdown)
    process.on('SIGTERM', onShutdown)
  };

  const playSound = async (note) => {
    try {
      // await axios.post("http://localhost:5001/play", { note });
      send(note);
      console.log(`Sent: ${note}`);
      const newWave = {
        id: Date.now(),
        color: note.includes("#") ? "black" : "white",
        left: `${Math.random() * 80 + 10}%`,
      };
      setWaves((prevWaves) => [...prevWaves, newWave]);

      setTimeout(() => {
        setWaves((prevWaves) =>
          prevWaves.filter((wave) => wave.id !== newWave.id)
        );
      }, 2000);
    } catch (error) {
      console.error("Error sending note:", error);
    }
    const audio = new Audio(`/sounds/${note}.mp3`);
    audio.play();
  };

  const goToTest = () => {
    navigate("/test");
  };

  return (
    <div className="p-4 flex flex-col items-center relative overflow-hidden h-screen bg-gray-900">
      <div className="mb-4">
        <p className="font-bold text-[220px] text-white">Piano</p>
        <p className="absolute top-[220px] right-[410px] text-[35px] font-semibold text-blue-400 rounded-full bg-blue-900 p-4">
          MQ
        </p>
      </div>

      {/* Waves Container */}
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
        {waves.map((wave) => (
          <div
            key={wave.id}
            className={`wave ${wave.color}-wave`}
            style={{ left: wave.left }}
          ></div>
        ))}
      </div>

      {/* Piano Container */}
      <div className="absolute bottom-0 flex bg-[#889fbbf0] pb-8 w-full justify-center">
        {notes.map(({ note, key, color }, index) => (
          <div
            key={note}
            className={`piano-key ${color}-key mt-[-12px] rounded cursor-pointer`}
            onClick={() => playSound(key)}
            style={{
              marginLeft: color === "black" ? "-1rem" : "0",
              zIndex: color === "black" ? 1 : 0,
            }}
          >
            <p
              className={`note-label ${
                color === "black" ? "text-white" : "text-black"
              }`}
            >
              {note}
            </p>
          </div>
        ))}
      </div>
      <div
        className="mt-auto z-10 flex justify-end w-full cursor-pointer font-thin px-2"
        onClick={goToTest}
      >
        Test
      </div>
    </div>
  );
}
