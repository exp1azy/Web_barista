import React from "react";
import { createRoot } from "react-dom/client";
import AppRoot from "./AppRoot.jsx";
import "../node_modules/bootstrap/dist/css/bootstrap.css"
 
createRoot(
    document.getElementById("app")
).render(
    <AppRoot />
);