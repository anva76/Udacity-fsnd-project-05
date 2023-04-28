import React from "react"
import "./App.css"
import { Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomeView from "./components/HomeView"
import CartView from "./components/CartView"
import ProductDetailView from "./components/ProductDetailView"
import CheckoutView from "./components/CheckoutView"
import OrderView from "./components/OrderView"
import OrderDetailView from "./components/OrderDetailView"
import CatalogView from "./components/CatalogView"
import { FlashMessage } from "./components/FlashMessage"
import CallbackPage from "./components/CallbackPage"
import PageLoader from "./components/PageLoader"
import SearchView from "./components/SearchView"
import { useAuth0 } from "@auth0/auth0-react"
import { Auth0RouteGuard } from "./components/Auth0RouteGuard"
import Page404 from "./components/Page404"

const App = () => {
  const { isLoading } = useAuth0()

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="App">
      <FlashMessage />
      <Header />
      <Routes>
        <Route path="*" element={<Page404 />} />
        <Route path="/" element={<HomeView />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/products/:id" element={<ProductDetailView />} />
        <Route
          path="/cart"
          element={<Auth0RouteGuard component={CartView} />}
        />
        <Route
          path="/checkout"
          element={<Auth0RouteGuard component={CheckoutView} />}
        />
        <Route
          path="/orders"
          element={<Auth0RouteGuard component={OrderView} />}
        />
        <Route
          path="/orders/:id"
          element={<Auth0RouteGuard component={OrderDetailView} />}
        />
        <Route path="/catalog" element={<CatalogView />} />
        <Route path="/catalog/:categoryId" element={<CatalogView />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/search" element={<SearchView />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
