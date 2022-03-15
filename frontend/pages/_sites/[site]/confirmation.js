import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Container, TextField } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

function confirmation() {
  const { subtotal, costo, cobro, envio, idCart, mailBuyer } = useSelector(
    (state) => state.cartReducer
  );

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
          <div className="flex flex-col gap-3">
            <div className="text-2xl font-bold my-5">Tu pedido</div>
            <div className="flex gap-4 flex-col lg:flex-row bg-gray-100">
              <div className="w-full lg:w-2/3 bg-gray-100 flex flex-col rounded-md gap-4 mb-0 lg:mb-6">
                <div className="bg-white rounded-md">
                  <div className="text-xl font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    Orden Generada
                  </div>
                  <div
                    className="px-3 pb-4 flex flex-col gap-3"
                    style={{ height: "auto" }}
                  >
                    Tu orden ha sido generada, hemos enviado el resumen de la
                    compra a su correo:
                    <strong>{mailBuyer}</strong> Cualquier consulta adicional no
                    dude consultarnos a través de nuestros canales.
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

export default confirmation;

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

  return {
    props: {
      site,
    },
    revalidate: 1,
  };
}
