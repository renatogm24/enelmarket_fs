import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Loader from "../../../../components/Loader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import HomeLayout from "../../../../components/HomeLayout";
import { Button, Container, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import axios from "../../../../lib/clientProvider/axiosConfig";
import { CircularProgress } from "@mui/material";

const changePictures = async ({ portada, logo }) => {
  const formData = new FormData();
  formData.append("portada", portada[0]);
  formData.append("logo", logo[0]);

  const { data: response } = await axios({
    method: "post",
    url: "/user/changePictures",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export default function index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoadingFirst, setIsLoadingFirst] = useState(true);
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const { handleSubmit, register } = useForm();

  const { mutate, isLoading } = useMutation(changePictures, {
    onSuccess: (data) => {},
    onError: (error) => {
      setErrors(error.response.data);
    },
    onSettled: () => {
      queryClient.invalidateQueries("/user/changePictures");
    },
  });

  const onSubmit = (data) => {
    const pictures = {
      ...data,
    };
    mutate(pictures);
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
                    Personalizar tienda
                  </div>
                  <div className="text-base font-bold my-5 border-b pb-5 px-3 border-gray-300">
                    Puedes modificar su foto de portada y el logo de su tienda
                  </div>
                  <div
                    className="px-3 pb-4 flex flex-col gap-3"
                    style={{ height: "auto" }}
                  >
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={handleSubmit(onSubmit)}
                      encType="multipart/form-data"
                    >
                      <span className="">Portada:</span>
                      <div className="w-full border border-gray-400 p-3 rounded flex flex-col">
                        <input
                          {...register("portada")}
                          type="file"
                          name="portada"
                        />
                      </div>

                      <span className="">Logo:</span>
                      <div className="w-full border border-gray-400 p-3 rounded flex flex-col">
                        <input {...register("logo")} type="file" name="logo" />
                      </div>

                      <Button
                        color="primary"
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                          width: "83.33%",
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
                        Guardar
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
