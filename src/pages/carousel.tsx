import { FullscreenCarousel } from "@/components/fullscreen-carousel";
import useEscapeToNavigateBack from "@/hooks/useScapeToNavigateBack";

export function Carousel() {
  useEscapeToNavigateBack()

  return (
    <FullscreenCarousel />
  )
} 