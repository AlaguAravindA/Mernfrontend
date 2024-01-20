import React, { useEffect,useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';

export default function Particle() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const loadparticlesInit = (container) => {
    if(init){

      console.log(container);
    }
  };

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={loadparticlesInit}
      options={{
        particles: {
          number: {
            value: 40, // Adjust this value
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
              mode :'grab' // Disable onHover event
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
  );
}
