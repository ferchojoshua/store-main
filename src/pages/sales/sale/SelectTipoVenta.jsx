import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import React from "react";
import { FormLabel } from "react-bootstrap";

const SelectTipoVenta = ({ typeVenta, setTypeVenta, typeClient }) => {
  const handleChange = (event) => {
    setTypeVenta(event.target.value);
  };

  return (
    <div>
      <FormControl style={{ marginTop: 20 }}>
        <FormLabel
          style={{
            textDecoration: "underline",
            fontWeight: "bold",
            fontSize: 20,
          }}
          id="demo-radio-buttons-group-label"
        >
          Tipo de Venta
        </FormLabel>

        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          value={typeVenta}
          onChange={handleChange}
        >
          <FormControlLabel
            value="contado"
            control={<Radio />}
            label="Venta de Contado"
          />
          <FormControlLabel
            value="credito"
            control={<Radio />}
            disabled={typeClient}
            label="Venta de Credito"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default SelectTipoVenta;
