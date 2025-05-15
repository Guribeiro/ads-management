import { authSlice } from "@/store/auth"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import { SigninPage } from "@/pages/signin";
import { HomePage } from "@/pages/home";
import { AdDetails } from "@/pages/ad-details";
import { Carousel } from "@/pages/carousel";
import { CreateAdPage } from '@/pages/create-ad'
import PrivateRoute from "./private-route";
import { AnimatePresence } from 'framer-motion';

import { PageTransition } from "./transition";


import { CreateAdLayout } from "@/pages/layouts/create-ad-layout";

export const IndexRoutes = () => {
  const { auth } = authSlice(state => state)
  return (
    <AnimatePresence mode="wait">

      <BrowserRouter>
        <Routes>
          {!auth ? (
            <Route path="/" element={<SigninPage />} />
          ) : (
            <Route
              element={<PrivateRoute />}
            >
              <Route
                path="/"
                element={
                  <PageTransition>
                    <HomePage />
                  </PageTransition>
                }
              />
              <Route
                path="/:adId"
                element={
                  <PageTransition>
                    <AdDetails />
                  </PageTransition>
                }

              />
              <Route element={<CreateAdLayout />} >
                <Route
                  path="/new"
                  element={
                    <PageTransition>
                      <CreateAdPage />
                    </PageTransition>
                  }
                />
              </Route>
            </Route>
          )}
          <Route path="*" element={<Navigate to={auth ? '/dashboard' : '/'} />} />
          <Route path="/carousel" element={<Carousel />} />
        </Routes>
      </BrowserRouter>
    </AnimatePresence>

  )
}