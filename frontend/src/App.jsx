import React from "react"
import "./App.css"
import { Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import HomeView from "./components/HomeView"
import CartView from "./components/CartView"
import ProductDetailView from "./components/ProductDetailView"
import CheckoutView from "./components/CheckoutView"
import OrderView from "./components/OrderView"
import OrderDetailView from "./components/OrderDetailView"
import CatalogView from "./components/CatalogView"

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/products/:id" element={<ProductDetailView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/checkout" element={<CheckoutView />} />
        <Route path="/orders" element={<OrderView />} />
        <Route path="/orders/:id" element={<OrderDetailView />} />
        <Route path="/catalog" element={<CatalogView />} />
        <Route path="/catalog/:categoryId" element={<CatalogView />} />
      </Routes>
    </>
  )
}

export default App
