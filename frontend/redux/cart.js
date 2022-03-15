import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  cart: [],
  subtotal: 0,
  costo: 0,
  pago: {},
  envio: {},
  idCart: "",
  mailBuyer: "",
};

function getSubtotal(items) {
  let newCosto = 0;
  let newSubtotal = 0;
  for (const item of items) {
    let itemprice = 0;
    let itemcosto = 0;
    if (Object.keys(item.combinatoria).length === 0) {
      itemprice =
        ((item.producto.precio * (100 - item.producto.descuento)) / 100) *
        item.cantidad;
      itemcosto = item.producto.precio * item.cantidad;
    } else {
      itemprice =
        ((item.producto.combinatories.filter(
          (x) => x.name === item.combinatoria.combText
        )[0].precio *
          (100 - item.producto.descuento)) /
          100) *
        item.cantidad;
      itemcosto =
        item.producto.combinatories.filter(
          (x) => x.name === item.combinatoria.combText
        )[0].precio * item.cantidad;
    }
    newSubtotal += itemprice;
    newCosto += itemcosto;
  }
  return [newSubtotal, newCosto];
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const copy = [...state.cart];
      const newItem = action.payload;
      let found = false;
      for (const item of copy) {
        if (
          item.producto.id == newItem.producto.id &&
          item.combinatoria.combText == newItem.combinatoria.combText
        ) {
          item.cantidad = item.cantidad + newItem.cantidad;
          found = true;
        }
      }

      if (!found) {
        copy.push(newItem);
      }

      const result = getSubtotal(copy);

      state.subtotal = result[0];
      state.costo = result[1];
      state.cart = copy;
    },
    addToItemCart: (state, action) => {
      const copy = [...state.cart];
      const itemToFind = action.payload;
      for (const item of copy) {
        if (
          item.producto.id == itemToFind.producto.id &&
          item.combinatoria.combText == itemToFind.combinatoria.combText
        ) {
          item.cantidad = item.cantidad + 1;
        }
      }

      const result = getSubtotal(copy);

      state.subtotal = result[0];
      state.costo = result[1];
      state.cart = copy;
    },
    deleteFromCart: (state, action) => {
      const copy = [...state.cart];
      const itemToFind = action.payload;
      let indexFound = "";
      let indexRunning = 0;
      for (const item of copy) {
        if (
          item.producto.id == itemToFind.producto.id &&
          item.combinatoria.combText == itemToFind.combinatoria.combText
        ) {
          if (item.cantidad == 1) {
            indexFound = indexRunning;
          } else {
            item.cantidad = item.cantidad - 1;
          }
        }
        indexRunning++;
      }

      if (indexFound !== "") {
        copy.splice(indexFound, 1);
      }

      const result = getSubtotal(copy);

      state.subtotal = result[0];
      state.costo = result[1];
      state.cart = copy;
    },
    setCobro: (state, action) => {
      state.cobro = action.payload;
    },
    setEnvio: (state, action) => {
      state.envio = action.payload;
    },
    setIdCart: (state, action) => {
      state.idCart = action.payload;
    },
    setMailBuyer: (state, action) => {
      state.mailBuyer = action.payload;
    },
    extraReducers: (builder) => {
      builder.addCase(PURGE, (state) => {
        customEntityAdapter.removeAll(state);
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToCart,
  addToItemCart,
  deleteFromCart,
  setCobro,
  setEnvio,
  setIdCart,
  setMailBuyer,
} = cartSlice.actions;

export default cartSlice.reducer;
