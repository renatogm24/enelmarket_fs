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
  setCategoriesSelected,
  reset,
  selected,
  label,
}) {
  return (
    <Autocomplete
      key={reset}
      value={selected ? selected : []}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      multiple
      id="checkboxes-tags-demo"
      options={options}
      disableCloseOnSelect
      fullWidth
      onChange={(event, value, reason) => {
        setCategoriesSelected(value);
      }}
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Seleccionar" />
      )}
    />
  );
}
