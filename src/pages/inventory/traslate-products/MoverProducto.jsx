import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button, IconButton, Stack } from "@mui/material";
import MediumModal from "../../../components/modals/MediumModal";

import MoverProductoAdd from "./MoverProductoAdd";
import { getProdMovmtsAsync } from "../../../services/ProductMovementsApi";
import { getRuta, isAccess, toastError } from "../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import moment from "moment";
import PaginationComponent from "../../../components/PaginationComponent";
import { TrasladoDetails } from "./TrasladoDetails";
import SmallModal from "../../../components/modals/SmallModal";
import TraslateComponent from "./printTraslate/TraslateComponent";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";

const MoverProducto = () => {
  let ruta = getRuta();

  let navigate = useNavigate();
  const {
    isDarkMode,
    setIsLoading,
    reload,
    setIsLogged,
    setIsDefaultPass,
    access,
  } = useContext(DataContext);
  const [movimientosList, setMovimientosList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = movimientosList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [showModal, setShowModal] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState([]);

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [dataToPrint, setDataToPrint] = useState([]);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getProdMovmtsAsync(token);
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
      setMovimientosList(result.data);
      setIsLoading(false);
    })();
  }, [reload]);

  return (
    <div>
      <Container>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Lista de Movimientos</h1>

          {isAccess(access, "PRODUCT TRANSLATE CREATE") ? (
            <Button
              variant="outlined"
              style={{ borderRadius: 20 }}
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Agregar Movimiento
            </Button>
          ) : (
            <></>
          )}
        </div>

        <hr />

        {isEmpty(movimientosList) ? (
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
                <th style={{ textAlign: "center" }}>#</th>
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th style={{ textAlign: "center" }}>Cant. Productos</th>
                <th style={{ textAlign: "left" }}>Concepto</th>
                <th style={{ textAlign: "left" }}>Realizado Por</th>
                <th style={{ textAlign: "center" }}>Detalles</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "center" }}>{item.id}</td>
                    <td style={{ textAlign: "center" }}>
                      {moment(item.fecha).format("L")}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.movmentDetails.length}
                    </td>

                    <td style={{ textAlign: "left" }}>{item.concepto}</td>
                    <td style={{ textAlign: "left" }}>{item.user.fullName}</td>
                    <td>
                      <Stack spacing={1} direction="row">
                        <IconButton
                          style={{
                            color: "#2979ff",
                          }}
                          size="small"
                          onClick={() => {
                            setDataToPrint(item);
                            setShowPrintModal(true);
                          }}
                        >
                          <PrintRoundedIcon style={{ fontSize: 30 }} />
                        </IconButton>

                        <IconButton
                          style={{ marginRight: 10, color: "#009688" }}
                          onClick={() => {
                            setSelectedTransaction(item);
                            setShowDetailsModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </IconButton>
                      </Stack>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        <PaginationComponent
          data={movimientosList}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>

      <MediumModal
        titulo={"Agregar Traslado de Productos"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <MoverProductoAdd setShowModal={setShowModal} />
      </MediumModal>

      <MediumModal
        titulo={"Detalles de Traslado"}
        isVisible={showDetailsModal}
        setVisible={setShowDetailsModal}
      >
        <TrasladoDetails selectedTransaction={selectedTransaction} />
      </MediumModal>

      <SmallModal
        titulo={"Reimprimir Traslado"}
        isVisible={showPrintModal}
        setVisible={setShowPrintModal}
      >
        <TraslateComponent data={dataToPrint} />
      </SmallModal>
    </div>
  );
};

export default MoverProducto;
