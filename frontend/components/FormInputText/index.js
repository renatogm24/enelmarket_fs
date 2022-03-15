import TextField from "@material-ui/core/TextField";
import { Controller } from "react-hook-form";
import React from "react";

export const FormInputText = ({
  name,
  control,
  label,
  errors,
  type,
  defaultOpt,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField
          onChange={onChange}
          label={label}
          value={value}
          variant="outlined"
          className="w-full"
          autoComplete="off"
          error={errors[name] ? true : false}
          helperText={errors[name]}
          type={type}
        />
      )}
    />
  );
};
