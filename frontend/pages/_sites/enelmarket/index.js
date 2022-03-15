import React, { useState } from "react";
import Welcome from "../../../components/enelmarket/steps/Welcome.js";
import CreateName from "../../../components/enelmarket/steps/CreateName.js";
import CompleteInfo from "../../../components/enelmarket/steps/CompleteInfo.js";
import Finish from "../../../components/enelmarket/steps/Finish.js";
import Svg from "../../../components/enelmarket/svg.js";

export default function index() {
  const img = "/bgimage.jpg";

  const [step, setStep] = useState("welcome");
  const [storeName, setStoreName] = useState("");
  //const [user, setUser] = useState({});

  let content = null;

  switch (step) {
    case "welcome":
      content = <Welcome setStep={setStep} />;
      break;
    case "createName":
      content = <CreateName setStep={setStep} setStoreName={setStoreName} />;
      break;
    case "completeInfo":
      content = <CompleteInfo setStep={setStep} storeName={storeName} />;
      break;
    case "finish":
      content = <Finish storeName={storeName} />;
      break;
    default:
      break;
  }

  return (
    <div
      className="w-full h-screen bg-no-repeat bg-center bg-cover m-0 p-0 overflow-y-hidden"
      style={{
        backgroundImage: `url(${img})`,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backgroundBlendMode: "darken",
      }}
    >
      <div className="h-full flex flex-col justify-center md:flex-row">
        <div className="object-fill h-28 w-full pt-8 pr-6 flex md:flex-grow md:w-1/2 md:items-center md:justify-center md:align-middle md:self-center xl:justify-end">
          <div className="w-full md:w-4/5 md:flex md:flex-col">
            <Svg color={"#fff"} />
            <div className="text-gray-100 font-roboto-700 text-base hidden md:flex md:w-3/4 md:self-center md:align-middle md:justify-center md:text-base xl:text-2xl">
              En el market es un sistema que permite a los emprendedores poder
              gestionar e impulsar su negocio a través de una tienda web con
              dominio propio. 6 meses gratis de prueba. Ver planes
            </div>
          </div>
        </div>
        <div className=" flex flex-col h-full mt-10 items-center md:flex-grow md:w-1/2 md:items-center md:justify-center md:mt-0 xl:self-center">
          {content}
        </div>
      </div>
    </div>
  );
}
