import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Container,
  Stack,
  AppBar,
  Toolbar,
  Typography,
  Dialog,
  IconButton,
} from "@mui/material";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import NoData from "../../../../components/NoData";
import PaginationComponent from "../../../../components/PaginationComponent";
import { DataContext } from "../../../../context/DataContext";
import { getRuta, isAccess, toastError } from "../../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import ReactToPrint from "react-to-print";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, } from "@fortawesome/free-solid-svg-icons";
//import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { Table } from "react-bootstrap";
import moment from "moment";
import "../../../../components/styles/estilo.css";
import { PrintReport } from "../../../../components/modals/PrintReport";

import { getMasterVentasAsync } from "../../../../services/ReportApi";
import XLSX from "xlsx";

export const MasterVentas = () => {
  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const {
    selectedStore,
    desde,
    hasta,
    creditSales,
    items,
    contadoSales,
    horaDesde,
    horaHasta,
  } = dataJson;

  const [data, setData] = useState([]);

  const {
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    isDarkMode,
    setIsDarkMode,
    title,
    access,
  } = useContext(DataContext);
  setIsDarkMode(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(20);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = data.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  useEffect(() => {
    (async () => {
      const datos = {
        desde: new Date(desde),
        hasta: new Date(hasta),
        storeId: selectedStore === "t" ? 0 : selectedStore,
        contadoSales,
        creditSales,
      };

      setIsLoading(true);
      const result = await getMasterVentasAsync(token, datos);
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

      setData(result.data);
      setIsLoading(false);
      setIsDarkMode(false);
    })();
  }, []);

  const sumSales = () => {
    let sum = 0;
    data.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumContadoSales = () => {
    const contSales = data.filter((item) => item.isContado);
    let sum = 0;
    contSales.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumCreditoSales = () => {
    const credSales = data.filter((item) => !item.isContado);
    let sum = 0;
    credSales.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumSaldo = () => {
    const credSales = data.filter((item) => !item.isContado);
    let sum = 0;
    credSales.map((item) => (sum += item.saldo));
    return sum;
  };

  const sumDescuentosTotales = () => {
    let total = 0;
    data.forEach(venta => {
      if (venta.saleDetails && Array.isArray(venta.saleDetails)) {
        venta.saleDetails.forEach(detail => {
          if (typeof detail.descuento === 'number' && detail.descuento > 0) {
            total += detail.descuento;
          }
        });
      }
    });
    return total;
  };

  const utilityPercent = (data) => {
    let utilidadTotal = 0;
    data.forEach(item => {
      if (
        (item.costoTotal - item.costoCompra).toFixed(2) ===
        item.ganancia.toFixed(2)
      ) {
        let utilidadDetail = 1 - item.costoCompra / item.costoTotal;
        utilidadTotal += utilidadDetail;
      } else {
        let utilidadDetail =
          1 - (item.costoCompra * item.cantidad) / item.costoTotal;
        utilidadTotal += utilidadDetail;
      }
    });

    utilidadTotal = utilidadTotal / data.length;
    return (utilidadTotal * 100).toFixed(2);
  };

  const sumGanancia = (data) => {
    let gananciaTotal = 0;
    data.forEach(item => {
      gananciaTotal += item.ganancia;
    });
    return gananciaTotal.toFixed(2);
  };

  const sumarTotalGanancias = () => {
    let total = 0;
    data.forEach(venta => {
      if (venta.saleDetails && Array.isArray(venta.saleDetails)) {
        total += sumGanancia(venta.saleDetails);
      }
    });
    return total.toFixed(2);
  };

  const sumAbonado = () => {
    let sum = 0;
    data.forEach(item => {
      if (item.isContado === 1) {
        sum += item.montoVenta;
      } else {
        sum += item.montoVenta - item.saldo;
      }
    });
    return sum;
  };

  const printTable = () => {
    window.print();
  };

  const exportExcel = (tableId, filename, totalMaster, sumSales, sumContadoSales, sumCreditoSales ,sumAbonado,sumDescuentosTotales ,sumSaldo, sumarTotalGanancias, utilidadPorcentaje) => {
    const table = document.getElementById(tableId);
    const ws_data = XLSX.utils.table_to_sheet(table);

    // Agregar el formato de porcentaje para la columna de utilidad
    if (utilidadPorcentaje.length > 0) {
      const utilidadRow = [
        { t: "s", v: "Utilidad (%)", s: { font: { bold: true } } },
        ...utilidadPorcentaje.map((value) => ({ t: "s", v: value })),
      ];

      XLSX.utils.sheet_add_aoa(ws_data, [utilidadRow], { origin: -1 });
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws_data, "Master de Ventas");

    // Guardar el archivo Excel
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const downloadExcel = () => {
    const utilidadPorcentaje = data.map((item) => {
      return isAccess(access, "MASTER VENTAS UTILIDAD") ? utilityPercent(item.saleDetails) : '';
    });

    exportExcel("table-to-xls", "Master de Ventas", data.length, sumSales(), sumContadoSales(), sumCreditoSales(), sumAbonado(currentItem), sumDescuentosTotales(data),sumSaldo(), sumarTotalGanancias(), utilidadPorcentaje);
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={2}>
        <Dialog
          fullScreen
          open={false}
          onClose={() => console.log("Cerrado")}
        >
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => console.log("Cerrado")}
                aria-label="close"
              >
                <PrintRoundedIcon />
              </IconButton>
              <Typography variant="h6" className="title">
                {title}
              </Typography>
            </Toolbar>
          </AppBar>
          <Stack spacing={2} style={{ padding: "2em" }} ref={compRef}>
            <Table
              striped
              bordered
              hover
              responsive
              id="table-to-xls"
              className="table"
            >
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Documento</th>
                  <th>Venta</th>
                  <th>Contado</th>
                  <th>Credito</th>
                  <th>Abonado</th>
                  <th>Descuentos</th>
                  <th>Saldo</th>
                  <th>Ganancia</th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(currentItem) ? (
                  currentItem.map((item) => (
                    <tr key={item.id}>
                      <td>{moment(item.fechaVenta).format("DD/MM/YYYY")}</td>
                      <td>{item.horaVenta}</td>
                      <td>{item.cliente}</td>
                      <td>{item.nroDocumento}</td>
                      <td>{item.montoVenta}</td>
                      <td>{item.isContado === 1 ? item.montoVenta : 0}</td>
                      <td>{item.isContado === 0 ? item.montoVenta : 0}</td>
                      <td>
                        {item.isContado === 1
                          ? item.montoVenta
                          : item.montoVenta - item.saldo}
                      </td>
                      <td>{item.descuento}</td>
                      <td>{item.saldo}</td>
                      <td>{sumGanancia(item.saleDetails)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      <NoData />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className="col-md-6">
              <h4>Total de Registros: {data.length}</h4>
              <h4>Ventas: {sumSales()}</h4>
              <h4>Contado: {sumContadoSales()}</h4>
              <h4>Crédito: {sumCreditoSales()}</h4>
              <h4>Abonado: {sumAbonado()}</h4>
              <h4>Descuentos: {sumDescuentosTotales()}</h4>
              <h4>Saldo: {sumSaldo()}</h4>
              <h4>Ganancias Totales: {sumarTotalGanancias()}</h4>
            </div>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              alignItems="center"
            >
              <IconButton
                onClick={printTable}
                color="primary"
                aria-label="Imprimir"
              >
                <PrintRoundedIcon />
              </IconButton>
              <IconButton
                onClick={downloadExcel}
                color="primary"
                aria-label="Descargar Excel"
              >
                <FontAwesomeIcon icon={faDownload} />
              </IconButton>
              <ReactToPrint
                trigger={() => (
                  <IconButton color="primary" aria-label="Imprimir">
                    <PrintRoundedIcon />
                  </IconButton>
                )}
                content={() => compRef.current}
              />
            </Stack>
          </Stack>
          <PaginationComponent
            itemsPerPage={itemsperPage}
            totalItems={data.length}
            paginate={paginate}
          />
        </Dialog>
      </Stack>
    </Container>
  );
};
