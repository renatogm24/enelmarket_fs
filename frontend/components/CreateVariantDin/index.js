import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function CreateVariantDin({ options, setOptions, keyOption }) {
  //const options = [];
  let label = `Crear opciones para ${keyOption}. Ejm: Blanco, Negro`;
  let placeholder = `Presione Enter para crear ${keyOption}`;

  return (
    <Autocomplete
      multiple
      value={options[keyOption].map((option) => option)}
      options={options[keyOption].map((option) => option)}
      //defaultValue={[top100Films[13].title]}
      fullWidth
      freeSolo
      onChange={(event, value, reason) => {
        let optionsAux = { ...options };

        optionsAux[keyOption] = value;

        setOptions(optionsAux);
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
    />
  );
}
