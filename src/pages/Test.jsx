import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Test() {
  const [waves, setWaves] = useState([]);
  const navigate = useNavigate();

  const playSound = (color) => {
    const audio = new Audio(`/sounds/${color}.mp3`);
    audio.play();

    const newWave = {
      id: Date.now(),
      color,
      left: `${Math.random() * 80 + 10}%`,
    };
    setWaves((prevWaves) => [...prevWaves, newWave]);

    setTimeout(() => {
      setWaves((prevWaves) =>
        prevWaves.filter((wave) => wave.id !== newWave.id)
      );
    }, 2000);
  };

  const goToHome = () => {
    navigate("/");
  };
  return (
    <div className="p-4 flex flex-col items-center relative overflow-hidden h-screen">
      <h1 className="font-bold text-3xl">Piano</h1>

      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
        {waves.map((wave) => (
          <div
            key={wave.id}
            className={`wave ${wave.color}-wave`}
            style={{ left: wave.left }}
          ></div>
        ))}
      </div>

      <div className="flex gap-4 w-full justify-center p-4">
        {["red", "green", "blue"].map((color) => (
          <div
            key={color}
            className={`bg-${color}-600 p-8 rounded border w-24 h-10 flex items-center justify-center cursor-pointer`}
            onClick={() => playSound(color)}
          >
            <p className="text-white text-center font-bold self-center capitalize">
              {color}
            </p>
          </div>
        ))}
      </div>
      <div
        className="mt-auto z-10 flex justify-end w-full cursor-pointer font-thin px-2"
        onClick={goToHome}
      >
        Home
      </div>
    </div>
  );
}
