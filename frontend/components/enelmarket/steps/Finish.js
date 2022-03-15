import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

export default function Finish({ storeName }) {
  const router = useRouter();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 1000, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -1000, opacity: 0 }}
        className="bg-gray-100 w-4/5 h-auto rounded-xl text-gray-800 px-4 py-10 flex flex-col xl:w-1/2 xl:self-start"
      >
        <div className="flex font-roboto-700 font-bold text-2xl mb-6">
          Paso 3. Configura tu tienda
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col font-roboto-700 text-base">
            Nos encontramos creando tu tienda web, en 5 minutos estará
            disponible en el siguiente link
            <button
              onClick={() => router.push(`https://${storeName}.enelmarket.com`)}
              className="bg-blue-500 self-center text-white font-bold rounded-xl px-8 py-4 my-2"
            >
              {storeName}.enelmarket.com
            </button>
            Mientras tanto puedes ir configurando tu tienda y cargando productos
            en:
            <button
              onClick={() => router.push("https://admin.enelmarket.com")}
              className="bg-blue-500 self-center text-white font-bold rounded-xl px-8 py-4 my-2"
            >
              admin.enelmarket.com
            </button>
            con el correo y contraseña registrados. <br />
            <br />
            <div className="font-roboto-700 text-lg font-bold">
              ¡Éxitos en tu emprendimiento!
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
