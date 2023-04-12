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
      </Routes>
    </>
  )
}

export default App
