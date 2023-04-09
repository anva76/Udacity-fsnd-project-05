import React from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import HomeView from "./components/HomeView"
import CartView from "./components/CartView"
import ProductDetailView from "./components/ProductDetailView"

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/products/:id" element={<ProductDetailView />} />
        <Route path="/cart" element={<CartView />} />
      </Routes>
    </>
  )
}

export default App
