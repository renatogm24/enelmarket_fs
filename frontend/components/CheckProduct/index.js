import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags({
  options,
  setProductoSelected,
  label,
  reset,
}) {
  return (
    <Autocomplete
      id="checkboxes-tags-demo"
      key={reset}
      options={options}
      disableCloseOnSelect
      fullWidth
      onChange={(event, value, reason) => {
        setProductoSelected(value);
      }}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Seleccionar" />
      )}
    />
  );
}
