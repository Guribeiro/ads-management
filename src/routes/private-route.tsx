import { authSlice } from '@/store/auth';
import { Navigate, useLocation, Outlet } from 'react-router';


function PrivateRoute() {
  const { state } = useLocation();
  const { user } = authSlice(state => state)

  if (!user) {
    return <Navigate to="/" state={state} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;