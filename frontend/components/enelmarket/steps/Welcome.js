import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Welcome({ setStep }) {
  const words = ["emprendimiento", "negocio", "tienda"];
  const [word, setWord] = useState("emprendimiento");

  function SpanWordReact(props) {
    const word = props.word;
    return (
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -5, opacity: 0 }}
        transition={{
          default: { duration: 0.7 },
        }}
        className="font-bold inline-block"
      >
        {word}
      </motion.div>
    );
  }

  let intervalID;
  useEffect(() => {
    let index = 1;
    intervalID = setInterval(() => {
      setWord(words[index]);
      index++;
      if (index > 2) {
        index = 0;
      }
    }, 2000);
    return () => clearInterval(intervalID);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 1000, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -1000, opacity: 0 }}
        className="bg-gray-100 w-4/5 h-auto rounded-xl text-gray-800 px-4 py-10 flex flex-col xl:w-1/2 xl:self-start"
      >
        <div className="font-roboto-700 font-bold text-2xl">
          Dale un impulso
          <br />
          a tu <SpanWordReact word={word} />
        </div>
        <div className="mt-8 px-2">
          <li>
            Comencemos <strong>configurando tu página web</strong> con el diseño
            que más te guste
          </li>
          <li className="mt-4">
            Con tu dominio propio podrás activar tu{" "}
            <strong>Facebook e Instragram Shopping</strong> así como hacer
            seguimiento de tus potenciales clientes
          </li>
          <li className="mt-4">
            Cobramos <strong>0% de comisión por transacciones</strong> , elige
            el medio de pago que se te acomode.
          </li>
        </div>
        <button
          onClick={() => setStep("createName")}
          className="bg-blue-500 w-4/5 self-center text-white font-bold rounded-xl px-8 py-4 mt-8"
        >
          ¡Registra tu market!
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
