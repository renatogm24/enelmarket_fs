import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Loader from "../../../../components/Loader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import HomeLayout from "../../../../components/HomeLayout";
import { Button, Container, TextField } from "@mui/material";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import axios from "../../../../lib/clientProvider/axiosConfig";
import { CircularProgress } from "@mui/material";
import Categories from "../../../../components/Categories";
import { FormInputText } from "../../../../components/FormInputText";
import CheckboxesTags from "../../../../components/CheckboxesTags";
import CheckProduct from "../../../../components/CheckProduct";
import CreateVariant from "../../../../components/CreateVariant";
import CreateVariantDin from "../../../../components/CreateVariantDin";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const addCategory = async (data) => {
  const formData = new FormData();
  formData.append("image", data.fotosrc);

  delete data.fotosrc;
  delete data.foto;

  formData.append("producto", JSON.stringify(data));

  const { data: response } = await axios({
    method: "post",
    url: "/productos/addProducto",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const deleteProducto = async (data) => {
  const { data: response } = await axios.get("/productos/deleteProducto", {
    params: {
      id: data,
    },
  });
  return response;
};

const getCategories = async () => {
  const { data } = await axios.get("/categories");
  return data;
};

const getProductos = async () => {
  const { data } = await axios.get("/productos/all");
  return data;
};

const updateCategories = async (data) => {
  const { data: response } = await axios.post(
    "/categories/updateCategories",
    data
  );
  return response;
};

function cartesian(...args) {
  var r = [],
    max = args.length - 1;
  function helper(arr, i) {
    for (var j = 0, l = args[i].length; j < l; j++) {
      var a = arr.slice(0); // clone arr
      a.push(args[i][j]);
      if (i == max) r.push(a);
      else helper(a, i + 1);
    }
  }
  helper([], 0);
  return r;
}

export default function index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoadingFirst, setIsLoadingFirst] = useState(true);

  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const { handleSubmit, control, reset, register, getValues, setValue } =
    useForm({
      defaultValues: {
        name: "",
        precio: "",
        descuento: "",
      },
    });

  const [cards, setCards] = useState([]);

  const [errorCategories, setErrorCategories] = useState("");

  const [options, setOptions] = React.useState({});

  const [categoriesSelected, setCategoriesSelected] = React.useState({});

  const [combinatories, setCombinatories] = React.useState([]);

  const [productos, setProductos] = React.useState([]);

  const [productoSelected, setProductoSelected] = React.useState("");

  const [resetOptions, setResetOptions] = React.useState("");

  useEffect(() => {
    let optionsArrays = [];
    for (const keyOption of Object.keys(options)) {
      optionsArrays.push(options[keyOption]);
    }
    if (optionsArrays.length > 0) {
      let result = cartesian(...optionsArrays);
      setCombinatories(result);
    }
  }, [options]);

  useQuery("categories", getCategories, {
    onSuccess: (data) => {
      setCards(data);
    },
  });

  useQuery("productos", getProductos, {
    onSuccess: (data) => {
      setProductos(data);
    },
  });

  const { mutate, isLoading } = useMutation(addCategory, {
    onSuccess: (data) => {
      setCards(cards.concat(data));
      reset();
      setCombinatories([]);
      setCategoriesSelected(null);
      setOptions({});
      setResetOptions(!resetOptions);
      setValue("id", "");
      setProductoSelected("");
    },
    onError: (error) => {
      setErrors(error.response.data);
    },
    onSettled: () => {
      queryClient.invalidateQueries("categories/addCategory");
    },
  });

  const { mutate: mutateDelete, isLoading: isLoadingDeleted } = useMutation(
    deleteProducto,
    {
      onSuccess: (data) => {
        window.location.reload(false);
      },
      onError: (error) => {
        setErrors(error.response.data);
      },
      onSettled: () => {
        queryClient.invalidateQueries("productos/deleteProduct");
      },
    }
  );

  useEffect(() => {
    if (productoSelected) {
      const newObj = {};
      for (const variante of productoSelected.variants) {
        newObj[variante.name] = variante.optionsVar.map((elem) => elem.name);
      }
      setOptions(newObj);
      setValue("name", productoSelected.name);
      setValue("precio", productoSelected.precio);
      setValue("descuento", productoSelected.descuento);
      setValue("id", productoSelected.id);
    }

    if (productoSelected == null) {
      window.location.reload(false);
    }
    setCategoriesSelected(productoSelected.categories);
  }, [productoSelected]);

  const onSubmit = (data, options, categoriesSelected, combinatories) => {
    let categoriesForm = [];
    for (const catAux of categoriesSelected) {
      categoriesForm.push(catAux.id);
    }

    data["categoriesForm"] = categoriesForm;

    let variants = Object.keys(options);
    let variantsOptions = Object.values(options);

    data["variantsForm"] = variants;
    data["variantsOptions"] = variantsOptions;

    let variantsCombinatories = [];

    for (let index = 0; index < combinatories.length; index++) {
      const element = combinatories[index];
      variantsCombinatories.push([element.join(""), data[`variante${index}`]]);
    }

    data["variantsCombinatories"] = variantsCombinatories;
    data["fotosrc"] = data.foto[0];

    const result = {
      ...data,
    };

    mutate(result);
  };

  const onSubmitDelete = ({ id }) => {
    mutateDelete(id);
  };

  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } = useMutation(
    updateCategories,
    {
      onSuccess: (data) => {},
      onError: (error) => {
        setErrorsUpdate(error.response.data);
      },
      onSettled: () => {
        queryClient.invalidateQueries("categories/updateCategories");
      },
    }
  );

  const onSubmitUpdate = (data) => {
    let index = 1;
    data.forEach((element) => {
      element.orderCat = index;
      index++;
    });

    mutateUpdate(data);
  };

  useEffect(() => {
    const isUserAuth = isAuthenticated();
    if (!isUserAuth) {
      router.push("/");
    }
    setIsLoadingFirst(false);
  }, []);

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
                    Productos
                  </div>
                  <div className="text-base font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    <div className="mb-3">Modificar producto</div>
                    <CheckProduct
                      options={productos}
                      setProductoSelected={setProductoSelected}
                      label={"Productos"}
                    />
                  </div>
                  <div className="text-base font-bold my-5 border-b pb-5 px-3 border-gray-300 text-center">
                    {productoSelected ? "Editar" : "Agregar"} nuevo Producto
                  </div>
                  <div
                    className="px-3 pb-4 flex flex-col gap-3"
                    style={{ height: "auto" }}
                  >
                    <form className="flex flex-col gap-3">
                      <span className="">Foto:</span>
                      <div className="w-full border border-gray-400 p-3 rounded flex flex-col">
                        <input {...register("foto")} type="file" name="foto" />
                      </div>

                      <input
                        {...register("id")}
                        type="hidden"
                        name="id"
                        value=""
                        placeholder="id"
                      />

                      <div className="w-full border border-gray-400 p-3 rounded flex flex-col">
                        <input
                          {...register("name", { required: true })}
                          type="text"
                          name="name"
                          placeholder="Nombre Producto"
                          className="outline-none"
                        />
                      </div>

                      <div className="w-full border border-gray-400 p-3 rounded flex flex-col">
                        <input
                          {...register("precio")}
                          type="text"
                          name="precio"
                          placeholder="Precio"
                          className="outline-none"
                        />
                      </div>

                      <div className="w-full border border-gray-400 p-3 rounded flex flex-col">
                        <input
                          {...register("descuento")}
                          type="text"
                          name="descuento"
                          placeholder="Descuento"
                          className="outline-none"
                        />
                      </div>

                      <CheckboxesTags
                        options={cards}
                        setCategoriesSelected={setCategoriesSelected}
                        reset={resetOptions}
                        selected={categoriesSelected}
                      />

                      <CreateVariant
                        options={options}
                        setOptions={setOptions}
                        reset={resetOptions}
                        selected={options}
                      />

                      {Object.keys(options).length > 0 ? (
                        <div className="w-full border border-gray-400 py-3 px-5 rounded flex flex-col gap-5">
                          {Object.keys(options).map((keyOption) => (
                            <CreateVariantDin
                              options={options}
                              setOptions={setOptions}
                              keyOption={keyOption}
                            />
                          ))}
                        </div>
                      ) : (
                        ""
                      )}

                      {combinatories.length > 0 ? (
                        <div className="w-full border border-gray-400 py-3 px-5 rounded flex flex-col gap-5">
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ width: "100%" }}
                              aria-label="simple table"
                            >
                              <TableHead>
                                <TableRow>
                                  {Object.keys(options).map((keyOption) => (
                                    <TableCell>{keyOption}</TableCell>
                                  ))}
                                  <TableCell>Precio</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {combinatories.map((option, index) => (
                                  <TableRow
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}
                                  >
                                    {option.map((keyOption) => (
                                      <TableCell>{keyOption}</TableCell>
                                    ))}
                                    <TableCell>
                                      <input
                                        {...register(`variante${index}`, {
                                          required: true,
                                        })}
                                        type="text"
                                        defaultValue={
                                          productoSelected &&
                                          index <
                                            productoSelected.combinatories
                                              .length
                                            ? productoSelected.combinatories[
                                                index
                                              ].precio
                                            : ""
                                        }
                                        placeholder="Completar..."
                                        style={{
                                          border: "1px solid rgba(0,0,0,0.3)",
                                          borderRadius: "10px",
                                          padding: "2px 5px",
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      ) : (
                        ""
                      )}

                      {productoSelected && (
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
                          Eliminar producto
                        </Button>
                      )}

                      <Button
                        color="primary"
                        onClick={handleSubmit((data) =>
                          onSubmit(
                            data,
                            options,
                            categoriesSelected,
                            combinatories
                          )
                        )}
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
                        {productoSelected
                          ? "Editar producto"
                          : "Agregar producto"}
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
