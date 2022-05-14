import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isAccess, toastError } from "../../../helpers/Helpers";
import { getEntradasAsync } from "../../../services/ProductIsApi";
import moment from "moment/moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCirclePlus,
  faCircleXmark,
  faExternalLink,
} from "@fortawesome/free-solid-svg-icons";
import { Button, IconButton } from "@mui/material";
import PaginationComponent from "../../../components/PaginationComponent";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";

const EntradaProduto = () => {
  let navigate = useNavigate();
  const [entradaList, setEntradaList] = useState([]);
  const { setIsLoading, reload, setIsLogged, setIsDefaultPass, access } =
    useContext(DataContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = entradaList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getEntradasAsync(token);
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
      setEntradaList(result.data);
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
          <h1>Lista de Entrada de Productos</h1>

          {isAccess(access, "ENTRADAPRODUCTOS CREATE") ? (
            <Button
              variant="outlined"
              style={{ borderRadius: 20 }}
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={() => {
                navigate(`/entrada/add`);
              }}
            >
              Agregar Entrada
            </Button>
          ) : (
            <></>
          )}
        </div>

        <hr />

        <Table hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th># Factura</th>
              <th>Fecha Ingreso</th>
              <th style={{ textAlign: "left" }}>Proveedor</th>
              <th>Productos</th>
              <th>Monto Compra</th>
              <th>Cancelado</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {currentItem.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.noFactura}</td>
                  <td>{moment(item.fechaIngreso).format("L")}</td>
                  <td style={{ textAlign: "left" }}>{item.provider.nombre}</td>
                  <td>{item.productInDetails.length}</td>
                  <td>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(item.montoFactura)}
                  </td>
                  <td>
                    {
                      <FontAwesomeIcon
                        style={{
                          fontSize: 25,
                          marginTop: 5,
                          color: item.fechaVencimiento ? "#f50057" : "#4caf50",
                        }}
                        icon={
                          item.fechaVencimiento ? faCircleXmark : faCircleCheck
                        }
                      />
                    }
                  </td>
                  <td>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        navigate(`/entrada/${item.id}`);
                      }}
                    >
                      <FontAwesomeIcon icon={faExternalLink} />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <PaginationComponent
          data={entradaList}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>
    </div>
  );
};

export default EntradaProduto;
