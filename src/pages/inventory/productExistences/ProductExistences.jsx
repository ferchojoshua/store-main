import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { getRuta, isAccess, toastError } from "../../../helpers/Helpers";

import {
  IconButton,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  Divider,
  ListItemText,
  MenuList,
  Grid,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faSearch,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../../components/PaginationComponent";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import MediumModal from "../../../components/modals/MediumModal";
import { getExistencesAsync } from "../../../services/ExistanceApi";
import ProductExistenceEdit from "./ProductExistenceEdit";

const ProductExistences = () => {
  let ruta = getRuta();

  const {
    isDarkMode,
    reload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);
  let navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const withSearch = productList.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.description.toString().includes(searchTerm) ||
      val.barCode.toString().includes(searchTerm)
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

  const token = getToken();

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedStore, setSelectedStore] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const result = await getExistencesAsync(token);
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
      setProductList(result.data);
    })();
  }, [reload]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
  };

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
          <h1>Existencia de Productos</h1>
        </div>

        <Divider style={{ marginBottom: 10, marginTop: 10 }} />

        <TextField
          style={{ marginBottom: 20, width: 600 }}
          variant="standard"
          onChange={(e) => onChangeSearch(e.target.value.toUpperCase())}
          value={searchTerm}
          label={"Buscar Producto"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ color: "#1769aa" }}
                  />
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
                <th>#</th>
                <th style={{ textAlign: "left" }}>T.Negocio</th>
                <th style={{ textAlign: "left" }}>Familia</th>
                <th style={{ textAlign: "left" }}>Producto</th>
                <th style={{ textAlign: "left" }}>C. Barra</th>
                <th style={{ textAlign: "left" }}>Marca</th>
                {isAccess(access, "EXISTANCE VER") ? (
                  <th>Existencias</th>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem.map((item) => {
                return (
                  <tr key={item.idProducto}>
                    <td>{item.idProducto}</td>

                    <td style={{ textAlign: "left" }}>{item.tipoNegocio}</td>

                    <td style={{ textAlign: "left" }}>{item.familia}</td>

                    <td style={{ textAlign: "left" }}>{item.description}</td>

                    <td style={{ textAlign: "left" }}>{item.barCode}</td>

                    <td style={{ textAlign: "left" }}>
                      {item.marca ? item.marca : "S/M"}
                    </td>

                    <td>
                      {isAccess(access, "EXISTANCE VER") ? (
                        <IconButton
                          style={{ marginRight: 10, color: "#2196f3" }}
                          id="basic-button"
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={(e) => {
                            // console.log(item);
                            setSelectedProduct(item);
                            handleClick(e);
                          }}
                        >
                          <FontAwesomeIcon icon={faCircleInfo} />
                        </IconButton>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        <PaginationComponent
          data={withSearch}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>

      {open ? (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          PaperProps={{ style: { borderRadius: 25 } }}
        >
          <MenuList dense>
            <MenuItem>
              <Grid container spacing={3}>
                <Grid item xs={5}>
                  <ListItemText>
                    <span
                      style={{
                        color: "#9c27b0",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      Almacen
                    </span>
                  </ListItemText>
                </Grid>
                <Grid item xs={1}>
                  <ListItemText style={{ textAlign: "center" }}>
                    <span
                      style={{
                        color: "#9c27b0",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      Exist
                    </span>
                  </ListItemText>
                </Grid>
                <Grid item xs={2}>
                  <ListItemText style={{ textAlign: "center" }}>
                    <span
                      style={{
                        color: "#9c27b0",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      PVD
                    </span>
                  </ListItemText>
                </Grid>
                <Grid item xs={2}>
                  <ListItemText style={{ textAlign: "center" }}>
                    <span
                      style={{
                        color: "#9c27b0",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      PVM
                    </span>
                  </ListItemText>
                </Grid>

                {isAccess(access, "EXISTANCE UPDATE") ? (
                  <Grid item xs={2}>
                    <ListItemText style={{ textAlign: "center" }}>
                      <span
                        style={{
                          color: "#9c27b0",
                          fontWeight: "bold",
                          fontSize: 17,
                        }}
                      >
                        Ajustar
                      </span>
                    </ListItemText>
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            </MenuItem>
            <Divider />

            {selectedProduct.existence.map((val) => {
              return (
                <MenuItem key={Math.random()} style={{ width: 500 }}>
                  <Grid
                    container
                    spacing={3}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Grid item xs={5}>
                      <ListItemText>
                        <span
                          style={{
                            color: "#2196f3",
                            fontWeight: "bold",
                          }}
                        >
                          {val.almacen}
                        </span>
                      </ListItemText>
                    </Grid>
                    <Grid item xs={1}>
                      <ListItemText style={{ textAlign: "center" }}>
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {val.exisistencia}
                        </span>
                      </ListItemText>
                    </Grid>
                    <Grid item xs={2}>
                      <ListItemText style={{ textAlign: "center" }}>
                        <span
                          style={{
                            color: "#4caf50",
                            fontWeight: "bold",
                          }}
                        >
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(val.pvd)}
                        </span>
                      </ListItemText>
                    </Grid>
                    <Grid item xs={2}>
                      <ListItemText style={{ textAlign: "center" }}>
                        <span
                          style={{
                            color: "#4caf50",
                            fontWeight: "bold",
                          }}
                        >
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(val.pvm)}
                        </span>
                      </ListItemText>
                    </Grid>
                    {isAccess(access, "EXISTANCE UPDATE") ? (
                      <Grid item xs={2}>
                        <ListItemText style={{ textAlign: "center" }}>
                          <IconButton
                            style={{
                              color: "#009688",
                            }}
                            onClick={() => {
                              setSelectedStore(val);
                              setShowEditModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </IconButton>
                        </ListItemText>
                      </Grid>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      ) : (
        <></>
      )}

      <MediumModal
        titulo={
          isEmpty(selectedProduct)
            ? ""
            : `Ajustar Existencias: ${selectedProduct.description}`
        }
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <ProductExistenceEdit
          selectedStore={selectedStore}
          setShowModal={setShowEditModal}
        />
      </MediumModal>
    </div>
  );
};

export default ProductExistences;
