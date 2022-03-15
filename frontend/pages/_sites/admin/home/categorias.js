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

const addCategory = async (data) => {
  const { data: response } = await axios.post("/categories/addCategory", data);
  return response;
};

const getCategories = async () => {
  const { data } = await axios.get("/categories");
  return data;
};

const updateCategories = async (data) => {
  let newData = [];
  for (const cat of data) {
    newData.push([cat.id, cat.orderCat]);
  }

  const { data: response } = await axios.post(
    "/categories/updateCategories",
    newData
  );
  return response;
};

export default function index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoadingFirst, setIsLoadingFirst] = useState(true);

  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const [cards, setCards] = useState([]);

  const [errorCategories, setErrorCategories] = useState("");

  useQuery("categories", getCategories, {
    onSuccess: (data) => {
      setCards(data);
    },
  });

  const { mutate, isLoading } = useMutation(addCategory, {
    onSuccess: (data) => {
      setCards(cards.concat(data));
      reset();
    },
    onError: (error) => {
      setErrors(error.response.data);
    },
    onSettled: () => {
      queryClient.invalidateQueries("categories/addCategory");
    },
  });

  const onSubmit = (data) => {
    const category = {
      ...data,
    };
    mutate(category);
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
                    Categorías
                  </div>
                  <div className="text-base font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    Puedes agregar y modificar el orden en el que aparecen tus
                    categorias
                  </div>
                  <div
                    className="px-3 pb-4 flex flex-col gap-3"
                    style={{ height: "auto" }}
                  >
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <FormInputText
                        name={"name"}
                        control={control}
                        label={"Nueva categoría"}
                        errors={errors}
                      />

                      <Button
                        color="primary"
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
                        Agregar categoría
                      </Button>
                    </form>
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <span className="">Categorías:</span>

                      {errorCategories !== "" ? (
                        <span className="text-red-500">{errorCategories}</span>
                      ) : (
                        ""
                      )}

                      <div className="w-full border border-gray-400 p-3 rounded flex flex-wrap gap-2">
                        <Categories
                          cards={cards}
                          setCards={setCards}
                          setErrorCategories={setErrorCategories}
                        />
                      </div>

                      <Button
                        color="primary"
                        variant="contained"
                        disabled={isLoading}
                        onClick={() => onSubmitUpdate(cards)}
                        sx={{
                          width: "auto",
                          borderRadius: "12px",
                          padding: "5px 15px",
                          textTransform: "none",
                          fontWeight: "700",
                          alignSelf: "center",
                        }}
                        startIcon={
                          isLoadingUpdate ? (
                            <CircularProgress color="inherit" size={25} />
                          ) : null
                        }
                      >
                        Actualizar
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
