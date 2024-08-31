import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getRuta, isAccess, toastError } from "../../../helpers/Helpers";
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
} from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";

import { getAsientosContAsync } from "../../../services/ContabilidadApi";
import MediumModal from "../../../components/modals/MediumModal";
import moment from "moment";
import { AddAsientoContable } from "./AddAsientoContable";

export const AsientoList = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    isDarkMode,
    reload,
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
                setShowModal(true);
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
                  id,
                  libroContable,
                  referencia,
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
                                <td
                                  style={{
                                    textAlign: "center",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#2196f3",
                                  }}
                                >
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
                                <td
                                  style={{
                                    textAlign: "left",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#2196f3",
                                  }}
                                >
                                  {i.cuenta.descripcion}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td
                              style={{
                                textAlign: "left",
                                fontWeight: "bold",
                                color: "#ffc107",
                              }}
                            >
                              {referencia}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <Table
                        hover={!isDarkMode}
                        size="sm"
                        responsive
                        className="text-primary"
                      >
                        <tbody
                          className={isDarkMode ? "text-white" : "text-dark"}
                        >
                          {countAsientoContableDetails.map((i) => {
                            return (
                              <tr key={i.id}>
                                <td
                                  style={{
                                    textAlign: "center",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#2196f3",
                                  }}
                                >
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

                    <td style={{ textAlign: "center" }}>
                      <Table
                        hover={!isDarkMode}
                        size="sm"
                        responsive
                        className="text-primary"
                      >
                        <tbody
                          className={isDarkMode ? "text-white" : "text-dark"}
                        >
                          {countAsientoContableDetails.map((i) => {
                            return (
                              <tr key={i.id}>
                                <td
                                  style={{
                                    textAlign: "center",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#2196f3",
                                  }}
                                >
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

      <MediumModal
        titulo={"Agregar Asiento Contable"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <AddAsientoContable setShowModal={setShowModal} />
      </MediumModal>
    </div>
  );
};



// import React, { useState, useEffect, useContext } from "react";
// import { DataContext } from "../../../context/DataContext";
// import { Container, Table } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { getRuta, isAccess, toastError } from "../../../helpers/Helpers";
// import { Button } from "@mui/material";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
// import { isEmpty } from "lodash";
// import NoData from "../../../components/NoData";
// import {
//   getToken,
//   deleteToken,
//   deleteUserData,
// } from "../../../services/Account";
// import { getAsientosContAsync } from "../../../services/ContabilidadApi";
// import MediumModal from "../../../components/modals/MediumModal";
// import moment from "moment";
// import { AddAsientoContable } from "./AddAsientoContable";

// export const AsientoList = () => {
//   const [showModal, setShowModal] = useState(false);
//   const {
//     isDarkMode,
//     reload,
//     setIsLoading,
//     setIsDefaultPass,
//     setIsLogged,
//     access,
//   } = useContext(DataContext);
//   let ruta = getRuta();
//   let navigate = useNavigate();
//   const MySwal = withReactContent(Swal);
//   const [aContList, setAContList] = useState([]);
//   const token = getToken();

//   useEffect(() => {
//     (async () => {
//       setIsLoading(true);

//       const result = await getAsientosContAsync(token);
//       setIsLoading(false);
//       if (!result.statusResponse) {
//         if (result.error.request.status === 401) {
//           navigate(`${ruta}/unauthorized`);
//           return;
//         }
//         toastError(result.error.message);
//         return;
//       }

//       if (result.data === "eX01") {
//         deleteUserData();
//         deleteToken();
//         setIsLogged(false);
//         return;
//       }

//       if (result.data.isDefaultPass) {
//         setIsDefaultPass(true);
//         return;
//       }

//       setAContList(result.data || []); // Asegurar que aContList siempre sea un array
//     })();
//   }, [reload]);

//   return (
//     <div>
//       <Container>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             alignContent: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <h1>Lista de Asientos Contables</h1>

//           {isAccess(access, "CONT CREATE") ? (
//             <Button
//               variant="outlined"
//               style={{ borderRadius: 20 }}
//               startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
//               onClick={() => {
//                 setShowModal(true);
//               }}
//             >
//               Agregar Asiento Contable
//             </Button>
//           ) : null}
//         </div>

//         <hr />

//         {isEmpty(aContList) ? (
//           <NoData />
//         ) : (
//           <Table
//             hover={!isDarkMode}
//             size="sm"
//             responsive
//             className="text-primary"
//           >
//             <thead>
//               <tr>
//                 <th style={{ textAlign: "center" }}>#Asiento</th>
//                 <th style={{ textAlign: "center" }}>Fecha</th>
//                 <th style={{ textAlign: "left" }}>Libro</th>
//                 <th style={{ textAlign: "center" }}>Cuenta</th>
//                 <th style={{ textAlign: "left" }}>Descripcion</th>
//                 <th style={{ textAlign: "center" }}>Debito C$</th>
//                 <th style={{ textAlign: "center" }}>Credito C$</th>
//               </tr>
//             </thead>
//             <tbody className={isDarkMode ? "text-white" : "text-dark"}>
//               {aContList.map((item) => {
//                 if (!item) return null; // Verificación adicional para evitar null
//                 const {
//                   countAsientoContableDetails = [], // Asegurar que sea un array
//                   fecha,
//                   id,
//                   libroContable = {},
//                   referencia,
//                 } = item;

//                 return (
//                   <tr key={id}>
//                     <td style={{ textAlign: "center", verticalAlign: "middle" }}>
//                       {id}
//                     </td>

//                     <td style={{ textAlign: "center", verticalAlign: "middle" }}>
//                       {moment(fecha).format("L")}
//                     </td>

//                     <td style={{ textAlign: "left", verticalAlign: "middle" }}>
//                       {libroContable.description || "No disponible"}
//                     </td>

//                     <td style={{ textAlign: "center" }}>
//                       <Table
//                         hover={!isDarkMode}
//                         size="sm"
//                         responsive
//                         className="text-primary"
//                         borderless
//                       >
//                         <tbody className={isDarkMode ? "text-white" : "text-dark"}>
//                           {countAsientoContableDetails.map((i) => {
//                             if (!i || !i.cuenta) return null; // Verificación adicional
//                             return (
//                               <tr key={i.id}>
//                                 <td
//                                   style={{
//                                     textAlign: "center",
//                                     borderBottomWidth: 1,
//                                     borderBottomColor: "#2196f3",
//                                   }}
//                                 >
//                                   {i.cuenta.countNumber || "No disponible"}
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </Table>
//                     </td>

//                     <td>
//                       <Table
//                         hover={!isDarkMode}
//                         size="sm"
//                         responsive
//                         className="text-primary"
//                         borderless
//                       >
//                         <tbody className={isDarkMode ? "text-white" : "text-dark"}>
//                           {countAsientoContableDetails.map((i) => {
//                             if (!i || !i.cuenta) return null; // Verificación adicional
//                             return (
//                               <tr key={i.id}>
//                                 <td
//                                   style={{
//                                     textAlign: "left",
//                                     borderBottomWidth: 1,
//                                     borderBottomColor: "#2196f3",
//                                   }}
//                                 >
//                                   {i.cuenta.descripcion || "No disponible"}
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                           <tr>
//                             <td
//                               style={{
//                                 textAlign: "left",
//                                 fontWeight: "bold",
//                                 color: "#ffc107",
//                               }}
//                             >
//                               {referencia || "Sin referencia"}
//                             </td>
//                           </tr>
//                         </tbody>
//                       </Table>
//                     </td>

//                     <td style={{ textAlign: "center" }}>
//                       <Table
//                         hover={!isDarkMode}
//                         size="sm"
//                         responsive
//                         className="text-primary"
//                       >
//                         <tbody className={isDarkMode ? "text-white" : "text-dark"}>
//                           {countAsientoContableDetails.map((i) => {
//                             if (!i) return null; // Verificación adicional
//                             return (
//                               <tr key={i.id}>
//                                 <td
//                                   style={{
//                                     textAlign: "center",
//                                     borderBottomWidth: 1,
//                                     borderBottomColor: "#2196f3",
//                                   }}
//                                 >
//                                   {new Intl.NumberFormat("es-NI", {
//                                     style: "currency",
//                                     currency: "NIO",
//                                   }).format(i.debito || 0)}
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </Table>
//                     </td>

//                     <td style={{ textAlign: "center" }}>
//                       <Table
//                         hover={!isDarkMode}
//                         size="sm"
//                         responsive
//                         className="text-primary"
//                       >
//                         <tbody className={isDarkMode ? "text-white" : "text-dark"}>
//                           {countAsientoContableDetails.map((i) => {
//                             if (!i) return null; // Verificación adicional
//                             return (
//                               <tr key={i.id}>
//                                 <td
//                                   style={{
//                                     textAlign: "center",
//                                     borderBottomWidth: 1,
//                                     borderBottomColor: "#2196f3",
//                                   }}
//                                 >
//                                   {new Intl.NumberFormat("es-NI", {
//                                     style: "currency",
//                                     currency: "NIO",
//                                   }).format(i.credito || 0)}
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </Table>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         )}
//       </Container>

//       <MediumModal
//         titulo={"Agregar Asiento Contable"}
//         isVisible={showModal}
//         setVisible={setShowModal}
//       >
//         <AddAsientoContable setShowModal={setShowModal} />
//       </MediumModal>
//     </div>
//   );
// };

// export default AsientoList;
