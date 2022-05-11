import React, { useState, useEffect, useContext } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../../../helpers/Helpers";

import { Button, IconButton, Container, Paper } from "@mui/material";
import {
  faCircleArrowLeft,
  faExternalLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../../services/Account";
import { DataContext } from "../../../../context/DataContext";
import NoData from "../../../../components/NoData";
import { isEmpty } from "lodash";
import PaginationComponent from "../../../../components/PaginationComponent";
import {
  getDepartmentByIdAsync,
  getMunsWithCommsCountAsync,
} from "../../../../services/CommunitiesApi";

const Municipalities = () => {
  const { setIsLoading, reload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  const token = getToken();
  let navigate = useNavigate();
  const { id } = useParams();

  const [department, setDepartment] = useState([]);

  const [municipalityList, setMunicipalityList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = municipalityList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const resultDepto = await getDepartmentByIdAsync(token, id);
      if (!resultDepto.statusResponse) {
        setIsLoading(false);
        if (resultDepto.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
        toastError(resultDepto.error.message);
        return;
      }

      if (resultDepto.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultDepto.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setDepartment(resultDepto.data);

      const result = await getMunsWithCommsCountAsync(token, id);
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
      setMunicipalityList(result.data);
    })();
  }, [reload]);

  return (
    <div>
      <Container>
        <Paper
          elevation={10}
          style={{
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
            <Button
              onClick={() => {
                navigate("/departments/");
              }}
              style={{ marginRight: 20, borderRadius: 20 }}
              variant="outlined"
            >
              <FontAwesomeIcon
                style={{ marginRight: 10, fontSize: 20 }}
                icon={faCircleArrowLeft}
              />
              Regresar
            </Button>

            <h2>{`Detalle depto: ${department.name}`} </h2>
          </div>

          <hr />

          {isEmpty(currentItem) ? (
            <NoData />
          ) : (
            <Table hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ textAlign: "left" }}>Nombre Municipio</th>
                  <th style={{ textAlign: "center" }}># Comunidades</th>
                  <th>Ver</th>
                </tr>
              </thead>
              <tbody>
                {currentItem.map((item) => {
                  return (
                    <tr key={item.municipality.id}>
                      <td>{item.municipality.id}</td>
                      <td style={{ textAlign: "left" }}>
                        {item.municipality.name}
                      </td>
                      <td>{item.communitiesCount}</td>
                      <td>
                        <IconButton
                          color="primary"
                          style={{ marginRight: 10 }}
                          onClick={() => {
                            navigate(
                              `/departments/municipalities/${item.municipality.id}`
                            );
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
          )}
          <PaginationComponent
            data={municipalityList}
            paginate={paginate}
            itemsperPage={itemsperPage}
          />
        </Paper>
      </Container>
    </div>
  );
};

export default Municipalities;
