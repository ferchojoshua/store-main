import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../../helpers/Helpers";
import { getDeptosWithMunCountAsync } from "../../../services/CommunitiesApi";
import PaginationComponent from "../../../components/PaginationComponent";
import { IconButton, Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";

const Departments = () => {
  const { reload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [departmentList, setDepartmentList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = departmentList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getDeptosWithMunCountAsync(token);
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
      setDepartmentList(result.data);
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
              justifyContent: "space-between",
            }}
          >
            <h1>Lista de Departamentos</h1>
          </div>

          <hr />

          {isEmpty(currentItem) ? (
            <NoData />
          ) : (
            <Table hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ textAlign: "left" }}>Nombre Departamento</th>
                  <th style={{ textAlign: "center" }}># Municipios</th>
                  <th>Ver</th>
                </tr>
              </thead>
              <tbody>
                {currentItem.map((item) => {
                  return (
                    <tr key={item.department.id}>
                      <td>{item.department.id}</td>
                      <td style={{ textAlign: "left" }}>
                        {item.department.name}
                      </td>
                      <td>{item.municipalitiesCount}</td>
                      <td>
                        <IconButton
                          color="primary"
                          style={{ marginRight: 10 }}
                          onClick={() => {
                            navigate(`/departments/${item.department.id}`);
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
            data={departmentList}
            paginate={paginate}
            itemsperPage={itemsperPage}
          />
        </Paper>
      </Container>
    </div>
  );
};

export default Departments;
