import { ModeToggle } from '@/components/mode-toggle';
import { authSlice } from '@/store/auth';
import { Navigate, useLocation, Outlet } from 'react-router';


function PrivateRoute() {
  const { state } = useLocation();
  const { user } = authSlice(state => state)

  if (!user) {
    return <Navigate to="/" state={state} replace />;
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="flex justify-end mb-4">
        <ModeToggle />
      </div>
      <Outlet />
    </div>
  )
}

export default PrivateRoute;