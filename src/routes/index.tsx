import { authSlice } from "@/store/auth"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import { SigninPage } from "@/pages/signin";
import { HomePage } from "@/pages/home";
import { AdDetails } from "@/pages/ad-details";
import { Carousel } from "@/pages/carousel";
import { CreateAdPage } from '@/pages/create-ad'
import PrivateRoute from "./private-route";

import { CreateAdLayout } from "@/pages/layouts/create-ad-layout";

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
            <Route element={<CreateAdLayout />} >
              <Route path="/new" element={<CreateAdPage />} />
            </Route>
            <Route path="/carousel" element={<Carousel />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to={auth ? '/dashboard' : '/'} />} />
      </Routes>
    </BrowserRouter>
  )
}