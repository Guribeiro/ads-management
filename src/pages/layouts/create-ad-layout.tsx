import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export function CreateAdLayout() {
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
    <div className="bg-background p-2 flex flex-col">
      <div className='my-8 max-w-lg w-full mx-auto'>
        <Button variant="ghost" className='my-4' onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <h2 className="text-2xl font-bold">Novo anúncio</h2>
        <div className='mt-4'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
