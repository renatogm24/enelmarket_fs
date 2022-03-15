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

const addCobro = async (data) => {
  const { data: response } = await axios.post("/cobros/addCobro", data);
  return response;
};

const deleteProducto = async (data) => {
  const { data: response } = await axios.get("/cobros/deleteCobro", {
    params: {
      id: data,
    },
  });
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
  const { handleSubmit, control, reset, register } = useForm({
    defaultValues: {
      name: "",
      cuenta: "",
    },
  });

  const [envios, setEnvios] = React.useState([]);
  const [cobros, setCobros] = React.useState([]);

  const [cobroSelected, setCobroSelected] = React.useState("");
  const [resetCobro, setResetCobro] = React.useState(true);

  const { data: cobrosQuery, refetch } = useQuery(
    ["getCobrosEnvios", storeName],
    () => getCobrosEnvios(storeName),
    {
      onSuccess: (data) => {
        setCobros(data[0]);
        setEnvios(data[1]);
      },
    }
  );

  const { mutate, isLoading } = useMutation(addCobro, {
    onSuccess: (data) => {
      reset({
        id: "",
        name: "",
        cuenta: "",
      });
      setTipo("");
      setResetCobro(!resetCobro);
      refetch();
    },
    onError: (error) => {
      setErrors(error.response.data);
    },
    onSettled: () => {
      queryClient.invalidateQueries("cobros/addCobro");
    },
  });

  const onSubmit = (data, tipo) => {
    data["tipo"] = tipo;

    mutate(data);
  };

  useEffect(() => {
    if (cobroSelected) {
      setTipo(cobroSelected.tipo);
      reset({
        id: cobroSelected.id,
        name: cobroSelected.name,
        cuenta: cobroSelected.cuenta,
      });
    }
  }, [cobroSelected]);

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
        setResetCobro(!resetCobro);
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
                    Cobro
                  </div>
                  <div className="text-base font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    <div className="mb-3">Modificar cobro</div>
                    <CheckProduct
                      options={cobrosQuery ? cobrosQuery[0] : cobros}
                      setProductoSelected={setCobroSelected}
                      label={"Medio de cobro"}
                      reset={resetCobro}
                    />
                  </div>
                  <div className="text-base font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    Puedes añadir metodos de pago para tu tienda
                  </div>
                  <div
                    className="px-3 pb-4 flex flex-col gap-3"
                    style={{ height: "auto" }}
                  >
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={handleSubmit((data) => onSubmit(data, tipo))}
                    >
                      <input
                        {...register("id")}
                        type="hidden"
                        name="id"
                        value=""
                        placeholder="id"
                      />
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Tipo de cobro
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={tipo}
                          label="Tipo de cobro"
                          onChange={handleChange}
                        >
                          <MenuItem value={"Transferencia bancaria"}>
                            Transferencia bancaria
                          </MenuItem>
                          <MenuItem
                            value={"Monederos digitales (Yape, Plin, etc)"}
                          >
                            Medios digitales (Yape, Plin, etc)
                          </MenuItem>
                          <MenuItem disabled value={"Mercado Pago"}>
                            Mercado Pago
                          </MenuItem>
                        </Select>
                      </FormControl>

                      <FormInputText
                        name={"name"}
                        control={control}
                        label={"Nombre: ejm: Cuenta BBVA, Yape"}
                        errors={errors}
                      />

                      <FormInputText
                        name={"cuenta"}
                        control={control}
                        label={"Numero de cuenta o móvil"}
                        errors={errors}
                      />

                      {cobroSelected && (
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
                            isLoading ? (
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
                        {cobroSelected ? "Editar metodo" : "Agregar metodo"}
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
