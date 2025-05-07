import { useEffect } from 'react';
import { useNavigate } from 'react-router'; // Assuming you're using react-router-dom


const useEscapeToNavigateBack = (): void => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        navigate(-1);
      }
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [navigate]);
};

export default useEscapeToNavigateBack;