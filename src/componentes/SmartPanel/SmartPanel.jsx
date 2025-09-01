import { Fragment, useEffect, useState } from 'react';
import './SmartPanel.css'
import api from '../../api';
import ModalPropostaGemea from './ModalPropostaGemea/ModalPropostaGemea';
//import imageLoading from '';
function SmartPanel(props) {
    function nova_cotacao() {
        window.location = props.urlServer;
    }

    function abrir_modal_proposta_gemea(id_item_proposta) {
        props.abrir_modal_proposta_gemea(id_item_proposta);
    }
    const dadosBuscaPropostaGemea = {
        "id_tarifario": "",
        "peso": "",
        "cubagem": "",
        "quantidade": "",
        "numero_proposta": ""
    }


    const [listaPropostasGemea, setListaPropostaGemea] = useState([]);
    const [exibirLoading, setExibirLoading] = useState(false);
    const [dadosCarregados, setDadosCarregados] = useState(false);

    async function busca_proposta_gemea() {
        let resultado = await api.post("https://allinkscoa.com.br" + props.apiDados + "buscar_propostas_gemeas.php",
            dadosBuscaPropostaGemea
        ).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });
        if (resultado.length > 0) {
            setListaPropostaGemea(resultado);
            document.getElementsByName("loading_lista_proposta_gemea")[0].className = "class_loading hide_loading";
            document.getElementsByName("lista_propostas_gemeas_encontradas")[0].className = "show_dados";
    
        } else {
            setListaPropostaGemea([]);
            document.getElementsByName("loading_lista_proposta_gemea")[0].className = "class_loading hide_loading";
            document.getElementsByName("lista_propostas_gemeas_encontradas")[0].className = "show_dados";    
        }
    }


    useEffect(() => {
        let buscar_proposta_gemea = 1;

        if ((!props.id_tarifario_proposta_gemea) || props.id_tarifario_proposta_gemea === "" || props.id_tarifario_proposta_gemea === 0 || props.id_tarifario_proposta_gemea === "0") {
            buscar_proposta_gemea = 0;
            setListaPropostaGemea([]);
        }
        if (props.peso_total_proposta_gemea === "" || props.cubagem_total_proposta_gemea === "" || props.quantidade_total_proposta_gemea === "") {
            buscar_proposta_gemea = 0;
            setListaPropostaGemea([]);
        }
        if (buscar_proposta_gemea === 1) {
            dadosBuscaPropostaGemea.id_tarifario = props.id_tarifario_proposta_gemea;
            dadosBuscaPropostaGemea.peso = props.peso_total_proposta_gemea;
            dadosBuscaPropostaGemea.cubagem = props.cubagem_total_proposta_gemea;
            dadosBuscaPropostaGemea.quantidade = props.quantidade_total_proposta_gemea;

            if (props.numero_proposta !== null) {
                dadosBuscaPropostaGemea.numero_proposta = props.numero_proposta;
            }
            document.getElementsByName("lista_propostas_gemeas_encontradas")[0].className = "hide_dados";
            document.getElementsByName("loading_lista_proposta_gemea")[0].className = "class_loading";
            busca_proposta_gemea();
        }
    }, [
        props.id_tarifario_proposta_gemea,
        props.peso_total_proposta_gemea,
        props.cubagem_total_proposta_gemea,
        props.quantidade_total_proposta_gemea
    ]
    );

    return (
        <Fragment>
            <div className="col-md-3 col-lg-3 col-xl-3 col">
                <div className="card shadow-lg p-3 mb-3 bg-white rounded">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm">
                                <button type="button" className="btn btn-outline-dark v-icon notranslate v-icon--link mdi mdi-content-duplicate theme--light dark-grey-purple--text"></button>
                            </div>
                            <div className="col-sm">
                                <button type="button" className="btn btn-outline-dark v-icon notranslate v-icon--link mdi mdi-file-document-outline theme--light dark-grey-purple--text"></button>
                            </div>
                            <div className="col-sm">
                                <button type="button" className="btn btn-outline-dark v-icon notranslate v-icon--link mdi mdi-note-outline theme--light dark-grey-purple--text"></button>
                            </div>
                            <br />
                        </div>
                        <div className='left_panel'>
                            <br />
                            <div name="loading_lista_proposta_gemea" className="class_loading hide_loading">
                                <img src="https://allinkscoa.com.br/Imagens/carregando_dados.gif"></img>
                            </div>
                            <div name="lista_propostas_gemeas_encontradas" className='hide_dados'>
                                {listaPropostasGemea.length > 0 && (
                                    <div>
                                        <div className='div_proposta_gemea_encontrada'>
                                            <span className='texto_proposta_gemea'>Proposta Gemea Encontrada <span className='class_quantidade_proposta_gemea_encontrada'>({listaPropostasGemea.length})</span></span>
                                        </div>

                                        {listaPropostasGemea.map((item, contador) => (
                                            <div key={contador} className='div_proposta_gemea'>
                                                <span className="nome_campo_proposta_gemea_notificacao">Proposta:</span> {item.numero_proposta}<br />
                                                <span className='nome_campo_proposta_gemea_notificacao'>Data de Criação:</span> {item.data_inclusao_proposta} <br />
                                                <span className='nome_campo_proposta_gemea_notificacao'>Rota:</span> {item.rota}<br />
                                                <span className='nome_campo_proposta_gemea_notificacao'>Autor:</span> {item.nome_usuario_proposta}
                                                {(item.numero_proposta_tarifario_nac !== "" && item.numero_proposta_tarifario_nac !== null) && (
                                                    <Fragment>
                                                        <br /><span className='nome_campo_proposta_gemea_notificacao'>PT/NAC Selecionada:</span> {item.numero_proposta_tarifario_nac}<br />
                                                    </Fragment>
                                                )                                                
                                                }
                                                <br /><br />
                                                <button onClick={() => abrir_modal_proposta_gemea(item.id_item_proposta)} type="button" className="btn btn-outline-dark v-icon notranslate v-icon--link mdi mdi-note-outline theme--light dark-grey-purple--text botao_visualizar_proposta_gemea">Visualizar Proposta</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="row">
                                <div className="col-sm">
                                </div>
                                <div className="col-sm">
                                </div>
                                <div className="col-sm">
                                    <button type="button" onClick={() => nova_cotacao()} className="btn btn-primary">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    )
}

export default SmartPanel