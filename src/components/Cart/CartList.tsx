"use client";

import { useState } from "react";
import CartItem from "@/components/Cart/CartItem";

const initialCart = [
  {
    id: 1,
    name: "Performance Air Filter",
    category: "Engine Parts",
    price: 89.99,
    quantity: 3,
  },
  {
    id: 2,
    name: "Sport Exhaust System",
    category: "Exhaust",
    price: 299.99,
    quantity: 1,
  },
  {
    id: 3,
    name: "LED Headlights",
    category: "Electronics",
    price: 159.99,
    quantity: 1,
  },
];

export default function CartList() {
  const [cartItems, setCartItems] = useState(initialCart);

  const handleIncrement = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          {...item}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}
