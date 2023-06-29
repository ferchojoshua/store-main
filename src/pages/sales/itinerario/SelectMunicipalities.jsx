import React from "react";
import { Typography, Tooltip, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

export const SelectMunicipalities = ({
  municipalityList,
  setMunicipalityList,
  municipalityListSelected,
  setMunicipalityListSelected,
}) => {
  const addToList = (item) => {
    const filtered = municipalityList.filter((f) => f.id !== item.id);
    setMunicipalityList(filtered);
    setMunicipalityListSelected([...municipalityListSelected, item]);
  };

  return (
    <div>
      {municipalityList.map((item) => {
        return (
          <div
            key={item.id}
            style={{
              borderBottomWidth: 1,
              borderBottomStyle: "solid",
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="col-xs-10">
              <Typography
                variant="body1"
                style={{ marginTop: 5, textAlign: "left" }}
              >
                {item.name}
              </Typography>
            </div>

            <div className="col-xs-2">
              <Tooltip title="Agregar a la lista" style={{ marginTop: 5 }}>
                <IconButton
                  onClick={() => {
                    addToList(item);
                  }}
                >
                  <FontAwesomeIcon
                    style={{
                      fontSize: 25,
                      color: "#1769aa",
                    }}
                    icon={faCirclePlus}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );
      })}
    </div>
  );
};
