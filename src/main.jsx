import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App apiDados={document.getElementById('root').getAttribute("urlApiDados")} urlServer={document.getElementById('root').getAttribute("urlServer")} id_usuario={document.getElementById('root').getAttribute("id_usuario")}  nome_usuario={document.getElementById('root').getAttribute("nome_usuario")} />
  </React.StrictMode>,
)
