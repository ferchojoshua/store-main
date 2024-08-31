 import React from "react";
 import { Pagination } from "@mui/material";

 const PaginationComponent = ({ data, paginate, itemsperPage }) => {
    //Verificar si data está definido y tiene una propiedad length válida
   if (!data || !data.length) {
     return null;  ///O manejar el caso en que data no esté definido o sea vacío
   }

    ///Calcular el número total de páginas
   const totalPages = Math.ceil(data.length / itemsperPage);

  ///  Función para manejar el cambio de página
   const handleChange = (event, value) => {
     paginate(value);
   };

   return (
     <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
       <Pagination
         count={totalPages}
         variant="outlined"
         color="primary"
         onChange={handleChange}
       />
     </div>
   );
 };

 export default PaginationComponent;



//  import React from "react";
//  import { Pagination } from "@mui/material";

//  const PaginationComponent = ({ data, paginate, itemsperPage }) => {
//    const pageNumber = [];
//   for (let i = 0; i < Math.ceil(data.length / itemsperPage); i++) {
//      pageNumber.push(i);
//    }

//    const handleChange = (event, value) => {
//      paginate(value);
//    };

//    return (
//      <div style={{ display: "flex", justifyContent: "flex-end"  }}>
//        <Pagination
//          style={{ marginRight: 15 }}
//          count={pageNumber.length}
//          defaultPage={6}
//           siblingCount={0}
//          variant="outlined"
//          color="primary"
//          onChange={handleChange}
//        />
//      </div>
//    );
//  };

// export default PaginationComponent;
