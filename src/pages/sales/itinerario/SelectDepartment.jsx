import React, { useState, useEffect, useContext } from "react";
import { FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";
import {
  getDepartmentListAsync,
  getMunicipalitiesByDeptoAsync,
} from "../../../services/CommunitiesApi";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../../helpers/Helpers";
import { isEmpty } from "lodash";

export const SelectDepartment = ({
  selectedDepartment,
  setSelectedDepartment,
  setMunicipalityList,
  municipalityListSelected,
}) => {
  const [departmentList, setDepartmentList] = useState([]);
  const { setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);

  const token = getToken();
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setIsLoading(false);
      const result = await getDepartmentListAsync(token);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
        toastError(result.error.message);
        return;
      }

      if (result.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (result.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setDepartmentList(result.data);
    })();
  }, []);

  const handleChangeDepartment = async (event) => {
    setMunicipalityList([]);
    setSelectedDepartment(event.target.value);

    if (event.target.value !== "") {
      setIsLoading(true);
      const result = await getMunicipalitiesByDeptoAsync(
        token,
        event.target.value
      );
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
        toastError(result.error.message);
        return;
      }

      if (result.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (result.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      let data = result.data;

      if (isEmpty(municipalityListSelected)) {
        setMunicipalityList(result.data);
      } else {
        municipalityListSelected.map((item) => {
          data = data.filter((f) => f.id !== item.id);
          setMunicipalityList(data);
        });
      }
    } else {
      setMunicipalityList([]);
    }
  };

  return (
    <div>
      <FormControl
        variant="standard"
        fullWidth
        style={{ marginRight: 20, marginTop: 20 }}
        required
      >
        <InputLabel id="demo-simple-select-standard-label">
          Seleccione un Departamento
        </InputLabel>
        <Select
          defaultValue=""
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selectedDepartment}
          onChange={handleChangeDepartment}
          label="Departamento"
          style={{ textAlign: "left" }}
        >
          <MenuItem key={-1} value="">
            <em> Seleccione un departamento</em>
          </MenuItem>
          {departmentList.map((item) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};
