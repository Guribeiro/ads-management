import { FullscreenCarousel } from "@/components/fullscreen-carousel";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Carousel() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate(-1); // Navigates to the previous page in history
        // This is the standard way to go back.
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('keydown', handleEsc);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [navigate]);
  return (
    <FullscreenCarousel />
  )
} 