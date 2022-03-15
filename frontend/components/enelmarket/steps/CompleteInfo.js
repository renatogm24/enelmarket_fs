import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { FormInputText } from "../../FormInputText";
import axios from "../../../lib/clientProvider/axiosConfig";
import { CircularProgress } from "@mui/material";
import { Button } from "@mui/material";

const saveUser = async (data) => {
  const { data: response } = await axios.post("/user/save", data);
  return response;
};

export default function CompleteInfo({ setStep, storeName }) {
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const { handleSubmit, register, control } = useForm({
    defaultValues: {
      name: "",
      lastname: "",
      username: "",
      password: "",
      storeName,
    },
  });

  const { mutate, isLoading } = useMutation(saveUser, {
    onSuccess: () => {
      setStep("finish");
    },
    onError: (error) => {
      setErrors(error.response.data);
    },
    onSettled: () => {
      queryClient.invalidateQueries("user/save");
    },
  });

  const onSubmit = (data) => {
    const user = {
      ...data,
    };
    mutate(user);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 1000, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -1000, opacity: 0 }}
        className="bg-gray-100 w-4/5 h-auto rounded-xl text-gray-800 px-4 py-10 flex flex-col xl:w-1/2 xl:self-start"
      >
        <div className="flex font-roboto-700 font-bold text-2xl mb-6">
          Paso 2. Completa tus datos
        </div>
        <div className="flex flex-col justify-center w-full">
          <form
            className="flex flex-col w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col w-5/6 self-center items-center space-y-2">
              <input type="hidden" {...register("storeName")} />
              <FormInputText
                name={"name"}
                control={control}
                label={"Nombres"}
                errors={errors}
              />
              <FormInputText
                name={"lastname"}
                control={control}
                label={"Apellidos"}
                errors={errors}
              />
              <FormInputText
                name={"username"}
                control={control}
                label={"Correo"}
                errors={errors}
              />
              <FormInputText
                name={"password"}
                control={control}
                label={"Clave"}
                errors={errors}
                type={"password"}
              />
            </div>

            <Button
              color="primary"
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                width: "83.33%",
                borderRadius: "12px",
                padding: "16px 32px",
                margin: "32px 0",
                textTransform: "none",
                fontWeight: "700",
                alignSelf: "center",
              }}
              startIcon={
                isLoading ? (
                  <CircularProgress color="inherit" size={25} />
                ) : null
              }
            >
              ¡Configura tu tienda!
            </Button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
