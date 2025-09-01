import { useEffect, useState, useRef } from 'react';
import { default as ReactSelect, components } from 'react-select';
import ReactSelectAsync from 'react-select/async';

import api from '../../api';
import Swal from 'sweetalert2'
import XMLJS from 'xml-js'
export default (props) => {
    const [processaDadosRota, setProcessaDadosRota] = useState(false);
    const [valueOrigemSelecionada, setValueOrigemSelecionada] = useState("");
    const [valueDestinoSelecionado, setValueDestinoSelecionado] = useState("");
    const [listarRotas, setListarRotas] = useState(false);
    const [tarifariosPadrao, setTarifariosPadrao] = useState([]);
    const [tarifariosAcordo, setTarifariosAcordo] = useState([]);
    const [contadorTarifarios, setContadorTarifarios] = useState(0);
    const [impExpSelecionado, setimpExpSelecionado] = useState('');

    const [desabilitarRotasImo, setdesabilitarRotasImo] = useState(false);
    const [verificarRotasCondicoes, setverificarRotasCondicoes] = useState(false);

    const [formatacaoRota, setFormatacaoRota] = useState('container shadow p-3 mb-3 bg-white rounded m-0 lista_rota');
    const [formatacaoPadraoRotasDesfocada, setFormatacaoPadraoRotasDesfocada] = useState('container shadow p-3 mb-3 bg-white rounded m-0 opacity-25');
    const [rotasLabel, setRotasLabel] = useState("Selecionar Rota");
    const [idTarifarioSelecionado, setIdTarifarioSelecionado] = useState("");
    const [numeroPropostaSelecionada, setNumeroPropostaSelecionada] = useState("");
    const [dadosSalvosCarregados, setDadosSalvosCarregados] = useState(false);

    const [dados_rota, setDadosRota] = useState({
        "id_tarifario": "",
        "origem": "",
        "destino": "",
        "pp": "",
        "cc": "",
        "incoterm": "",
        "numero_proposta": ""
    })

    var contadorListaTarifario = -1;

    const loadOptionsOrigem = (searchValue) => {
        let DestinoSelecionado = "";
        if (valueDestinoSelecionado !== "") {
            DestinoSelecionado = valueDestinoSelecionado.value;
        }

        return api.post("https://allinkscoa.com.br" + props.apiDados + "BuscaPortosCombo.php", {
            "parametro_busca": searchValue,
            "objeto_requisicao": "origem",
            "verificacao_direcao": DestinoSelecionado
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });
    }

    const loadOptionsDestino = (searchValue) => {
        let OrigemSelecionada = "";
        if (valueOrigemSelecionada !== "") {
            OrigemSelecionada = valueOrigemSelecionada.value;
        }

        return api.post("https://allinkscoa.com.br" + props.apiDados + "BuscaPortosCombo.php", {
            parametro_busca: searchValue,
            verificacao_direcao: OrigemSelecionada,
            objeto_requisicao: "destino"
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });
    }

    async function listar_tarifarios_cliente(selecao_rota, valor_selecao, origem_value = null, destino_value = null, id_cliente_selecionado = 0, ppccSelecionado) {
        setTarifariosPadrao([]);
        setTarifariosAcordo([]);
        let lista_tarifarios_padrao = [];
        let lista_propostas_acordo = [];

        let id_cliente = "";
        let origem = "";
        let destino = "";

        let imp_exp = "IMP";
        let modalidadePPCC = "";

        if (origem_value === null && destino_value === null) {
            id_cliente = props.idClienteSelecionado;
            if (selecao_rota == "origem") {
                origem = valor_selecao.value;
                destino = valueDestinoSelecionado.value;
            } else {
                origem = valueOrigemSelecionada.value;
                destino = valor_selecao.value;
            }

            if (origem.substring(0, 2) == "BR") {
                imp_exp = "EXP";
                setIsCheckedPP(true);
                modalidadePPCC = "PP";
                setIsCheckedCC(false);
                setValueIncotermSelecionado({ "value": "CIF", "label": "CIF" });
            } else {
                setIsCheckedCC(true);
                modalidadePPCC = "CC";
                setIsCheckedPP(false);
                setValueIncotermSelecionado({ "value": "FOB", "label": "FOB" });
            }
            setimpExpSelecionado(imp_exp);
        } else {
            id_cliente = id_cliente_selecionado;
            origem = origem_value.value;
            destino = destino_value.value;
            modalidadePPCC = ppccSelecionado;

            if (origem.substring(0, 2) == "BR") {
                imp_exp = "EXP";
            } else {
                imp_exp = "IMP";
            }
        }



        // Listar Tarifarios Padrao
        let response_servicos = await api.get("https://allinkscoa.com.br/Clientes/propostas/index.php/api/tarifas/buscar/" + id_cliente + "/0/PP/" + imp_exp + "/" + origem + "/NULL/NULL/" + destino + "/S", {
            "Content-Type": "application/xml; charset=utf-8"
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });
        let json_result = XMLJS.xml2json(response_servicos, { compact: true, spaces: 2 })
        json_result = JSON.parse(json_result)

        let resultado = [];
        if (json_result.tarifas.servico) {
            if (json_result.tarifas.servico.id_tarifario) {
                resultado = [json_result.tarifas.servico];
                //setTarifariosPadrao([json_result.tarifas.servico])
            } else {
                resultado = json_result.tarifas.servico;
                //setTarifariosPadrao(json_result.tarifas.servico);
            }

            let id_tarifarios = [];
            resultado.map(function (item) {
                if (!item.numero_proposta) {
                    let valor_transhipment_rota = '';
                    let moeda_transhipment_rota = '';
                    if (item.transhipment) {
                        valor_transhipment_rota = item.transhipment.valor._text;
                        moeda_transhipment_rota = item.transhipment.moeda._text;
                    }
                    if (item.frete) {
                        lista_tarifarios_padrao = [...lista_tarifarios_padrao,
                        {
                            "id_tarifario": item.id_tarifario._text,
                            "origem": item.origem._text,
                            "uncode_origem": item.uncode_origem._text,
                            "embarque": item.embarque._text,
                            "uncode_embarque": item.uncode_embarque._text,
                            "desembarque": item.desembarque._text,
                            "uncode_desembarque": item.uncode_desembarque._text,
                            "destino": item.destino._text,
                            "uncode_destino": item.uncode_destino._text,
                            "id_agente": item.id_agente._text,
                            "agente": item.agente._text,
                            "id_sub_agente": item.id_sub_agente._text,
                            "sub_agente": item.sub_agente._text,
                            "rota_principal": item.rota_principal._text,
                            "transit_time_onboard": item.transit_time_onboard._text,
                            "aceita_frete_cc": item.aceita_frete_cc._text,
                            "valor_frete_venda": item.frete.valor._text,
                            "moeda_frete_venda": item.frete.moeda._text,
                            "unidade_frete_venda": item.frete.unidade._text,
                            "valor_frete_compra": item.frete_compra.valor._text,
                            "nome_nac_exibicao": "",
                            "numero_proposta": "",
                            "valor_transhipment": valor_transhipment_rota,
                            "moeda_transhipment": moeda_transhipment_rota,
                            "rota_selecionada": "0",
                            "aceita_imo": "",
                            "data_expiracao": item.eta
                        }]
                        id_tarifarios = [...id_tarifarios, item.id_tarifario._text];
                    }
                }
            });

            // Busca Tarifario Vencido / Cancelado
            if (props.dados_proposta_salva !== null) {
                let response_servicos_tarifario = await api.get("https://allinkscoa.com.br/Clientes/propostas/index.php/api/tarifas/buscarTarifarioCompleto/" + props.dados_proposta_salva.dados_rota.id_tarifario + "/" + id_cliente + "/N/PP/", {
                    "Content-Type": "application/xml; charset=utf-8"
                }).then((response) => {
                    return response.data
                }).catch((err) => {
                    console.error("Ocorreu um erro" + err);
                });
                let json_result_selecionados = XMLJS.xml2json(response_servicos_tarifario, { compact: true, spaces: 2 });
                let id_tarifario_encontrado = lista_tarifarios_padrao.find((dados_proposta_salva) => dados_proposta_salva.id_tarifario === props.dados_proposta_salva.dados_rota.id_tarifario);
                if (!id_tarifario_encontrado) {
                    lista_tarifarios_padrao = [...lista_tarifarios_padrao,
                    {
                        "id_tarifario": props.dados_proposta_salva.dados_rota.id_tarifario,
                        "origem": props.dados_proposta_salva.dados_rota.origem.label,
                        "uncode_origem": props.dados_proposta_salva.dados_rota.origem.value,
                        "embarque": "-",
                        "uncode_embarque": "-",
                        "desembarque": "-",
                        "uncode_desembarque": "-",
                        "destino": props.dados_proposta_salva.dados_rota.destino.label,
                        "uncode_destino": props.dados_proposta_salva.dados_rota.destino.value,
                        "id_agente": 0,
                        "agente": "",
                        "id_sub_agente": "",
                        "sub_agente": "",
                        "rota_principal": "",
                        "transit_time_onboard": "",
                        "aceita_frete_cc": "S",
                        "valor_frete_venda": '',
                        "moeda_frete_venda": "Tarifario Cancelado",
                        "unidade_frete_venda": 0.00,
                        "valor_frete_compra": 0.00,
                        "nome_nac": "",
                        "nome_nac_exibicao": "",
                        "numero_proposta": "",
                        "valor_transhipment": 0.00,
                        "moeda_transhipment": "USD",
                        "rota_selecionada": "0",
                        "aceita_imo": "",
                        "data_expiracao": ""
                    }]
                }
            }

            // Lista Tarifarios com Spot e NAC
            let response_servicos_acordos = await api.get("https://allinkscoa.com.br/Clientes/propostas/index.php/api/tarifas/buscar/" + id_cliente + "/0/PP/" + imp_exp + "/" + origem + "/NULL/NULL/" + destino + "/N", {
                "Content-Type": "application/xml; charset=utf-8"
            }).then((response) => {
                return response.data
            }).catch((err) => {
                console.error("Ocorreu um erro" + err);
            });
            let json_result_acordos = XMLJS.xml2json(response_servicos_acordos, { compact: true, spaces: 2 })
            json_result_acordos = JSON.parse(json_result_acordos)

            if (json_result_acordos.tarifas.servico.id_tarifario) {
                resultado = [json_result_acordos.tarifas.servico];
                //setRotaUnica([json_result.tarifas.servico])
            } else {
                resultado = json_result_acordos.tarifas.servico;
                //setRotaUnica(json_result.tarifas.servico);
            }


            resultado.map(function (item) {
                if (item.numero_proposta) {
                    let valor_transhipment_rota = '';
                    let moeda_transhipment_rota = '';
                    let nome_nac = '';
                    let nome_nac_exibicao = '';
                    if (item.transhipment) {
                        valor_transhipment_rota = item.transhipment.valor._text;
                        moeda_transhipment_rota = item.transhipment.moeda._text;
                    }

                    if (item.nome_nac) {
                        nome_nac = item.nome_nac._text;
                        nome_nac_exibicao = "- " + item.nome_nac._text;
                    }
                    if (item.frete) {
                        lista_propostas_acordo = [...lista_propostas_acordo,
                        {
                            "id_tarifario": item.id_tarifario._text,
                            "origem": item.origem._text,
                            "uncode_origem": item.uncode_origem._text,
                            "embarque": item.embarque._text,
                            "uncode_embarque": item.uncode_embarque._text,
                            "desembarque": item.desembarque._text,
                            "uncode_desembarque": item.uncode_desembarque._text,
                            "destino": item.destino._text,
                            "uncode_destino": item.uncode_destino._text,
                            "id_agente": item.id_agente._text,
                            "agente": item.agente._text,
                            "id_sub_agente": item.id_sub_agente._text,
                            "sub_agente": item.sub_agente._text,
                            "rota_principal": item.rota_principal._text,
                            "transit_time_onboard": item.transit_time_onboard._text,
                            "aceita_frete_cc": item.aceita_frete_cc._text,
                            "valor_frete_venda": item.frete.valor._text,
                            "moeda_frete_venda": item.frete.moeda._text,
                            "unidade_frete_venda": item.frete.unidade._text,
                            "valor_frete_compra": item.frete_compra.valor._text,
                            "nome_nac": nome_nac,
                            "nome_nac_exibicao": nome_nac_exibicao,
                            "numero_proposta": item.numero_proposta._text,
                            "valor_transhipment": valor_transhipment_rota,
                            "moeda_transhipment": moeda_transhipment_rota,
                            "rota_selecionada": "0",
                            "aceita_imo": "",
                            "data_expiracao": item.eta
                        }]
                        id_tarifarios = [...id_tarifarios, item.id_tarifario._text];
                    }
                }

            });

            if (props.dados_proposta_salva !== null) {
                if (dadosSalvosCarregados === false) {
                    if (props.dados_proposta_salva.dados_rota.numero_proposta != "") {
                        let numero_proposta_tarifario = lista_propostas_acordo.find((dados_proposta_salva) => dados_proposta_salva.numero_proposta === props.dados_proposta_salva.dados_rota.numero_proposta);
                        if (!numero_proposta_tarifario) {
                            let response_servicos_acordos = await api.get("https://allinkscoa.com.br/Clientes/propostas/index.php/api/tarifas/buscarTarifarioCompleto/" + props.dados_proposta_salva.dados_rota.id_tarifario + "/" + id_cliente + "/N/PP/" + props.dados_proposta_salva.dados_rota.numero_proposta, {
                                "Content-Type": "application/xml; charset=utf-8"
                            }).then((response) => {
                                return response.data
                            }).catch((err) => {
                                console.error("Ocorreu um erro" + err);
                            });
                            let json_result_acordos_selecionados = XMLJS.xml2json(response_servicos_acordos, { compact: true, spaces: 2 })
                            let json_result_acordos = JSON.parse(json_result_acordos_selecionados);

                            lista_propostas_acordo = [...lista_propostas_acordo,
                            {
                                "id_tarifario": json_result_acordos.tarifario.id_tarifario._text,
                                "origem": json_result_acordos.tarifario.rota.origem.nome._text,
                                "uncode_origem": json_result_acordos.tarifario.rota.origem.uncode._text,
                                "embarque": json_result_acordos.tarifario.rota.embarque.nome._text,
                                "uncode_embarque": json_result_acordos.tarifario.rota.embarque.uncode._text,
                                "desembarque": json_result_acordos.tarifario.rota.desembarque.nome._text,
                                "uncode_desembarque": json_result_acordos.tarifario.rota.desembarque.uncode._text,
                                "destino": json_result_acordos.tarifario.rota.destino.nome._text,
                                "uncode_destino": json_result_acordos.tarifario.rota.destino.uncode._text,
                                "id_agente": json_result_acordos.tarifario.agente.id_agente._text,
                                "agente": json_result_acordos.tarifario.agente.razao._text,
                                "id_sub_agente": json_result_acordos.tarifario.sub_agente.id_agente._text,
                                "sub_agente": json_result_acordos.tarifario.sub_agente.razao._text,
                                "rota_principal": "",
                                "transit_time_onboard": json_result_acordos.tarifario.transit_time_onboard._text,
                                "aceita_frete_cc": "S",
                                "valor_frete_venda": 'Acordo',
                                "moeda_frete_venda": "Vencido",
                                "unidade_frete_venda": 0.00,
                                "valor_frete_compra": 0.00,
                                "nome_nac": "",
                                "nome_nac_exibicao": "",
                                "numero_proposta": props.dados_proposta_salva.dados_rota.numero_proposta,
                                "valor_transhipment": 0.00,
                                "moeda_transhipment": "USD",
                                "rota_selecionada": "0",
                                "aceita_imo": "",
                                "data_expiracao": ""
                            }]
                            id_tarifarios = [...id_tarifarios, json_result_acordos.tarifario.id_tarifario._text];
                        }
                    }
                }
            }


            if (id_tarifarios.length > 0) {
                let response_aceita_imo_tarifario = await api.post("https://allinkscoa.com.br" + props.apiDados + "buscaAceitaImoRota.php", {
                    "ids_tarifarios": id_tarifarios
                }).then((response) => {
                    return response.data
                }).catch((err) => {
                    console.error("Ocorreu um erro" + err);
                });

                lista_tarifarios_padrao.map((item, contadorTarifario) => {
                    let result_aceita_imo_tarifario = response_aceita_imo_tarifario.find(({ id_tarifario }) => id_tarifario === item.id_tarifario);
                    if (result_aceita_imo_tarifario) {
                        item.aceita_imo = result_aceita_imo_tarifario.aceita_imo;
                    }
                });

                lista_propostas_acordo.map((item, contadorTarifario) => {
                    let result_aceita_imo_tarifario = response_aceita_imo_tarifario.find(({ id_tarifario }) => id_tarifario === item.id_tarifario);
                    if (result_aceita_imo_tarifario) {
                        item.aceita_imo = result_aceita_imo_tarifario.aceita_imo;
                    }
                });
            }


            let qtde_totais_tarifarios = (lista_propostas_acordo.length + lista_tarifarios_padrao.length);
            if (qtde_totais_tarifarios > 1) {
                setFormatacaoRota("container shadow p-3 mb-3 bg-white rounded m-0 lista_rota");
                setRotasLabel("Selecionar Rota");
                setTarifariosPadrao(lista_tarifarios_padrao);
                setTarifariosAcordo(lista_propostas_acordo);
                setProcessaDadosRota(true);
                if (props.cargaImo === "S") {
                    setdesabilitarRotasImo(true);
                    setverificarRotasCondicoes(true);
                } else {
                    setdesabilitarRotasImo(false);
                    setverificarRotasCondicoes(true);
                }

            } else if (qtde_totais_tarifarios == 1) {
                setFormatacaoRota("container shadow p-3 mb-3 bg-white rounded m-0 lista_rota rota_selecionada");
                setRotasLabel("Rota Selecionada");
                let numero_proposta = "";
                let id_tarifario = "";
                let bloqueio_imo = 0;
                if (lista_propostas_acordo.length > 0) {
                    lista_propostas_acordo.map((item) => {
                        numero_proposta = item.numero_proposta;
                        id_tarifario = item.id_tarifario
                        item.rota_selecionada = "1";
                        if (item.aceita_imo === "N") {
                            bloqueio_imo = 1;
                        }
                    })
                    setTarifariosAcordo(lista_propostas_acordo);
                }

                if (lista_tarifarios_padrao.length > 0) {
                    lista_tarifarios_padrao.map((item) => {
                        id_tarifario = item.id_tarifario;
                        item.rota_selecionada = "1";
                        if (item.aceita_imo === "N") {
                            bloqueio_imo = 1;
                        }
                    })
                    setTarifariosPadrao(lista_tarifarios_padrao);
                }
                if (bloqueio_imo === 1) {
                    props.handleBloqueioImo(true);
                } else {
                    props.handleBloqueioImo(false);
                }

                setIdTarifarioSelecionado(id_tarifario);
                setNumeroPropostaSelecionada(numero_proposta);
                props.dadosRotaSelecionada(id_tarifario, numero_proposta, modalidadePPCC);
                setProcessaDadosRota(true);

                if (props.cargaImo === "S") {
                    setdesabilitarRotasImo(true);
                    setverificarRotasCondicoes(true);
                } else {
                    setdesabilitarRotasImo(false);
                    setverificarRotasCondicoes(true);
                }

            }

        } else {
            if (props.dados_proposta_salva !== null) {
                if (props.dados_proposta_salva.dados_rota.numero_proposta === "") {
                    lista_tarifarios_padrao = [...lista_tarifarios_padrao,
                    {
                        "id_tarifario": props.dados_proposta_salva.dados_rota.id_tarifario,
                        "origem": props.dados_proposta_salva.dados_rota.origem.label,
                        "uncode_origem": props.dados_proposta_salva.dados_rota.origem.value,
                        "embarque": "-",
                        "uncode_embarque": "-",
                        "desembarque": "-",
                        "uncode_desembarque": "-",
                        "destino": props.dados_proposta_salva.dados_rota.destino.label,
                        "uncode_destino": props.dados_proposta_salva.dados_rota.destino.value,
                        "id_agente": 0,
                        "agente": "",
                        "id_sub_agente": "",
                        "sub_agente": "",
                        "rota_principal": "",
                        "transit_time_onboard": "",
                        "aceita_frete_cc": "S",
                        "valor_frete_venda": '',
                        "moeda_frete_venda": "Tarifario Cancelado",
                        "unidade_frete_venda": 0.00,
                        "valor_frete_compra": 0.00,
                        "nome_nac": "",
                        "nome_nac_exibicao": "",
                        "numero_proposta": "",
                        "valor_transhipment": 0.00,
                        "moeda_transhipment": "USD",
                        "rota_selecionada": "0",
                        "aceita_imo": "",
                        "data_expiracao": ""
                    }]
                    setTarifariosPadrao(lista_tarifarios_padrao);
                } else {
                    lista_propostas_acordo = [...lista_propostas_acordo,
                    {
                        "id_tarifario": props.dados_proposta_salva.dados_rota.id_tarifario,
                        "origem": props.dados_proposta_salva.dados_rota.origem.label,
                        "uncode_origem": props.dados_proposta_salva.dados_rota.origem.value,
                        "embarque": "-",
                        "uncode_embarque": "-",
                        "desembarque": "-",
                        "uncode_desembarque": "",
                        "destino": props.dados_proposta_salva.dados_rota.destino.label,
                        "uncode_destino": props.dados_proposta_salva.dados_rota.destino.value,
                        "id_agente": "",
                        "agente": "",
                        "id_sub_agente": "",
                        "sub_agente": "",
                        "rota_principal": "",
                        "transit_time_onboard": "",
                        "aceita_frete_cc": "S",
                        "valor_frete_venda": 'tarifario',
                        "moeda_frete_venda": "Cancelado",
                        "unidade_frete_venda": 0.00,
                        "valor_frete_compra": 0.00,
                        "nome_nac": "",
                        "nome_nac_exibicao": "",
                        "numero_proposta": props.dados_proposta_salva.dados_rota.numero_proposta,
                        "valor_transhipment": 0.00,
                        "moeda_transhipment": "USD",
                        "rota_selecionada": "0",
                        "aceita_imo": "",
                        "data_expiracao": ""
                    }];
                    setTarifariosAcordo(lista_propostas_acordo);                    
                }
            }
        }

        if (selecao_rota === "ambos") {

            setSelecionarRotaSalva(true);
        }
    }

    const handleChangeOrigem = (selectedOption, triggeredAction) => {
        setValueOrigemSelecionada(selectedOption);
        if (triggeredAction.action === 'clear') {
            setValueOrigemSelecionada('');
            setListarRotas(false);
        } else {
            if (valueDestinoSelecionado !== "" && selectedOption !== "") {
                setListarRotas(true);
                listar_tarifarios_cliente("origem", selectedOption);
            } else {
                setListarRotas(false);
            }
        }
        props.recarregar_taxas(true)
    }

    const handleChangeDestino = (selectedOption, triggeredAction) => {
        setValueDestinoSelecionado(selectedOption);
        if (triggeredAction.action === 'clear') {
            setValueDestinoSelecionado('');
            setListarRotas(false);
        } else {
            if (valueOrigemSelecionada != "" && selectedOption != "") {
                listar_tarifarios_cliente("destino", selectedOption);
                setListarRotas(true);
            } else {
                setListarRotas(false);
            }
        }
        props.recarregar_taxas(true);
    }

    const [rotaSelecionada, setRotaSelecionada] = useState({ "tipo_tarifario": "", "contador_rota": "", "id_tarifario": "", "numeroProposta": "", "aceita_imo": "", "aceita_frete_cc": "" });
    function handleSelecionarRota(tipo_tarifario, elemento, id_tarifario = 0, numero_proposta = "") {
        let elemento_selecionado = document.querySelector("div[name='lista_tarifarios'][tipo_tarifario='" + tipo_tarifario + "'][contador_rota='" + elemento + "']");
        if (isCheckedCC == true) {
            if (elemento_selecionado.getAttribute("aceita_cc") == "N") {
                return false;
            }
        }

        if (props.listaCargaImo.length > 0) {
            if (elemento_selecionado.getAttribute("aceita_imo") === "N") {
                props.handleBloqueioImo(true);
                return false;
            }
        }

        let qtde_rotas = document.getElementsByName("lista_tarifarios").length;
        if (tipo_tarifario != rotaSelecionada.tipo_tarifario || elemento != rotaSelecionada.contador_rota) {
            for (let i = 0; i < qtde_rotas; i++) {
                document.getElementsByName("lista_tarifarios")[i].className = "d-none";
            }
            elemento_selecionado.className = "container shadow p-3 mb-3 bg-white rounded m-0 lista_rota rota_selecionada";
            elemento_selecionado.setAttribute("rota_selecionada", "1");
            setRotaSelecionada({ "tipo_tarifario": tipo_tarifario, "contador_rota": elemento, "id_tarifario": id_tarifario, "numeroProposta": numero_proposta, "aceita_imo": elemento_selecionado.getAttribute("aceita_imo") });
            let fretePPCC = "";
            if (isCheckedPP == true && isCheckedCC == true) {
                fretePPCC = "PP/CC";
            } else if (isCheckedPP == true) {
                fretePPCC = "PP";
            } else if (isCheckedCC == true) {
                fretePPCC = "CC";
            }

            if (elemento_selecionado.getAttribute("aceita_imo") === "N") {
                props.handleBloqueioImo(true);
            } else {
                props.handleBloqueioImo(false);
            }

            setIdTarifarioSelecionado(id_tarifario);
            setNumeroPropostaSelecionada(numero_proposta);
            props.dadosRotaSelecionada(id_tarifario, numero_proposta, fretePPCC);
        } else {
            for (let i = 0; i < qtde_rotas; i++) {
                document.getElementsByName("lista_tarifarios")[i].className = formatacaoRota;
            }
            if (isCheckedCC == true) {
                let elementosDesfocados = document.querySelectorAll("div[name='lista_tarifarios'][aceita_cc='N']");
                for (let i = 0; i < elementosDesfocados.length; i++) {
                    elementosDesfocados[i].className = formatacaoPadraoRotasDesfocada;
                    if (elementosDesfocados[i].getAttribute("rota_selecionada") === "1") {
                        props.dadosRotaSelecionada(0, "", "");
                        setIdTarifarioSelecionado(0);
                    } else {
                        if (elementosDesfocados[i].getAttribute("id_tarifario") === dados_rota.id_tarifario || elementosDesfocados[i].getAttribute("id_tarifario") === idTarifarioSelecionado) {
                            props.dadosRotaSelecionada(0, "", "");
                            setIdTarifarioSelecionado(0);
                        }
                    }
                }
            }

            if (props.cargaImo === "S") {
                let elementosDesfocados = document.querySelectorAll("div[name='lista_tarifarios'][aceita_imo='N']");
                for (let i = 0; i < elementosDesfocados.length; i++) {
                    elementosDesfocados[i].className = formatacaoPadraoRotasDesfocada;
                    if (elementosDesfocados[i].getAttribute("rota_selecionada") === "1") {
                        props.dadosRotaSelecionada(0, "", "");
                        setIdTarifarioSelecionado(0);
                    } else {
                        if (elementosDesfocados[i].getAttribute("id_tarifario") === dados_rota.id_tarifario || elementosDesfocados[i].getAttribute("id_tarifario") === idTarifarioSelecionado) {
                            props.dadosRotaSelecionada(0, "", "");
                            setIdTarifarioSelecionado(0);
                        }
                    }
                }
            }

            if (qtde_rotas > 1) {
                elemento_selecionado.setAttribute("rota_selecionada", "0");
                setRotaSelecionada({ "tipo_tarifario": "", "contador_rota": "", "id_tarifario": "", "numeroProposta": "", "aceita_imo": "" })
                setIdTarifarioSelecionado(0);
                setNumeroPropostaSelecionada("");
                props.dadosRotaSelecionada(0, "", "");
            }
        }
        setProcessaDadosRota(true);
    }

    function dados_selecionar_dados_rota_salva(tipo_tarifario, id_tarifario, numero_proposta = "") {
        //let elemento_selecionado = document.querySelector("div[name='lista_tarifarios'][tipo_tarifario='" + tipo_tarifario + "'][contador_rota='" + elemento + "']");

        let elemento_selecionado = document.querySelector("div[name='lista_tarifarios'][tipo_tarifario='" + tipo_tarifario + "'][id_tarifario='" + id_tarifario + "']");
        if (tipo_tarifario === "acordos") {
            elemento_selecionado = document.querySelector("div[name='lista_tarifarios'][tipo_tarifario='" + tipo_tarifario + "'][id_tarifario='" + id_tarifario + "'][numero_proposta='" + numero_proposta + "']");
        }

        let elemento = elemento_selecionado.getAttribute("contador_rota");


        let qtde_rotas = document.getElementsByName("lista_tarifarios").length;
        if (tipo_tarifario != rotaSelecionada.tipo_tarifario || elemento != rotaSelecionada.contador_rota) {
            for (let i = 0; i < qtde_rotas; i++) {
                document.getElementsByName("lista_tarifarios")[i].className = "d-none";
            }
            elemento_selecionado.className = "container shadow p-3 mb-3 bg-white rounded m-0 lista_rota rota_selecionada";
            elemento_selecionado.setAttribute("rota_selecionada", "1");
            setRotaSelecionada({ "tipo_tarifario": tipo_tarifario, "contador_rota": elemento, "id_tarifario": id_tarifario, "numeroProposta": numero_proposta, "aceita_imo": elemento_selecionado.getAttribute("aceita_imo") });
            let fretePPCC = "";
            if (isCheckedPP == true && isCheckedCC == true) {
                fretePPCC = "PP/CC";
            } else if (isCheckedPP == true) {
                fretePPCC = "PP";
            } else if (isCheckedCC == true) {
                fretePPCC = "CC";
            }
            if (elemento_selecionado.getAttribute("aceita_imo") === "N") {
                props.handleBloqueioImo(true);
            } else {
                props.handleBloqueioImo(false);
            }
            setIdTarifarioSelecionado(id_tarifario);
            setNumeroPropostaSelecionada(numero_proposta);
            //props.dadosRotaSelecionada(id_tarifario, numero_proposta, fretePPCC);
        } else {
            for (let i = 0; i < qtde_rotas; i++) {
                document.getElementsByName("lista_tarifarios")[i].className = formatacaoRota;
            }
            if (isCheckedCC == true) {
                let elementosDesfocados = document.querySelectorAll("div[name='lista_tarifarios'][aceita_cc='N']");
                for (let i = 0; i < elementosDesfocados.length; i++) {
                    elementosDesfocados[i].className = formatacaoPadraoRotasDesfocada;
                    if (elementosDesfocados[i].getAttribute("rota_selecionada") === "1") {
                        props.dadosRotaSelecionada(0, "", "");
                        setIdTarifarioSelecionado(0);
                    } else {
                        if (elementosDesfocados[i].getAttribute("id_tarifario") === dados_rota.id_tarifario || elementosDesfocados[i].getAttribute("id_tarifario") === idTarifarioSelecionado) {
                            props.dadosRotaSelecionada(0, "", "");
                            setIdTarifarioSelecionado(0);
                        }
                    }
                }
            }

            if (props.cargaImo === "S") {
                let elementosDesfocados = document.querySelectorAll("div[name='lista_tarifarios'][aceita_imo='N']");
                let rota_imo_selecionada = 0;
                for (let i = 0; i < elementosDesfocados.length; i++) {
                    elementosDesfocados[i].className = formatacaoPadraoRotasDesfocada;
                    if (elementosDesfocados[i].getAttribute("rota_selecionada") === "1") {
                        rota_imo_selecionada = 1;
                        props.dadosRotaSelecionada(0, "", "");
                        setIdTarifarioSelecionado(0);
                    } else {
                        if (elementosDesfocados[i].getAttribute("id_tarifario") === dados_rota.id_tarifario || elementosDesfocados[i].getAttribute("id_tarifario") === idTarifarioSelecionado) {
                            rota_imo_selecionada = 1;
                            props.dadosRotaSelecionada(0, "", "");
                            setIdTarifarioSelecionado(0);
                        }
                    }
                }
                if (rota_imo_selecionada === 1) {
                    props.handleBloqueioImo(true);
                } else {
                    props.handleBloqueioImo(true);
                }
            }

            if (qtde_rotas > 1) {
                elemento_selecionado.setAttribute("rota_selecionada", "0");
                setRotaSelecionada({ "tipo_tarifario": "", "contador_rota": "", "id_tarifario": "", "numeroProposta": "", "aceita_imo": "" })
                setIdTarifarioSelecionado(0);
                setNumeroPropostaSelecionada("");
                //props.dadosRotaSelecionada(0, "", "");
            }
        }
    }

    const [isCheckedPP, setIsCheckedPP] = useState(false);
    const [isCheckedCC, setIsCheckedCC] = useState(false);

    const checkHandlerPP = (objeto) => {
        setIsCheckedPP(!isCheckedPP);
        if (objeto.target.checked === true) {
            dados_rota.pp = 1;
        } else {
            dados_rota.pp = 0;
        }

        if (objeto.target.checked === true && isCheckedCC === false) {
            props.dadosRotaSelecionada(idTarifarioSelecionado, numeroPropostaSelecionada, "PP");
        } else if (isCheckedCC === true && objeto.target.checked === false) {
            props.dadosRotaSelecionada(idTarifarioSelecionado, numeroPropostaSelecionada, "CC");
        } else if (objeto.target.checked === true && isCheckedCC === true) {
            props.dadosRotaSelecionada(idTarifarioSelecionado, numeroPropostaSelecionada, "PP");
        }

        if (processaDadosRota === false) {
            setProcessaDadosRota(true);
        } else {
            setProcessaDadosRota(false);
        }
    }

    function selecionar_rota_condicional(tipo_condicao, selecaoObjetoCondicional) {
        let campo = "";
        let rota_habilitada = 0;
        let habilitarTarifariosSelecao = false;
        let campo_verificacao = "";
        let bloqueio_imo = 0;
        if (tipo_condicao === "aceita_cc") {
            campo = "aceita_cc"
            campo_verificacao = "aceita_imo";
        }

        if (tipo_condicao === "aceita_imo") {
            campo = "aceita_imo";
            campo_verificacao = "aceita_cc";
        }

        if (selecaoObjetoCondicional === true) {
            let elementos_tarifarios_totais = document.querySelectorAll("div[name='lista_tarifarios']");
            let elementos = document.querySelectorAll("div[name='lista_tarifarios'][" + campo + "='N']");

            let quantidade_totais_tarifarios = elementos_tarifarios_totais.length;
            let quantidade_linhas_desfocado = elementos.length;
            for (let i = 0; i < elementos.length; i++) {
                if (elementos[i].className != "d-none") {
                    elementos[i].className = formatacaoPadraoRotasDesfocada;
                    if (elementos[i].getAttribute("rota_selecionada") === "1") {
                        habilitarTarifariosSelecao = true;
                        props.dadosRotaSelecionada(0, "", "");
                        setIdTarifarioSelecionado(0);

                        if (campo === "aceita_imo") {
                            bloqueio_imo = 1;
                        }
                    }
                }
            }

            if (campo === "aceita_imo") {
                if (bloqueio_imo === 1) {
                    props.handleBloqueioImo(true);
                } else {
                    if (quantidade_totais_tarifarios === quantidade_linhas_desfocado) {
                        props.handleBloqueioImo(true);
                    } else {
                        props.handleBloqueioImo(false);
                    }
                }
            }

            if (habilitarTarifariosSelecao === true) {
                let elementos_tarifarios = document.querySelectorAll("div[name='lista_tarifarios']:not([" + campo + "='S'])");
                for (let i = 0; i < elementos_tarifarios.length; i++) {
                    elementos_tarifarios[i].className = formatacaoPadraoRotasDesfocada;
                }

                elementos_tarifarios = document.querySelectorAll("div[name='lista_tarifarios']:not([" + campo + "='N'])");
                for (let i = 0; i < elementos_tarifarios.length; i++) {
                    if (campo_verificacao === "aceita_cc") {
                        if (isCheckedCC === true && isCheckedPP === false) {
                            if (elementos_tarifarios[i].getAttribute("aceita_cc") !== "N") {
                                elementos_tarifarios[i].className = formatacaoRota;
                            }
                        } else {
                            elementos_tarifarios[i].className = formatacaoRota;
                        }
                    } else if (campo_verificacao === "aceita_imo") {
                        if (props.cargaImo === "S") {
                            if (elementos_tarifarios[i].getAttribute("aceita_imo") !== "N") {
                                elementos_tarifarios[i].className = formatacaoRota;
                            }
                        } else {
                            elementos_tarifarios[i].className = formatacaoRota;
                        }
                    }
                }

                setIdTarifarioSelecionado(0);
                setNumeroPropostaSelecionada("");
                props.dadosRotaSelecionada(0, "", "");
            } else {
                let elementos_tarifarios = document.querySelectorAll("div[name='lista_tarifarios']:not([" + campo + "='N'])");
                if (elementos_tarifarios.length === 1) {
                    let aceita_imo_linha_tarifario = elementos_tarifarios[0].getAttribute("aceita_imo");
                    let aceita_frete_cc = elementos_tarifarios[0].getAttribute("aceita_cc");
                    if ((isCheckedCC === true && aceita_frete_cc === "N") || (aceita_imo_linha_tarifario === "N" && props.cargaImo === "S")) {
                        elementos_tarifarios[0].className = formatacaoPadraoRotasDesfocada;
                        if (elementos_tarifarios[0].getAttribute("id_tarifario") === dados_rota.id_tarifario || elementos_tarifarios[0].getAttribute("id_tarifario") === idTarifarioSelecionado) {
                            props.dadosRotaSelecionada(0, "", "");
                            setIdTarifarioSelecionado(0);
                        }

                    } else {
                        let id_tarifario = elementos_tarifarios[0].getAttribute("id_tarifario");
                        let numero_proposta = elementos_tarifarios[0].getAttribute("numero_proposta");
                        let modalidade_ppcc = "";
                        if (isCheckedPP === true) {
                            modalidade_ppcc = "PP";
                        } else if (isCheckedCC === true) {
                            modalidade_ppcc = "CC";
                        }

                        props.dadosRotaSelecionada(id_tarifario, numero_proposta, modalidade_ppcc)
                    }
                } else {
                    let aceita_imo_linha_tarifario = "";
                    let aceita_frete_cc = "";
                    let id_tarifario = "";
                    let numero_proposta = "";
                    let modalidade_ppcc = "";

                    for (let za = 0; za < elementos_tarifarios.length; za++) {
                        aceita_imo_linha_tarifario = elementos_tarifarios[za].getAttribute("aceita_imo");
                        aceita_frete_cc = elementos_tarifarios[za].getAttribute("aceita_cc");
                        if (elementos_tarifarios[za].getAttribute("rota_selecionada") === "1") {
                            if ((isCheckedCC === true && aceita_frete_cc === "N") || (aceita_imo_linha_tarifario === "N" && props.cargaImo === "S")) {
                                elementos_tarifarios[za].className = formatacaoPadraoRotasDesfocada;
                                if (elementos_tarifarios[za].getAttribute("id_tarifario") === dados_rota.id_tarifario || elementos_tarifarios[za].getAttribute("id_tarifario") === idTarifarioSelecionado) {
                                    props.dadosRotaSelecionada(0, "", "");
                                    setIdTarifarioSelecionado(0);
                                }

                            } else {
                                id_tarifario = elementos_tarifarios[za].getAttribute("id_tarifario");
                                numero_proposta = elementos_tarifarios[za].getAttribute("numero_proposta");
                                modalidade_ppcc = "";
                                if (isCheckedPP === true) {
                                    modalidade_ppcc = "PP";
                                } else if (isCheckedCC === true) {
                                    modalidade_ppcc = "CC";
                                }

                                props.dadosRotaSelecionada(id_tarifario, numero_proposta, modalidade_ppcc)
                            }
                        }
                    }
                }
            }
        } else {
            let elementosTarifarios = document.querySelectorAll("div[name='lista_tarifarios']");
            let elementos = document.querySelectorAll("div[name='lista_tarifarios'][" + campo + "='N']");
            let selecionar_rota_automaticamente = 0;
            let id_tarifario = 0;
            let numero_proposta = "";
            if (elementosTarifarios.length === 1) {
                selecionar_rota_automaticamente = 1;
                id_tarifario = elementosTarifarios[0].getAttribute("id_tarifario");
                numero_proposta = elementosTarifarios[0].getAttribute("numero_proposta");
            }

            for (let i = 0; i < elementos.length; i++) {
                if (elementos[i].className != "d-none") {
                    if (isCheckedCC === true && isCheckedPP === false) {
                        if (elementos[i].getAttribute("aceita_cc") !== "N") {
                            elementos[i].className = formatacaoRota;
                        }
                    } else {
                        if (props.cargaImo === "S") {
                            if (elementos[i].getAttribute("aceita_imo") !== "N") {
                                elementos[i].className = formatacaoRota;
                            }
                        } else {
                            elementos[i].className = formatacaoRota;
                        }
                    }
                }
            }

            if (elementosTarifarios.length === 1) {
                let modalidade_ppcc = "";
                if (isCheckedPP === true) {
                    modalidade_ppcc = "PP";
                } else if (isCheckedCC === true) {
                    modalidade_ppcc = "CC";
                }
                setIdTarifarioSelecionado(id_tarifario);
                setNumeroPropostaSelecionada(numero_proposta);
                props.dadosRotaSelecionada(id_tarifario, numero_proposta, modalidade_ppcc)
            } else {
                if (dadosSalvosCarregados === true && props.dados_proposta_salva.dados_rota.id_tarifario !== idTarifarioSelecionado) {
                    setIdTarifarioSelecionado(0);
                    setNumeroPropostaSelecionada("");
                    props.dadosRotaSelecionada(0, "", "");
                }
            }
        }
        setProcessaDadosRota(true);
    }

    const checkHandlerCC = (objeto) => {
        setIsCheckedCC(!isCheckedCC)
        let habilitarTarifariosSelecao = false;
        if (objeto.target.checked == true) {
            selecionar_rota_condicional("aceita_cc", true);
        } else {
            selecionar_rota_condicional("aceita_cc", false);
        }
        if (objeto.target.checked === true && isCheckedPP === false) {
            props.dadosRotaSelecionada(idTarifarioSelecionado, numeroPropostaSelecionada, "CC");
        } else if (isCheckedPP === true && objeto.target.checked === false) {
            props.dadosRotaSelecionada(idTarifarioSelecionado, numeroPropostaSelecionada, "PP");
        } else if (isCheckedPP === true && objeto.target.checked === true) {
            props.dadosRotaSelecionada(idTarifarioSelecionado, numeroPropostaSelecionada, "PP");
        }

        if (processaDadosRota === false) {
            setProcessaDadosRota(true);
        } else {
            setProcessaDadosRota(false);
        }
    }

    const loadOptionsIncoterms = () => {
        return api.get("https://allinkscoa.com.br" + props.apiDados + "buscarIncotermsCombo.php", {
            "Content-Type": "application/xml; charset=utf-8"
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });

    }

    const [valueIncotermSelecionado, setValueIncotermSelecionado] = useState([]);

    const handleIncoterm = (selectedOption) => {
        setValueIncotermSelecionado(selectedOption);
        if (processaDadosRota === false) {
            setProcessaDadosRota(true);
        } else {
            setProcessaDadosRota(false);
        }
    }

    function handleRemoverTaxas() {
        setIdTarifarioSelecionado(0);
        setNumeroPropostaSelecionada("");
        props.dadosRotaSelecionada(0, "", "");
    }

    useEffect(() => {
        dados_rota.id_tarifario = idTarifarioSelecionado;
        dados_rota.origem = valueOrigemSelecionada;
        dados_rota.destino = valueDestinoSelecionado;
        if (valueIncotermSelecionado !== null) {
            dados_rota.incoterm = valueIncotermSelecionado.value;
        }
        dados_rota.numero_proposta = numeroPropostaSelecionada;
        if (isCheckedPP === true) {
            dados_rota.pp = 1;
        } else {
            dados_rota.pp = 0;
        }
        if (isCheckedCC === true) {
            dados_rota.cc = 1;
        } else {
            dados_rota.cc = 0;
        }
        props.dados_rota(dados_rota);
    }, [processaDadosRota, idTarifarioSelecionado]);

    useEffect(() => {
        if (props.dados_proposta_salva !== null) {
            if (props.dados_proposta_salva.dados_cliente.id_cliente !== props.idClienteSelecionado) {
                if (valueDestinoSelecionado !== "" && valueOrigemSelecionada !== "") {
                    listar_tarifarios_cliente("destino", valueDestinoSelecionado);
                }
            }
        } else {
            if (valueDestinoSelecionado !== "" && valueOrigemSelecionada !== "") {
                listar_tarifarios_cliente("destino", valueDestinoSelecionado);
            }
        }
    }, [props.idClienteSelecionado]);

    useEffect(() => {
        if (props.alterarStatusProcessarRota === true) {
            setProcessaDadosRota(false);
            props.handleAlterarStatusProcessar();
        }
    }, [props.alterarStatusProcessarRota]);

    useEffect(() => {
        if (props.dados_proposta_salva !== null) {
            if (dadosSalvosCarregados === true) {
                if (props.cargaImo === "S") {
                    selecionar_rota_condicional("aceita_imo", true);
                } else {
                    selecionar_rota_condicional("aceita_imo", false);
                }
            }
        } else {

            if (props.cargaImo === "S") {
                //handleRemoverTaxas();
                selecionar_rota_condicional("aceita_imo", true);
            } else {
                selecionar_rota_condicional("aceita_imo", false);
            }
        }
    }, [props.cargaImo]);

    useEffect(() => {
        if (props.dados_proposta_salva !== null) {
            if (dadosSalvosCarregados === true) {
                if (desabilitarRotasImo === true) {
                    selecionar_rota_condicional("aceita_imo", true);
                } else {
                    selecionar_rota_condicional("aceita_imo", false);
                }
            }
        } else {
            if (desabilitarRotasImo === true) {
                selecionar_rota_condicional("aceita_imo", true);
            } else {
                selecionar_rota_condicional("aceita_imo", false);
            }
        }
        setverificarRotasCondicoes(false);
    }, [verificarRotasCondicoes])

    useEffect(() => {
        let quantidade_total_tarifarios = tarifariosPadrao.length + tarifariosAcordo.length;
        if (listarRotas === false || quantidade_total_tarifarios === 0) {
            handleRemoverTaxas();
        }
    }, [tarifariosPadrao, tarifariosAcordo, listarRotas]);

    useEffect(() => {
        if (props.limpar_dados === true) {
            setValueOrigemSelecionada("");
            setValueDestinoSelecionado("");
            setValueIncotermSelecionado("");
            setTarifariosPadrao([]);
            setTarifariosAcordo([]);
            setIsCheckedPP(false);
            setIsCheckedCC(false);

            props.campos_limpos()
        }
    }, [props.limpar_dados]);

    const [selecionarRotaSalva, setSelecionarRotaSalva] = useState(false);

    useEffect(() => {
        if (props.dados_proposta_salva !== null) {
            setValueOrigemSelecionada(props.dados_proposta_salva.dados_rota.origem);
            setValueDestinoSelecionado(props.dados_proposta_salva.dados_rota.destino);
            setValueIncotermSelecionado({ "value": props.dados_proposta_salva.dados_rota.incoterm, "label": props.dados_proposta_salva.dados_rota.incoterm });
            let ppcc = new Array();
            let ppcc_string = "";
            if (props.dados_proposta_salva.dados_rota.pp == 1) {
                setIsCheckedPP(true);
                ppcc.push("PP");
            }
            if (props.dados_proposta_salva.dados_rota.cc == 1) {
                setIsCheckedCC(true);
                ppcc.push("CC");
            }

            if (ppcc.length > 0) {
                ppcc_string = ppcc.join("/");
            }

            setListarRotas(true);
            listar_tarifarios_cliente("ambos",
                "",
                props.dados_proposta_salva.dados_rota.origem,
                props.dados_proposta_salva.dados_rota.destino,
                props.dados_proposta_salva.dados_cliente.id_cliente,
                ppcc_string
            );
            //dados_selecionar_dados_rota_salva();
        }
    }, [props.dados_proposta_salva])

    useEffect(() => {
        if (props.dados_proposta_salva !== null) {
            if (selecionarRotaSalva === true) {
                if (props.dados_proposta_salva.dados_rota.numero_proposta === "") {
                    dados_selecionar_dados_rota_salva("padrao", props.dados_proposta_salva.dados_rota.id_tarifario)
                } else {
                    dados_selecionar_dados_rota_salva("acordos", props.dados_proposta_salva.dados_rota.id_tarifario, props.dados_proposta_salva.dados_rota.numero_proposta);
                }
                setProcessaDadosRota(true);
                setDadosSalvosCarregados(true);
            }
        }
    }, [selecionarRotaSalva])


    useEffect(() => {
        if (props.checkIncotermPropostaGemea === true) {
            setValueIncotermSelecionado({ "value": props.incotermPropostaGemea, "label": props.incotermPropostaGemea });
            dados_rota.incoterm = props.incotermPropostaGemea
            setProcessaDadosRota(true);
            props.mudarStatusCheckPropostaGemea(false);
        }
    }, [props.checkIncotermPropostaGemea])


    return (
        <div className="container shadow-lg p-3 mb-4 bg-white rounded m-0">
            <div className='row'>
                <div className="col-1 border-bottom titulo">
                    <b>Rota</b>
                </div>
                <div className="col-11 border-bottom titulo_informacao">
                    <b>Informações Sobre a Rota são Obrigatórias</b>
                </div>
            </div>
            <div className="row">
                <div className="col-3">
                    <label className='titulo'>Origem</label>
                    <ReactSelectAsync
                        isClearable
                        loadOptions={loadOptionsOrigem}
                        name='origem'
                        noOptionsMessage={() => "Digite a Origem"}
                        value={valueOrigemSelecionada}
                        placeholder=""
                        onChange={handleChangeOrigem}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                boxShadow: state.isFocused && '0 0 0 0',
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderRadius: '0%',
                                borderColor: state.isFocused && 'blue',
                                borderBottom: state.isFocused && 'solid',
                                outline: 0,
                            }),
                            dropdownIndicator: (baseStyles, state) => ({
                                ...baseStyles,
                                display: 'none'
                            })

                        }}
                    />
                    <span className='campos_validacao'>{props.mensagens_validacao.origem}</span>
                </div>
                <div className="col-3">
                    <label className='titulo'>Destino</label>
                    <ReactSelectAsync
                        isClearable
                        loadOptions={loadOptionsDestino}
                        name='destino'
                        noOptionsMessage={() => "Digite o Destino"}
                        value={valueDestinoSelecionado}
                        placeholder=""
                        onChange={handleChangeDestino}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                boxShadow: state.isFocused && '0 0 0 0',
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderRadius: '0%',
                                borderColor: state.isFocused && 'blue',
                                borderBottom: state.isFocused && 'solid',
                                outline: 0,
                            }),
                            dropdownIndicator: (baseStyles, state) => ({
                                ...baseStyles,
                                display: 'none'
                            })
                        }}
                    />
                    <span className='campos_validacao'>{props.mensagens_validacao.destino}</span>
                </div>
                <div className="col">
                    <label className='titulo'>Modalidade Frete</label><br />
                    <input value="PP" type="checkbox" checked={isCheckedPP} onChange={checkHandlerPP} name="PP" />PP&nbsp;&nbsp;&nbsp;
                    <input value="CC" type="checkbox" checked={isCheckedCC} onChange={checkHandlerCC} name="CC" /> CC
                    <div className='campos_validacao'><span>{props.mensagens_validacao.ppcc}</span></div>

                </div>
                <div className="col">
                    <label className='titulo'>Incoterm</label>
                    <ReactSelectAsync
                        isClearable
                        isSearchable
                        name="incoterm"
                        placeholder="Selecione"
                        onChange={handleIncoterm}
                        value={valueIncotermSelecionado}
                        loadOptions={loadOptionsIncoterms}
                        defaultOptions
                        cacheOptions
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                boxShadow: state.isFocused && '0 0 0 0',
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderRadius: '0%',
                                borderColor: state.isFocused && 'blue',
                                borderBottom: state.isFocused && 'solid',
                                outline: 0,
                            })
                        }}
                    />
                    <span className='campos_validacao'>{props.mensagens_validacao.incoterm}</span>
                </div>
            </div>
            {
                listarRotas == true && (
                    <div className="row ">
                        <div className="row mt-4">
                            <div className="col">
                                <div className="row mb-1">
                                    <div className="col-12" >
                                        <label className='titulo'><b>{rotasLabel}</b></label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col pl-2" >
                                        {
                                            tarifariosPadrao.length > 0 && (
                                                tarifariosPadrao.map((item, contadorRota) => (
                                                    <div aria-disabled name="lista_tarifarios" aceita_cc={item.aceita_frete_cc} numero_proposta={item.numero_proposta} tipo_tarifario="padrao" key={item.id_tarifario} contador_rota={contadorRota} id_tarifario={item.id_tarifario} onClick={() => handleSelecionarRota("padrao", contadorRota, item.id_tarifario, item.numero_proposta)} aceita_imo={item.aceita_imo} rota_selecionada={item.rota_selecionada} className={formatacaoRota}>
                                                        <div className="row">
                                                            <div className="col-4">
                                                                <span className='titulo'>{item.origem}</span>
                                                                <i className="v-icon notranslate mx-1 mdi mdi-play theme--light" />
                                                                <span className='titulo'>{item.embarque}</span>
                                                                <i className="v-icon notranslate mx-1 mdi mdi-play theme--light" />
                                                                <span className='titulo'>{item.desembarque}</span>
                                                                <i className="v-icon notranslate mx-1 mdi mdi-play theme--light" />
                                                                <span className='titulo'>{item.destino}</span>
                                                            </div>
                                                            <div className='col-2'>
                                                                {
                                                                    item.aceita_frete_cc == "N" && (
                                                                        <div className="col nao_aceita_frete_cc shadow p-1 mb-1">
                                                                            <span className='titulo'><b>Collect Não Aceito !</b></span>
                                                                        </div>
                                                                    )
                                                                }
                                                                {
                                                                    item.aceita_frete_cc == "SC" && (
                                                                        <div className="col collect_sob_consulta shadow p-1 mb-1">
                                                                            <span className='titulo'><b>Collect Sob-Consulta !</b></span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="col">
                                                                <span className='titulo'><b>Transit Time:</b> {item.transit_time_onboard}</span>
                                                            </div>
                                                            <div className="col">
                                                                <span className='titulo'><b>Valor de Venda:</b> {item.valor_frete_venda} {item.moeda_frete_venda}</span>
                                                            </div>
                                                            <div className="col">
                                                                {
                                                                    impExpSelecionado == 'EXP' && (
                                                                        <span className='titulo'><b>Transhipment: </b>{item.valor_transhipment} {item.moeda_transhipment}</span>
                                                                    )
                                                                }
                                                                {
                                                                    impExpSelecionado == 'IMP' && (
                                                                        <span className='titulo'><b>Valor Compra: </b>{item.valor_frete_compra} {item.moeda_frete_venda}</span>
                                                                    )
                                                                }
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))
                                            )
                                        }

                                        {tarifariosAcordo.length > 0 && (
                                            tarifariosAcordo.map((item, contadorTarifario) => (
                                                <div name="lista_tarifarios" aceita_imo={item.aceita_imo} aceita_cc={item.aceita_frete_cc} numero_proposta={item.numero_proposta} tipo_tarifario="acordos" key={contadorTarifario} contador_rota={contadorTarifario} id_tarifario={item.id_tarifario} onClick={() => handleSelecionarRota("acordos", contadorTarifario, item.id_tarifario, item.numero_proposta)} rota_selecionada="0" className={formatacaoRota}>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <span className='titulo'><b>Número Proposta: </b></span>
                                                            <span className='titulo'>{item.numero_proposta} {item.nome_nac_exibicao}</span>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-4">
                                                            <span className='titulo'>{item.origem}</span>
                                                            <i className="v-icon notranslate mx-1 mdi mdi-play theme--light" />
                                                            <span className='titulo'>{item.embarque}</span>
                                                            <i className="v-icon notranslate mx-1 mdi mdi-play theme--light" />
                                                            <span className='titulo'>{item.desembarque}</span>
                                                            <i className="v-icon notranslate mx-1 mdi mdi-play theme--light" />
                                                            <span className='titulo'>{item.destino}</span>
                                                        </div>
                                                        <div className='col-2'>
                                                            {
                                                                item.aceita_frete_cc == "N" && (
                                                                    <div className='row'>
                                                                        <div className="col nao_aceita_frete_cc shadow p-1 mb-1">
                                                                            <span className='titulo'><b>Collect Não Aceito !</b></span>
                                                                        </div>
                                                                    </div>
                                                                )

                                                            }
                                                            {
                                                                item.aceita_frete_cc == "SC" && (
                                                                    <div className='row'>
                                                                        <div className="col collect_sob_consulta shadow p-1 mb-1">
                                                                            <span className='titulo'><b>Collect Sob-Consulta !</b></span>
                                                                        </div>
                                                                    </div>
                                                                )

                                                            }
                                                        </div>
                                                        <div className="col">
                                                            <span className='titulo'><b>Transit Time: </b> {item.transit_time_onboard}</span>
                                                        </div>
                                                        <div className="col">
                                                            <span className='titulo'><b>Valor de Venda: </b> {item.valor_frete_venda} {item.moeda_frete_venda}</span>
                                                        </div>
                                                        <div className="col">
                                                            {
                                                                impExpSelecionado == 'EXP' && (
                                                                    <span className='titulo'><b>Transhipment: </b>{item.valor_transhipment} {item.moeda_transhipment}</span>
                                                                )
                                                            }
                                                            {
                                                                impExpSelecionado == 'IMP' && (
                                                                    <span className='titulo'><b>Valor Compra: </b>{item.valor_frete_compra} {item.moeda_frete_venda}</span>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )

}