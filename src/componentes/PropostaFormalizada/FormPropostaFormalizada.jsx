import { useParams } from "react-router-dom";
import HeaderPropostaFormalizada from "./HeaderPropstaFormalizada/HeaderPropostaFormalizada";
import { Fragment, useEffect, useState } from "react";
import api from '../../api';
import BodyPropostaFormalizada from "./BodyPropostaFormalizada/BodyPropostaFormalizada";
import Swal from "sweetalert2";
export default function PropostaFormalizada(props) {
    const { id_cotacao, token, token_acesso_scoa } = useParams();
    const [dadosProposta, setDadosProposta] = useState(null);
    const [processarDadosProposta, setProcessarDadosProposta] = useState(false);
    const [exibirDados, setExibirDados] = useState(false)

    async function busca_dados_cotacao(id_cotacao, numeroVersao="") {
        Swal.fire({
            title: "Carregando Dados da Proposta !",
            text: "Por favor Aguarde",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
        let token_acesso_dados = ""
        if(token) {
            token_acesso_dados = token;
        } else {
            if(token_acesso_scoa) {
                token_acesso_dados = token_acesso_scoa;
            }
        }

        let resultado = await api.post("https://allinkscoa.com.br"+props.apiDados+"buscar_dados_proposta_formalizada.php",
            {
                "id_cotacao": id_cotacao,
                "numero_versao": numeroVersao,
                "token_acesso": token_acesso_dados
            }

        ).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });
        if (resultado.numero_proposta) {
                        
            setDadosProposta(resultado);
            setProcessarDadosProposta(true);
            setExibirDados(true);
            Swal.close();
        } else {
            return false;
            if(token_acesso_dados === "") {
                Swal.close();
                Swal.fire({
                    title: "Sem acesso a Proposta",
                    text: "",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
                window.close();    
            } else {
                Swal.close();
                Swal.fire({
                    title: "Ocorreu um erro !",
                    text:  "Proposta Nao Encontrada",
                    icon: "error"
                });                        
                window.close();
            }
        }

    }

    const handleProcessarDadosProposta = (processarDadosProposta) => {
        setProcessarDadosProposta(processarDadosProposta);
    }

    const handleProcessarVersaoProposta = (numeroVersao) => {
        busca_dados_cotacao(id_cotacao, numeroVersao);
    }

    useEffect(() => {
        busca_dados_cotacao(id_cotacao);
    }, []);

    return (
        <Fragment>
            {exibirDados === true && (
                <Fragment>
                    <HeaderPropostaFormalizada
                        dados_proposta={dadosProposta !== null ? dadosProposta : null}
                        handleProcessarDadosProposta={handleProcessarDadosProposta}
                        tokenAcesso={token}
                        processarDadosProposta={processarDadosProposta}
                        processarVersaoProposta={handleProcessarVersaoProposta}
                
                    />
                    <BodyPropostaFormalizada
                        dados_proposta={dadosProposta !== null ? dadosProposta : null}
                        tokenAcesso={token}
                        handleProcessarDadosProposta={handleProcessarDadosProposta}
                        processarDadosProposta={processarDadosProposta}
                    />
                </Fragment>
            )}
        </Fragment>
    )
}