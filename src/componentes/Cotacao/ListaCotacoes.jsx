import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import FormListaCotacoes from '../FormListaCotacoes/FormListaCotacoes';
import SmartPanel from '../SmartPanel/SmartPanel';
import Header from '../Header/Header';
export default (props) => {
    
    const [dados_header,setDadosHeader] = useState({
        "pendente":false
    });
    
    const handleSalvarCotacao = () => {
    }

    const handleCalcularProposta = () => {
    }
    
    const handleAbrirModalAnexarArquivo = () => {
    }
    
    return (
        <>
        <Header apiDados={props.apiDados} urlServer={props.urlServer} id_usuario={props.id_usuario} nome_usuario={props.nome_usuario} />
        <div className="row d-flex white-40 no-gutters">
            <SmartPanel apiDados={props.apiDados} urlServer={props.urlServer} id_usuario={props.id_usuario} />
            <FormListaCotacoes apiDados={props.apiDados} urlServer={props.urlServer} id_usuario={props.id_usuario} nome_usuario={props.nome_usuario} />
        </div>        
        </>
    )
}
