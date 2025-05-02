import { authSlice } from "@/store/auth"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import { SigninPage } from "@/pages/signin";
import { HomePage } from "@/pages/home";
import { AdDetails } from "@/pages/ad-details";
import PrivateRoute from "./private-route";

export const IndexRoutes = () => {
  const { auth } = authSlice(state => state)
  return (
    <BrowserRouter>
      <Routes>
        {!auth ? (
          <Route path="/" element={<SigninPage />} />
        ) : (
          <Route
            element={<PrivateRoute />}
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/:adId" element={<AdDetails />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to={auth ? '/dashboard' : '/'} />} />
      </Routes>
    </BrowserRouter>
  )
}