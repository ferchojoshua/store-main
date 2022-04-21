import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import MediumModal from "../../../components/modals/MediumModal";

import MoverProductoAdd from "./MoverProductoAdd";
import { getProdMovmtsAsync } from "../../../services/ProductMovementsApi";
import { toastError } from "../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import moment from "moment";
import PaginationComponent from "../../../components/PaginationComponent";

const MoverProducto = () => {
  let navigate = useNavigate();
  const { setIsLoading, reload, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  const [movimientosList, setMovimientosList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = movimientosList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [showModal, setShowModal] = useState(false);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getProdMovmtsAsync(token);
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
        </div>

        <hr />

        {isEmpty(movimientosList) ? (
          <NoData />
        ) : (
          <Table hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th style={{ textAlign: "left" }}>Producto</th>
                <th style={{ textAlign: "left" }}>Almacen Procedencia</th>
                <th style={{ textAlign: "left" }}>Concepto</th>
                <th style={{ textAlign: "left" }}>Almacen Destino</th>
                <th style={{ textAlign: "left" }}>Realizado Por</th>
              </tr>
            </thead>
            <tbody>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td style={{ textAlign: "center" }}>
                      {moment(item.fecha).format("L")}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {item.producto.description}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {item.almacenProcedencia.name}
                    </td>
                    <td style={{ textAlign: "left" }}>{item.concepto}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.almacenDestino.name}
                    </td>
                    <td style={{ textAlign: "left" }}>{item.user.fullName}</td>
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
    </div>
  );
};

export default MoverProducto;
