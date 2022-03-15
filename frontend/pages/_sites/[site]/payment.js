import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Container, TextField } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import {
  useQuery,
  QueryClient,
  dehydrate,
  useMutation,
  useQueryClient,
} from "react-query";
import axios from "../../../lib/clientProvider/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { FormInputText } from "../../../components/FormInputText";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import { setMailBuyer } from "../../../redux/cart";
import { useRouter } from "next/router";

const getCobrosEnvios = async (storeName, categoria) => {
  const { data } = await axios.get("/store2/getCobrosEnvios", {
    params: {
      name: storeName,
    },
  });
  return data;
};

const updateOrden = async (data) => {
  const { data: response } = await axios.post("/ordenes/updateOrden", data);
  return response;
};

function payment({ site }) {
  const [envios, setEnvios] = React.useState([]);
  const [cobros, setCobros] = React.useState([]);
  const [errors, setErrors] = React.useState({});

  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const router = useRouter();

  const { subtotal, costo, cobro, envio, idCart } = useSelector(
    (state) => state.cartReducer
  );

  const { handleSubmit, control, reset, register } = useForm({
    defaultValues: {
      namePay: "",
      lastnamePay: "",
      pagoCodigo: "",
      phonePay: "",
      name: "a",
      lastname: "a",
      phone: "a",
      email: "a",
      address: "a",
      zona: "a",
      envioMetodo: "a",
      pagoMetodo: "a",
    },
  });

  useQuery(["getCobrosEnvios", site], () => getCobrosEnvios(site), {
    onSuccess: (data) => {
      const cobrosRaw = data[0].filter(
        (x) => x.tipo.toLowerCase() === cobro.toLowerCase()
      );
      setCobros(cobrosRaw);
      setEnvios(data[1]);
    },
  });

  const { mutate, isLoading } = useMutation(updateOrden, {
    onSuccess: (data) => {
      reset();
      dispatch(setMailBuyer(data.email));
      router.push("/confirmation");
    },
    onError: (error) => {
      setErrors(error.response.data);
    },
    onSettled: () => {
      queryClient.invalidateQueries("ordenes/updateOrden");
    },
  });

  const onSubmit = (data, idCart) => {
    data["id"] = idCart;
    mutate(data);
  };

  return (
    <div>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Your Order</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <div className="w-full h-full bg-gray-100 flex flex-col">
        <div className="w-full bg-white flex ">
          <Link href="/order">
            <div className="flex cursor-pointer p-3 gap-3 items-center">
              <ArrowBackIcon />
              <span className="text-base font-medium">Volver</span>
            </div>
          </Link>
        </div>
        <Container fixed>
          <div className="flex flex-col gap-3">
            <div className="text-2xl font-bold my-5">Tu pedido</div>
            <div className="flex gap-4 flex-col lg:flex-row bg-gray-100">
              <div className="w-full lg:w-2/3 bg-gray-100 flex flex-col rounded-md gap-4 mb-0 lg:mb-6">
                <div className="bg-white rounded-md">
                  <div className="text-xl font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    Confirmar pago: Transferencia bancaria
                  </div>
                  <div
                    className="px-3 pb-4 flex flex-col gap-3"
                    style={{ height: "auto" }}
                  >
                    <div className="flex flex-col gap-1 text-sm lg:text-base bg-gray-200 rounded-md my-3 px-3 py-2">
                      {cobros.map((cobro) => (
                        <div className="flex justify-between lg:justify-start lg:gap-2">
                          <span>{cobro.name}</span>
                          <span>{cobro.cuenta}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <FormInputText
                          name={"namePay"}
                          control={control}
                          label={"Nombres"}
                          errors={errors}
                        />
                        <FormInputText
                          name={"lastnamePay"}
                          control={control}
                          label={"Apellidos"}
                          errors={errors}
                        />
                      </div>

                      <FormInputText
                        name={"pagoCodigo"}
                        control={control}
                        label={"Numero de transferencia/ Numero de envío"}
                        errors={errors}
                      />
                      <FormInputText
                        name={"phonePay"}
                        control={control}
                        label={"Celular"}
                        errors={errors}
                      />
                    </div>
                  </div>
                  <div className="px-5 mt-3 mb-6">
                    <Button
                      color="primary"
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isLoading}
                      onClick={handleSubmit((data) => onSubmit(data, idCart))}
                      sx={{
                        width: "100%",
                        borderRadius: "12px",
                        padding: "16px 32px",
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
                      Confirmar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/3 bg-white flex flex-col rounded-md mb-6 h-1/3">
                <div className="w-full text-xl font-bold my-5 border-b pb-5 px-3 border-gray-300">
                  Resumen
                </div>
                <div className="flex flex-col gap-6 px-6 text-lg pb-3">
                  <div className="flex justify-between">
                    <span>Costo de productos</span>
                    <span>S/{costo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costo de Envío</span>
                    <span>{envio === "" ? "S/--" : `S/${envio.costo}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Descuento de productos</span>
                    <span>S/{Math.round((subtotal - costo) * 100) / 100}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      {envio === ""
                        ? `S/${subtotal}`
                        : `S/${subtotal + envio.costo}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default payment;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking", // fallback true allows sites to be generated using ISR
  };
}

export async function getStaticProps({ params: { site } }) {
  if (site == "enelmarket.com" || site == "localhost:3000") {
    site = "enelmarket";
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getCobrosEnvios", site], () =>
    getCobrosEnvios(site)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      site,
    },
    revalidate: 1,
  };
}
