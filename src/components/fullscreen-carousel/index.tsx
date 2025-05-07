import { ComponentProps, useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './styles.css'; // Criaremos este arquivo para estilos fullscreen
import { useQuery } from '@tanstack/react-query';
import { fetchAds } from '@/http/fetch-ads';
import { Image } from '../image-grid';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

const ONE_MINUTE_IN_MILISECONDS = 60000

type SliderProps = ComponentProps<typeof Slider>

const FullscreenCarousel = () => {
  const sliderRef = useRef<Slider>(null);

  const settings: SliderProps = {
    dots: true, // Mostrar indicadores de pontos
    infinite: true, // Loop infinito
    speed: 1000, // Velocidade da animação de transição em ms
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Ativar autoplay
    autoplaySpeed: ONE_MINUTE_IN_MILISECONDS, // Duração padrão se não especificada
    fade: true, // Usar fade para a transição (pode escolher outras)
    cssEase: 'linear', // Tipo de easing para a animação
  };


  const { data, isPending, error } = useQuery({
    initialData: [],
    queryKey: ['active-ads'],
    queryFn: async () => {
      const { data } = await fetchAds({ status: 'ATIVO' })

      const images: Image[] = data.map((item, index) => ({
        active: item.status === 'ATIVO',
        id: item.id,
        alt: item.descricao,
        src: item.foto,
        order: index
      }))

      return images
    }
  })

  if (isPending) return <h1>carregando....</h1>

  if (error) {
    return (
      <Alert variant='destructive'>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Ops... Algo deu errado!</AlertTitle>
        <AlertDescription>
          {error?.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="fullscreen-carousel-container">
      <Slider ref={sliderRef} {...settings}>
        {data.map(item => (
          <div key={item.id} className="carousel-slide">
            <img src={item.src} alt={`Slide ${item.id}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export { FullscreenCarousel };