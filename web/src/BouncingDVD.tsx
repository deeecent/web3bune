import { Box } from "@chakra-ui/react";
import { CSSProperties, useEffect, useRef, useState } from "react";

const styles: Record<string, CSSProperties> = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "visible",
    pointerEvents: "none",
  },
  image: {
    position: "absolute",
    display: "block",
    userSelect: "none",
    pointerEvents: "none",
  },
};

interface BouncingDVDProps {
  imageSrc: string;
  id: string;
  startX: number;
  startY: number;
  speed?: number;
}

const BouncingDVD = ({
  imageSrc,
  id,
  startX,
  startY,
  speed = 10,
}: BouncingDVDProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Initialize with the provided starting positions
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: startX,
    y: startY,
  });
  const [velocity, setVelocity] = useState({ dx: speed, dy: speed });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Handle image load to get natural dimensions
  useEffect(() => {
    const image = imageRef.current;
    if (image) {
      const handleLoad = () => {
        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;

        setImageDimensions({
          width: naturalWidth,
          height: naturalHeight,
        });

        // Only adjust position if it would cause the image to be out of bounds
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;

          setPosition((prev) => ({
            x: Math.min(prev.x, containerWidth - naturalWidth),
            y: Math.min(prev.y, containerHeight - naturalHeight),
          }));
        }

        setIsImageLoaded(true);
      };

      if (image.complete) {
        handleLoad();
      } else {
        image.addEventListener("load", handleLoad);
        return () => image.removeEventListener("load", handleLoad);
      }
    }
  }, [imageSrc]);

  // Initialize container dimensions
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;

        setDimensions({
          width: newWidth,
          height: newHeight,
        });

        // Adjust position if needed after resize
        setPosition((prevPos) => ({
          x: Math.max(0, Math.min(prevPos.x, newWidth - imageDimensions.width)),
          y: Math.max(
            0,
            Math.min(prevPos.y, newHeight - imageDimensions.height)
          ),
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imageDimensions.width, imageDimensions.height]);

  // Animation loop - only start after image is loaded
  useEffect(() => {
    if (
      !isImageLoaded ||
      imageDimensions.width === 0 ||
      imageDimensions.height === 0
    )
      return;

    const animate = () => {
      setPosition((prevPos) => {
        const newPos = {
          x: prevPos.x + velocity.dx,
          y: prevPos.y + velocity.dy,
        };

        const newVelocity = { ...velocity };

        // Check horizontal boundaries
        if (
          newPos.x + imageDimensions.width > dimensions.width ||
          newPos.x < 0
        ) {
          newVelocity.dx = -velocity.dx;
          setVelocity(newVelocity);
        }

        // Check vertical boundaries
        if (
          newPos.y + imageDimensions.height > dimensions.height ||
          newPos.y < 0
        ) {
          newVelocity.dy = -velocity.dy;
          setVelocity(newVelocity);
        }

        // Ensure position stays within bounds

        return {
          x: Math.max(
            0,
            Math.min(newPos.x, dimensions.width - imageDimensions.width)
          ),
          y: Math.max(
            0,
            Math.min(newPos.y, dimensions.height - imageDimensions.height)
          ),
        };
      });
    };

    const intervalId = setInterval(animate, 160); // ~60 FPS
    return () => clearInterval(intervalId);
  }, [dimensions, velocity, imageDimensions, isImageLoaded]);

  return (
    <Box key={id} ref={containerRef} style={styles.container}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt="Bouncing Image"
        style={{
          ...styles.image,
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 16ms linear",
        }}
      />
    </Box>
  );
};

export default BouncingDVD;
