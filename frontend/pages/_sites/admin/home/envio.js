import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Loader from "../../../../components/Loader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import HomeLayout from "../../../../components/HomeLayout";
import { Button, Container, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import axios from "../../../../lib/clientProvider/axiosConfig";
import { CircularProgress } from "@mui/material";
import { FormInputText } from "../../../../components/FormInputText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CheckProduct from "../../../../components/CheckProduct";
import { useSelector } from "react-redux";

const addEnvio = async (data) => {
  const { data: response } = await axios.post("/envios/addEnvio", data);
  return response;
};

const getCobrosEnvios = async (storeName, categoria) => {
  const { data } = await axios.get("/store2/getCobrosEnvios", {
    params: {
      name: storeName,
    },
  });

  return data;
};

const deleteProducto = async (data) => {
  const { data: response } = await axios.get("/envios/deleteEnvio", {
    params: {
      id: data,
    },
  });
  return response;
};

export default function index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoadingFirst, setIsLoadingFirst] = useState(true);
  const [errors, setErrors] = useState({});

  const [tipo, setTipo] = React.useState("");

  const { user } = useSelector((state) => state.userReducer.user);
  const storeName = user.store.name;

  const handleChange = (event) => {
    setTipo(event.target.value);
  };

  const queryClient = useQueryClient();
  const { handleSubmit, control, register, reset } = useForm({
    defaultValues: {
      name: "",
      costo: "",
    },
  });

  const [envios, setEnvios] = React.useState([]);
  const [cobros, setCobros] = React.useState([]);

  const [envioSelected, setEnvioSelected] = React.useState("");
  const [resetEnvio, setResetEnvio] = React.useState(true);

  const { data: enviosQuery, refetch } = useQuery(
    ["getCobrosEnvios", storeName],
    () => getCobrosEnvios(storeName),
    {
      onSuccess: (data) => {
        setCobros(data[0]);
        setEnvios(data[1]);
      },
    }
  );

  const { mutate, isLoading } = useMutation(addEnvio, {
    onSuccess: (data) => {
      reset({
        id: "",
        name: "",
        costo: "",
      });
      setTipo("");
      setResetEnvio(!resetEnvio);
      refetch();
    },
    onError: (error) => {
      setErrors(error.response.data);
    },
    onSettled: () => {
      queryClient.invalidateQueries("/envios/addEnvio");
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  useEffect(() => {
    if (envioSelected) {
      reset({
        id: envioSelected.id,
        name: envioSelected.name,
        costo: envioSelected.costo,
      });
    }
  }, [envioSelected]);

  useEffect(() => {
    const isUserAuth = isAuthenticated();
    if (!isUserAuth) {
      router.push("/");
    }
    setIsLoadingFirst(false);
  }, []);

  const { mutate: mutateDelete, isLoading: isLoadingDeleted } = useMutation(
    deleteProducto,
    {
      onSuccess: (data) => {
        reset({
          id: "",
          name: "",
          cuenta: "",
        });
        setTipo("");
        setResetEnvio(!resetEnvio);
        refetch();
      },
      onError: (error) => {
        setErrors(error.response.data);
      },
      onSettled: () => {
        queryClient.invalidateQueries("productos/deleteProduct");
      },
    }
  );

  const onSubmitDelete = ({ id }) => {
    mutateDelete(id);
  };

  if (isLoadingFirst) {
    return <Loader centered />;
  } else {
    return (
      <div>
        <Container fixed>
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 flex-col lg:flex-row bg-gray-100">
              <div className="w-full bg-gray-100 flex flex-col rounded-md gap-4 my-6">
                <div className="bg-white rounded-md mx-auto">
                  <div className="text-xl font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    Envio
                  </div>
                  <div className="text-base font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    <div className="mb-3">Modificar cobro</div>
                    <CheckProduct
                      options={enviosQuery ? enviosQuery[1] : envios}
                      setProductoSelected={setEnvioSelected}
                      label={"Medio de envio"}
                      reset={resetEnvio}
                    />
                  </div>
                  <div className="text-base font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    Puedes añadir los metodos de envio para tu tienda
                  </div>
                  <div
                    className="px-3 pb-4 flex flex-col gap-3"
                    style={{ height: "auto" }}
                  >
                    <form
                      className="flex flex-col gap-3"
                      encType="multipart/form-data"
                    >
                      <input
                        {...register("id")}
                        type="hidden"
                        name="id"
                        value=""
                        placeholder="id"
                      />
                      <FormInputText
                        name={"name"}
                        control={control}
                        label={"Nombre: ejm: Envio express..."}
                        errors={errors}
                      />

                      <FormInputText
                        name={"costo"}
                        control={control}
                        label={"Costo de envio"}
                        errors={errors}
                      />

                      {envioSelected && (
                        <Button
                          color="error"
                          onClick={handleSubmit((data) => onSubmitDelete(data))}
                          type="submit"
                          variant="contained"
                          disabled={isLoadingDeleted}
                          sx={{
                            width: "auto",
                            borderRadius: "12px",
                            padding: "5px 10px",
                            textTransform: "none",
                            fontWeight: "700",
                            alignSelf: "center",
                          }}
                          startIcon={
                            isLoadingDeleted ? (
                              <CircularProgress color="inherit" size={25} />
                            ) : null
                          }
                        >
                          Eliminar metodo
                        </Button>
                      )}

                      <Button
                        color="primary"
                        onClick={handleSubmit((data) => onSubmit(data, tipo))}
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                          width: "auto",
                          borderRadius: "12px",
                          padding: "5px 10px",
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
                        {envioSelected ? "Editar metodo" : "Agregar metodo"}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

index.getLayout = function getLayout(index) {
  return <HomeLayout>{index}</HomeLayout>;
};
