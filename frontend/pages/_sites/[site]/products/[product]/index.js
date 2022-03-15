import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Container,
  IconButton,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styles from "./index.module.css";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

function product({ dataStore, siteStore }) {
  const [selectedValue, setSelectedValue] = React.useState("a");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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
          <Link href="/">
            <div className="flex cursor-pointer p-3 gap-3 items-center">
              <ArrowBackIcon />
              <span className="text-base font-medium">Volver</span>
            </div>
          </Link>
        </div>
        <Container fixed>
          <div className="bg-white rounded-md h-full">
            <div className="text-xl font-bold my-5 border-b py-5 px-3 border-gray-300">
              Pizza Seleccionada
            </div>
            <div className="flex flex-col lg:flex-row mb-5">
              <div className="lg:w-1/2 mb-6 flex flex-col justify-center items-center lg:mt-16">
                <img
                  src="https://images.rappi.pe/products/687773-1645573519943.png?d=128x104&?d=1200xundefined&e=webp"
                  alt=""
                  className={styles.image}
                />
                <div className="flex gap-4 mt-4">
                  <span>S/19.90</span>
                  <strike>S/25.90</strike>
                </div>

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
                      <strong>-52%</strong>
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 lg:pr-14 lg:flex lg:flex-col lg:justify-center">
                <div className="flex flex-col gap-1 my-2 px-4">
                  <div className="flex justify-between ">
                    <span className="text-lg">Elige el Sabor de tu Pizza</span>
                    <div>
                      <div className="bg-gray-400 text-xs px-2 py-2 m-0 text-white flex justify-center items-center rounded-xl">
                        Obligatorio
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 items-center border-b border-gray-200 py-2">
                    <span className="text-md">Pizza Crispy Chicken Grande</span>
                    <div>
                      <Radio
                        checked={selectedValue === "b"}
                        onChange={handleChange}
                        value="b"
                        name="radio-buttons"
                        inputProps={{ "aria-label": "B" }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 py-2">
                    <span className="text-md">Pizza Española Grande</span>
                    <div>
                      <Radio
                        checked={selectedValue === "c"}
                        onChange={handleChange}
                        value="c"
                        name="radio-buttons"
                        inputProps={{ "aria-label": "C" }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 py-2">
                    <span className="text-md">Pizza Americana Grande</span>
                    <div>
                      <Radio
                        checked={selectedValue === "d"}
                        onChange={handleChange}
                        value="d"
                        name="radio-buttons"
                        inputProps={{ "aria-label": "d" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between px-4 my-5">
                  <div className="flex gap-6 border items-center px-2">
                    <DeleteOutlineIcon />
                    <span>1</span>
                    <AddIcon />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="contained">Agregar</Button>
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

export default product;

export function getStaticPaths() {
  const stores = [{ storeName: "rumbero" }, { storeName: "emprendeadvisor" }];
  const filteredStores = stores;

  // build paths for each of the sites in the previous two lists
  const paths = [
    { params: { site: "rumbero", product: "rumbero" } },
    { params: { site: "rumbero", product: "rumbero2" } },
    { params: { site: "emprendeadvisor", product: "emprendeadvisor" } },
  ];

  return {
    paths: paths,
    fallback: "blocking", // fallback true allows sites to be generated using ISR
  };
}

export async function getStaticProps({ params: { site, product } }) {
  const stores = {
    rumbero: {
      id: 1,
      storeName: "rumbero",
      name: "Renato",
      lastname: "Garay",
      mail: "renatogaraym@gmail.com",
      password: "1234",
    },
    emprendeadvisor: {
      id: 1,
      storeName: "emprendeadvisor",
      name: "Asis",
      lastname: "Miranda",
      mail: "emprendeadvisor@gmail.com",
      password: "1234",
    },
    rumbero2: {
      id: 1,
      storeName: "rumbero2",
      name: "Renato",
      lastname: "Garay",
      mail: "renatogaraym@gmail.com",
      password: "1234",
    },
  };

  const productAux = stores[product];
  const siteAux = stores[site];

  if (!productAux) {
    return {
      redirect: {
        destination: "/", //"https://enelmarket.com/"
        permanent: false,
      },
    };
  }

  return {
    props: {
      dataStore: productAux,
      siteStore: siteAux,
    },
    revalidate: 1, // set revalidate interval of 5s
  };
}
