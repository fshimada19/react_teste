import { useState } from 'react'
import Header from './componentes/Header/Header'
import Cotacao from './componentes/Cotacao/Cotacao'
import ListaCotacoes from './componentes/Cotacao/ListaCotacoes'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Usuarios from './componentes/Usuarios/Usuarios'
import AlteracaoCotacao from './componentes/Cotacao/AlteracaoCotacao'
import FormPropostaFormalizada from './componentes/PropostaFormalizada/FormPropostaFormalizada'
function App(props) {
  const [count, setCount] = useState(0)
  return (
      <div>
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Cotacao apiDados={props.apiDados} urlServer={props.urlServer} nome_usuario={props.nome_usuario} id_usuario={props.id_usuario} />} />
              <Route path={props.urlServer} element={<Cotacao apiDados={props.apiDados} urlServer={props.urlServer} nome_usuario={props.nome_usuario} id_usuario={props.id_usuario} />} />
              <Route path={props.urlServer+'cotacao'} element={<Cotacao apiDados={props.apiDados} urlServer={props.urlServer} nome_usuario={props.nome_usuario} id_usuario={props.id_usuario} />}></Route>
              <Route path={props.urlServer+'usuarios'} element={<Usuarios apiDados={props.apiDados} urlServer={props.urlServer} />}></Route>
              <Route path={props.urlServer+'listaCotacoes'} element={<ListaCotacoes apiDados={props.apiDados} urlServer={props.urlServer} nome_usuario={props.nome_usuario} id_usuario={props.id_usuario} />}></Route>
              <Route path={props.urlServer+'alteracao_cotacao/:id_cotacao'} element={<AlteracaoCotacao apiDados={props.apiDados} urlServer={props.urlServer} nome_usuario={props.nome_usuario} id_usuario={props.id_usuario} />}></Route>
              <Route path={props.urlServer+'propostaFormalizada/:id_cotacao/:token_acesso_scoa'} element={<FormPropostaFormalizada apiDados={props.apiDados} urlServer={props.urlServer} />}></Route>
              <Route path={props.urlServer+'propostaFormalizadaCliente/:id_cotacao/:token'} element={<FormPropostaFormalizada apiDados={props.apiDados} urlServer={props.urlServer} />}></Route>
            </Routes>
          </BrowserRouter>
      </div>
  )
}
export default App
