import { Fragment, useEffect, useState } from 'react';
import './BodyPropostaFormalizada.css'
import { Link } from 'react-router-dom';

export default function BodyPropostaFormalizada(props) {
    const [nome_cliente, setNomeCliente] = useState("");
    const [origem, setOrigem] = useState("");
    const [portoEmbarque, setPortoEmbarque] = useState("");
    const [portoDesembarque, setPortoDesembarque] = useState("");
    const [destinoFinal, setDestinoFinal] = useState("");
    const [idProposta, setIdProposta] = useState("");
    const [exibirImpressao, setExibirImpressao] = useState(0);


    const [transitTimeReceiptXLoading, setTransitTimeReceiptXLoading] = useState("");
    const [frequenciaReceiptXLoading, setFrequenciaReceiptXLoading] = useState("");

    const [transitTimeLoadingXVia, setTransitTimeLoadingXVia] = useState("");
    const [frequenciaLoadingXVia, setFrequenciaLoadingXVia] = useState("");

    const [transitTimeViaXPlaceDelivery, setTransitTimeViaXPlaceDelivery] = useState("");
    const [frequenciaViaXPlaceDelivery, setFrequenciaViaXPlaceDelivery] = useState("");

    const [transitTimeViaXViaAdicional, setTransitTimeViaXViaAdicional] = useState("");
    const [frequenciaViaXViaAdicional, setFrequenciaViaXViaAdicional] = useState("");

    const [transitTimeViaAdicionalXPlaceDelivery, setTransitTimeViaAdicionalXPlaceDelivery] = useState("");
    const [frequenciaViaAdicionalXPlaceDelivery,setFrequenciaViaAdicionalXPlaceDelivery] = useState("");
    const [viaAdicional, setViaAdicional] = useState("");



    const [transitTimeTotal, setTransitTimeTotal] = useState("");
    const [mercadoria, setMercadoria] = useState([]);
    const [ncms, setNcms] = useState([]);
    const [volumeTotal, setVolumeTotal] = useState("");
    const [pesoTotal, setPesoTotal] = useState("");
    const [cubagemTotal, setCubagemTotal] = useState("");
    const [incoterm, setIncoterm] = useState("");
    const [ppcc, setPPCC] = useState("");
    const [cargaEmpilhavel, setCargaEmpilhavel] = useState("");
    const [cargaImo, setCargaImo] = useState("");
    const [propostaImpExp, setPropostaImpExp] = useState("");
    const [id_tarifario, setIdTarifario] = useState("");

    const [valorUsdPP, setValorUsdPP] = useState("");
    const [valorUsdCC, setValorUsdCC] = useState("");
    const [valorBrlPP, setValorBrlPP] = useState("");
    const [valorBrlCC, setValorBrlCC] = useState("");
    const [valorEurPP, setValorEurPP] = useState("");
    const [valorEurCC, setValorEurCC] = useState("");
    const [separadorTotais, setSeparadorTotais] = useState(false);

    const [valorTotalOrigemUsdPP, setValorTotalOrigemUsdPP] = useState("");
    const [valorTotalOrigemUsdCC, setValorTotalOrigemUsdCC] = useState("");

    const [valorTotalOrigemBrlPP, setValorTotalOrigemBrlPP] = useState("");
    const [valorTotalOrigemBrlCC, setValorTotalOrigemBrlCC] = useState("");

    const [valorTotalOrigemEurPP, setValorTotalOrigemEurPP] = useState("");
    const [valorTotalOrigemEurCC, setValorTotalOrigemEurCC] = useState("");

    const [valorTotalFreteUsdPP, setValorTotalFreteUsdPP] = useState("");
    const [valorTotalFreteUsdCC, setValorTotalFreteUsdCC] = useState("");

    const [valorTotalFreteEurPP, setValorTotalFreteEurPP] = useState("");
    const [valorTotalFreteEurCC, setValorTotalFreteEurCC] = useState("");

    const [valorTotalFreteBrlPP, setValorTotalFreteBrlPP] = useState("");
    const [valorTotalFreteBrlCC, setValorTotalFreteBrlCC] = useState("");

    const [valorTotalDestinoUsdPP, setValorTotalDestinoUsdPP] = useState("");
    const [valorTotalDestinoUsdCC, setValorTotalDestinoUsdCC] = useState("");

    const [valorTotalDestinoEurPP, setValorTotalDestinoEurPP] = useState("");
    const [valorTotalDestinoEurCC, setValorTotalDestinoEurCC] = useState("");

    const [valorTotalDestinoBrlPP, setValorTotalDestinoBrlPP] = useState("");
    const [valorTotalDestinoBrlCC, setValorTotalDestinoBrlCC] = useState("");

    const [taxasOrigem, setTaxasOrigem] = useState([]);
    const [taxasFrete, setTaxasFrete] = useState([]);
    const [taxasDestino, setTaxasDestino] = useState([]);

    const [observacaoUSA, setObservacaoUSA] = useState([]);
    const [observacaoGeral, setObservacaoGeral] = useState([]);
    const [observacaoLTL, setObservacaoLtl] = useState([]);

    const [exibirPickup, setExibirPickup] = useState(false);
    const [dadosPickup, setDadosPickup] = useState([]);

    const [exibirDoorDelivery, setExibirDoorDelivery] = useState(false);
    const [dadosDoorDelivery, setDadosDoorDelivery] = useState([]);

    const [exibirImo, setExibirImo] = useState(false);
    const [dadosImo, setDadosImo] = useState([]);

    const [exibirProgramacaoNavios, setExibirProgramacaoNavios] = useState(false);
    const [exibirObservacao, setExibirObservacao] = useState(false);
    const [observacao, setObservacao] = useState("");
    const [listaProgramacaoNavios, setListaProgramacaoNavios] = useState([]);

    useEffect(() => {
        if (props.processarDadosProposta === true) {
            if (!props.tokenAcesso) {
                setExibirImpressao(1)
            } else {
                setExibirImpressao(0)
            }

            if (props.dados_proposta !== null) {
                setNomeCliente(props.dados_proposta.dados_cliente.nome_cliente);
                if (props.dados_proposta.propsta_imp_exp === "EXP") {
                    setPropostaImpExp("Exportação");
                } else {
                    setPropostaImpExp("Importação");
                }



                setOrigem(props.dados_proposta.dados_rota.rota_completa.origem);
                setPortoEmbarque(props.dados_proposta.dados_rota.rota_completa.porto_embarque);
                setPortoDesembarque(props.dados_proposta.dados_rota.rota_completa.porto_desembarque);
                setDestinoFinal(props.dados_proposta.dados_rota.rota_completa.destino);
                setIdTarifario(props.dados_proposta.dados_rota.id_tarifario)

                setObservacaoUSA(props.dados_proposta.observacao_estados_unidos);
                setObservacaoGeral(props.dados_proposta.observacao_geral);
                setObservacaoLtl(props.dados_proposta.observacao_ltl);

                setTransitTimeReceiptXLoading(props.dados_proposta.dados_rota.transit_receipt_x_loading);
                setFrequenciaReceiptXLoading(props.dados_proposta.dados_rota.frequencia_receipt_x_loading);

                setTransitTimeLoadingXVia(props.dados_proposta.dados_rota.transit_loading_x_via);
                setFrequenciaLoadingXVia(props.dados_proposta.dados_rota.frequencia_loading_x_via);

                setTransitTimeViaXPlaceDelivery(props.dados_proposta.dados_rota.transit_via_x_place_delivery);
                setFrequenciaViaXPlaceDelivery(props.dados_proposta.dados_rota.frequencia_via_x_place_delivery)

                setTransitTimeViaXViaAdicional(props.dados_proposta.dados_rota.transit_via_x_via_adicional);
                setFrequenciaViaXViaAdicional(props.dados_proposta.dados_rota.frequencia_via_x_via_adicional);
                
                setTransitTimeViaAdicionalXPlaceDelivery(props.dados_proposta.dados_rota.transit_via_adicional_x_place_delivery);
                setFrequenciaViaAdicionalXPlaceDelivery(props.dados_proposta.dados_rota.frequencia_via_adicional_x_place_delivery);

                setViaAdicional(props.dados_proposta.dados_rota.rota_completa.via_adicional);
                setTransitTimeTotal(props.dados_proposta.dados_rota.transitTimeTotal);

                
                let mercadorias = new Array();
                let ncms = new Array();
                let contador_mercadoria = 0;
                if (props.dados_proposta.dados_carga.descricao_unica_marcado !== 1) {
                    for (let i = 0; i < props.dados_proposta.dados_carga.lista_itens_cargas.length; i++) {
                        mercadorias[contador_mercadoria] = props.dados_proposta.dados_carga.lista_itens_cargas[i].descricao;
                        if (props.dados_proposta.dados_carga.lista_itens_cargas[i].ncm === "") {
                            ncms[contador_mercadoria] = "Não Informado";
                        } else {
                            ncms[contador_mercadoria] = props.dados_proposta.dados_carga.lista_itens_cargas[i].ncm;
                        }
                        contador_mercadoria = contador_mercadoria + 1;
                    }
                } else {
                    mercadorias[contador_mercadoria] = props.dados_proposta.dados_carga.descricao_unica;
                    if (props.dados_proposta.dados_carga.ncm_unico == "") {
                        ncms[contador_mercadoria] = "Nao Informado";
                    } else {
                        ncms[contador_mercadoria] = props.dados_proposta.dados_carga.ncm_unico;
                    }
                }

                if (props.dados_proposta.proximas_saidas.length > 0) {
                    setExibirProgramacaoNavios(true);
                    setListaProgramacaoNavios(props.dados_proposta.proximas_saidas);
                } else {
                    setExibirProgramacaoNavios(false);
                }

                setMercadoria(mercadorias);
                setNcms(ncms);
                setVolumeTotal(props.dados_proposta.dados_carga.volume_total);
                setPesoTotal(props.dados_proposta.dados_carga.peso_total);
                setCubagemTotal(props.dados_proposta.dados_carga.cubagem_total);
                setIncoterm(props.dados_proposta.dados_rota.incoterm);
                setIdProposta(props.dados_proposta.id_proposta);

                if (props.dados_proposta.observacao_proposta.observacao !== "") {
                    let observacao_externa = props.dados_proposta.observacao_proposta.observacao.split("\n");
                    setObservacao(observacao_externa);
                    setExibirObservacao(true);
                } else {
                    setExibirObservacao(false);
                }


                if (props.dados_proposta.dados_rota.pp === 1 && props.dados_proposta.dados_rota.cc === 1) {
                    setPPCC("Prepaid/Collect");
                } else if (props.dados_proposta.dados_rota.pp === 1) {
                    setPPCC("Prepaid");
                } else if (props.dados_proposta.dados_rota.cc === 1) {
                    setPPCC("Collect");
                }

                if (props.dados_proposta.dados_carga.itens_nao_empilhaveis === 0) {
                    setCargaEmpilhavel("SIM");
                } else {
                    setCargaEmpilhavel("NÃO");
                }

                if (props.dados_proposta.dados_carga.lista_carga_imo.length > 0) {
                    setCargaImo("SIM");
                } else {
                    setCargaImo("NÃO");
                }

                if (props.dados_proposta.dados_carga.lista_pickups_selecionados.length > 0) {
                    setExibirPickup(true);
                } else {
                    setExibirPickup(false);
                }

                setDadosPickup(props.dados_proposta.dados_carga.lista_pickups_selecionados);


                if (props.dados_proposta.dados_carga.lista_door_delivery_selecionados.length > 0) {
                    setExibirDoorDelivery(true);
                } else {
                    setExibirDoorDelivery(false);
                }

                setDadosDoorDelivery(props.dados_proposta.dados_carga.lista_door_delivery_selecionados);

                if (props.dados_proposta.dados_carga.lista_carga_imo.length > 0) {
                    setExibirImo(true);
                } else {
                    setExibirImo(false);
                }

                setDadosImo(props.dados_proposta.dados_carga.lista_carga_imo);



                let valor_total_usd_pp = parseFloat(0.00);
                let valor_total_eur_pp = parseFloat(0.00);
                let valor_total_brl_pp = parseFloat(0.00);

                let valor_total_usd_cc = parseFloat(0.00);
                let valor_total_eur_cc = parseFloat(0.00);
                let valor_total_brl_cc = parseFloat(0.00);

                let valor_origem_usd_pp = parseFloat(0.00);
                let valor_origem_usd_cc = parseFloat(0.00);

                let valor_origem_brl_pp = 0.00;
                let valor_origem_brl_cc = 0.00;

                let valor_origem_eur_pp = 0.00;
                let valor_origem_eur_cc = 0.00;

                if (props.dados_proposta.dados_taxas.taxas_origem.length > 0) {
                    for (let i = 0; i < props.dados_proposta.dados_taxas.taxas_origem.length; i++) {
                        if (props.dados_proposta.dados_taxas.taxas_origem[i].moeda === "USD" && props.dados_proposta.dados_taxas.taxas_origem[i].ppcc === "PP") {
                            valor_total_usd_pp = parseFloat(valor_total_usd_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);
                            valor_origem_usd_pp = parseFloat(valor_origem_usd_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);
                        } else if (props.dados_proposta.dados_taxas.taxas_origem[i].moeda === "USD" && props.dados_proposta.dados_taxas.taxas_origem[i].ppcc === "CC") {
                            valor_total_usd_cc = parseFloat(valor_total_usd_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);
                            valor_origem_usd_cc = parseFloat(valor_origem_usd_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);
                        }

                        if (props.dados_proposta.dados_taxas.taxas_origem[i].moeda === "EUR" && props.dados_proposta.dados_taxas.taxas_origem[i].ppcc === "PP") {
                            valor_total_eur_pp = parseFloat(valor_total_eur_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);
                            valor_origem_eur_pp = parseFloat(valor_origem_eur_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);

                        } else if (props.dados_proposta.dados_taxas.taxas_origem[i].moeda === "EUR" && props.dados_proposta.dados_taxas.taxas_origem[i].ppcc === "CC") {
                            valor_total_eur_cc = parseFloat(valor_total_eur_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);
                            valor_origem_eur_cc = parseFloat(valor_origem_eur_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);

                        }

                        if (props.dados_proposta.dados_taxas.taxas_origem[i].moeda === "BRL" && props.dados_proposta.dados_taxas.taxas_origem[i].ppcc === "PP") {
                            valor_total_brl_pp = parseFloat(valor_total_brl_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);
                            valor_origem_brl_pp = parseFloat(valor_origem_brl_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);

                        } else if (props.dados_proposta.dados_taxas.taxas_origem[i].moeda === "BRL" && props.dados_proposta.dados_taxas.taxas_origem[i].ppcc === "CC") {
                            valor_total_brl_cc = parseFloat(valor_total_brl_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);
                            valor_origem_brl_cc = parseFloat(valor_origem_brl_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_origem[i].valor_calculado);
                        }
                    }

                }

                let valor_frete_usd_pp = 0.00;
                let valor_frete_usd_cc = 0.00;

                let valor_frete_brl_pp = 0.00;
                let valor_frete_brl_cc = 0.00;

                let valor_frete_eur_pp = 0.00;
                let valor_frete_eur_cc = 0.00;
                let ppcc_frete = "";
                if (props.dados_proposta.dados_taxas.taxas_frete.length > 0) {
                    for (let i = 0; i < props.dados_proposta.dados_taxas.taxas_frete.length; i++) {
                        if(props.dados_proposta.dados_taxas.taxas_frete[i].id_taxa === "10") {
                            ppcc_frete = props.dados_proposta.dados_taxas.taxas_frete[i].ppcc;
                        }
                    }

                    for (let i = 0; i < props.dados_proposta.dados_taxas.taxas_frete.length; i++) {                        
                        if(props.dados_proposta.dados_taxas.taxas_frete[i].ppcc === "AF") {
                            props.dados_proposta.dados_taxas.taxas_frete[i].ppcc = ppcc_frete;
                        }

                        if (props.dados_proposta.dados_taxas.taxas_frete[i].moeda === "USD" && props.dados_proposta.dados_taxas.taxas_frete[i].ppcc === "PP") {
                            valor_total_usd_pp = parseFloat(valor_total_usd_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);
                            valor_frete_usd_pp = parseFloat(valor_frete_usd_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);

                        } else if (props.dados_proposta.dados_taxas.taxas_frete[i].moeda === "USD" && props.dados_proposta.dados_taxas.taxas_frete[i].ppcc === "CC") {
                            valor_total_usd_cc = parseFloat(valor_total_usd_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);
                            valor_frete_usd_cc = parseFloat(valor_frete_usd_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);
                        } 

                        if (props.dados_proposta.dados_taxas.taxas_frete[i].moeda === "EUR" && props.dados_proposta.dados_taxas.taxas_frete[i].ppcc === "PP") {
                            valor_total_eur_pp = parseFloat(valor_total_eur_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);
                            valor_frete_eur_pp = parseFloat(valor_frete_eur_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);

                        } else if (props.dados_proposta.dados_taxas.taxas_frete[i].moeda === "EUR" && props.dados_proposta.dados_taxas.taxas_frete[i].ppcc === "CC") {
                            valor_total_eur_cc = parseFloat(valor_total_eur_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);
                            valor_frete_eur_cc = parseFloat(valor_frete_eur_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);

                        }

                        if (props.dados_proposta.dados_taxas.taxas_frete[i].moeda === "BRL" && props.dados_proposta.dados_taxas.taxas_frete[i].ppcc === "PP") {
                            valor_total_brl_pp = parseFloat(valor_total_brl_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);
                            valor_frete_brl_pp = parseFloat(valor_frete_brl_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);

                        } else if (props.dados_proposta.dados_taxas.taxas_frete[i].moeda === "BRL" && props.dados_proposta.dados_taxas.taxas_frete[i].ppcc === "CC") {
                            valor_total_brl_cc = parseFloat(valor_total_brl_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);
                            valor_frete_brl_cc = parseFloat(valor_frete_brl_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_frete[i].valor_calculado);

                        }
                    }
                }


                let valor_destino_usd_pp = parseFloat(0.00);
                let valor_destino_usd_cc = parseFloat(0.00);

                let valor_destino_eur_pp = parseFloat(0.00);
                let valor_destino_eur_cc = parseFloat(0.00);

                let valor_destino_brl_pp = parseFloat(0.00);
                let valor_destino_brl_cc = parseFloat(0.00);


                if (props.dados_proposta.dados_taxas.taxas_destino.length > 0) {
                    for (let i = 0; i < props.dados_proposta.dados_taxas.taxas_destino.length; i++) {
                        if (props.dados_proposta.dados_taxas.taxas_destino[i].moeda === "USD" && props.dados_proposta.dados_taxas.taxas_destino[i].ppcc === "PP") {
                            valor_total_usd_pp = parseFloat(valor_total_usd_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);
                            valor_destino_usd_pp = parseFloat(valor_destino_usd_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);

                        } else if (props.dados_proposta.dados_taxas.taxas_destino[i].moeda === "USD" && props.dados_proposta.dados_taxas.taxas_destino[i].ppcc === "CC") {
                            valor_total_usd_cc = parseFloat(valor_total_usd_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);
                            valor_destino_usd_cc = parseFloat(valor_destino_usd_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);
                        }

                        if (props.dados_proposta.dados_taxas.taxas_destino[i].moeda === "EUR" && props.dados_proposta.dados_taxas.taxas_destino[i].ppcc === "PP") {
                            valor_total_eur_pp = parseFloat(valor_total_eur_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);
                            valor_destino_eur_pp = parseFloat(valor_destino_eur_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);

                        } else if (props.dados_proposta.dados_taxas.taxas_destino[i].moeda === "EUR" && props.dados_proposta.dados_taxas.taxas_destino[i].ppcc === "CC") {
                            valor_total_eur_cc = parseFloat(valor_total_eur_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);
                            valor_destino_eur_cc = parseFloat(valor_destino_eur_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);

                        }

                        if (props.dados_proposta.dados_taxas.taxas_destino[i].moeda === "BRL" && props.dados_proposta.dados_taxas.taxas_destino[i].ppcc === "PP") {
                            valor_total_brl_pp = parseFloat(valor_total_brl_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);
                            valor_destino_brl_pp = parseFloat(valor_destino_brl_pp) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);

                        } else if (props.dados_proposta.dados_taxas.taxas_destino[i].moeda === "BRL" && props.dados_proposta.dados_taxas.taxas_destino[i].ppcc === "CC") {
                            valor_total_brl_cc = parseFloat(valor_total_brl_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);
                            valor_destino_brl_cc = parseFloat(valor_destino_brl_cc) + parseFloat(props.dados_proposta.dados_taxas.taxas_destino[i].valor_calculado);
                        }
                    }

                }

                let contador_totais = 0;
                if (valor_total_usd_pp > 0.00) {
                    setValorUsdPP(String(parseFloat(valor_total_usd_pp).toFixed(2)) + " PP");
                    contador_totais = contador_totais + 1;
                } else {
                    setValorUsdPP("");
                }

                if (valor_total_usd_cc > 0.00) {
                    setValorUsdCC(String(parseFloat(valor_total_usd_cc).toFixed(2)) + " CC");
                    contador_totais = contador_totais + 1;
                } else {
                    setValorUsdCC("");
                }

                if (valor_total_brl_pp > 0.00) {
                    setValorBrlPP(String(parseFloat(valor_total_brl_pp).toFixed(2)) + " PP");
                    contador_totais = contador_totais + 1;
                } else {
                    setValorBrlPP("");
                }

                if (valor_total_brl_cc > 0.00) {
                    setValorBrlCC(String(parseFloat(valor_total_brl_cc).toFixed(2)) + " CC");
                    contador_totais = contador_totais + 1;
                } else {
                    setValorBrlCC("");
                }

                if (valor_total_eur_pp > 0.00) {
                    setValorEurPP(String(parseFloat(valor_total_eur_pp).toFixed(2)) + " PP");
                    contador_totais = contador_totais + 1;
                } else {
                    setValorEurPP("");
                }

                if (valor_total_eur_cc > 0.00) {
                    setValorEurCC(String(parseFloat(valor_total_eur_cc).toFixed(2)) + " CC");
                    contador_totais = contador_totais + 1;
                } else {
                    setValorEurCC("");
                }

                if (contador_totais > 1) {
                    setSeparadorTotais(true);
                } else {
                    setSeparadorTotais(false);
                }


                //////////////// Origem

                if (valor_origem_usd_pp > 0.00) {
                    setValorTotalOrigemUsdPP("USD " + String(parseFloat(valor_origem_usd_pp).toFixed(2)) + " PP");
                } else {
                    setValorTotalOrigemUsdPP("");
                }

                if (valor_origem_usd_cc > 0.00) {
                    setValorTotalOrigemUsdCC("USD " + String(parseFloat(valor_origem_usd_cc).toFixed(2)) + " CC");
                } else {
                    setValorTotalOrigemUsdCC("");
                }

                if (valor_origem_eur_pp > 0.00) {
                    setValorTotalOrigemEurPP("EUR " + String(parseFloat(valor_origem_eur_pp).toFixed(2)) + " PP");
                } else {
                    setValorTotalOrigemEurPP("");
                }

                if (valor_origem_eur_cc > 0.00) {
                    setValorTotalOrigemEurCC("EUR " + String(parseFloat(valor_origem_eur_cc).toFixed(2)) + " CC");
                } else {
                    setValorTotalOrigemEurCC("");
                }

                if (valor_origem_brl_pp > 0.00) {
                    setValorTotalOrigemBrlPP("BRL " + String(parseFloat(valor_origem_brl_pp).toFixed(2)) + " PP");
                } else {
                    setValorTotalOrigemBrlPP("");
                }

                if (valor_origem_brl_cc > 0.00) {
                    setValorTotalOrigemBrlCC("BRL " + String(parseFloat(valor_origem_eur_pp).toFixed(2)) + " CC");
                } else {
                    setValorTotalOrigemBrlCC("");
                }

                ///////////////////////// Frete /////////////////////////////
                if (valor_frete_usd_pp > 0.00) {
                    setValorTotalFreteUsdPP("USD " + String(parseFloat(valor_frete_usd_pp).toFixed(2)) + " PP");
                } else {
                    setValorTotalFreteUsdPP("");
                }

                if (valor_frete_usd_cc > 0.00) {
                    setValorTotalFreteUsdCC("USD " + String(parseFloat(valor_frete_usd_cc).toFixed(2)) + " CC");
                } else {
                    setValorTotalFreteUsdCC("");
                }

                if (valor_frete_eur_pp > 0.00) {
                    setValorTotalFreteEurPP("EUR " + String(parseFloat(valor_frete_eur_pp).toFixed(2)) + " PP");
                } else {
                    setValorTotalFreteEurPP("");
                }

                if (valor_frete_eur_cc > 0.00) {
                    setValorTotalFreteEurCC("EUR " + String(parseFloat(valor_frete_eur_cc).toFixed(2)) + " CC");
                } else {
                    setValorTotalFreteEurCC("");
                }

                if (valor_frete_brl_pp > 0.00) {
                    setValorTotalFreteBrlPP("BRL " + String(parseFloat(valor_frete_brl_pp).toFixed(2)) + " PP");
                } else {
                    setValorTotalFreteBrlPP("");
                }

                if (valor_frete_brl_cc > 0.00) {
                    setValorTotalFreteBrlCC("BRL " + String(parseFloat(valor_frete_brl_cc).toFixed(2)) + " CC");
                } else {
                    setValorTotalFreteBrlCC("");
                }

                ////////////// Destino
                if (valor_destino_usd_pp > 0.00) {
                    setValorTotalDestinoUsdPP("USD " + String(parseFloat(valor_destino_usd_pp).toFixed(2)) + " PP");
                } else {
                    setValorTotalDestinoUsdPP("");
                }

                if (valor_destino_usd_cc > 0.00) {
                    setValorTotalDestinoUsdCC("USD " + String(parseFloat(valor_frete_usd_cc).toFixed(2)) + " CC");
                } else {
                    setValorTotalDestinoUsdCC("");
                }

                if (valor_destino_eur_pp > 0.00) {
                    setValorTotalDestinoEurPP("EUR " + String(parseFloat(valor_destino_eur_pp).toFixed(2)) + " PP");
                } else {
                    setValorTotalDestinoEurPP("");
                }

                if (valor_destino_eur_cc > 0.00) {
                    setValorTotalDestinoEurCC("EUR " + String(parseFloat(valor_destino_eur_cc).toFixed(2)) + " CC");
                } else {
                    setValorTotalDestinoEurCC("");
                }

                if (valor_destino_brl_pp > 0.00) {
                    setValorTotalDestinoBrlPP("BRL " + String(parseFloat(valor_destino_brl_pp).toFixed(2)) + " PP");
                } else {
                    setValorTotalDestinoBrlPP("");
                }

                if (valor_destino_brl_cc > 0.00) {
                    setValorTotalDestinoBrlCC("BRL " + String(parseFloat(valor_destino_brl_cc).toFixed(2)) + " CC");
                } else {
                    setValorTotalDestinoBrlCC("");
                }

                setTaxasOrigem(props.dados_proposta.dados_taxas.taxas_origem);
                setTaxasFrete(props.dados_proposta.dados_taxas.taxas_frete);
                setTaxasDestino(props.dados_proposta.dados_taxas.taxas_destino);



                props.handleProcessarDadosProposta(false);
            }
        }
    }, [props.processarDadosProposta]);

    function handlePdfProposta(id_proposta) {
        if (id_proposta !== "") {
            window.open("https://allinkscoa.com.br/Clientes/propostas/index.php/propostas/propostas/exportar_pdf_proposta/" + id_proposta)
        }
    }

    function handleAbreObsTarifario(id_tarifario) {
        if (id_tarifario !== "") {
            window.open("https://allinkscoa.com.br/Clientes/tarifario/aditional_information.php?key=" + id_tarifario)
        }
    }

    const [expandirCondicoesDetalhadas, setExpandirCondicoesDetalahadas] = useState(false)
    const handleExpandirCondicoesDetalhadas = () => {
        if (expandirCondicoesDetalhadas === true) {
            setExpandirCondicoesDetalahadas(false)
        } else {
            setExpandirCondicoesDetalahadas(true);
        }
    }

    const [expandirTaxasOrigem, setExpandirTaxasOrigem] = useState(true);
    const handleExpandirTaxasOrigem = () => {
        if (expandirTaxasOrigem === false) {
            setExpandirTaxasOrigem(true);
        } else {
            setExpandirTaxasOrigem(false);
        }
    }

    const [expandirTaxasFrete, setExpandirTaxasFrete] = useState(true);
    const handleExpandirTaxasFrete = () => {
        if (expandirTaxasFrete === false) {
            setExpandirTaxasFrete(true);
        } else {
            setExpandirTaxasFrete(false);
        }
    }

    const [expandirTaxasDestino, setExpandirTaxasDestino] = useState(true);
    const handleExpandirTaxasDestino = () => {
        if (expandirTaxasDestino === false) {
            setExpandirTaxasDestino(true);
        } else {
            setExpandirTaxasDestino(false);
        }
    }

    const [expandirDadosPickup, setExpandirDadosPickup] = useState(false);
    const handleExpandirDadosPickup = () => {
        if (expandirDadosPickup === false) {
            setExpandirDadosPickup(true);
        } else {
            setExpandirDadosPickup(false);
        }
    }

    const [expandirDadosDoorDelivery, setExpandirDadosDoorDelivery] = useState(false);
    const handleExpandirDadosDoorDelivery = () => {
        if (expandirDadosDoorDelivery === false) {
            setExpandirDadosDoorDelivery(true);
        } else {
            setExpandirDadosDoorDelivery(false);
        }
    }

    const [expandirDadosImo, setExpandirDadosImo] = useState(false);
    const handleExpandirDadosImo = () => {
        if (expandirDadosImo === false) {
            setExpandirDadosImo(true);
        } else {
            setExpandirDadosImo(false);
        }
    }

    const [expandirObservacao, setExpandirObservacao] = useState(true);
    const handleExpandirObservacao = () => {
        if (expandirObservacao === false) {
            setExpandirObservacao(true);
        } else {
            setExpandirObservacao(false);
        }
    }

    function trocarCor(contador) {
        let resultado = contador%2;
        if(resultado == 0) {
            return "td_personalizada_navio";
        } else {
            return "td_personalizada_navio";
        }
    }
    return (
        <>
            <div className='body_proposta_formalizada'>
                <br />
                <div className="class_corpo_cotacao_formalizada ">
                    <div className='row class_dados_cliente_cotacao'>
                        <div className='col-7'>
                            <div className='class_titulo_cliente_proposta'>
                                PROPOSTA COMERCIAL DE {propostaImpExp} PARA
                            </div>
                            <div className='class_texto_cliente_proposta'>
                                {nome_cliente}
                            </div>
                        </div>
                        <div className='col class_proposta_vatos'>
                            <span className='class_texto_proposta_vatos'>
                                Proposta VATOS
                            </span>
                            (Sujeito a alterações de valores considerando
                            <br />
                            <span className='class_vatos_data_embarque'>data embarque</span>
                            no primeiro porto de origem)
                        </div>
                        <div className='class_imprimir col-1'>
                            {exibirImpressao === 1 && (
                                <button onClick={() => handlePdfProposta(idProposta)} className='class_botao_imprimir v-icon notranslate v-icon--link mdi mdi-printer theme--light'></button>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className='class_rota'>
                            <div className='class_espaco_minha_rota'>
                                <div className='class_rota_titulo'>
                                    Minha Rota
                                </div>
                            </div>
                            <div className='class_bloco_texto_rota'>
                                <div className='class_rota_bloco_origem'>
                                    <div cols="3">
                                        <div className='class_texto_rota_bloco_origem'>
                                            <span>
                                                <span className='class_texto_bloc_origem'>Origem</span>
                                            </span>
                                        </div>
                                        <div className='class_texto_origem'>
                                            {origem}
                                        </div>
                                    </div>
                                </div>
                                <div className='class_espacador_rota'>
                                    <i className='class_espacador_rota_1 icon-setamaior material-icons'></i>
                                </div>
                                <div className='class_rota_bloco_porto_embarque'>
                                    <div cols="3">
                                        <div className='class_texto_rota_bloco_porto_embarque'>
                                            <span>
                                                <span className='class_texto_bloc_porto_embarque'>Porto de Embarque</span>
                                            </span>
                                        </div>
                                        <div className='class_texto_porto_embarque'>
                                            {portoEmbarque}
                                        </div>
                                    </div>
                                </div>
                                <div className='class_espacador_rota'>
                                    <i className='class_espacador_rota_1 icon-setamaior material-icons'></i>
                                </div>
                                <div className='class_rota_bloco_porto_descarga'>
                                    <div cols="3">
                                        <div className='class_texto_rota_bloco_porto_descarga'>
                                            <span>
                                                <span className='class_texto_bloc_porto_descarga'>Porto de Desembarque</span>
                                            </span>
                                        </div>
                                        <div className='class_texto_porto_descarga'>
                                            {portoDesembarque}
                                        </div>
                                    </div>
                                </div>
                                <div className='class_espacador_rota'>
                                    <i className='class_espacador_rota_1 icon-setamaior material-icons'></i>
                                </div>
                                <div className='class_rota_bloco_destino'>
                                    <div cols="3">
                                        <div className='class_texto_rota_bloco_destino'>
                                            <span>
                                                <span className='class_texto_bloc_destino'>Destino</span>
                                            </span>
                                        </div>
                                        <div className='class_texto_destino'>
                                            {destinoFinal}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='class_dados_minha_rota'>
                            <div className='class_sub_bloco_minha_rota_1'>
                                <div className='class_titulo_dados_minha_rota'>
                                    DADOS DA MINHA ROTA
                                </div>
                                <div>
                                    <div className='class_rota_detalhada'>
                                        <div className='class_rota_detalhada_1'>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className='th_rota_detalhada'>Rota Detalhada</th>
                                                        <th className='th_rota_detalhada'>Tempo de Transito Estimado</th>
                                                        <th className='th_rota_detalhada'>Frequencia</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(transitTimeReceiptXLoading !== "" && transitTimeReceiptXLoading !== "0") && (
                                                        <tr>
                                                            <td className='td_rota_detalhada'>{origem}/{portoEmbarque}</td>
                                                            <td className='td_rota_detalhada'>{transitTimeReceiptXLoading} dias aprox.</td>
                                                            <td className='td_rota_detalhada'>{frequenciaReceiptXLoading}</td>
                                                        </tr>
                                                    )}

                                                    <tr>
                                                        <td className='td_rota_detalhada'>{portoEmbarque}/{portoDesembarque}</td>
                                                        <td className='td_rota_detalhada'>{transitTimeLoadingXVia} dias aprox.</td>
                                                        <td className='td_rota_detalhada'>{frequenciaLoadingXVia}</td>
                                                    </tr>

                                                    {(transitTimeViaXViaAdicional !== "" && transitTimeViaXViaAdicional !== null && transitTimeViaXViaAdicional !== "0") && (
                                                        <tr>
                                                            <td className='td_rota_detalhada'>{portoDesembarque}/{viaAdicional}</td>
                                                            <td className='td_rota_detalhada'>{transitTimeViaXViaAdicional} dias aprox.</td>
                                                            <td className='td_rota_detalhada'>{frequenciaViaXViaAdicional}</td>
                                                        </tr>
                                                    )}

                                                    {(transitTimeViaAdicionalXPlaceDelivery !== "" && transitTimeViaAdicionalXPlaceDelivery !== null && transitTimeViaAdicionalXPlaceDelivery !== "0") && (
                                                        <tr>
                                                            <td className='td_rota_detalhada'>{viaAdicional}/{destinoFinal}</td>
                                                            <td className='td_rota_detalhada'>{transitTimeViaAdicionalXPlaceDelivery} dias aprox.</td>
                                                            <td className='td_rota_detalhada'>{frequenciaViaAdicionalXPlaceDelivery}</td>
                                                        </tr>
                                                    )}


                                                    {(transitTimeViaXPlaceDelivery !== "" && transitTimeViaXPlaceDelivery !== null && transitTimeViaXPlaceDelivery !== "0") && (
                                                        <tr>
                                                            <td className='td_rota_detalhada'>{portoDesembarque}/{destinoFinal}</td>
                                                            <td className='td_rota_detalhada'>{transitTimeViaXPlaceDelivery} dias aprox.</td>
                                                            <td className='td_rota_detalhada'>{frequenciaViaXPlaceDelivery}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='class_sub_bloco_minha_rota_2'></div>
                        </div>
                        <hr className='separador_dados_rota' />
                        <div className='row class_transito_estimado'>
                            <div className='class_transito_estimado_1'>
                                <span className='class_span_transito_estimado'>Transito Estimado Total: </span>
                                <span className='class_span_qtde_dias_estimado'>{transitTimeTotal} DIAS APROX. </span>
                                A BORDO (não contempla tempo de transbordo).
                            </div>
                        </div>

                        <div className='class_detalhes_minha_carga'>
                            <div className='class_detalhes_minha_carga_1'>
                                <div className='class_detalhes_minha_carga_2'>DETALHES DA MINHA CARGA</div>
                                <div className='class_detalhes_minha_carga_3'>
                                    <div className='class_detalhes_minha_carga_4'>
                                        MERCADORIA
                                    </div>
                                    {mercadoria.length > 0 && (
                                        mercadoria.map((item, contadorMercadoria) => (
                                            <Fragment key={contadorMercadoria}>
                                                <div className='class_detalhes_minha_carga_5'>
                                                    <span>
                                                        <div className='class_detalhes_minha_carga_6'>{item}</div>
                                                    </span>
                                                </div>
                                                <div className='class_detalhes_minha_carga_4'>
                                                    <span>
                                                        <div className='class_detalhes_minha_carga_4'>NCM: <b>{ncms[contadorMercadoria]}</b></div>
                                                    </span>
                                                </div>
                                            </Fragment>
                                        ))
                                    )}
                                </div>
                                <div className='class_dados_carga'>
                                    <div>
                                        <div className='class_dados_carga_1'>
                                            QTD. DE VOLUMES
                                        </div>
                                        <div className='class_dados_carga_2'>
                                            {volumeTotal}
                                        </div>
                                    </div>
                                    <hr role="separator" aria-orientation="vertical" className="class_dados_carga_3" />
                                    <div>
                                        <div className='class_dados_carga_1'>
                                            PESO
                                        </div>
                                        <div className='class_dados_carga_2'>
                                            {pesoTotal}
                                        </div>
                                    </div>
                                    <hr role="separator" aria-orientation="vertical" className="class_dados_carga_3" />
                                    <div>
                                        <div className='class_dados_carga_1'>
                                            CUBAGEM (CBM)
                                        </div>
                                        <div className='class_dados_carga_2'>
                                            {cubagemTotal}
                                        </div>
                                    </div>
                                    <hr role="separator" aria-orientation="vertical" className="class_dados_carga_3" />
                                    <div>
                                        <div className='class_dados_carga_1'>
                                            INCOTERM
                                        </div>
                                        <div className='class_dados_carga_2'>
                                            {incoterm}
                                        </div>
                                    </div>
                                    <hr role="separator" aria-orientation="vertical" className="class_dados_carga_3" />
                                    <div>
                                        <div className='class_dados_carga_1'>
                                            MODALIDADE DE FRETE
                                        </div>
                                        <div className='class_dados_carga_2'>
                                            {ppcc}
                                        </div>
                                    </div>
                                    <hr role="separator" aria-orientation="vertical" className="class_dados_carga_3" />
                                    <div>
                                        <div className='class_dados_carga_1'>
                                            CARGA EMPILHAVEL
                                        </div>
                                        <div className='class_dados_carga_2'>
                                            {cargaEmpilhavel}
                                        </div>
                                    </div>
                                    <hr role="separator" aria-orientation="vertical" className="class_dados_carga_3" />
                                    <div>
                                        <div className='class_dados_carga_1'>
                                            CARGA IMO
                                        </div>
                                        <div className='class_dados_carga_2'>
                                            {cargaImo}
                                        </div>
                                    </div>
                                </div>
                                <div className='class_dados_carga_4'></div>
                            </div>
                            <div className='separador_dados_carga'></div>
                        </div>

                        {exibirPickup === true && (
                            <div className='class_dados_coleta'>
                                <div className='class_dados_coleta_1'>
                                    <div className='titulo_button_expansivel_detalhes_coleta'>
                                        <div className='titulo_detalhes_coleta_formatacao'>Detalhes da coleta da sua carga</div>
                                        <div className='icone_botao_expansivel' onClick={handleExpandirDadosPickup}>
                                            {expandirDadosPickup === true ? (
                                                <i className='v-icon notranslate mdi mdi-minus-circle-outline theme--light'></i>
                                            ) : (
                                                <i className='v-icon notranslate mdi mdi-plus-circle-outline theme--light'></i>
                                            )
                                            }
                                        </div>
                                    </div>
                                    <div className='class_tabela_coleta'>
                                        {expandirDadosPickup === true && (
                                            <div className='d-flex'>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th className='th_detalhes_coleta'>Endereço Coleta</th>
                                                            <th className='th_detalhes_coleta'>Cubagem</th>
                                                            <th className='th_detalhes_coleta'>Volumes</th>
                                                            <th className='th_detalhes_coleta'>Peso</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dadosPickup.map((item, contadorPickup) => (
                                                            <tr key={contadorPickup}>
                                                                <td width="55%" className='td_detalhes_coleta'>{item.endereco}</td>
                                                                <td width="15%" className='td_detalhes_coleta'>{item.cubagem}</td>
                                                                <td width="15%" className='td_detalhes_coleta'>{item.volume}</td>
                                                                <td width="15%" className='td_detalhes_coleta'>{item.peso}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='class_sub_bloco_minha_rota_2'>

                                </div>
                            </div>
                        )}

                        {exibirDoorDelivery === true && (
                            <div className='class_dados_coleta'>
                                <div className='class_dados_coleta_1'>
                                    <div className='titulo_button_expansivel_detalhes_coleta'>
                                        <div className='titulo_detalhes_coleta_formatacao'>Detalhes da entrega da sua carga</div>
                                        <div className='icone_botao_expansivel' onClick={handleExpandirDadosDoorDelivery}>
                                            {expandirDadosDoorDelivery === true ? (
                                                <i className='v-icon notranslate mdi mdi-minus-circle-outline theme--light'></i>
                                            ) : (
                                                <i className='v-icon notranslate mdi mdi-plus-circle-outline theme--light'></i>
                                            )
                                            }
                                        </div>
                                    </div>
                                    <div className='class_tabela_coleta'>
                                        {expandirDadosDoorDelivery === true && (
                                            <div className='d-flex'>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th width="55%" className='th_detalhes_coleta'>Endereço de Entrega</th>
                                                            <th width="15%" className='th_detalhes_coleta'>Cubagem (M³)</th>
                                                            <th width="15%" className='th_detalhes_coleta'>Volumes</th>
                                                            <th width="15%" className='th_detalhes_coleta'>Peso (Kg)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dadosDoorDelivery.map((item, contadorDoorDelivery) => (
                                                            <tr key={contadorDoorDelivery}>
                                                                <td className='td_detalhes_coleta'>{item.endereco}</td>
                                                                <td className='td_detalhes_coleta'>{item.cubagem}</td>
                                                                <td className='td_detalhes_coleta'>{item.volume}</td>
                                                                <td className='td_detalhes_coleta'>{item.peso}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {exibirImo === true && (
                            <div className='class_dados_coleta'>
                                <div className='class_dados_coleta_1'>
                                    <div className='titulo_button_expansivel_detalhes_coleta'>
                                        <div className='titulo_detalhes_coleta_formatacao'>Detalhes da sua Carga IMO</div>
                                        <div className='icone_botao_expansivel' onClick={handleExpandirDadosImo}>
                                            {expandirDadosImo === true ? (
                                                <i className='v-icon notranslate mdi mdi-minus-circle-outline theme--light'></i>
                                            ) : (
                                                <i className='v-icon notranslate mdi mdi-plus-circle-outline theme--light'></i>
                                            )
                                            }
                                        </div>
                                    </div>
                                    <div className='class_tabela_coleta'>
                                        {expandirDadosImo === true && (
                                            <div className='d-flex'>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th width="55%" className='th_detalhes_coleta'>IMO</th>
                                                            <th width="15%" className='th_detalhes_coleta'>UN</th>
                                                            <th width="15%" className='th_detalhes_coleta'>Packing Group</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dadosImo.map((item, contadorImo) => (
                                                            <tr key={contadorImo}>
                                                                <td className='td_detalhes_coleta'>{item.classe_imo_label}</td>
                                                                <td className='td_detalhes_coleta'>{item.un_imo}</td>
                                                                <td className='td_detalhes_coleta'>{item.packing_group}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='class_total_proposta'>
                            <div className='class_total_proposta_1'>
                                <div className='class_titulo_total_proposta'>
                                    TOTAL DESTA PROPOSTA
                                </div>
                                <div className='class_titulo_total_proposta'>
                                    <div className='d-flex'>
                                        <div className='bloco_total_proposta_4'>
                                            {(valorBrlPP !== "") && (
                                                <div className='bloco_total_proposta_5'>
                                                    BRL {valorBrlPP}
                                                </div>

                                            )}
                                            {(valorBrlCC !== "") && (
                                                <div className='bloco_total_proposta_6'>
                                                    {valorBrlPP !== "" && (
                                                        <span className='bloco_total_proposta_7'>|</span>
                                                    )}
                                                    BRL {valorBrlCC}
                                                </div>

                                            )}

                                            {(valorUsdPP !== "") && (
                                                <div className='bloco_total_proposta_6'>
                                                    {(valorBrlPP !== "" || valorBrlCC !== "") && (
                                                        <span className='bloco_total_proposta_7'>|</span>
                                                    )}
                                                    USD {valorUsdPP}
                                                </div>
                                            )}

                                            {(valorUsdCC !== "") && (
                                                <div className='bloco_total_proposta_6'>
                                                    {(valorBrlPP !== "" || valorBrlCC !== "" || valorUsdPP !== "") && (
                                                        <span className='bloco_total_proposta_7'>|</span>
                                                    )}
                                                    USD {valorUsdCC}
                                                </div>
                                            )}

                                            {(valorEurPP !== "") && (
                                                <div className='bloco_total_proposta_6'>
                                                    {(valorBrlPP !== "" || valorBrlCC !== "" || valorUsdPP !== "" || valorUsdCC !== "") && (
                                                        <span className='bloco_total_proposta_7'>|</span>
                                                    )}
                                                    EUR {valorEurPP}
                                                </div>
                                            )}

                                            {(valorEurCC !== "") && (
                                                <div className='bloco_total_proposta_6'>
                                                    {(valorBrlPP !== "" || valorBrlCC !== "" || valorUsdPP !== "" || valorUsdCC !== "" || valorEurPP !== "") && (
                                                        <span className='bloco_total_proposta_7'>|</span>
                                                    )}
                                                    EUR {valorEurCC}
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='class_sub_bloco_minha_rota_2'></div>
                        </div>

                    </div>
                </div>

                {taxasFrete.length > 0 && (
                    <div className='class_corpo_cotacao_formalizada'>
                        <div className='dados_taxas'>
                            <button className='button_expansivel' onClick={handleExpandirTaxasFrete}>
                                <div className='alinhamento_titulo_taxas'>
                                    <div className='titulo_button_expansivel'>
                                        <div className='observacao_condicoes_proposta'>Frete e Adicionais</div>
                                        <div className='icone_botao_expansivel'>
                                            {expandirTaxasFrete === true ? (
                                                <i className='v-icon notranslate mdi mdi-minus-circle-outline theme--light'></i>
                                            ) : (
                                                <i className='v-icon notranslate mdi mdi-plus-circle-outline theme--light'></i>
                                            )
                                            }
                                        </div>
                                    </div>

                                    <div className='sub_titulo_button_expansivel'>
                                        {taxasFrete.length > 0 && (
                                            <div className='texto_sub_titulo_expansivel'>

                                                <div className='texto_sub_titulo_expansivel_2'>
                                                    <div className='texto_sub_titulo_expansivel_3'>
                                                        <div className='texto_sub_titulo_expansivel_4'>
                                                            TOTAIS:
                                                        </div>

                                                        {(valorTotalFreteBrlPP !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {valorTotalFreteBrlPP}
                                                            </div>

                                                        )}

                                                        {(valorTotalFreteBrlCC !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {valorTotalFreteBrlPP !== "" && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalFreteBrlCC}
                                                            </div>
                                                        )}

                                                        {(valorTotalFreteUsdPP !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalFreteBrlPP !== "" || valorTotalFreteBrlCC !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalFreteUsdPP}
                                                            </div>
                                                        )}

                                                        {(valorTotalFreteUsdCC !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalFreteBrlPP !== "" || valorTotalFreteBrlCC !== "" || valorTotalFreteUsdPP !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalFreteUsdCC}
                                                            </div>
                                                        )}

                                                        {(valorTotalFreteEurPP !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalFreteBrlPP !== "" || valorTotalFreteBrlCC !== "" || valorTotalFreteUsdPP !== "" || valorTotalFreteEurPP !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalFreteEurPP}
                                                            </div>
                                                        )}

                                                        {(valorTotalFreteEurCC !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalFreteBrlPP !== "" || valorTotalFreteBrlCC !== "" || valorTotalFreteUsdPP !== "" || valorTotalFreteEurPP !== "" || valorTotalFreteEurPP !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalFreteEurCC}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        )}

                                    </div>
                                </div>
                            </button>
                            <div>
                                <div>
                                    {expandirTaxasFrete === true && (
                                        <div className='conteudo_taxas'>
                                            <div className='conteudo_taxas_table'>
                                                {taxasFrete.length > 0 && (
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th className='th_personalizada'>
                                                                    <span>Taxa</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Valor</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Min</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Max</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Moeda</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Total</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Modalidade</span>
                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                taxasFrete.map((item, contadorTaxaFrete) => (
                                                                    <tr key={contadorTaxaFrete}>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.taxa}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_venda} {item.unidade}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_venda_minimo}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_venda_maximo}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.moeda}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_calculado}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.ppcc}</span>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {taxasOrigem.length > 0 && (
                    <div className='class_corpo_cotacao_formalizada'>
                        <div className='dados_taxas'>
                            <button className='button_expansivel' onClick={handleExpandirTaxasOrigem}>
                                <div className='alinhamento_titulo_taxas'>
                                    <div className='titulo_button_expansivel'>
                                        <div className='observacao_condicoes_proposta'>Custos de Origem</div>
                                        <div className='icone_botao_expansivel'>
                                            {expandirTaxasOrigem === true ? (
                                                <i className='v-icon notranslate mdi mdi-minus-circle-outline theme--light'></i>
                                            ) : (
                                                <i className='v-icon notranslate mdi mdi-plus-circle-outline theme--light'></i>
                                            )
                                            }
                                        </div>
                                    </div>

                                    <div className='sub_titulo_button_expansivel'>
                                        {taxasOrigem.length > 0 && (
                                            <div className='texto_sub_titulo_expansivel'>

                                                <div className='texto_sub_titulo_expansivel_2'>
                                                    <div className='texto_sub_titulo_expansivel_3'>
                                                        <div className='texto_sub_titulo_expansivel_4'>
                                                            TOTAIS:
                                                        </div>

                                                        {(valorTotalOrigemBrlPP !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {valorTotalOrigemBrlPP}
                                                            </div>

                                                        )}

                                                        {(valorTotalOrigemBrlCC !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {valorTotalOrigemBrlPP !== "" && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalOrigemBrlCC}
                                                            </div>
                                                        )}

                                                        {(valorTotalOrigemUsdPP !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalOrigemBrlPP !== "" || valorTotalOrigemBrlCC !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalOrigemUsdPP}
                                                            </div>
                                                        )}

                                                        {(valorTotalOrigemUsdCC !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalOrigemBrlPP !== "" || valorTotalOrigemBrlCC !== "" || valorTotalOrigemUsdPP !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalOrigemUsdCC}
                                                            </div>
                                                        )}

                                                        {(valorTotalOrigemEurPP !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalOrigemBrlPP !== "" || valorTotalOrigemBrlCC !== "" || valorTotalOrigemUsdPP !== "" || valorTotalOrigemUsdCC !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalOrigemEurPP}
                                                            </div>
                                                        )}

                                                        {(valorTotalOrigemEurCC !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalOrigemBrlPP !== "" || valorTotalOrigemBrlCC !== "" || valorTotalOrigemUsdPP !== "" || valorTotalOrigemUsdCC !== "" || valorTotalOrigemEurPP !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalOrigemEurCC}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        )}

                                    </div>
                                </div>
                            </button>
                            <div>
                                {expandirTaxasOrigem === true && (
                                    <div>
                                        <div className='conteudo_taxas'>
                                            <div className='conteudo_taxas_table'>
                                                {taxasOrigem.length > 0 && (
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th className='th_personalizada'>
                                                                    <span>Taxa</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Valor</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Min</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Max</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Moeda</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Total</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Modalidade</span>
                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                taxasOrigem.map((item, contadorTaxaFrete) => (
                                                                    <tr key={contadorTaxaFrete}>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.taxa}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_venda} {item.unidade}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_venda_minimo}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_venda_maximo}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.moeda}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_calculado}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.ppcc}</span>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
                }

                {taxasDestino.length > 0 && (
                    <div className='class_corpo_cotacao_formalizada'>
                        <div className='dados_taxas'>
                            <button className='button_expansivel' onClick={handleExpandirTaxasDestino}>
                                <div className='alinhamento_titulo_taxas'>
                                    <div className='titulo_button_expansivel'>
                                        <div className='observacao_condicoes_proposta'>Custos de Destino</div>
                                        <div className='icone_botao_expansivel'>
                                            {expandirTaxasDestino === true ? (
                                                <i className='v-icon notranslate mdi mdi-minus-circle-outline theme--light'></i>
                                            ) : (
                                                <i className='v-icon notranslate mdi mdi-plus-circle-outline theme--light'></i>
                                            )
                                            }
                                        </div>
                                    </div>

                                    <div className='sub_titulo_button_expansivel'>
                                        {taxasDestino.length > 0 && (
                                            <div className='texto_sub_titulo_expansivel'>
                                                <div className='texto_sub_titulo_expansivel_2'>
                                                    <div className='texto_sub_titulo_expansivel_3'>
                                                        <div className='texto_sub_titulo_expansivel_4'>
                                                            TOTAIS:
                                                        </div>

                                                        {(valorTotalDestinoBrlPP !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {valorTotalDestinoBrlPP}
                                                            </div>

                                                        )}

                                                        {(valorTotalDestinoBrlCC !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {valorTotalDestinoBrlPP !== "" && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalDestinoBrlCC}
                                                            </div>
                                                        )}

                                                        {(valorTotalDestinoUsdPP !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalDestinoBrlPP !== "" || valorTotalDestinoBrlCC !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalDestinoUsdPP}
                                                            </div>
                                                        )}

                                                        {(valorTotalDestinoUsdCC !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalDestinoBrlPP !== "" || valorTotalDestinoBrlCC !== "" || valorTotalDestinoUsdPP !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalDestinoUsdCC}
                                                            </div>
                                                        )}

                                                        {(valorTotalDestinoEurPP !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalDestinoBrlPP !== "" || valorTotalDestinoBrlCC !== "" || valorTotalDestinoUsdPP !== "" || valorTotalDestinoUsdCC !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalDestinoEurPP}
                                                            </div>
                                                        )}

                                                        {(valorTotalDestinoEurCC !== "") && (
                                                            <div className='texto_sub_titulo_expansivel_4'>
                                                                {(valorTotalDestinoBrlPP !== "" || valorTotalDestinoBrlCC !== "" || valorTotalDestinoUsdPP !== "" || valorTotalDestinoUsdCC !== "" || valorTotalDestinoEurPP !== "") && (
                                                                    <span className='bloco_total_proposta_7'>|</span>
                                                                )}
                                                                {valorTotalDestinoEurCC}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                            <div>
                                {expandirTaxasDestino === true && (
                                    <div>
                                        <div className='conteudo_taxas'>
                                            <div className='conteudo_taxas_table'>
                                                {taxasDestino.length > 0 && (
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th className='th_personalizada'>
                                                                    <span>Taxa</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Valor</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Min</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Max</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Moeda</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Total</span>
                                                                </th>
                                                                <th className='th_personalizada'>
                                                                    <span>Modalidade</span>
                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                taxasDestino.map((item, contadorTaxaFrete) => (
                                                                    <tr key={contadorTaxaFrete}>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.taxa}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_venda} {item.unidade}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_venda_minimo}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_venda_maximo}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.moeda}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.valor_calculado}</span>
                                                                        </td>
                                                                        <td className='td_personalizada'>
                                                                            <span>{item.ppcc}</span>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className='class_corpo_cotacao_formalizada'>
                    <div className='dados_taxas'>
                        <button className='button_expansivel'>
                            <div>
                                <div className='titulo_button_expansivel'>
                                    Comentários da Rota
                                </div>
                                <div className='sub_titulo_button_expansivel'>
                                    <div className='texto_sub_titulo_expansivel'>
                                        <div className='texto_sub_titulo_expansivel_2'>
                                            <div className='texto_sub_titulo_expansivel_3'>
                                                <div className='texto_sub_titulo_expansivel_4'>
                                                    Para Informações adicionais e importantes sobre o trafego
                                                    <Link className='link_acesso_info' onClick={() => handleAbreObsTarifario(id_tarifario)}>
                                                        clique aqui para visualizar
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
                {exibirObservacao === true && (
                    <div className='class_corpo_cotacao_formalizada'>
                        <div className='dados_taxas'>
                            <button className='button_expansivel' onClick={handleExpandirObservacao}>
                                <div className='alinhamento_titulo_condicoes'>
                                    <div className='titulo_button_expansivel'>
                                        <div className='observacao_condicoes_proposta'>Informações Importantes desta Proposta</div>
                                        <div className='icone_botao_expansivel'>
                                            {expandirObservacao === true ? (
                                                <i className='v-icon notranslate mdi mdi-minus-circle-outline theme--light'></i>
                                            ) : (
                                                <i className='v-icon notranslate mdi mdi-plus-circle-outline theme--light'></i>
                                            )
                                            }

                                        </div>
                                    </div>
                                    <div className='sub_titulo_button_expansivel'>
                                        <div className='texto_sub_titulo_expansivel'>
                                            <div className='texto_sub_titulo_expansivel_2'>
                                                <div className='texto_sub_titulo_expansivel_3'>
                                                    <div className='texto_sub_titulo_expansivel_4'>
                                                        Comentários e Particularidades desta proposta
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {expandirObservacao === true && (
                                <div className='texto_expansivel'>
                                    <div className='texto_sub_titulo_expansivel_descricao'>
                                        <div className='texto_sub_titulo_expansivel_descricao_2'>
                                            <div className='texto_sub_titulo_expansivel_descricao_3'>
                                                <div className='texto_sub_titulo_expansivel_descricao_4'>
                                                    {observacao.map((item, contadorLinhaObservacao) => (
                                                        <p key={contadorLinhaObservacao}>{item}</p>
                                                    ))
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                <div className='class_corpo_cotacao_formalizada'>
                    <div className='dados_taxas'>
                        <button className='button_expansivel' onClick={handleExpandirCondicoesDetalhadas}>
                            <div className='alinhamento_titulo_condicoes'>
                                <div className='titulo_button_expansivel'>
                                    <div className='observacao_condicoes_proposta'>Condições desta Proposta</div>
                                    <div className='icone_botao_expansivel'>
                                        {expandirCondicoesDetalhadas === true ? (
                                            <i className='v-icon notranslate mdi mdi-minus-circle-outline theme--light'></i>
                                        ) : (
                                            <i className='v-icon notranslate mdi mdi-plus-circle-outline theme--light'></i>
                                        )
                                        }

                                    </div>
                                </div>
                                <div className='sub_titulo_button_expansivel'>
                                    <div className='texto_sub_titulo_expansivel'>
                                        <div className='texto_sub_titulo_expansivel_2'>
                                            <div className='texto_sub_titulo_expansivel_3'>
                                                <div className='texto_sub_titulo_expansivel_4'>
                                                    Condições Detalhadas da Proposta
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>

                        {expandirCondicoesDetalhadas === true && (
                            <div className='texto_expansivel'>
                                <div className='texto_sub_titulo_expansivel_descricao'>
                                    <div className='texto_sub_titulo_expansivel_descricao_2'>
                                        <div className='texto_sub_titulo_expansivel_descricao_3'>
                                            {observacaoUSA.length > 0 && (
                                                <div className='texto_sub_titulo_expansivel_descricao_4'>
                                                    {observacaoUSA.map((item, contadorLinhaObservacaoUsa) => (
                                                        <p key={contadorLinhaObservacaoUsa}>{item}</p>
                                                    ))
                                                    }
                                                </div>
                                            )
                                            }

                                            {observacaoGeral.length > 0 && (
                                                <div className='texto_sub_titulo_expansivel_descricao_sem_negrito_4'>
                                                    <br />
                                                    {observacaoGeral.map((item, contadorLinhaObservacaoGeral) => (
                                                        <p key={contadorLinhaObservacaoGeral}>{item}</p>
                                                    ))
                                                    }
                                                </div>
                                            )
                                            }

                                            {observacaoLTL.length > 0 && (
                                                <div className='texto_sub_titulo_expansivel_descricao_sem_negrito_4'>
                                                    <br />
                                                    {observacaoLTL.map((item, contadorLinhaObservacaoLtl) => (
                                                        <p key={contadorLinhaObservacaoLtl}>{item}</p>
                                                    ))
                                                    }
                                                </div>
                                            )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='class_corpo_cotacao_formalizada'>
                    <div className='dados_taxas'>
                        <button className='button_expansivel' onClick={handleExpandirCondicoesDetalhadas}>
                            <div className='alinhamento_titulo_condicoes'>
                                <div className='titulo_button_expansivel'>
                                    <div className='observacao_condicoes_proposta'>Programação de Navios</div>
                                </div>
                                <div className='sub_titulo_button_expansivel'>
                                    <div className='texto_sub_titulo_expansivel'>
                                        <div className='texto_sub_titulo_expansivel_2'>
                                            <div className='texto_sub_titulo_expansivel_3'>
                                                <div className='texto_sub_titulo_expansivel_4'>
                                                    Escolha qual navio deseja embarcar sua carga.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                        <div>
                            <table width={"100%"}>
                                <thead>
                                    <tr>
                                        <th width="33.33%" className='th_personalizada_navio'>
                                            <span>Navio</span>
                                        </th>
                                        <th width="33.33%" className='th_personalizada_navio'>
                                            <span>Dead Line</span>
                                        </th>
                                        <th width="33.33%" className='th_personalizada_navio'>
                                            <span>Saída</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaProgramacaoNavios.map((item, contadorLinhaProgramacaoNavios) => (
                                        <tr key={contadorLinhaProgramacaoNavios}>
                                            <td className={contadorLinhaProgramacaoNavios%2 === 0?'td_personalizada_navio_alternado_1':'td_personalizada_navio_alternado_2'}>
                                                <span>{item.navio} - {item.viagem}</span>
                                            </td>
                                            <td className={contadorLinhaProgramacaoNavios%2 === 0?'td_personalizada_navio_alternado_1':'td_personalizada_navio_alternado_2'}>
                                                <span>{item.deadline}</span>
                                            </td>
                                            <td className={contadorLinhaProgramacaoNavios%2 === 0?'td_personalizada_navio_alternado_1':'td_personalizada_navio_alternado_2'}>
                                                <span>{item.ets}</span>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}