import { ComponentProps, useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './styles.css'; // Criaremos este arquivo para estilos fullscreen
import { useQuery } from '@tanstack/react-query';
import { fetchAds } from '@/http/fetch-ads';
import { Image } from '../image-grid';
import { Loader2, Terminal } from 'lucide-react';
import { FeedbackAlertContainer, FeedbackAlertDescription, FeedbackAlertIcon, FeedbackAlertTitle } from '../feedback-alert';

const INTERVAL_IN_MINUTES = 30
const ONE_MINUTE_IN_MILISECONDS = 60000
const REFETCH_INTERVAL_IN_MILISECONDS = ONE_MINUTE_IN_MILISECONDS * INTERVAL_IN_MINUTES

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


  const { data, isFetching, error } = useQuery({
    initialData: [],
    queryKey: ['active-ads'],
    refetchInterval: REFETCH_INTERVAL_IN_MILISECONDS,
    queryFn: async () => {
      const { data } = await fetchAds({ status: 'ATIVO' })

      const images: Image[] = data.ads.map((item, index) => ({
        active: item.status === 'ATIVO',
        id: item.id,
        alt: item.descricao,
        src: item.foto,
        order: index
      }))

      return images
    }
  })

  if (isFetching) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    )
  }

  if (error) {
    return (
      <FeedbackAlertContainer variant='destructive'>
        <FeedbackAlertIcon>
          <Terminal className="h-4 w-4" />
        </FeedbackAlertIcon>
        <FeedbackAlertTitle>Ops... Algo deu errado!</FeedbackAlertTitle>
        <FeedbackAlertDescription>
          {error?.message}
        </FeedbackAlertDescription>
      </FeedbackAlertContainer>
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