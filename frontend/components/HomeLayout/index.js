import React, { useState } from "react";
import styles from "./home.module.css";
import Head from "next/head";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setSelected, setActive } from "../../redux/home";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function layout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { clearSessionData } = useAuth();

  const { user } = useSelector((state) => state.userReducer.user);
  const selected = useSelector((state) => state.homeReducer.selected);
  const isActive = useSelector((state) => state.homeReducer.active);

  const matchesMedium = useMediaQuery("(max-width:900px)");

  function changeSelected(selection) {
    if (matchesMedium) {
      dispatch(setActive(!isActive));
    } else {
      if (!isActive) {
        dispatch(setActive(true));
      }
    }

    dispatch(setSelected(selection));
    router.push(`/home/${selection}`);
  }

  return (
    <div>
      <Head>
        <title>
          {user.store.name[0].toUpperCase() + user.store.name.substring(1)}{" "}
          Tienda
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></script>
        <script
          nomodule
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
        ></script>
      </Head>
      <div className={styles.all}>
        <div className={styles.body}>
          <div className={styles.container}>
            <div
              className={`${styles.navigation} ${
                isActive ? styles.active : ""
              }`}
            >
              <ul>
                <li>
                  <a href="#">
                    <span className={styles.icon}>
                      <ion-icon name="storefront-outline"></ion-icon>
                    </span>
                    <span className={styles.title}>
                      {user.store.name || ""}
                    </span>
                  </a>
                </li>
                <li
                  className={selected === "dashboard" ? styles.hovered : ""}
                  onClick={() => changeSelected("dashboard")}
                >
                  <a href="#">
                    <span className={styles.icon}>
                      <ion-icon name="home-outline"></ion-icon>
                    </span>
                    <span className={styles.title}>Dashboard</span>
                  </a>
                </li>
                <li
                  className={selected === "personalizar" ? styles.hovered : ""}
                  onClick={() => changeSelected("personalizar")}
                >
                  <a href="#">
                    <span className={styles.icon}>
                      <ion-icon name="pencil-outline"></ion-icon>
                    </span>
                    <span className={styles.title}>Personalizar</span>
                  </a>
                </li>

                <li
                  className={selected === "categorias" ? styles.hovered : ""}
                  onClick={() => changeSelected("categorias")}
                >
                  <a href="#">
                    <span className={styles.icon}>
                      <ion-icon name="bookmarks-outline"></ion-icon>
                    </span>
                    <span className={styles.title}>Categorías</span>
                  </a>
                </li>

                <li
                  className={selected === "productos" ? styles.hovered : ""}
                  onClick={() => changeSelected("productos")}
                >
                  <a href="#">
                    <span className={styles.icon}>
                      <ion-icon name="bag-outline"></ion-icon>
                    </span>
                    <span className={styles.title}>Productos</span>
                  </a>
                </li>

                <li
                  className={selected === "cobro" ? styles.hovered : ""}
                  onClick={() => changeSelected("cobro")}
                >
                  <a href="#">
                    <span className={styles.icon}>
                      <ion-icon name="card-outline"></ion-icon>
                    </span>
                    <span className={styles.title}>Cobro</span>
                  </a>
                </li>

                <li
                  className={selected === "envio" ? styles.hovered : ""}
                  onClick={() => changeSelected("envio")}
                >
                  <a href="#">
                    <span className={styles.icon}>
                      <ion-icon name="car-outline"></ion-icon>
                    </span>
                    <span className={styles.title}>Envío</span>
                  </a>
                </li>

                <li
                  className={selected === "ordenes" ? styles.hovered : ""}
                  onClick={() => changeSelected("ordenes")}
                >
                  <a href="#">
                    <span className={styles.icon}>
                      <ion-icon name="calendar-outline"></ion-icon>
                    </span>
                    <span className={styles.title}>Ordenes</span>
                  </a>
                </li>

                <li
                  className={selected === "logout" ? styles.hovered : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    clearSessionData();
                    setSelected("logout");
                    router.push("/");
                  }}
                >
                  <a href="#">
                    <span className={styles.icon}>
                      <ion-icon name="log-out-outline"></ion-icon>
                    </span>
                    <span className={styles.title}>Cerrar sesión</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className={`${styles.main} ${isActive ? styles.active : ""}`}>
              <div className={styles.topbar}>
                <div
                  className={styles.toggle}
                  onClick={() => dispatch(setActive(!isActive))}
                >
                  <ion-icon name="menu-outline"></ion-icon>
                </div>
                <div className={styles.search}>
                  <label>
                    <input type="text" placeholder="Buscar..." />
                  </label>
                </div>
                <div className={styles.user}>
                  <Avatar className={styles.avatar}>
                    {`${user.name[0]}${user.lastname[0]}` || ""}
                  </Avatar>
                </div>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
