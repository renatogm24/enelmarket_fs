import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function CreateVariant({
  options,
  setOptions,
  reset,
  selected,
}) {
  return (
    <Autocomplete
      key={reset}
      multiple
      value={Object.keys(options).map((option) => option)}
      //value={selected ? selected : []}
      //isOptionEqualToValue={(option, value) => option.id === value.id}
      options={Object.keys(options).map((option) => option)}
      //defaultValue={[top100Films[13].title]}
      fullWidth
      freeSolo
      onChange={(event, value, reason) => {
        let optionsAux = { ...options };

        for (let item of value) {
          if (!(item in optionsAux)) {
            optionsAux[item] = [];
          }
        }

        for (let item of Object.keys(optionsAux)) {
          if (!value.includes(item)) {
            delete optionsAux[item];
          }
        }

        setOptions(optionsAux);
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Crear variantes. Ejm: Color, Tamaño"
          placeholder="Presione Enter para crear"
        />
      )}
    />
  );
}
