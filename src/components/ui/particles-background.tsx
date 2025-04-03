import { useCallback } from "react";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Optional: You can access the container here if needed
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      className="absolute inset-0"
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60, // Reduced from typical 60 to improve performance
        particles: {
          color: {
            value: "#ffffff", // Subtle gray color
          },
          links: {
            color: "#888888",
            distance: 150,
            enable: true,
            opacity: 0.3, // Reduced opacity
            width: 1, // Thinner lines
          },
          collisions: {
            enable: false, // Disabled collisions for better performance
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 0.8, // Reduced speed
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800, // Increased area = fewer particles
            },
            value: 30, // Significantly reduced number of particles
          },
          opacity: {
            value: 0.3, // Reduced opacity
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 }, // Smaller particles
          },
        },
        detectRetina: false, // Disable retina detection for better performance
        interactivity: {
          events: {
            onClick: {
              enable: false, // Disabled click interactions
            },
            onHover: {
              enable: true,
              mode: "grab",
              parallax: {
                enable: false, // Disabled parallax effect
              }
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.2, // Reduced opacity on hover
              }
            },
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;
