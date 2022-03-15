import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { tabsClasses } from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import * as React from "react";
import Loader from "../../components/Loader";
import styles from "./index.module.css";
import { upperFirst, lowerCase } from "lodash";
import CustomizedBadges from "../../components/CustomizedBadges";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "react-responsive-modal/styles.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import Radio from "@mui/material/Radio";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "../../redux/counter";
import { addToCart, addToItemCart, deleteFromCart } from "../../redux/cart";
import { persistor } from "../../redux/store";
import { useQuery, QueryClient, dehydrate } from "react-query";
import axios from "../../lib/clientProvider/axiosConfig";
import RemoveIcon from "@mui/icons-material/Remove";

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

const getStores = async (storeName) => {
  const { data } = await axios.get("/store", {
    params: {
      name: storeName,
    },
  });
  return data;
};

export default function Index({ children }) {
  const { cart, subtotal } = useSelector((state) => state.cartReducer);

  const router = useRouter();
  const site = router.query.site;
  const order = router.query.categoria;

  const [categories, setCategories] = React.useState([]);

  const {
    isSuccess,
    data: dataStore,
    isLoading,
    isError,
  } = useQuery(["getStore", site], () => getStores(site), {
    onSuccess: (data) => {
      setCategories(data.categories.sort(dynamicSort("orderCat")));
    },
  });

  if (!isLoading && !dataStore) {
    router.push("http://localhost:3000/");
  }

  const { total } = useSelector((state) => state.counterReducer);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //const router = useRouter();

  const purge = async () => {
    await persistor.purge();
    router.reload(window.location.pathname);
  };

  let matches = "";

  const matchesSmall = useMediaQuery("(max-width:600px)");
  const matchesMedium = useMediaQuery("(max-width:900px)");
  const matchesLarge = useMediaQuery("(max-width:1200px)");
  //const matchesXLarge = useMediaQuery("(min-width:1200px)");

  if (matchesSmall) {
    matches = "100%";
  } else if (matchesMedium) {
    matches = "60%";
  } else if (matchesLarge) {
    matches = "40%";
  } else {
    matches = "30%";
  }

  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: matches,
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "15px",
    boxShadow: 24,
    p: 4,
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    height: "auto",
    borderRadius: "15px",
    color: theme.palette.text.secondary,
  }));

  const StyledTabs = styled((props) => (
    <Tabs
      {...props}
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
    />
  ))({
    "& .MuiTabs-indicator": {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    "& .MuiTabs-indicatorSpan": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "##29d884",
    },
  });

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: "none",
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      color: "rgba(0, 0, 0, 0.7)",
      border: "1px solid rgba(0, 0, 0, 0.3)",
      borderRadius: "10px",
      "&.Mui-selected": {
        color: "#29d884",
        backgroundColor: "#e9fcf2",
        border: "1px solid #29d884",
      },
      "&.Mui-focusVisible": {
        backgroundColor: "#29d884",
      },
    })
  );

  //Setea producto en el dialogo

  const [selectedProduct, setSelectedProduct] = React.useState({});

  const [selectedValue, setSelectedValue] = React.useState({});

  const [selectedCombinatorie, setSelectedCombinatorie] = React.useState({});

  const [existCombinatorie, setExistCombinatorie] = React.useState("");

  const [countDialog, setCountDialog] = React.useState(1);

  const handleChange = (event) => {
    let selectedValueCp = { ...selectedValue };
    let valueArr = event.target.value.split("*****");
    selectedValueCp[valueArr[0]] = valueArr[1];

    let combText = "";
    let combTextSlash = "";
    for (const item in selectedValueCp) {
      combText += selectedValueCp[item];
      combTextSlash += selectedValueCp[item] + "/";
    }

    let selectedCombinatorieCp = { ...selectedCombinatorie };
    selectedCombinatorieCp["combText"] = combText;
    selectedCombinatorieCp["combTextSlash"] = combTextSlash;

    if (selectedProduct.variants.length > 0) {
      const filteredVariants = selectedProduct.combinatories.filter(
        (x) => x.name == combText
      );
      if (filteredVariants.length > 0) {
        setExistCombinatorie(filteredVariants[0].precio);
      } else {
        setExistCombinatorie("--");
      }
    } else {
      setExistCombinatorie(selectedProduct.precio);
    }

    setSelectedCombinatorie(selectedCombinatorieCp);

    setSelectedValue(selectedValueCp);
  };

  let content = null;

  const [value, setValue] = React.useState(0);

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
    router.push(`/categorias/${newValue + 1}`);
  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const handleClickOpenDialog = (scrollType, data) => () => {
    setCountDialog(1);
    setOpenDialog(true);
    setScroll(scrollType);
    setSelectedProduct(data);

    let selectedValueCp = { ...selectedValue };

    for (const variant of data.variants) {
      selectedValueCp[variant.name] = "";
    }

    if (data.variants.length > 0) {
      setExistCombinatorie("--");
    } else {
      setExistCombinatorie(data.precio);
    }

    setSelectedValue(selectedValueCp);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [openDialogCart, setOpenDialogCart] = React.useState(false);

  const handleClickOpenDialogCart = (scrollType) => () => {
    setOpenDialogCart(true);
    setScroll(scrollType);
  };

  const handleCloseDialogCart = () => {
    setOpenDialogCart(false);
  };

  if (!dataStore) {
    content = <Loader centered />;
  } else {
    content = (
      <div>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <title>{upperFirst(lowerCase(site))}</title>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Head>
        <div
          className="w-full h-28 bg-no-repeat bg-center bg-cover m-0 p-0 mb-24"
          style={{
            backgroundImage: `url(${dataStore.portada_img?.url || ""})`,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backgroundBlendMode: "darken",
          }}
        >
          <Container fixed>
            <div className="relative top-12 flex">
              <div className={styles.hero_media}>
                <img
                  src={dataStore.logo_img?.url || ""}
                  alt=""
                  className={styles.image}
                />
              </div>
              <div className="flex flex-grow flex-col justify-end ml-5 pb-5 text-2xl">
                {upperFirst(lowerCase(dataStore.name))}
              </div>
              <div className="flex flex-grow justify-end place-items-end pb-2">
                <IconButton
                  onClick={handleClickOpenDialogCart("paper")}
                  aria-label="cart"
                >
                  <CustomizedBadges value={cart.length} />
                </IconButton>
              </div>
            </div>
          </Container>
        </div>
        <Container fixed sx={{ mb: "20px", mt: "100px" }}>
          <Box sx={{ flexGrow: 1, maxWidth: "100%", bgcolor: "#ffffff" }}>
            <StyledTabs
              value={order - 1}
              onChange={handleChange2}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="visible arrows tabs example"
              sx={{
                [`& .${tabsClasses.scrollButtons}`]: {
                  "&.Mui-disabled": { opacity: 1 },
                },
              }}
            >
              {categories.map((category) => (
                <StyledTab label={category.name} />
              ))}
            </StyledTabs>
          </Box>
        </Container>

        <Container fixed>{children}</Container>

        <Dialog
          open={openDialogCart}
          onClose={handleCloseDialogCart}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
        >
          <DialogTitle id="scroll-dialog-title">
            <div className="flex justify-between">
              <span>Tu carrito</span>
              <Button onClick={handleCloseDialogCart}>
                <CancelIcon style={{ color: "grey" }} />
              </Button>
            </div>
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <div className="flex flex-col gap-3">
              {cart.length === 0 ? (
                <>
                  <div className="flex justify-center">
                    <img
                      src="/undraw_empty_cart_co35.png"
                      alt=""
                      style={{ width: "50%" }}
                    />
                  </div>
                </>
              ) : (
                ""
              )}

              {cart.map((item) => (
                <div className="flex gap-2">
                  <div className={styles.imageCartBx}>
                    <img
                      src={item.producto.producto_img.url}
                      alt=""
                      className={styles.image}
                    />
                  </div>
                  <div className="flex-grow flex flex-col text-sm gap-1">
                    <span>
                      {item.producto.name}
                      {item.combinatoria.combTextSlash
                        ? ` (${item.combinatoria.combTextSlash.slice(0, -1)})`
                        : ""}
                    </span>
                    <div className="flex gap-1">
                      {item.producto.descuento && (
                        <>
                          <span>
                            <strong>
                              S/
                              {Object.keys(item.combinatoria).length === 0
                                ? ((item.producto.precio *
                                    (100 - item.producto.descuento)) /
                                    100) *
                                  item.cantidad
                                : ((item.producto.combinatories.filter(
                                    (x) => x.name == item.combinatoria.combText
                                  )[0].precio *
                                    (100 - item.producto.descuento)) /
                                    100) *
                                  item.cantidad}
                            </strong>
                          </span>
                          <span>
                            <strike>
                              S/
                              {Object.keys(item.combinatoria).length === 0
                                ? item.producto.precio * item.cantidad
                                : item.producto.combinatories.filter(
                                    (x) => x.name == item.combinatoria.combText
                                  )[0].precio * item.cantidad}
                            </strike>
                          </span>
                        </>
                      )}

                      {!item.producto.descuento && (
                        <>
                          <span>
                            <strong>
                              S/
                              {item.combinatoria == {}
                                ? item.producto.precio * item.cantidad
                                : item.producto.combinatories.filter(
                                    (x) => x.name == item.combinatoria.combText
                                  )[0].precio * item.cantidad}
                            </strong>
                          </span>
                        </>
                      )}
                    </div>

                    {item.producto.descuento && (
                      <div className="flex">
                        <LocalOfferIcon fontSize="small" color="primary" />
                        <Typography
                          variant="body2"
                          color="primary"
                          gutterBottom
                          component="span"
                          sx={{ margin: 0 }}
                        >
                          <strong>-{item.producto.descuento}%</strong>
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div className="">
                    <div className="flex gap-0 border items-center">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => dispatch(deleteFromCart(item))}
                      >
                        {item.cantidad == 1 ? (
                          <DeleteOutlineIcon />
                        ) : (
                          <RemoveIcon />
                        )}
                      </IconButton>

                      <span>{item.cantidad}</span>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => dispatch(addToItemCart(item))}
                      >
                        <AddIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Container fixed>
              <div className="flex gap-2 justify-between items-center">
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => purge()}
                  disabled={subtotal == 0}
                >
                  <DeleteOutlineIcon />
                </IconButton>
                <div className="flex gap-2 flex-grow">
                  <Link href="/order">
                    <Button
                      variant="contained"
                      sx={{ width: "100%", textTransform: "none" }}
                      disabled={subtotal == 0}
                    >
                      <div className="flex justify-between w-full">
                        <span>Continuar</span>
                        <span>Subtotal: S/{subtotal}</span>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </Container>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return content;
}
