import SmartPanel from '../SmartPanel/SmartPanel'
import FormCotacao from '../FormCotacao/FormCotacao';
import Header from '../Header/Header';
import { useState } from 'react';

function Cotacao(props) {
    const [id_tarifario_proposta_gemea, setIdTarifarioPropostaGemea] = useState(0);
    const [peso_total_proposta_gemea, setPesoTotalPropostaGemea] = useState("");
    const [numeroProposta, setNumeroProposta] = useState(null);
    const [cubagem_total_proposta_gemea, setCubagemTotalPropostaGemea] = useState("");
    const [quantidade_total_proposta_gemea, setQuantidadeTotalPropostaGemea] = useState("");
    const [abrir_modal_proposta_gemea, setAbrirModalPropostaGemea] = useState(false);
    const [id_proposta_gemea, setIdPropostaGemea] = useState(0);

    const handleDadosBuscaPropostaGemea = (dados_cotacao) => {
        if(dados_cotacao.dados_rota) {
            setIdTarifarioPropostaGemea(dados_cotacao.dados_rota.id_tarifario);
        }
        if(dados_cotacao.dados_carga) {
            setPesoTotalPropostaGemea(dados_cotacao.dados_carga.peso_total);
            setCubagemTotalPropostaGemea(dados_cotacao.dados_carga.cubagem_total);
            setQuantidadeTotalPropostaGemea(dados_cotacao.dados_carga.volume_total);    
        }
    }

    const handleAbrirModalPropostaGemea = (id_proposta_gemea) => {
        setIdPropostaGemea(id_proposta_gemea);
        setAbrirModalPropostaGemea(true);
    }

    const handleFecharModalPropostaGemea = () => {
        setAbrirModalPropostaGemea(false);
    }

    const handleNumeroPropostaSalva = (numero_proposta) => {
        setNumeroProposta(numero_proposta);
    }
    return (
        <>
        <Header apiDados={props.apiDados} urlServer={props.urlServer} id_usuario={props.id_usuario} nome_usuario={props.nome_usuario} />
        <div className="row d-flex white-40 no-gutters">
            <SmartPanel 
                apiDados={props.apiDados} 
                urlServer={props.urlServer} 
                id_usuario={props.id_usuario}
                id_tarifario_proposta_gemea={id_tarifario_proposta_gemea}
                peso_total_proposta_gemea={peso_total_proposta_gemea}
                cubagem_total_proposta_gemea={cubagem_total_proposta_gemea}
                quantidade_total_proposta_gemea={quantidade_total_proposta_gemea}
                abrir_modal_proposta_gemea={handleAbrirModalPropostaGemea}
                numero_proposta={numeroProposta}
            />

            <FormCotacao 
                apiDados={props.apiDados} 
                urlServer={props.urlServer} 
                dados_proposta_carregado={false} 
                dados_proposta={null} 
                numero_proposta={null} 
                id_cotacao={null} 
                modo_alteracao={false} 
                id_usuario={props.id_usuario} 
                nome_usuario={props.nome_usuario} 
                busca_proposta_gemea={handleDadosBuscaPropostaGemea}
                abrir_modal_proposta_gemea={abrir_modal_proposta_gemea}
                id_proposta_gemea={id_proposta_gemea}
                fechar_modal_proposta_gemea={handleFecharModalPropostaGemea}
                numero_proposta_salva={handleNumeroPropostaSalva}
            />
                
        </div>
        </>        
    );
}

export default Cotacao
