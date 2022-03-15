import React, { useState } from "react";
import styles from "./dashboard.module.css";
import { Avatar } from "@material-ui/core";
import { useAuth } from "../../../../context/AuthContext";
import Loader from "../../../../components/Loader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import HomeLayout from "../../../../components/HomeLayout";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import axios from "../../../../lib/clientProvider/axiosConfig";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, CircularProgress, Container, Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Typography from "@mui/material/Typography";
import CheckProduct from "../../../../components/CheckProduct";

const updateOrder = async ({ estado, id }) => {
  const { data: response } = await axios.get("/orders/updateOrder", {
    params: {
      id,
      estado: estado.name,
    },
  });
  return response;
};

const getUserSession = async () => {
  const { data } = await axios.get("/user/session");
  return data;
};

export default function index() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoadingStart, setIsLoadingStart] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ventas, setVentas] = useState(0);
  const [categories, setCategories] = useState(0);
  const [ingresos, setIngresos] = useState(0);

  const queryClient = useQueryClient();

  const { refetch } = useQuery(["getUserSession"], () => getUserSession(), {
    onSuccess: (data) => {
      setOrders(data.store.ordercarts);
      setVentas(data.store.ordercarts.length);
      setCategories(data.store.categories.length);

      let sum = 0;
      for (const order of data.store.ordercarts) {
        sum = sum + order.subtotal + order.envioCosto;
      }

      setIngresos(sum);
    },
  });

  useEffect(() => {
    const isUserAuth = isAuthenticated();
    if (!isUserAuth) {
      router.push("/");
    }
    setIsLoadingStart(false);
  }, []);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const [selectedOrder, setselectedOrder] = React.useState("");

  const [estados, setEstados] = React.useState([
    { name: "Pendiente" },
    { name: "En progreso" },
    { name: "Enviado" },
    { name: "Finalizado" },
    { name: "Cancelado" },
  ]);

  const [estadoSelected, setEstadoSelected] = React.useState("");
  const [resetEstado, setResetEstado] = React.useState(true);

  const handleClickOpenDialog = (scrollType, data) => () => {
    setOpenDialog(true);
    setScroll(scrollType);

    setselectedOrder(data);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const { mutate, isLoading } = useMutation(updateOrder, {
    onSuccess: (data) => {
      refetch();
      handleCloseDialog();
    },
    onError: (error) => {
      setErrors(error.response.data);
    },
    onSettled: () => {
      queryClient.invalidateQueries("orders/updateOrder");
    },
  });

  const onSubmit = (estado, id) => {
    mutate({ estado, id });
  };

  if (isLoadingStart) {
    return <Loader centered />;
  } else {
    return (
      <div>
        <div className={styles.details}>
          <div className={styles.recentOrders}>
            <div className={styles.cardHeader}>
              <h2>Todas las ordenes</h2>
            </div>

            {orders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <td>Nombre</td>
                    <td>Precio</td>
                    <td>Pago</td>
                    <td>Estado</td>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr onClick={handleClickOpenDialog("paper", order)}>
                      <td>
                        {order.name} {order.lastname}{" "}
                      </td>
                      <td>S/{order.subtotal + order.envioCosto}</td>
                      <td>{order.pagoMetodo}</td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            styles[order.estado.toLowerCase().replace(/ /g, "")]
                          }`}
                        >
                          {order.estado.charAt(0).toUpperCase() +
                            order.estado.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
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
                <div className="flex flex-col">
                  <span>{selectedOrder.name || ""}</span>
                </div>

                <Button onClick={handleCloseDialog}>
                  <CancelIcon style={{ color: "grey" }} />
                </Button>
              </div>
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
              <div className="flex flex-col mb-4">
                <span>Dirección: {selectedOrder.address}</span>
                <span>Telefono: {selectedOrder.phone}</span>
                <span>
                  Pago: {selectedOrder.pagoMetodo} -{">"} (
                  {selectedOrder.pagoCodigo})
                </span>
                <span>Costo productos: S/{selectedOrder.subtotal}</span>
                <span>
                  Costo envío: S/{selectedOrder.envioCosto} (
                  {selectedOrder.envioMetodo})
                </span>
                <span>
                  Total: S/{selectedOrder.subtotal + selectedOrder.envioCosto}
                </span>
              </div>
              <div className="flex flex-wrap ">
                {selectedOrder &&
                  selectedOrder.productosdb.map((item) => (
                    <div className="flex gap-2">
                      <div className={styles.imageCartBx}>
                        <img
                          src={item.url}
                          alt=""
                          className={styles.imageDashboard}
                        />
                      </div>
                      <div className="flex flex-col text-sm gap-1">
                        <span>
                          {item.name} ({item.variante})
                        </span>
                        <div className="flex gap-1">
                          {item.descuento && (
                            <>
                              <span>
                                <strong>
                                  S/
                                  {item.precio - item.descuento}
                                </strong>
                              </span>
                            </>
                          )}
                        </div>

                        {item.descuento && (
                          <div className="flex">
                            <LocalOfferIcon fontSize="small" color="primary" />
                            <Typography
                              variant="body2"
                              color="primary"
                              gutterBottom
                              component="span"
                              sx={{ margin: 0 }}
                            >
                              <strong>-{item.precio / item.descuento}%</strong>
                            </Typography>
                          </div>
                        )}
                      </div>
                      <div className="">
                        <div className="flex items-center">
                          <span>x{item.cantidad}</span>
                        </div>
                      </div>
                      <div className="">
                        <div className="flex items-center">
                          <span>
                            S/{item.cantidad * (item.precio - item.descuento)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Container fixed>
                <div className="flex gap-6 justify-between">
                  <div className="flex gap-6 border items-center px-2">
                    {selectedOrder && (
                      <span
                        className={`${styles.status} ${
                          styles[
                            selectedOrder.estado.toLowerCase().replace(/ /g, "")
                          ]
                        }`}
                      >
                        {selectedOrder.estado.charAt(0).toUpperCase() +
                          selectedOrder.estado.slice(1)}
                      </span>
                    )}
                  </div>
                  <CheckProduct
                    options={estados}
                    setProductoSelected={setEstadoSelected}
                    label={"Estado pedido"}
                    reset={resetEstado}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="contained"
                      onClick={() => onSubmit(estadoSelected, selectedOrder.id)}
                      disabled={isLoading}
                      startIcon={
                        isLoading ? (
                          <CircularProgress color="inherit" size={25} />
                        ) : null
                      }
                    >
                      Actualizar
                    </Button>
                  </div>
                </div>
              </Container>
            </DialogActions>
          </Dialog>

          <div className={styles.recentCustomers}>
            <div className={styles.cardHeader}>
              <h2>Últimos Clientes</h2>
            </div>
            <table>
              <tbody>
                {orders.map((order) => (
                  <tr>
                    <td width="60px">
                      <div className={styles.imgBx}>
                        <Avatar className={styles.avatar}>
                          {order.name[0].toUpperCase()}
                          {order.lastname[0].toUpperCase()}
                        </Avatar>
                      </div>
                    </td>
                    <td>
                      <h4>{order.name}</h4>
                      <span>{order.zona}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

index.getLayout = function getLayout(index) {
  return <HomeLayout>{index}</HomeLayout>;
};

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getUserSession"], () => getUserSession());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
}
