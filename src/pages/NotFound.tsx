import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

export default function NotFound() {
  const { pathname } = useLocation();
  useEffect(() => {
    console.error("404:", pathname);
  }, [pathname]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-12 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold">404</h1>
        <p className="text-base sm:text-lg text-gray-600">Страница не найдена</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
