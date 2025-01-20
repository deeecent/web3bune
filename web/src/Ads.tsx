import { useState, useEffect } from "react";
import { BannerImages } from "./BannerImages";
import BouncingDVD from "./BouncingDVD";

type Image = {
  animation: string;
  duration: number;
  x: number;
  y: number;
  size: number;
  id: string;
  direction: string;
  src: string;
  scale: number;
  blinkRate: number;
};

const ChaoticImageDisplay = ({ activate }: { activate: boolean }) => {
  const [images, setImages] = useState<Image[]>([]);

  // Generate a random position within viewport bounds
  const getRandomPosition = () => {
    return {
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 200),
    };
  };

  // Generate random animation properties
  const getRandomAnimation = () => {
    const animations = [
      "slide-right",
      "slide-left",
      "slide-up",
      "slide-down",
      "slide-right-short",
      "slide-left-short",
      "slide-up-short",
      "slide-down-short",
      "blink",
      "bounce-around",
    ];

    return {
      animation: animations[Math.floor(Math.random() * animations.length)],
      direction: "alternate",
      duration: 10 + Math.random() * 7,
      blinkRate: 0.1 + Math.random() * 0.4,
    };
  };

  // Add a new image
  const addImage = () => {
    if (BannerImages.length === 0) return;

    const newImage: Image = {
      id: Date.now().toString(),
      src:
        "./banners/" +
        BannerImages[Math.floor(Math.random() * BannerImages.length)],
      ...getRandomPosition(),
      ...getRandomAnimation(),
      size: 100 + Math.random() * 150,
      scale: [1, 1.2, 1.5, 1.7][Math.floor(Math.random() * 4)],
    };

    console.log(newImage.x);

    setImages((prev) => [...prev, newImage]); // Keep max 15 images
  };

  // Remove an image
  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Add new images periodically
  useEffect(() => {
    if (activate) {
      const interval = setInterval(addImage, 2000);
      return () => clearInterval(interval);
    }
  }, [activate]);

  useEffect(() => {
    //setFilePaths(getFilePaths("./banners"));
  });

  return (
    <div className="container">
      <style>
        {`
          .container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
          }

          .image {
            position: fixed;
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
          }

          .image.large {
            min-height: 50vh;
          }

          .image.small {
            min-height: 25vh;
          }

          @keyframes slide-left-short {
            50% { transform: translateX(-10vw) }
            100% { transform: translateX(10vw) }
          }

          @keyframes slide-right-short {
            50% { transform: translateX(10vw) }
            100% { transform: translateX(-10vw) }
          }

          @keyframes slide-up-short {
            50% { transform: translateY(10vh) }
            100% { transform: translateY(-10vh) }
          }

          @keyframes slide-down-short {
            50% { transform: translateY(-10vh) }
            100% { transform: translateY(10vh) }
          }

          @keyframes slide-left {
            50% { transform: translateX(-30vw) }
            100% { transform: translateX(30vw) }
          }

          @keyframes slide-right {
            50% { transform: translateX(30vw) }
            100% { transform: translateX(-30vw) }
          }

          @keyframes slide-up {
            50% { transform: translateY(30vh) }
            100% { transform: translateY(-30vh) }
          }

          @keyframes slide-down {
            50% { transform: translateY(-30vh) }
            100% { transform: translateY(30vh) }
          }

          @keyframes blink {
            0%, 49% {
              opacity: 1;
            }
            50%, 100% {
              opacity: 0;
            }
          }
        `}
      </style>

      {images.map((img) =>
        img.animation === "bounce-around" ? (
          <BouncingDVD
            startX={img.x}
            startY={img.y}
            id={img.id}
            imageSrc={img.src}
          />
        ) : (
          <img
            key={img.id}
            src={img.src}
            alt=""
            className={`image ${img.size}`}
            style={{
              left: `${img.x}px`,
              top: `${img.y}px`,
              animation: `${img.animation} ${
                img.animation === "blink" ? img.blinkRate : img.duration
              }s ${img.direction} linear infinite`,
              scale: `${img.scale}`,
            }}
            onAnimationIteration={() => {
              if (Math.random() < 0.3) {
                removeImage(img.id);
              }
            }}
          />
        )
      )}
    </div>
  );
};

export default ChaoticImageDisplay;
