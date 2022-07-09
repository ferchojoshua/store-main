import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../helpers/Helpers";
import {
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
  faSearch,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../../components/PaginationComponent";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";

import {
  deleteCountAsync,
  getAsientosContAsync,
  getCuentasAsync,
} from "../../../services/ContabilidadApi";
import SmallModal from "../../../components/modals/SmallModal";
import moment from "moment";
import { AsientosContablesComponent } from "../../../components/AsientosContablesComponent";

export const AsientoList = () => {
  const {
    isDarkMode,
    reload,
    setReload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);
  let ruta = getRuta();

  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [aContList, setAContList] = useState([]);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const result = await getAsientosContAsync(token);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
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
      setAContList(result.data);
    })();
  }, [reload]);

  return (
    <div>
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Lista de Asientos Contables</h1>

          {isAccess(access, "CONT CREATE") ? (
            <Button
              variant="outlined"
              style={{ borderRadius: 20 }}
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={() => {
                console.log("Agregar Asiento");
                // setShowModal(true);
              }}
            >
              Agregar Asiento Contable
            </Button>
          ) : (
            <></>
          )}
        </div>

        <hr />

        {isEmpty(aContList) ? (
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
                <th style={{ textAlign: "center" }}>#Asiento</th>
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th style={{ textAlign: "left" }}>Libro</th>
                <th style={{ textAlign: "center" }}>Cuenta</th>
                <th style={{ textAlign: "left" }}>Descripcion</th>
                <th style={{ textAlign: "center" }}>Debito C$</th>
                <th style={{ textAlign: "center" }}>Credito C$</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {aContList.map((item) => {
                const {
                  countAsientoContableDetails,
                  fecha,
                  fuenteContable,
                  id,
                  libroContable,
                  referencia,
                  store,
                  user,
                } = item;
                return (
                  <tr key={id}>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      {id}
                    </td>

                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      {moment(fecha).format("L")}
                    </td>

                    <td style={{ textAlign: "left", verticalAlign: "middle" }}>
                      {libroContable.description}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <Table
                        hover={!isDarkMode}
                        size="sm"
                        responsive
                        className="text-primary"
                        borderless
                      >
                        <tbody
                          className={isDarkMode ? "text-white" : "text-dark"}
                        >
                          {countAsientoContableDetails.map((i) => {
                            return (
                              <tr key={i.id}>
                                <td style={{ textAlign: "center" }}>
                                  {i.cuenta.countNumber}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </td>

                    <td>
                      <Table
                        hover={!isDarkMode}
                        size="sm"
                        responsive
                        className="text-primary"
                        borderless
                      >
                        <tbody
                          className={isDarkMode ? "text-white" : "text-dark"}
                        >
                          {countAsientoContableDetails.map((i) => {
                            return (
                              <tr key={i.id}>
                                <td style={{ textAlign: "left" }}>
                                  {i.cuenta.descripcion}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td style={{ textAlign: "left" }}>{referencia}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </td>

                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <Table
                        hover={!isDarkMode}
                        size="sm"
                        responsive
                        className="text-primary"
                        borderless
                      >
                        <tbody
                          className={isDarkMode ? "text-white" : "text-dark"}
                        >
                          {countAsientoContableDetails.map((i) => {
                            return (
                              <tr key={i.id}>
                                <td style={{ textAlign: "center" }}>
                                  {new Intl.NumberFormat("es-NI", {
                                    style: "currency",
                                    currency: "NIO",
                                  }).format(i.debito)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </td>

                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <Table
                        hover={!isDarkMode}
                        size="sm"
                        responsive
                        className="text-primary"
                        borderless
                      >
                        <tbody
                          className={isDarkMode ? "text-white" : "text-dark"}
                        >
                          {countAsientoContableDetails.map((i) => {
                            return (
                              <tr key={i.id}>
                                <td style={{ textAlign: "center" }}>
                                  {new Intl.NumberFormat("es-NI", {
                                    style: "currency",
                                    currency: "NIO",
                                  }).format(i.credito)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};
