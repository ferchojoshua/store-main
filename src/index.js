import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import  "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


ReactDOM.render(
  <BrowserRouter>
    <DataProvider>     
      <App />
    </DataProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
