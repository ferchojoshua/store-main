import React from "react";
import { Table } from "react-bootstrap";
import { Paper, Divider, IconButton, Typography, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faSave } from "@fortawesome/free-solid-svg-icons";

const SaleDetail = ({
  selectedProductList,
  setSelectedProductList,
  montoVenta,
  setMontoVenta,
  addNewVenta,
}) => {
  const deleteFromProductDetailList = (item) => {
    const filtered = selectedProductList.filter(
      (p) => p.product.id !== item.product.id
    );
    setMontoVenta(montoVenta - item.costoTotal);
    setSelectedProductList(filtered);
  };
  return (
    <div>
      <Paper
        elevation={10}
        style={{
          marginTop: 5,
          borderRadius: 30,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <h6>Detalle de Venta</h6>
        </div>

        <Divider style={{ marginBottom: 20 }} />

        <Table hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "left" }}>Producto</th>
              <th style={{ textAlign: "center" }}>Cantidad</th>
              <th style={{ textAlign: "center" }}>Descuento</th>
              <th style={{ textAlign: "center" }}>Costo Unitario</th>
              <th style={{ textAlign: "center", color: "#757575" }}>
                P.V. Mayor
              </th>
              <th style={{ textAlign: "center", color: "#757575" }}>
                P.V. Detalle
              </th>
              <th style={{ textAlign: "center" }}>Costo Total</th>
              <th style={{ textAlign: "center" }}>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {selectedProductList ? (
              selectedProductList.map((item) => {
                return (
                  <tr key={selectedProductList.indexOf(item) + 1}>
                    <td>{selectedProductList.indexOf(item) + 1}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.product.description}
                    </td>
                    <td>{item.cantidad}</td>
                    <td>{`${item.descuento}%`}</td>
                    <td>
                      {item.costoUnitario.toLocaleString("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      })}
                    </td>
                    <td>
                      {item.PVM.toLocaleString("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      })}
                    </td>
                    <td>
                      {item.PVD.toLocaleString("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      })}
                    </td>
                    <td>
                      {item.costoTotal.toLocaleString("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      })}
                    </td>
                    <td>
                      <IconButton
                        style={{ color: "#f50057" }}
                        onClick={() => deleteFromProductDetailList(item)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </IconButton>
                    </td>
                  </tr>
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </Table>
      </Paper>

      <Paper
        elevation={10}
        style={{
          marginTop: 5,
          borderRadius: 30,
          padding: 20,
        }}
      >
        <div className="row justify-content-around align-items-center">
          <div className="col-sm-4 ">
            <Typography
              style={{
                marginBottom: 10,
                fontSize: 15,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Total de Productos
            </Typography>
            <Typography
              style={{
                fontSize: 14,
                color: "#2196f3",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {selectedProductList.length}
            </Typography>
          </div>

          <div className="col-sm-4 ">
            <Typography
              style={{
                marginBottom: 10,
                fontSize: 15,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Monto a pagar
            </Typography>
            <Typography
              style={{
                fontSize: 14,
                color: "#f50057",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(montoVenta)}
            </Typography>
          </div>

          <div className="col-sm-4 ">
            <Button
              variant="outlined"
              style={{ borderRadius: 20 }}
              onClick={() => addNewVenta()}
            >
              <FontAwesomeIcon
                style={{ marginRight: 10, fontSize: 20 }}
                icon={faSave}
              />
              Facturar
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default SaleDetail;
