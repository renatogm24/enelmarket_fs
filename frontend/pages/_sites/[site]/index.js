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
import Loader from "../../../components/Loader";
import styles from "./index.module.css";
import { upperFirst, lowerCase } from "lodash";
import CustomizedBadges from "../../../components/CustomizedBadges";
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
import { decrement, increment } from "../../../redux/counter";
import { persistor } from "../../../redux/store";
import { useQuery, QueryClient, dehydrate } from "react-query";
import axios from "../../../lib/clientProvider/axiosConfig";
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

const getStore = async (storeName) => {
  const { data } = await axios.get("/store", {
    params: {
      name: storeName,
    },
  });
  return data;
};

export default function Index() {
  const router = useRouter();
  const site = router.query.site;

  const [categories, setCategories] = React.useState([]);

  const {
    isSuccess,
    data: dataStore,
    isLoading,
    isError,
  } = useQuery(["getStore", site], () => getStore(site), {
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
          <title>{upperFirst(lowerCase(dataStore.name))}</title>
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
                  <CustomizedBadges />
                </IconButton>
              </div>
            </div>
          </Container>
        </div>
        <Container fixed sx={{ mb: "20px", mt: "100px" }}>
          <Box sx={{ flexGrow: 1, maxWidth: "100%", bgcolor: "#ffffff" }}>
            <StyledTabs
              value={value}
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

        <Container fixed>
          <Typography variant="h6" gutterBottom component="div">
            Descuentos
          </Typography>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {dataStore.categories[0].productos.map((producto) => (
              <Grid item xs={6} sm={4} md={3} lg={2}>
                <Item>
                  <div className="flex flex-col h-72 justify-between">
                    <img
                      src={producto.producto_img.url}
                      alt=""
                      className={styles.imageGrid}
                    />
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                    >
                      {producto.name}
                    </Typography>

                    {!producto.descuento && (
                      <>
                        <Typography variant="body1" gutterBottom>
                          S/
                          {producto.variants.length > 0
                            ? producto.combinatories[0].precio
                            : producto.precio}
                        </Typography>

                        <div className="flex justify-end items-end px-2">
                          <div>
                            <IconButton
                              onClick={handleClickOpenDialog("paper", producto)}
                              aria-label="cart"
                            >
                              <AddCircleOutlineIcon
                                variant="body2"
                                color="success"
                              />
                            </IconButton>
                          </div>
                        </div>
                      </>
                    )}

                    {producto.descuento && (
                      <>
                        <Typography variant="body1" gutterBottom>
                          S/
                          {(producto.variants.length > 0
                            ? producto.combinatories[0].precio
                            : producto.precio) -
                            ((producto.variants.length > 0
                              ? producto.combinatories[0].precio
                              : producto.precio) *
                              producto.descuento) /
                              100}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strike>
                            S/
                            {producto.variants.length > 0
                              ? producto.combinatories[0].precio
                              : producto.precio}
                          </strike>
                        </Typography>
                        <div className="flex justify-between items-center px-2">
                          <div className="flex gap-1 items-center my-2">
                            <LocalOfferIcon variant="body2" color="primary" />
                            <Typography
                              variant="body2"
                              color="primary"
                              gutterBottom
                              component="span"
                              sx={{ margin: 0 }}
                            >
                              <strong>-{producto.descuento}%</strong>
                            </Typography>
                          </div>
                          <div>
                            <IconButton
                              onClick={handleClickOpenDialog("paper", producto)}
                              aria-label="cart"
                            >
                              <AddCircleOutlineIcon
                                variant="body2"
                                color="success"
                              />
                            </IconButton>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Container>

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
              <span>{selectedProduct.name || ""}</span>
              <Button onClick={handleCloseDialog}>
                <CancelIcon style={{ color: "grey" }} />
              </Button>
            </div>
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <div className="flex flex-col ">
              <div className="flex justify-center w-3/5 m-auto">
                <img
                  src={selectedProduct.producto_img?.url || ""}
                  alt=""
                  className={styles.image}
                />
              </div>
              <Container fixed>
                <div className="body1 flex gap-2 items-center mt-4">
                  {!selectedProduct.descuento && (
                    <>
                      <strong>
                        S/
                        {existCombinatorie !== "--"
                          ? existCombinatorie * countDialog
                          : "--"}
                      </strong>
                    </>
                  )}

                  {selectedProduct.descuento && (
                    <>
                      <strong>
                        S/
                        {existCombinatorie !== "--"
                          ? existCombinatorie * countDialog -
                            ((existCombinatorie * selectedProduct.descuento) /
                              100) *
                              countDialog
                          : "--"}{" "}
                      </strong>{" "}
                      <strike>
                        S/
                        {existCombinatorie !== "--"
                          ? existCombinatorie * countDialog
                          : "--"}
                      </strike>{" "}
                      <LocalOfferIcon variant="body2" color="primary" />
                      <Typography
                        variant="body2"
                        color="primary"
                        gutterBottom
                        component="span"
                        sx={{ margin: 0 }}
                      >
                        <strong>-{selectedProduct.descuento}%</strong>
                      </Typography>
                    </>
                  )}
                </div>

                {selectedProduct.variants?.map((variant) => (
                  <div className="flex flex-col gap-1 mt-2 mb-5">
                    <div className="flex justify-between ">
                      <span className="text-lg">Elija su {variant.name}</span>
                      <div>
                        <div className="bg-gray-400 text-xs px-2 py-2 m-0 text-white flex justify-center items-center rounded-xl">
                          Obligatorio
                        </div>
                      </div>
                    </div>

                    {variant.optionsVar.map((optionAux) => (
                      <div className="flex justify-between mt-2 items-center border-b border-gray-200 py-2">
                        <span className="text-md">{optionAux.name}</span>
                        <div>
                          <Radio
                            checked={
                              selectedValue[variant.name] === optionAux.name
                            }
                            onChange={handleChange}
                            value={`${variant.name}*****${optionAux.name}`}
                            name="radio-buttons"
                            inputProps={{ "aria-label": "B" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </Container>
            </div>
          </DialogContent>
          <DialogActions>
            <Container fixed>
              <div className="flex justify-between">
                <div className="flex gap-6 border items-center px-2">
                  {countDialog == 1 ? (
                    <DeleteOutlineIcon onClick={handleCloseDialog} />
                  ) : (
                    <RemoveIcon
                      onClick={() => setCountDialog(countDialog - 1)}
                    />
                  )}

                  <span>{countDialog}</span>
                  <AddIcon onClick={() => setCountDialog(countDialog + 1)} />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="contained"
                    disabled={existCombinatorie == "--"}
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            </Container>
          </DialogActions>
        </Dialog>

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
            <div className="flex flex-col">
              <div className="flex gap-2">
                <div className={styles.imageCartBx}>
                  <img
                    src="https://images.rappi.pe/products/687773-1645573519943.png?d=128x104&?d=1200xundefined&e=webp"
                    alt=""
                    className={styles.image}
                  />
                </div>
                <div className="flex-grow flex flex-col text-sm gap-1">
                  <span>Pizza Signature Seleccionada</span>
                  <div className="flex gap-1">
                    <span>
                      <strong>S/19.90</strong>
                    </span>
                    <span>
                      <strike>S/25.90</strike>
                    </span>
                  </div>
                  <div className="flex">
                    <LocalOfferIcon fontSize="small" color="primary" />
                    <Typography
                      variant="body2"
                      color="primary"
                      gutterBottom
                      component="span"
                      sx={{ margin: 0 }}
                    >
                      <strong>-52%</strong>
                    </Typography>
                  </div>
                </div>
                <div className="">
                  <div className="flex gap-0 border items-center">
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => dispatch(decrement())}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                    <span>1</span>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => dispatch(increment())}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Container fixed>
              <div className="flex gap-2 justify-between items-center">
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => purge()}
                >
                  <DeleteOutlineIcon />
                </IconButton>
                <div className="flex gap-2 flex-grow">
                  <Link href="/order">
                    <Button
                      variant="contained"
                      sx={{ width: "100%", textTransform: "none" }}
                    >
                      <div className="flex justify-between w-full">
                        <span>Continuar</span>
                        <span>Subtotal: {total}</span>
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

  await queryClient.prefetchQuery(["getStore", site], () => getStore(site));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
}
