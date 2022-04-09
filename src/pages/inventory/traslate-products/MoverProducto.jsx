import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// import moment from "moment/moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faCircleCheck,
  faCirclePlus,
  // faCircleXmark,
  // faExternalLink,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import MediumModal from "../../../components/modals/MediumModal";
// import PaginationComponent from "../../../components/PaginationComponent";
import MoverProductoAdd from "./MoverProductoAdd";

const MoverProducto = () => {
  let navigate = useNavigate();
  // const [movimientosList, setmovimientosList] = useState([]);
  const { setIsLoading, reload } = useContext(DataContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  // const currentItem = movimientosList.slice(indexFirst, indexLast);
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      //   const result = await getEntradasAsync();
      //   if (!result.statusResponse) {
      //     setIsLoading(false);
      //     simpleMessage(result.error, "error");
      //     return;
      //   }
      setIsLoading(false);
      //   setmovimientosList(result.data);
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
