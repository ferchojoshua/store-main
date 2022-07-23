import React, { useState, useContext } from "react";
import { isEmpty } from "lodash";
import { IconButton, Button, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPrint } from "@fortawesome/free-solid-svg-icons";
import NoData from "../../../components/NoData";
import { Table } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export const SelectedMunicipalities = ({
  municipalityListSelected,
  setMunicipalityListSelected,
}) => {
  const [clientList, setClientList] = useState([]);
  const MySwal = withReactContent(Swal);

  const deleteFromList = (item) => {
    MySwal.fire({
      icon: "question",
      iconColor: "#f50057",
      title: <p>Eliminar de la Lista</p>,
      text: `${item.name}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const filtered = municipalityListSelected.filter(
          (i) => i.id !== item.id
        );
        setMunicipalityListSelected(filtered);
      }
    });
  };

  const verClientList = async () => {
    // console.log(municipalityListSelected);
  };

  return (
    <div>
      {isEmpty(municipalityListSelected) ? (
        <NoData />
      ) : (
        <div>
          <Typography variant="h6" style={{ marginTop: 20, color: "#1769aa" }}>
            Municipios Seleccionados
          </Typography>

          <Table hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "left" }}>Municipio</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {municipalityListSelected.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td style={{ textAlign: "left" }}>{item.name}</td>

                    <td>
                      <IconButton
                        style={{ color: "#f50057" }}
                        onClick={() => deleteFromList(item)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Button
            variant="outlined"
            style={{ borderRadius: 20 }}
            startIcon={<FontAwesomeIcon icon={faPrint} />}
            onClick={() => {
              verClientList();
            }}
          >
            Ver Listado de clientes
          </Button>
        </div>
      )}
    </div>
  );
};
