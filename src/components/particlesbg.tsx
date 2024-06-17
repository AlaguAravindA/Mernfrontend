import React, { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';

export default function Particle() {
  const [init, setInit] = useState(false);
  const [particlesOn, setParticlesOn] = useState(true); // State variable for toggle switch

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const loadparticlesInit = (container) => {
    if (init) {
      // console.log(container);
    }
  };

  const handleToggle = () => {
    setParticlesOn(!particlesOn); // Toggle the particle state
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <Particles
        id="tsparticles"
        particlesLoaded={loadparticlesInit}
        options={{
          particles: {
            number: {
              value: particlesOn ? 40 : 0, // Use state variable to control particle count
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              enable: true,
              speed: 5,
              direction: 'left',
              out_mode: 'out',
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          background: {
            color: {
              value: "#000000",
            },
          },
          fullScreen: {
            enable: true,
            zIndex: -1,
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: false, // Disable onClick event
              },
              onHover: {
                enable: true,
                mode: 'grab', // Disable onHover event
              },
              resize: false, // Disable resize event
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          detectRetina: true,
        }}
        init={loadparticlesInit}
      />
      <div className="mt-8">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={particlesOn}
            onChange={handleToggle}
          />
          <div className="relative">
            <div className={`w-10 h-5 ${particlesOn ? 'bg-green-600' : 'bg-red-500'} rounded-full shadow-inner`}></div>
            <div
              className={`absolute w-5 h-5 bg-indigo-600 rounded-full shadow inset-y-0 left-0 transition-transform duration-300 ease-in-out transform ${
                particlesOn ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </div>
          <span className="ml-3 text-gray-300">
            {particlesOn ? 'CyberSpace On' : 'CyberSpace Off'}
          </span>
        </label>
      </div>
    </div>
  );
}
