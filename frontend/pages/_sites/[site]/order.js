import React, { Component, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import MapSelector from "../../../components/MapSelector";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import { useSelector, useDispatch } from "react-redux";
import { setCobro, setEnvio, setIdCart } from "../../../redux/cart";
import { useQuery, QueryClient, dehydrate } from "react-query";
import axios from "../../../lib/clientProvider/axiosConfig";
import { useForm } from "react-hook-form";
import { FormInputText } from "../../../components/FormInputText";
import { useMutation, useQueryClient } from "react-query";
import { CircularProgress } from "@mui/material";

const getCobrosEnvios = async (storeName, categoria) => {
  const { data } = await axios.get("/store2/getCobrosEnvios", {
    params: {
      name: storeName,
    },
  });
  return data;
};

const addOrden = async (data) => {
  const { data: response } = await axios.post("/ordenes/addOrden", data);
  return response;
};

export default function order({ site }) {
  const { subtotal, costo, cart } = useSelector((state) => state.cartReducer);

  const [errors, setErrors] = useState({});

  const router = useRouter();

  if (subtotal == 0) {
    router.push("/");
  }

  const dispatch = useDispatch();

  const { handleSubmit, control, reset, register } = useForm({
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
    },
  });

  const [envios, setEnvios] = React.useState([]);
  const [cobros, setCobros] = React.useState([]);

  const queryClient = useQueryClient();

  useQuery(["getCobrosEnvios", site], () => getCobrosEnvios(site), {
    onSuccess: (data) => {
      const cobrosRaw = data[0].map(
        (x) => x.tipo.charAt(0).toUpperCase() + x.tipo.slice(1)
      );
      const uniq = [...new Set(cobrosRaw)];

      setCobros(uniq);
      setEnvios(data[1]);
    },
  });

  let content = null;

  const [addressmap, setAdressmap] = React.useState(
    "Busque su dirección en el mapa, arrastre o mueva el punto de ser necesario"
  );

  const [selectedValue, setSelectedValue] = React.useState("");

  const handleChange = (envio) => {
    setSelectedValue(envio);
    dispatch(setEnvio(envio));
  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const handleClickOpenDialog = (scrollType) => () => {
    setOpenDialog(true);
    setScroll(scrollType);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [selectedCobro, setSelectedCobro] = React.useState("");

  const handleChangeCobro = (cobro) => {
    setSelectedCobro(cobro);
    dispatch(setCobro(cobro));
  };

  const [openDialogCobro, setOpenDialogCobro] = React.useState(false);
  const [scrollCobro, setScrollCobro] = React.useState("paper");

  const handleClickOpenDialogCobro = (scrollType) => () => {
    setOpenDialogCobro(true);
    setScrollCobro(scrollType);
  };

  const handleCloseDialogCobro = () => {
    setOpenDialogCobro(false);
  };

  const { mutate, isLoading } = useMutation(addOrden, {
    onSuccess: (data) => {
      reset();
      dispatch(setIdCart(data.id));
      router.push("/payment");
    },
    onError: (error) => {
      setErrors(error.response.data);
    },
    onSettled: () => {
      queryClient.invalidateQueries("ordenes/addOrden");
    },
  });

  const onSubmit = (
    data,
    addressmap,
    selectedValue,
    selectedCobro,
    subtotal,
    cart,
    site
  ) => {
    data["address"] = addressmap;
    data["zona"] = addressmap.split(",")[1];
    data["envioMetodo"] = selectedValue.name;
    data["envioCosto"] = selectedValue.costo;
    data["pagoMetodo"] = selectedCobro;
    data["subtotal"] = subtotal;
    const productosArr = cart.map((item) => {
      const newItem = {};
      newItem["id"] = item.producto.id;
      newItem["url"] = item.producto.producto_img.url;
      newItem["name"] = item.producto.name;
      if (Object.keys(item.combinatoria).length === 0) {
        newItem["variante"] = "";
        newItem["precio"] = item.producto.precio;
      } else {
        newItem["variante"] = item.combinatoria.combText;
        newItem["precio"] = item.producto.combinatories.filter(
          (x) => x.name === newItem["variante"]
        )[0].precio;
      }
      newItem["descuento"] =
        (item.producto.descuento * newItem["precio"]) / 100;
      newItem["subtotal"] = item.producto.precio - newItem["descuento"];
      newItem["cantidad"] = item.cantidad;
      newItem["total"] = item.cantidad * newItem["subtotal"];
      return newItem;
    });
    data["productos"] = productosArr;
    data["storeName"] = site;
    mutate(data);
  };

  content = (
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
          <Link href="/">
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
                    Datos personales
                  </div>
                  <div
                    className="px-3 pb-4 flex flex-col gap-3"
                    style={{ height: "auto" }}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
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
                      </div>

                      <FormInputText
                        name={"email"}
                        control={control}
                        label={"Correo"}
                        errors={errors}
                      />
                      <FormInputText
                        name={"phone"}
                        control={control}
                        label={"Celular"}
                        errors={errors}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-md">
                  <div className="text-xl font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    Dirección de entrega
                  </div>
                  <div className="px-3 pb-4 flex flex-col gap-14">
                    <MapSelector setAdressmap={setAdressmap} />
                    <TextField
                      id="filled-multiline-static"
                      multiline
                      rows={2}
                      sx={{ fontSize: "10px" }}
                      variant="filled"
                      fullWidth
                      disabled
                      value={addressmap}
                    />
                  </div>
                </div>
                <div className="bg-white rounded-md">
                  <div className="text-xl font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    Metodo de envío
                  </div>
                  <div className="flex px-3 pb-4 gap-2 items-center justify-between">
                    {selectedValue != "" ? (
                      <div className="text-lg font-medium">
                        {selectedValue.name} (S/{selectedValue.costo})
                      </div>
                    ) : (
                      ""
                    )}

                    <Button
                      variant="contained"
                      sx={{ textTransform: "none" }}
                      onClick={handleClickOpenDialog("paper")}
                    >
                      {selectedValue.name != "" ? "Cambiar" : "Seleccionar"}
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded-md">
                  <div className="text-xl font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    Metodo de pago
                  </div>
                  <div className="flex px-3 pb-4 gap-2 items-center justify-between">
                    {selectedCobro != "" ? (
                      <div className="text-lg font-medium">{selectedCobro}</div>
                    ) : (
                      ""
                    )}

                    <Button
                      variant="contained"
                      sx={{ textTransform: "none" }}
                      onClick={handleClickOpenDialogCobro("paper")}
                    >
                      {selectedCobro != "" ? "Cambiar" : "Seleccionar"}
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
                    <span>
                      {selectedValue === ""
                        ? "S/--"
                        : `S/${selectedValue.costo}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Descuento de productos</span>
                    <span>S/{Math.round((subtotal - costo) * 100) / 100}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      {selectedValue === ""
                        ? `S/${subtotal}`
                        : `S/${subtotal + selectedValue.costo}`}
                    </span>
                  </div>
                </div>
                <div className="px-5 mt-3 mb-6 w-full">
                  <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={
                      isLoading || selectedValue === "" || selectedCobro === ""
                    }
                    onClick={handleSubmit((data) =>
                      onSubmit(
                        data,
                        addressmap,
                        selectedValue,
                        selectedCobro,
                        subtotal,
                        cart,
                        site
                      )
                    )}
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
                    Proceder a pagar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">
          <div className="flex justify-between">
            <span>Metodo de envío</span>
            <Button onClick={handleCloseDialog}>
              <CancelIcon style={{ color: "grey" }} />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <div className="flex flex-col ">
              <Container fixed>
                <div className="flex flex-col gap-1 my-2">
                  <div className="flex justify-between ">
                    <span className="text-lg">Elige tu método de envío</span>
                    <div>
                      <div className="bg-gray-400 text-xs px-2 py-2 m-0 text-white flex justify-center items-center rounded-xl">
                        Obligatorio
                      </div>
                    </div>
                  </div>

                  {envios.map((envio) => (
                    <div className="flex justify-between mt-2 items-center border-b border-gray-200 py-2">
                      <span className="text-md">
                        {envio.name} (S/{envio.costo})
                      </span>
                      <div>
                        <Radio
                          checked={selectedValue.name === envio.name}
                          onChange={() => handleChange(envio)}
                          value={envio.name}
                          name="radio-buttons"
                          inputProps={{ "aria-label": "B" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Container>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Container fixed>
            <div className="flex justify-end">
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  disabled={selectedValue === ""}
                  onClick={handleCloseDialog}
                >
                  Seleccionar
                </Button>
              </div>
            </div>
          </Container>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogCobro}
        onClose={handleCloseDialogCobro}
        scroll={scrollCobro}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">
          <div className="flex justify-between">
            <span>Metodo de pago</span>
            <Button onClick={handleCloseDialogCobro}>
              <CancelIcon style={{ color: "grey" }} />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent dividers={scrollCobro === "paper"}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <div className="flex flex-col ">
              <Container fixed>
                <div className="flex flex-col gap-1 my-2">
                  <div className="flex justify-between ">
                    <span className="text-lg">Elige tu método de pago</span>
                    <div>
                      <div className="bg-gray-400 text-xs px-2 py-2 m-0 text-white flex justify-center items-center rounded-xl">
                        Obligatorio
                      </div>
                    </div>
                  </div>

                  {cobros.map((cobro) => (
                    <div className="flex justify-between mt-2 items-center border-b border-gray-200 py-2">
                      <span className="text-md">{cobro}</span>
                      <div>
                        <Radio
                          checked={selectedCobro === cobro}
                          onChange={() => handleChangeCobro(cobro)}
                          value={cobro}
                          name="radio-buttons"
                          inputProps={{ "aria-label": "B" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Container>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Container fixed>
            <div className="flex justify-end">
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  disabled={selectedCobro === ""}
                  onClick={handleCloseDialogCobro}
                >
                  Seleccionar
                </Button>
              </div>
            </div>
          </Container>
        </DialogActions>
      </Dialog>
    </div>
  );

  return content;
}

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
