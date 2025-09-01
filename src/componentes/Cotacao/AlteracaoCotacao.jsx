import SmartPanel from '../SmartPanel/SmartPanel'
import FormCotacao from '../FormCotacao/FormCotacao';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiHomol from '../../api_homol';
import api from '../../api';
import Header from '../Header/Header';
import Swal from 'sweetalert2';

function AlteracaoCotacao(props) {
    const {id_cotacao} = useParams();
    const [dadosProposta, setDadosProposta] = useState(null);
    const [numeroProposta, setNumeroProposta] = useState(null);
    const [dadosPropostaCarregado, setDadosPropostaCarregado] = useState(false);

    const [id_tarifario_proposta_gemea, setIdTarifarioPropostaGemea] = useState(0);
    const [peso_total_proposta_gemea, setPesoTotalPropostaGemea] = useState("");
    const [cubagem_total_proposta_gemea, setCubagemTotalPropostaGemea] = useState("");
    const [quantidade_total_proposta_gemea, setQuantidadeTotalPropostaGemea] = useState("");

    const [abrir_modal_proposta_gemea, setAbrirModalPropostaGemea] = useState(false);
    const [id_proposta_gemea, setIdPropostaGemea] = useState(0);


    async function busca_cotacao(id_cotacao) {
        Swal.fire({
            title: "Carregando dados da Proposta !",
            text:"Por favor Aguarde",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,            
        });

        let resultado = await api.post("https://allinkscoa.com.br"+props.apiDados+"buscar_dados_proposta.php",
            {
                "id_cotacao": id_cotacao
            }
        ).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });        
        setDadosProposta(resultado);
        if(resultado.numero_proposta) {
            setNumeroProposta(resultado.numero_proposta);
            setDadosPropostaCarregado(true);
            Swal.close();
        }
    }

    useEffect(() => {
        busca_cotacao(id_cotacao);
    }, []);

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
                dados_proposta_carregado={dadosPropostaCarregado} 
                dados_proposta={dadosProposta} 
                numero_proposta={numeroProposta} 
                id_cotacao={id_cotacao} 
                modo_alteracao={true} 
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

export default AlteracaoCotacao