import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";

ReactDOM.render(
  <BrowserRouter>
    <DataProvider>     
      <App />
    </DataProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
