import React, { useState, useEffect, useContext } from "react";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
  faSearch,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../context/DataContext";
import { isAccess } from "../helpers/Helpers";
import NoData from "./NoData";
import { isEmpty } from "lodash";

export const TableComponent = ({ data, columns }) => {
  const {
    isDarkMode,
    reload,
    setReload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);

  const [searchTerm, setSearchTerm] = useState("");
  const withSearch = data.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      // console.log(val)
      //   val.descripcion.toString().includes(searchTerm)
      //   ||
      //   val.countNumber.toString().includes(searchTerm)
    ) {
      return val;
    }
  });

  //Para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = withSearch.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
  };

  return (
    <div>
      <hr />
      <TextField
        style={{ marginBottom: 20, width: 600 }}
        variant="standard"
        onChange={(e) => onChangeSearch(e.target.value.toUpperCase())}
        value={searchTerm}
        label={"Buscar Cuenta"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <FontAwesomeIcon icon={faSearch} style={{ color: "#1769aa" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {isEmpty(withSearch) ? (
        <NoData />
      ) : (
        <Table
          hover={!isDarkMode}
          size="sm"
          responsive
          className="text-primary"
        >
          <thead>
            <tr>
              {columns.map((item) => {
                return <th>{item}</th>;
              })}
              <th>#.Cuenta</th>
              <th style={{ textAlign: "left" }}>Nombre Cuenta</th>
              <th style={{ textAlign: "center" }}>Clasficacion</th>
              <th style={{ width: 150 }}>Acciones</th>
            </tr>
          </thead>
          <tbody className={isDarkMode ? "text-white" : "text-dark"}>
            {currentItem.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.countNumber}</td>
                  <td style={{ textAlign: "left" }}>{item.descripcion}</td>
                  <td style={{ textAlign: "center" }}>
                    {item.countGroup.description}
                  </td>
{/* 
                  <td style={{ width: 150 }}>
                    {isAccess(access, "CONT VER") ? (
                      <IconButton
                        style={{ marginRight: 10, color: "#009688" }}
                        onClick={() => {
                          setSelectedCount(item);
                          setShowEditModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </IconButton>
                    ) : (
                      <></>
                    )}
                    {isAccess(access, "CONT DELETE") ? (
                      <IconButton
                        style={{ color: "#f50057" }}
                        onClick={() => deleteCuenta(item)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </IconButton>
                    ) : (
                      <></>
                    )}
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};
