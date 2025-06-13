// src/pages/NotFound.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.error("404:", pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-lg text-gray-600">Страница не найдена</p>
        <a href="/" className="text-blue-600 hover:underline">
          Вернуться на главную
        </a>
      </div>
    </div>
  );
}
