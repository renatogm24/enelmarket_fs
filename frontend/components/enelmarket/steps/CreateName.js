import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextField from "@material-ui/core/TextField";
import { useQuery } from "react-query";
import axios from "../../../lib/clientProvider/axiosConfig";
import { useMutation, useQueryClient } from "react-query";

const isNameValid = async ({ storeName }) => {
  const { data } = await axios.get("/isNameValid", {
    params: {
      name: storeName,
    },
  });
  return { data, storeName };
};

export default function CreateName({ setStep, setStoreName }) {
  const [errorName, setErrorName] = useState({
    val: false,
    msg: "",
    css: "pb-0",
  });

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(isNameValid, {
    onSuccess: (data) => {
      if (data.data) {
        setErrorName({
          val: true,
          msg: "No disponible",
          css: "pb-5",
        });
      } else {
        setStoreName(data.storeName);
        setStep("completeInfo");
      }
    },
    onError: () => {
      console.log("Hubo un error");
    },
    onSettled: () => {
      queryClient.invalidateQueries("isNameValid");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const storeName = e.target.name.value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    //const stores = [];

    if (e.target.name.value.toLowerCase() !== storeName) {
      setErrorName({
        val: true,
        msg: "No se permite caracteres",
        css: "pb-9",
      });
    } else {
      mutate({ storeName });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 1000, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -1000, opacity: 0 }}
        className="bg-gray-100 w-4/5 items-center h-auto rounded-xl text-gray-800 px-4 py-10 flex flex-col xl:w-1/2 xl:self-start"
      >
        <div className="font-roboto-700 font-bold text-2xl mb-8">
          Paso 1. Ponle un nombre a tu página
        </div>
        <div className="flex flex-col h-3/5 justify-center">
          <form className="w-full" onSubmit={(e) => onSubmit(e)}>
            <div className="flex w-full self-center">
              <TextField
                required
                name="name"
                error={errorName.val}
                id="outlined-basic"
                label="Tienda"
                variant="outlined"
                className="w-1/2"
                helperText={errorName.msg}
              />
              <div className={`text-lg self-center font-bold ${errorName.css}`}>
                .enelmarket.com
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 w-full self-center text-white font-bold rounded-xl px-8 py-4 mt-8"
            >
              ¡Completa tus datos!
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
