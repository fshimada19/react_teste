import { useEffect, useState } from "react";
import ReactSelectAsync from 'react-select/async';
import api from "../../../api";
import { NumericFormat } from 'react-number-format';

export default (props) => {
    const handleFecharModal = () => {
        props.fechar_alerta(false)
    }
    return (
        <div className='modal_alert container shadow-lg bg-white rounded no-gutters m-0'>
            <div className='row modal_alert-mensagem-titulo'>
                <div className='col'>
                    <button onClick={handleFecharModal} name="fechar_modal" className='btn btn-outline-light btn-sm'> X </button>
                </div>
            </div>            
            <div className='row modal_alert-mensagem'>
                <div className='col'>
                    Modalidade da taxa {props.nome_taxa} Alterada.<br />
                    Verifique se a Alteração pode ser realizada
                </div>
            </div>        
        </div>
    );
}