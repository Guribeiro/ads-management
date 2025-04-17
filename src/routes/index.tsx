import { authSlice } from "@/store/auth"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"


import { SigninPage } from "@/pages/signin";
import { HomePage } from "@/pages/home";
import PrivateRoute from "./private-route";


export const IndexRoutes = () => {
  const { user } = authSlice(state => state)
  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <Route path="/" element={<SigninPage />} />
        ) : (
          <Route
            element={<PrivateRoute />}
          >
            <Route path="/" element={<HomePage />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} />} />
      </Routes>
    </BrowserRouter>
  )
}