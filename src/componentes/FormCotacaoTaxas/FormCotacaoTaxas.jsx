import { useEffect, useState } from "react"

import api from '../../api';
import Swal from 'sweetalert2'
import XMLJS from 'xml-js'
import ModalAdicionarTaxa from "./ModalAdicionarTaxa/ModalAdicionarTaxa";
import ModalAlertModalidade from "./ModalAlert/ModalAlertModalidade";
import { Link } from "react-router-dom";
import { NumericFormat } from 'react-number-format';
import './FormCotacaoTaxas.css';

export default (props) => {
    const [processaDadosTaxas, setProcessaDadosTaxas] = useState(false);
    const [TaxasSalvasCarregadas, setTaxasSalvasCarregadas] = useState(false);
    const [listaTaxasOrigem, setListaTaxasOrigem] = useState([]);
    const [listaTaxasFretes, setListaTaxasFretes] = useState([]);
    const [listaTaxasDestino, setListaTaxasDestino] = useState([]);
    const [exibirModalTaxas, setExibirModalTaxas] = useState(false);
    const [tipoListaAdicionarTaxa, setTipoListaAdicionarTaxa] = useState("");
    const [recalcularTaxas, setRecalcularTaxas] = useState(false);
    const [TaxaImoCarregamentoDiretoAdicionado, setTaxaImoCarregamentoDiretoAdicionado] = useState(false);
    const [exibirModalAlertModalidade, setExibirModalAlertModalidade] = useState(false);
    const [nomeTaxa, setNomeTaxa] = useState("")
    const [puxarTaxasPickupEDoorDelivery, setPuxarTaxasPickupEDoorDelivery] = useState(false);
    const [impExp, setImpExp] = useState("");
    const [atualizaDadosTaxas,setAtualizarDadosTaxas] = useState(0);


    const [dadosTaxas, setDadosTaxas] = useState({
        "taxas_origem": [],
        "taxas_frete": [],
        "taxas_destino": [],
        "valor_total_taxas_origem_usd": 0.00,
        "valor_total_taxas_origem_brl": 0.00,
        "valor_total_taxas_origem_eur": 0.00,

        "valor_total_taxas_frete_usd":0.00,
        "valor_total_taxas_frete_eur":0.00,
        "valor_total_taxas_frete_brl":0.00,

        "valor_total_taxas_destino_usd":0.00,
        "valor_total_taxas_destino_brl":0.00,
        "valor_total_taxas_destino_eur":0.00,

        "valor_total_taxas_usd":0.00,
        "valor_total_taxas_eur":0.00,
        "valor_total_taxas_brl":0.00

    });

    async function buscarTaxasTarifario(id_tarifario, numero_proposta, id_cliente, fretePPCC, cargaImo, cubagemTotal, pesoTotal,  manter_taxas_adicionais=false) {
        let url = "";
        let ppcc_busca_tarifas = fretePPCC;
        if(ppcc_busca_tarifas.length > 2) {
            ppcc_busca_tarifas = "PP";
        }

        if (numero_proposta !== "") {
            if(numero_proposta.substring(0,2) === "PT") {
                url = "https://allinkscoa.com.br/Clientes/propostas/index.php/api/tarifas/buscarTarifarioCompleto/" + id_tarifario + "/" + id_cliente + "/" + cargaImo + "/" + ppcc_busca_tarifas + "/";
            } else {
                url = "https://allinkscoa.com.br/Clientes/propostas/index.php/api/tarifas/buscarTarifarioNacCompleto/" + id_tarifario + "/" + id_cliente + "/" + cargaImo + "/" + ppcc_busca_tarifas + "/";
            }
        } else {
            url = "https://allinkscoa.com.br/Clientes/propostas/index.php/api/tarifas/buscarTarifarioCompletoSemAcordo/" + id_tarifario + "/" + id_cliente + "/" + cargaImo + "/" + ppcc_busca_tarifas + "/";
        }
        let response_tarifarios = await api.get(url, {
            "Content-Type": "application/xml; charset=utf-8"
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });
        let json_result = XMLJS.xml2json(response_tarifarios, { compact: true, spaces: 2 })
        json_result = JSON.parse(json_result)
        let taxas_origem = [];
        let taxas_frete_e_adicionais = [];
        let taxas_destino = [];
        let valor_calculado = 0;
        let valor_ton = 0.000;
        let medida_calculo = 0.000;
        let ppcc_taxa = "";
        if (pesoTotal === "") {
            pesoTotal = 0.000;
        }

        if (cubagemTotal === "") {
            cubagemTotal = 0.000;
        }
        if(manter_taxas_adicionais === true) {
            // Busca Taxas Origem adicionadas manualmente
            let filtro_taxas_adicionais_origem = listaTaxasOrigem.filter(function (el) {
                if(el.taxa_adicional) {
                    return el.taxa_adicional == "1";
                }
              });
            if(filtro_taxas_adicionais_origem.length === 0) {
                setListaTaxasOrigem([]);
            } else {
                taxas_origem = filtro_taxas_adicionais_origem;
            }           


            // Busca Taxas fretes e adicionais adicionadas manualmente
            let filtro_taxas_adicionais_frete_taxas = listaTaxasFretes.filter(function (el) {
                if(el.taxa_adicional) {
                    return el.taxa_adicional == "1";
                }
              });
            
            if(filtro_taxas_adicionais_frete_taxas.length === 0) {
                setListaTaxasFretes([]);
            } else {
                taxas_frete_e_adicionais = filtro_taxas_adicionais_frete_taxas;
            }
            
            // Busca Taxas Destino
            let filtro_taxas_adicionais_destino = listaTaxasDestino.filter(function (el) {
                if(el.taxa_adicional) {
                    return el.taxa_adicional == "1";
                }
              });
            
            if(filtro_taxas_adicionais_destino.length === 0) {
                setListaTaxasDestino([]);
            } else {
                taxas_destino = filtro_taxas_adicionais_destino;
            }

            //let filtro_taxas_adicionais_origem = listaTaxasOrigem.filter((taxa_adicional) => taxa_adicional === "1");
        }
        if (json_result.tarifario) {
            // Seta a data da validade da proposta
            props.data_validade_proposta(json_result.tarifario.validade._text);
            setImpExp(json_result.tarifario.sentido._text);
            if (json_result.tarifario.sentido._text == "EXP") {
                if (Array.isArray(json_result.tarifario.taxas_locais.taxa)) {
                    json_result.tarifario.taxas_locais.taxa.map(function (item) {
                        valor_calculado = item.valor._text;
                        valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                        if (item.id_unidade._text === "3") {
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            if (parseFloat(valor_ton) > parseFloat(cubagemTotal)) {
                                medida_calculo = parseFloat(valor_ton);
                            } else {
                                medida_calculo = cubagemTotal;
                            }

                            if(parseFloat(medida_calculo) < 1) {
                                medida_calculo = 1;
                            } 

                            let valor_tarifario = item.valor._text;
                            valor_tarifario = valor_tarifario.replace(",","");
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }
                        
                        if (item.id_unidade._text === "1") {
                            medida_calculo = cubagemTotal;
                            let valor_tarifario = item.valor._text;
                            valor_tarifario = valor_tarifario.replace(",","");
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }

                        if(item.valor_minimo._text !== "") {
                            let valor_minimo_tarifario = item.valor_minimo._text;
                            valor_minimo_tarifario = valor_minimo_tarifario.replace(",",".");

                            // Calculo Valor Minimo
                            if(parseFloat(valor_minimo_tarifario) > valor_calculado) {
                                valor_calculado = parseFloat(valor_minimo_tarifario).toFixed(2);
                            }
                        }

                        if(item.valor_maximo._text !== "") {
                            let valor_maximo_tarifario = item.valor_maximo._text;
                            valor_maximo_tarifario = valor_maximo_tarifario.replace(",",".");

                            // Calculo Valor Maximo
                            if((parseFloat(valor_maximo_tarifario) < valor_calculado) && (parseFloat(valor_maximo_tarifario) > 0)) {
                                valor_calculado = parseFloat(valor_maximo_tarifario).toFixed(2);
                            }
                        }

                        ppcc_taxa = "";
                        if (!item.ppcc._text) {
                            ppcc_taxa = "PP";
                        } else {
                            if (item.ppcc._text === "") {
                                ppcc_taxa = "PP";
                            } else {
                                ppcc_taxa = item.ppcc._text;
                            }
                        }
                        taxas_origem = [...taxas_origem, {
                            "id_taxa": item.id_taxa._text,
                            "id_moeda": item.id_moeda._text,
                            "id_unidade": item.id_unidade._text,
                            "moeda": item.moeda._text,
                            "taxa": item.nome._text,
                            "ppcc": ppcc_taxa,
                            "unidade": item.unidade._text,
                            "valor_tarifario": item.valor._text,
                            "valor_compra": item.valor._text,
                            "valor_compra_minimo": item.valor_minimo._text,
                            "valor_compra_maximo": item.valor_maximo._text,
                            "valor_venda": item.valor._text,
                            "valor_venda_minimo": item.valor_minimo._text,
                            "valor_venda_maximo": item.valor_maximo._text,
                            "valor_calculado": valor_calculado,
                            "edicao_taxa": "0",
                            "editar_ppcc": "1",
                            "travar_taxa": "0",
                            "taxa_adicional":"0"
                        }];
                    });
                    setListaTaxasOrigem(taxas_origem);
                } else {
                    if(json_result.tarifario.taxas_locais.taxa) {
                        let valor_tarifario = json_result.tarifario.taxas_locais.taxa.valor._text;
                        valor_tarifario = valor_tarifario.replace(",","");
    
                        let valor_tarifario_minimo = json_result.tarifario.taxas_locais.taxa.valor_minimo._text;
                        valor_tarifario_minimo = valor_tarifario_minimo.replace(",","");
    
                        let valor_tarifario_maximo = json_result.tarifario.taxas_locais.taxa.valor_maximo._text;
                        valor_tarifario_maximo = valor_tarifario_maximo.replace(",","");
    
                        valor_calculado = json_result.tarifario.taxas_locais.taxa.valor._text;
                        valor_calculado = valor_calculado.replace(",","");
                        
                        if (json_result.tarifario.taxas_locais.taxa.id_unidade._text === "3") { //WM
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            if (parseFloat(valor_ton) > parseFloat(cubagemTotal)) {
                                medida_calculo = parseFloat(valor_ton);
                            } else {
                                medida_calculo = cubagemTotal;
                            }
                            let valor_tarifario = json_result.tarifario.taxas_locais.taxa.valor._text;
                            valor_tarifario = valor_tarifario.replace(",","");
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }
    
                        if (json_result.tarifario.taxas_locais.taxa.id_unidade._text === "1") { // M3
                            medida_calculo = cubagemTotal;
                            let valor_tarifario = json_result.tarifario.taxas_locais.taxa.valor._text;
                            valor_tarifario = valor_tarifario.replace(",","");
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }
    
                        if (json_result.tarifario.taxas_locais.taxa.id_unidade._text === "2") { // TON
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            medida_calculo = valor_ton;
                            let valor_tarifario = json_result.tarifario.taxas_locais.taxa.valor._text;
                            valor_tarifario = valor_tarifario.replace(",","");
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }
    
                        if(valor_tarifario_minimo !== "") {
                            let valor_minimo_tarifario = valor_tarifario_minimo;
                            valor_minimo_tarifario = valor_minimo_tarifario.replace(",",".");
    
                            // Calculo Valor Minimo
                            if(parseFloat(valor_minimo_tarifario) > valor_calculado) {
                                valor_calculado = parseFloat(valor_minimo_tarifario).toFixed(2);
                            }
                        }
    
                        if(valor_tarifario_maximo !== "") {
                            let valor_maximo_tarifario = valor_tarifario_maximo;
                            valor_maximo_tarifario = valor_maximo_tarifario.replace(",",".");
    
                            // Calculo Valor Maximo
                            if((parseFloat(valor_maximo_tarifario) < valor_calculado) && (parseFloat(valor_maximo_tarifario) > 0)) {
                                valor_calculado = parseFloat(valor_maximo_tarifario).toFixed(2);
                            }
                        }
    
    
                        ppcc_taxa = "";
                        if (!json_result.tarifario.taxas_locais.taxa.ppcc._text) {
                            ppcc_taxa = "AF";
                        } else {
                            if (json_result.tarifario.taxas_locais.taxa.ppcc._text == "") {
                                ppcc_taxa = "AF";
                            } else {
                                ppcc_taxa = json_result.tarifario.taxas_locais.taxa.ppcc._text;
                            }
                        }
    
                        taxas_origem = [{
                            "id_taxa": json_result.tarifario.taxas_locais.taxa.id_taxa._text,
                            "id_moeda": json_result.tarifario.taxas_locais.taxa.id_moeda._text,
                            "id_unidade": json_result.tarifario.taxas_locais.taxa.id_unidade._text,
                            "moeda": json_result.tarifario.taxas_locais.taxa.moeda._text,
                            "taxa": json_result.tarifario.taxas_locais.taxa.nome._text,
                            "ppcc": ppcc_taxa,
                            "unidade": json_result.tarifario.taxas_locais.taxa.unidade._text,
                            "valor_tarifario": valor_tarifario,
                            "valor_compra": valor_tarifario,
                            "valor_compra_minimo": valor_tarifario_minimo,
                            "valor_compra_maximo": valor_tarifario_maximo,
                            "valor_venda": valor_tarifario,
                            "valor_venda_minimo": valor_tarifario_minimo,
                            "valor_venda_maximo": valor_tarifario_maximo,
                            "valor_calculado": valor_calculado,
                            "edicao_taxa": "0",
                            "editar_ppcc": "1",
                            "travar_taxa": "0",
                            "taxa_adicional":"0"
                        }];
                        setListaTaxasOrigem(taxas_origem);    
                    }
                }

                let taxaPPCC = "";
                let editar_ppcc = 0;
                if (Array.isArray(json_result.tarifario.taxas_adicionais.taxa)) {
                    json_result.tarifario.taxas_adicionais.taxa.map(function (item) {
                        taxaPPCC = item.ppcc._text;
                        editar_ppcc = "1";
                        if (taxaPPCC === "AF") {
                            json_result.tarifario.sentido._text
                            if(fretePPCC.length > 2) {
                                /*
                                if(json_result.tarifario.sentido._text === "EXP") {
                                    fretePPCC = "AF";
                                } else {
                                    fretePPCC = "AF";
                                }
                                */
                                fretePPCC = "AF";
                                taxaPPCC = fretePPCC;
                            }                            
                            editar_ppcc = "0";
                        }

                        let valor_tarifario = item.valor._text;
                        valor_tarifario = valor_tarifario.replace(",","");
    
                        let valor_tarifario_minimo = item.valor_minimo._text;
                        valor_tarifario_minimo = valor_tarifario_minimo.replace(",","");
    
                        let valor_tarifario_maximo = item.valor_maximo._text;
                        valor_tarifario_maximo = valor_tarifario_maximo.replace(",","");
    
                        valor_calculado = item.valor._text;
                        valor_calculado = valor_calculado.replace(",","");
                        if (item.id_unidade._text === "3") {
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            if (parseFloat(valor_ton) > parseFloat(cubagemTotal)) {
                                medida_calculo = parseFloat(valor_ton);
                            } else {
                                medida_calculo = cubagemTotal;
                            }
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }

                        if (item.id_unidade._text === "1") { //M3
                            medida_calculo = cubagemTotal;
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }

                        if (item.id_unidade._text === "2") { // TON
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            medida_calculo = parseFloat(valor_ton);

                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }

                        if(valor_tarifario_minimo !== "") {
                            let valor_minimo_tarifario = valor_tarifario_minimo;
                            valor_minimo_tarifario = valor_minimo_tarifario.replace(",",".");
    
                            // Calculo Valor Minimo
                            if(parseFloat(valor_minimo_tarifario) > valor_calculado) {
                                valor_calculado = parseFloat(valor_minimo_tarifario).toFixed(2);
                            }
                        }
    
                        if(valor_tarifario_maximo !== "") {
                            let valor_maximo_tarifario = valor_tarifario_maximo;
                            valor_maximo_tarifario = valor_maximo_tarifario.replace(",",".");
    
                            // Calculo Valor Maximo
                            if((parseFloat(valor_maximo_tarifario) < valor_calculado) && (parseFloat(valor_maximo_tarifario) > 0)) {
                                valor_calculado = parseFloat(valor_maximo_tarifario).toFixed(2);
                            }
                        }
                        if(item.id_taxa._text === "10") {
                            let ppcc_frete = props.fretePPCC;
                            if(ppcc_frete.length > 2) {
                                if(json_result.tarifario.sentido._text === "EXP") {
                                    ppcc_frete = "PP";
                                } else {
                                    ppcc_frete = "CC";
                                }
                            }
                            taxaPPCC = ppcc_frete;
                            editar_ppcc = "0";
                        }

                        taxas_frete_e_adicionais = [...taxas_frete_e_adicionais, {
                            "id_taxa": item.id_taxa._text,
                            "id_moeda": item.id_moeda._text,
                            "id_unidade": item.id_unidade._text,
                            "moeda": item.moeda._text,
                            "taxa": item.nome._text,
                            "ppcc": taxaPPCC,
                            "unidade": item.unidade._text,

                            "valor_tarifario": valor_tarifario,
                            "valor_compra": valor_tarifario,
                            "valor_compra_minimo": valor_tarifario_minimo,
                            "valor_compra_maximo": valor_tarifario_maximo,

                            "valor_venda": valor_tarifario,
                            "valor_venda_minimo": valor_tarifario_minimo,
                            "valor_venda_maximo": valor_tarifario_maximo,

                            "valor_calculado": valor_calculado,
                            "edicao_taxa": "0",
                            "editar_ppcc": editar_ppcc,
                            "travar_taxa": "0",
                            "taxa_adicional":"0"
                        }];
                    });

                    if (cargaImo === "S") { // Carrega a taxa de Carregamento Direto
                        let carregar_taxa_carregamento_direto = 0;
                        if (props.listaCargaImo.length > 0) {
                            let listaCargaImo = props.listaCargaImo;
                            listaCargaImo.map((item) => {
                                if (item.carregamento_direto === "Sim") {
                                    carregar_taxa_carregamento_direto = 1;
                                }
                            });

                            if (carregar_taxa_carregamento_direto === 1) {
                                taxas_frete_e_adicionais = [...taxas_frete_e_adicionais, {
                                    "id_taxa": "1268",
                                    "id_moeda": "42",
                                    "id_unidade": "4",
                                    "moeda": "USD",
                                    "taxa": "IMO DE CARREGAMENTO DIRETO",
                                    "ppcc": fretePPCC,
                                    "unidade": "BL",
                                    "valor_tarifario": "1000.00",
                                    "valor_compra": "1000.00",
                                    "valor_compra_minimo": "1000.00",
                                    "valor_compra_maximo": "1000.00",
                                    "valor_venda": "1000.00",
                                    "valor_venda_minimo": "1000.00",
                                    "valor_venda_maximo": "1000.00",
                                    "valor_calculado": "1000.00",
                                    "edicao_taxa": "0",
                                    "editar_ppcc": "1",
                                    "travar_taxa": "0",
                                    "taxa_adicional":"0"
                                }];
                                setTaxaImoCarregamentoDiretoAdicionado(true);
                            } else {
                                setTaxaImoCarregamentoDiretoAdicionado(false);
                            }
                        }
                    } else {
                        setTaxaImoCarregamentoDiretoAdicionado(false);
                    }
                } else {
                    taxaPPCC = json_result.tarifario.taxas_adicionais.taxa.ppcc._text;
                    editar_ppcc = "1";
                    if (taxaPPCC === "AF") {
                        if(fretePPCC.length > 2) {
                            fretePPCC = "AF";
                            taxaPPCC = fretePPCC;
                        }
                        editar_ppcc = "0";
                    }

                    let valor_tarifario = json_result.tarifario.taxas_adicionais.taxa.valor._text;
                    valor_tarifario = valor_tarifario.replace(",","");

                    let valor_tarifario_minimo = json_result.tarifario.taxas_adicionais.taxa.valor_minimo._text;
                    valor_tarifario_minimo = valor_tarifario_minimo.replace(",","");

                    let valor_tarifario_maximo = json_result.tarifario.taxas_adicionais.taxa.valor_maximo._text;
                    valor_tarifario_maximo = valor_tarifario_maximo.replace(",","");
                
                    valor_calculado = json_result.tarifario.taxas_adicionais.taxa.valor._text;
                    if (json_result.tarifario.taxas_adicionais.taxa.id_unidade._text === "3") {
                        valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                        if (parseFloat(valor_ton) > parseFloat(cubagemTotal)) {
                            medida_calculo = parseFloat(valor_ton);
                        } else {
                            medida_calculo = cubagemTotal;
                        }
                        valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                        if (parseFloat(valor_calculado) > 0) {
                            valor_calculado = valor_calculado.toFixed(2);
                        } else {
                            valor_calculado = 0;
                        }
                    }
                    
                    if (json_result.tarifario.taxas_adicionais.taxa.id_unidade._text === "1") {
                        medida_calculo = cubagemTotal;
                        valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                        if (parseFloat(valor_calculado) > 0) {
                            valor_calculado = valor_calculado.toFixed(2);
                        } else {
                            valor_calculado = 0;
                        }
                    }

                    if (json_result.tarifario.taxas_adicionais.taxa.id_unidade._text === "2") {
                        valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                        medida_calculo = parseFloat(valor_ton);

                        valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                        if (parseFloat(valor_calculado) > 0) {
                            valor_calculado = valor_calculado.toFixed(2);
                        } else {
                            valor_calculado = 0;
                        }
                    }


                    if(valor_tarifario_minimo !== "") {
                        let valor_minimo_tarifario = valor_tarifario_minimo;
                        valor_minimo_tarifario = valor_minimo_tarifario.replace(",",".");

                        // Calculo Valor Minimo
                        if(parseFloat(valor_minimo_tarifario) > valor_calculado) {
                            valor_calculado = parseFloat(valor_minimo_tarifario).toFixed(2);
                        }
                    }

                    if(valor_tarifario_maximo !== "") {
                        let valor_maximo_tarifario = valor_tarifario_maximo;
                        valor_maximo_tarifario = valor_maximo_tarifario.replace(",",".");

                        // Calculo Valor Maximo
                        if((parseFloat(valor_maximo_tarifario) < valor_calculado) && (parseFloat(valor_maximo_tarifario) > 0)) {
                            valor_calculado = parseFloat(valor_maximo_tarifario).toFixed(2);
                        }
                    }

                    if(json_result.tarifario.taxas_adicionais.taxa.id_taxa._text === "10") {
                        if(props.fretePPCC !==  "") {
                            let ppcc_frete = props.fretePPCC;
                            if(ppcc_frete.length > 2) {
                                if(json_result.tarifario.sentido._text === "EXP") {
                                    ppcc_frete = "PP";
                                } else {
                                    ppcc_frete = "CC";
                                }
                            }
                            taxaPPCC = ppcc_frete;
                            editar_ppcc = "0";
                        }
                    }

                    taxas_frete_e_adicionais = [{
                        "id_taxa": json_result.tarifario.taxas_adicionais.taxa.id_taxa._text,
                        "id_moeda": json_result.tarifario.taxas_adicionais.taxa.id_moeda._text,
                        "id_unidade": json_result.tarifario.taxas_adicionais.taxa.id_unidade._text,
                        "moeda": json_result.tarifario.taxas_adicionais.taxa.moeda._text,
                        "taxa": json_result.tarifario.taxas_adicionais.taxa.nome._text,
                        "ppcc": taxaPPCC,
                        "unidade": json_result.tarifario.taxas_adicionais.taxa.unidade._text,

                        "valor_tarifario": valor_tarifario,
                        "valor_compra": valor_tarifario,
                        "valor_compra_minimo": valor_tarifario_minimo,
                        "valor_compra_maximo": valor_tarifario_maximo,
                        "valor_compra_calculado": valor_calculado,

                        "valor_venda": valor_tarifario,
                        "valor_venda_minimo": valor_tarifario_minimo,
                        "valor_venda_maximo": valor_tarifario_maximo,
                        "valor_calculado": valor_calculado,

                        "edicao_taxa": "0",
                        "editar_ppcc": editar_ppcc,
                        "travar_taxa": "0",
                        "taxa_adicional":"0"
                    }]

                    if (cargaImo === "S") { // Carrega a taxa de Carregamento Direto
                        let carregar_taxa_carregamento_direto = 0;
                        if (props.listaCargaImo.length > 0) {
                            let listaCargaImo = props.listaCargaImo;
                            listaCargaImo.map((item) => {
                                if (item.carregamento_direto === "Sim") {
                                    carregar_taxa_carregamento_direto = 1;
                                }
                            });

                            if (carregar_taxa_carregamento_direto === 1) {
                                taxas_frete_e_adicionais = [...taxas_frete_e_adicionais, {
                                    "id_taxa": "1268",
                                    "id_moeda": "42",
                                    "id_unidade": "4",
                                    "moeda": "USD",
                                    "taxa": "IMO DE CARREGAMENTO DIRETO",
                                    "ppcc": fretePPCC,
                                    "unidade": "BL",
                                    "valor_tarifario": "1000.00",
                                    "valor_compra": "1000.00",
                                    "valor_compra_minimo": "1000.00",
                                    "valor_compra_maximo": "1000.00",
                                    "valor_venda": "1000.00",
                                    "valor_venda_minimo": "1000.00",
                                    "valor_venda_maximo": "1000.00",
                                    "valor_calculado": "1000.00",
                                    "edicao_taxa": "0",
                                    "editar_ppcc": "1",
                                    "travar_taxa": "0",
                                    "taxa_adicional":"0"
                                }];
                                setTaxaImoCarregamentoDiretoAdicionado(true);
                            } else {
                                setTaxaImoCarregamentoDiretoAdicionado(false);
                            }
                        }
                    } else {
                        setTaxaImoCarregamentoDiretoAdicionado(false);
                    }
                }
                setListaTaxasFretes(taxas_frete_e_adicionais);
            } else { // Taxas Destino
                if (Array.isArray(json_result.tarifario.taxas_locais.taxa)) {
                    json_result.tarifario.taxas_locais.taxa.map(function (item) {

                        let valor_tarifario = item.valor._text;
                        valor_tarifario = valor_tarifario.replace(",","");
    
                        let valor_tarifario_minimo = item.valor_minimo._text;
                        valor_tarifario_minimo = valor_tarifario_minimo.replace(",","");
    
                        let valor_tarifario_maximo = item.valor_maximo._text;
                        valor_tarifario_maximo = valor_tarifario_maximo.replace(",","");
    
                        valor_calculado = item.valor._text;
                        valor_calculado = valor_calculado.replace(",","");

                        if (item.id_unidade._text === "3") {
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            if (parseFloat(valor_ton) > parseFloat(cubagemTotal)) {
                                medida_calculo = parseFloat(valor_ton);
                            } else {
                                medida_calculo = cubagemTotal;
                            }
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }

                        if (item.id_unidade._text === "1") {
                            medida_calculo = cubagemTotal;

                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }

                        if (item.id_unidade._text === "2") {
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            medida_calculo = parseFloat(valor_ton);

                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }

                        if(valor_tarifario_minimo !== "") {
                            let valor_minimo_tarifario = valor_tarifario_minimo;
                            valor_minimo_tarifario = valor_minimo_tarifario.replace(",",".");
    
                            // Calculo Valor Minimo
                            if(parseFloat(valor_minimo_tarifario) > valor_calculado) {
                                valor_calculado = parseFloat(valor_minimo_tarifario).toFixed(2);
                            }
                        }
    
                        if(valor_tarifario_maximo !== "") {
                            let valor_maximo_tarifario = valor_tarifario_maximo;
                            valor_maximo_tarifario = valor_maximo_tarifario.replace(",",".");
    
                            // Calculo Valor Maximo
                            if((parseFloat(valor_maximo_tarifario) < valor_calculado) && (parseFloat(valor_maximo_tarifario) > 0)) {
                                valor_calculado = parseFloat(valor_maximo_tarifario).toFixed(2);
                            }
                        }


                        ppcc_taxa = "";
                        if ((!item.ppcc._text) || (item.ppcc._text === "")) {
                            ppcc_taxa = "CC";
                        } else {
                            ppcc_taxa = item.ppcc._text;
                        }

                        taxas_destino = [...taxas_destino, {
                            "id_taxa": item.id_taxa._text,
                            "id_moeda": item.id_moeda._text,
                            "id_unidade": item.id_unidade._text,
                            "moeda": item.moeda._text,
                            "taxa": item.nome._text,
                            "ppcc": ppcc_taxa,
                            "unidade": item.unidade._text,

                            "valor_tarifario": valor_tarifario,
                            "valor_compra": valor_tarifario,
                            "valor_compra_minimo": valor_tarifario_minimo,
                            "valor_compra_maximo": valor_tarifario_maximo,

                            "valor_venda": valor_tarifario,
                            "valor_venda_minimo": valor_tarifario_minimo,
                            "valor_venda_maximo": valor_tarifario_maximo,

                            "valor_calculado": valor_calculado,
                            "edicao_taxa": "0",
                            "editar_ppcc": "0",
                            "travar_taxa": "0",
                            "taxa_adicional":"0"
                        }];
                    });
                } else {
                    if(json_result.tarifario.taxas_locais.taxa) {
                        let valor_tarifario = json_result.tarifario.taxas_locais.taxa.valor._text;
                        valor_tarifario = valor_tarifario.replace(",","");
    
                        let valor_tarifario_minimo = json_result.tarifario.taxas_locais.taxa.valor_minimo._text;
                        valor_tarifario_minimo = valor_tarifario_minimo.replace(",","");
    
                        let valor_tarifario_maximo = json_result.tarifario.taxas_locais.taxa.valor_maximo._text;
                        valor_tarifario_maximo = valor_tarifario_maximo.replace(",","");
    
                        valor_calculado = json_result.tarifario.taxas_locais.taxa.valor._text;
                        valor_calculado = valor_calculado.replace(",","");
    
                        if (json_result.tarifario.taxas_locais.taxa.id_unidade._text === "3") {
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            if (parseFloat(valor_ton) > parseFloat(cubagemTotal)) {
                                medida_calculo = parseFloat(valor_ton);
                            } else {
                                medida_calculo = cubagemTotal;
                            }
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }
    
    
                        if (json_result.tarifario.taxas_locais.taxa.id_unidade._text === "1") {
                            medida_calculo = cubagemTotal;
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }
    
                        if (json_result.tarifario.taxas_locais.taxa.id_unidade._text === "2") {
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            medida_calculo = parseFloat(valor_ton);
    
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }
    
                        if(valor_tarifario_minimo !== "") {
                            let valor_minimo_tarifario = valor_tarifario_minimo;
                            valor_minimo_tarifario = valor_minimo_tarifario.replace(",",".");
    
                            // Calculo Valor Minimo
                            if(parseFloat(valor_minimo_tarifario) > valor_calculado) {
                                valor_calculado = parseFloat(valor_minimo_tarifario).toFixed(2);
                            }
                        }
    
                        if(valor_tarifario_maximo !== "") {
                            let valor_maximo_tarifario = valor_tarifario_maximo;
                            valor_maximo_tarifario = valor_maximo_tarifario.replace(",",".");
    
                            // Calculo Valor Maximo
                            if((parseFloat(valor_maximo_tarifario) < valor_calculado) && (parseFloat(valor_maximo_tarifario) > 0)) {
                                valor_calculado = parseFloat(valor_maximo_tarifario).toFixed(2);
                            }
                        }
    
                        ppcc_taxa = "";
                        if((!json_result.tarifario.taxas_locais.taxa.ppcc._text) || (json_result.tarifario.taxas_locais.taxa.ppcc._text === "")) {
                            ppcc_taxa = "CC";
                        } else {
                            ppcc_taxa = json_result.tarifario.taxas_locais.taxa.ppcc._text;
                        }
                    
                        taxas_destino = [{
                            "id_taxa": json_result.tarifario.taxas_locais.taxa.id_taxa._text,
                            "id_moeda": json_result.tarifario.taxas_locais.taxa.id_moeda._text,
                            "id_unidade": json_result.tarifario.taxas_locais.taxa.id_unidade._text,
                            "moeda": json_result.tarifario.taxas_locais.taxa.moeda._text,
                            "taxa": json_result.tarifario.taxas_locais.taxa.nome._text,
                            "ppcc": ppcc_taxa,
                            "unidade": json_result.tarifario.taxas_locais.taxa.unidade._text,
    
                            "valor_tarifario": valor_tarifario,
                            "valor_compra": valor_tarifario,
                            "valor_compra_minimo": valor_tarifario_minimo,
                            "valor_compra_maximo": valor_tarifario_maximo,
    
                            "valor_venda": valor_tarifario,
                            "valor_venda_minimo": valor_tarifario_minimo,
                            "valor_venda_maximo": valor_tarifario_maximo,
    
                            "valor_calculado": valor_calculado,
                            "edicao_taxa": "0",
                            "editar_ppcc": "0",
                            "travar_taxa": "0",
                            "taxa_adicional":"0"
                        }]    
                    }
                }
                setListaTaxasDestino(taxas_destino);

                let taxaPPCC = "";
                let editar_ppcc = "0";
                if (Array.isArray(json_result.tarifario.taxas_adicionais.taxa)) {
                    json_result.tarifario.taxas_adicionais.taxa.map(function (item) {
                        taxaPPCC = item.ppcc._text;
                        editar_ppcc = 1;
                        if (taxaPPCC == "AF") {                            
                            if(fretePPCC.length > 2) {
                                fretePPCC = "AF";
                            }
                            taxaPPCC = fretePPCC;
                            editar_ppcc = "0";
                        }

                        let valor_tarifario = item.valor._text;
                        valor_tarifario = valor_tarifario.replace(",","");
    
                        let valor_tarifario_minimo = item.valor_minimo._text;
                        valor_tarifario_minimo = valor_tarifario_minimo.replace(",","");
    
                        let valor_tarifario_maximo = item.valor_maximo._text;
                        valor_tarifario_maximo = valor_tarifario_maximo.replace(",","");
    
                        valor_calculado = item.valor._text;
                        valor_calculado = valor_calculado.replace(",","");

                        if (item.id_unidade._text === "3") {
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            if (parseFloat(valor_ton) > parseFloat(cubagemTotal)) {
                                medida_calculo = parseFloat(valor_ton);
                            } else {
                                medida_calculo = cubagemTotal;
                            }
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }

                        if (item.id_unidade._text === "2") {
                            valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                            medida_calculo = parseFloat(valor_ton);
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }

                        if (item.id_unidade._text === "1") {
                            medida_calculo = cubagemTotal;
                            valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                            if (parseFloat(valor_calculado) > 0) {
                                valor_calculado = valor_calculado.toFixed(2);
                            } else {
                                valor_calculado = 0;
                            }
                        }

                        if(valor_tarifario_minimo !== "") {
                            let valor_minimo_tarifario = valor_tarifario_minimo;
                            valor_minimo_tarifario = valor_minimo_tarifario.replace(",",".");
    
                            // Calculo Valor Minimo
                            if(parseFloat(valor_minimo_tarifario) > valor_calculado) {
                                valor_calculado = parseFloat(valor_minimo_tarifario).toFixed(2);
                            }
                        }
    
                        if(valor_tarifario_maximo !== "") {
                            let valor_maximo_tarifario = valor_tarifario_maximo;
                            valor_maximo_tarifario = valor_maximo_tarifario.replace(",",".");
    
                            // Calculo Valor Maximo
                            if((parseFloat(valor_maximo_tarifario) < valor_calculado) && (parseFloat(valor_maximo_tarifario) > 0)) {
                                valor_calculado = parseFloat(valor_maximo_tarifario).toFixed(2);
                            }
                        }

                        if(item.id_taxa._text === "10") {
                            let ppcc_frete = props.fretePPCC;
                            if(ppcc_frete.length > 2) {
                                if(json_result.tarifario.sentido._text === "EXP") {
                                    ppcc_frete = "PP";
                                } else {
                                    ppcc_frete = "CC";
                                }
                            }
                            taxaPPCC = ppcc_frete;
                            editar_ppcc = "0";
                        }
    
    
                        taxas_frete_e_adicionais = [...taxas_frete_e_adicionais, {
                            "id_taxa": item.id_taxa._text,
                            "id_moeda": item.id_moeda._text,
                            "id_unidade": item.id_unidade._text,
                            "moeda": item.moeda._text,
                            "taxa": item.nome._text,
                            "ppcc": taxaPPCC,
                            "unidade": item.unidade._text,

                            "valor_tarifario": valor_tarifario,
                            "valor_compra": valor_tarifario,
                            "valor_compra_minimo": valor_tarifario_minimo,
                            "valor_compra_maximo": valor_tarifario_maximo,

                            "valor_venda": valor_tarifario,
                            "valor_venda_minimo": valor_tarifario_minimo,
                            "valor_venda_maximo": valor_tarifario_maximo,

                            "valor_calculado": valor_calculado,
                            "edicao_taxa": "0",
                            "editar_ppcc": editar_ppcc,
                            "travar_taxa": "0",
                            "taxa_adicional":"0"
                        }];
                    });
                } else {
                    taxaPPCC = json_result.tarifario.taxas_adicionais.taxa.ppcc._text;
                    editar_ppcc = 1;
                    if (taxaPPCC == "AF") {
                        if(fretePPCC.length > 2) {                            
                            fretePPCC = "AF";
                        }
                        taxaPPCC = fretePPCC;                        
                        editar_ppcc = 0;
                    }

                    let valor_tarifario = json_result.tarifario.taxas_adicionais.taxa.valor._text;
                    valor_tarifario = valor_tarifario.replace(",","");

                    let valor_tarifario_minimo = json_result.tarifario.taxas_adicionais.taxa.valor_minimo._text;
                    valor_tarifario_minimo = valor_tarifario_minimo.replace(",","");

                    let valor_tarifario_maximo = json_result.tarifario.taxas_adicionais.taxa.valor_maximo._text;
                    valor_tarifario_maximo = valor_tarifario_maximo.replace(",","");

                    valor_calculado = json_result.tarifario.taxas_adicionais.taxa.valor._text;
                    valor_calculado = valor_calculado.replace(",","");

                    if (json_result.tarifario.taxas_adicionais.taxa.id_unidade._text === "3") {
                        valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                        if (parseFloat(valor_ton) > parseFloat(cubagemTotal)) {
                            medida_calculo = parseFloat(valor_ton);
                        } else {
                            medida_calculo = cubagemTotal;
                        }
                        if(parseFloat(medida_calculo) < 1) {
                            medida_calculo = 1;
                        }
                        valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                        if (parseFloat(valor_calculado) > 0) {
                            valor_calculado = valor_calculado.toFixed(2);
                        } else {
                            valor_calculado = 0;
                        }
                    }

                    if (json_result.tarifario.taxas_adicionais.taxa.id_unidade._text === "1") {
                        medida_calculo = cubagemTotal;
                        valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                        if (parseFloat(valor_calculado) > 0) {
                            valor_calculado = valor_calculado.toFixed(2);
                        } else {
                            valor_calculado = 0;
                        }
                    }

                    if (json_result.tarifario.taxas_adicionais.taxa.id_unidade._text === "2") {
                        valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
                        medida_calculo = parseFloat(valor_ton);

                        valor_calculado = (parseFloat(valor_tarifario) * parseFloat(medida_calculo));
                        if (parseFloat(valor_calculado) > 0) {
                            valor_calculado = valor_calculado.toFixed(2);
                        } else {
                            valor_calculado = 0;
                        }
                    }

                    if(valor_tarifario_minimo !== "") {
                        let valor_minimo_tarifario = valor_tarifario_minimo;
                        valor_minimo_tarifario = valor_minimo_tarifario.replace(",",".");

                        // Calculo Valor Minimo
                        if(parseFloat(valor_minimo_tarifario) > valor_calculado) {
                            valor_calculado = parseFloat(valor_minimo_tarifario).toFixed(2);
                        }
                    }

                    if(valor_tarifario_maximo !== "") {
                        let valor_maximo_tarifario = valor_tarifario_maximo;
                        valor_maximo_tarifario = valor_maximo_tarifario.replace(",",".");

                        // Calculo Valor Maximo
                        if((parseFloat(valor_maximo_tarifario) < valor_calculado) && (parseFloat(valor_maximo_tarifario) > 0)) {
                            valor_calculado = parseFloat(valor_maximo_tarifario).toFixed(2);
                        }
                    }
                    
                    if(json_result.tarifario.taxas_adicionais.taxa.id_taxa._text === "10") {
                        if(props.fretePPCC !==  "") {
                            taxaPPCC = props.fretePPCC;
                            if(taxaPPCC.length > 2) {
                                if(json_result.tarifario.sentido._text === "EXP") {
                                    taxaPPCC = "PP";
                                } else {
                                    taxaPPCC = "CC";
                                }    
                            }
                        }
                    }
                    taxas_frete_e_adicionais = [{
                        "id_taxa": json_result.tarifario.taxas_adicionais.taxa.id_taxa._text,
                        "id_moeda": json_result.tarifario.taxas_adicionais.taxa.id_moeda._text,
                        "id_unidade": json_result.tarifario.taxas_adicionais.taxa.id_unidade._text,
                        "moeda": json_result.tarifario.taxas_adicionais.taxa.moeda._text,
                        "taxa": json_result.tarifario.taxas_adicionais.taxa.nome._text,
                        "ppcc": taxaPPCC,
                        "unidade": json_result.tarifario.taxas_adicionais.taxa.unidade._text,
                        "valor_tarifario": valor_tarifario,
                        "valor_compra": valor_tarifario,
                        "valor_compra_minimo": valor_tarifario_minimo,
                        "valor_compra_maximo": valor_tarifario_maximo,

                        "valor_venda": valor_tarifario,
                        "valor_venda_minimo": valor_tarifario_minimo,
                        "valor_venda_maximo": valor_tarifario_maximo,

                        "valor_calculado": valor_calculado,
                        "edicao_taxa": "0",
                        "editar_ppcc": editar_ppcc,
                        "travar_taxa": "0",
                        "taxa_adicional":"0"
                    }]
                }
                setListaTaxasFretes(taxas_frete_e_adicionais);
            }
            setPuxarTaxasPickupEDoorDelivery(true);
        }
        setProcessaDadosTaxas(true);
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);
    }

    const [ppcc_adicionar_taxa, setPpCcAdicionarTaxa] = useState("");
    function handleExibirModalAdicionarTaxa(exibirModalAdicionarTaxa, tipo_lista) {
        setExibirModalTaxas(exibirModalAdicionarTaxa);
        setTipoListaAdicionarTaxa(tipo_lista);
        if(tipo_lista === "origem") {
            if(impExp === "IMP") {
                if(props.fretePPCC !== "PP" && props.fretePPCC !== "CC") {
                    setPpCcAdicionarTaxa("PP");
                } else {
                    setPpCcAdicionarTaxa(props.fretePPCC);
                }
            } else {
                setPpCcAdicionarTaxa("PP");
            }
        } else if(tipo_lista === "destino") {
            if(impExp === "EXP") {
                if(props.fretePPCC !== "PP" && props.fretePPCC !== "CC") {
                    setPpCcAdicionarTaxa("PP");                
                } else {
                    setPpCcAdicionarTaxa(props.fretePPCC);
                }
            } else {
                setPpCcAdicionarTaxa("CC");
            }
        } else {
            if(props.fretePPCC !== "PP" && props.fretePPCC !== "CC") {
                setPpCcAdicionarTaxa("PP");
            } else {
                setPpCcAdicionarTaxa(props.fretePPCC);
            }
        }
    }

    const handleAdicionarTaxa = (inputsTaxa, tipo_lista) => {
        if (tipo_lista == "origem") {
            setListaTaxasOrigem([...listaTaxasOrigem, inputsTaxa]);
            setRecalcularTaxas(true);
        }
        if (tipo_lista == "frete") {
            setListaTaxasFretes([...listaTaxasFretes, inputsTaxa]);
            setRecalcularTaxas(true);
        }
        if (tipo_lista == "destino") {
            setListaTaxasDestino([...listaTaxasDestino, inputsTaxa]);
            setRecalcularTaxas(true);
        }
        setProcessaDadosTaxas(true);    
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);
    }

    function calcular_totais_taxas() {
        let valor_calculado = 0;
        let valor_ton = 0.000;
        let medida_calculo = 0.000;
        let novaListaValores = [];
        if (listaTaxasOrigem.length > 0) {
            novaListaValores = [];
            listaTaxasOrigem.map((item, contadorItem) => {
                valor_calculado = item.valor_venda;
                if (item.id_unidade === "3") {
                    valor_ton = parseFloat(props.pesoTotal / 1000).toFixed(3);
                    if (parseFloat(valor_ton) > parseFloat(props.cubagemTotal)) {
                        medida_calculo = parseFloat(valor_ton);
                    } else {
                        medida_calculo = props.cubagemTotal;
                    }
                    if(parseFloat(medida_calculo) < 1) {
                        medida_calculo = 1;
                    }
                    valor_calculado = parseFloat(item.valor_venda * medida_calculo).toFixed(2);
                    if (valor_calculado < parseFloat(item.valor_venda_minimo) && parseFloat(item.valor_venda_minimo) != 0.00 && item.valor_venda_minimo != "") {
                        valor_calculado = parseFloat(item.valor_venda_minimo);
                    }

                    if (valor_calculado > parseFloat(item.valor_venda_maximo) && parseFloat(item.valor_venda_maximo) !== 0.00 && item.valor_venda_maximo !== "") {
                        valor_calculado = parseFloat(item.valor_venda_maximo).toFixed(2);
                    }
                }
                if(item.id_unidade === "1") {
                    let medida_calculo = props.cubagemTotal;
                    valor_calculado = parseFloat(item.valor_venda * medida_calculo).toFixed(2);
                    if (valor_calculado < parseFloat(item.valor_venda_minimo) && parseFloat(item.valor_venda_minimo) != 0.00 && item.valor_venda_minimo != "") {
                        valor_calculado = parseFloat(item.valor_venda_minimo);
                    }

                    if (valor_calculado > parseFloat(item.valor_venda_maximo) && parseFloat(item.valor_venda_maximo) !== 0.00 && item.valor_venda_maximo !== "") {
                        valor_calculado = parseFloat(item.valor_venda_maximo).toFixed(2);
                    }
                }

                if(item.id_unidade === "2") {
                    valor_ton = parseFloat(props.pesoTotal / 1000).toFixed(3);
                    let medida_calculo = valor_ton;

                    valor_calculado = parseFloat(item.valor_venda * medida_calculo).toFixed(2);
                    if (valor_calculado < parseFloat(item.valor_venda_minimo) && parseFloat(item.valor_venda_minimo) != 0.00 && item.valor_venda_minimo != "") {
                        valor_calculado = parseFloat(item.valor_venda_minimo);
                    }

                    if (valor_calculado > parseFloat(item.valor_venda_maximo) && parseFloat(item.valor_venda_maximo) !== 0.00 && item.valor_venda_maximo !== "") {
                        valor_calculado = parseFloat(item.valor_venda_maximo).toFixed(2);
                    }
                }
                item.valor_calculado = valor_calculado;
                novaListaValores = [...novaListaValores, item];
            });
            setListaTaxasOrigem(novaListaValores);
        }

        if (listaTaxasFretes.length > 0) {
            novaListaValores = [];
            listaTaxasFretes.map((item, contadorItem) => {
                valor_calculado = item.valor_venda;
                if (item.id_unidade === "3") {
                    valor_ton = parseFloat(props.pesoTotal / 1000).toFixed(3);
                    if (parseFloat(valor_ton) > parseFloat(props.cubagemTotal)) {
                        medida_calculo = parseFloat(valor_ton);
                    } else {
                        medida_calculo = props.cubagemTotal;
                    }

                    if(parseFloat(medida_calculo) < 1) {
                        medida_calculo = 1;
                    }

                    valor_calculado = parseFloat(item.valor_venda * medida_calculo).toFixed(2);
                    if (valor_calculado < parseFloat(item.valor_venda_minimo) && parseFloat(item.valor_venda_minimo) != 0.00 && item.valor_venda_minimo != "") {
                        valor_calculado = parseFloat(item.valor_venda_minimo);
                    }

                    if (valor_calculado > parseFloat(item.valor_venda_maximo) && parseFloat(item.valor_venda_maximo) !== 0.00 && item.valor_venda_maximo !== "") {
                        valor_calculado = parseFloat(item.valor_venda_maximo).toFixed(2);
                    }
                }

                if(item.id_unidade === "1") {
                    let medida_calculo = props.cubagemTotal;
                    valor_calculado = parseFloat(item.valor_venda * medida_calculo).toFixed(2);
                    if (valor_calculado < parseFloat(item.valor_venda_minimo) && parseFloat(item.valor_venda_minimo) != 0.00 && item.valor_venda_minimo != "") {
                        valor_calculado = parseFloat(item.valor_venda_minimo);
                    }

                    if (valor_calculado > parseFloat(item.valor_venda_maximo) && parseFloat(item.valor_venda_maximo) !== 0.00 && item.valor_venda_maximo !== "") {
                        valor_calculado = parseFloat(item.valor_venda_maximo).toFixed(2);
                    }
                }

                if (item.id_unidade === "2") {
                    valor_ton = parseFloat(props.pesoTotal / 1000).toFixed(3);
                    medida_calculo = parseFloat(valor_ton);

                    valor_calculado = parseFloat(item.valor_venda * medida_calculo).toFixed(2);
                    if (valor_calculado < parseFloat(item.valor_venda_minimo) && parseFloat(item.valor_venda_minimo) != 0.00 && item.valor_venda_minimo != "") {
                        valor_calculado = parseFloat(item.valor_venda_minimo);
                    }

                    if (valor_calculado > parseFloat(item.valor_venda_maximo) && parseFloat(item.valor_venda_maximo) !== 0.00 && item.valor_venda_maximo !== "") {
                        valor_calculado = parseFloat(item.valor_venda_maximo).toFixed(2);
                    }
                }

                item.valor_calculado = valor_calculado;
                novaListaValores = [...novaListaValores, item];
            });
            setListaTaxasFretes(novaListaValores);
        }

        if (listaTaxasDestino.length > 0) {
            novaListaValores = [];
            listaTaxasDestino.map((item, contadorItem) => {
                valor_calculado = item.valor_venda;
                if (item.id_unidade === "3") {
                    valor_ton = parseFloat(props.pesoTotal / 1000).toFixed(3);
                    if (parseFloat(valor_ton) > parseFloat(props.cubagemTotal)) {
                        medida_calculo = parseFloat(valor_ton);
                    } else {
                        medida_calculo = parseFloat(props.cubagemTotal);
                    }
                    valor_calculado = parseFloat(item.valor_venda * medida_calculo).toFixed(2);

                    if (valor_calculado < parseFloat(item.valor_venda_minimo) && parseFloat(item.valor_venda_minimo) != 0.00 && item.valor_venda_minimo != "") {
                        valor_calculado = parseFloat(item.valor_venda_minimo);
                    }

                    if (valor_calculado > parseFloat(item.valor_venda_maximo) && parseFloat(item.valor_venda_maximo) !== 0.00 && item.valor_venda_maximo !== "") {
                        valor_calculado = parseFloat(item.valor_venda_maximo).toFixed(2);
                    }
                }

                if(item.id_unidade === "1") {
                    let medida_calculo = props.cubagemTotal;
                    valor_calculado = parseFloat(item.valor_venda * medida_calculo).toFixed(2);
                    if (valor_calculado < parseFloat(item.valor_venda_minimo) && parseFloat(item.valor_venda_minimo) != 0.00 && item.valor_venda_minimo != "") {
                        valor_calculado = parseFloat(item.valor_venda_minimo);
                    }

                    if (valor_calculado > parseFloat(item.valor_venda_maximo) && parseFloat(item.valor_venda_maximo) !== 0.00 && item.valor_venda_maximo !== "") {
                        valor_calculado = parseFloat(item.valor_venda_maximo).toFixed(2);
                    }
                }

                if (item.id_unidade === "2") {
                    valor_ton = parseFloat(props.pesoTotal / 1000).toFixed(3);
                    medida_calculo = parseFloat(valor_ton);

                    valor_calculado = parseFloat(item.valor_venda * medida_calculo).toFixed(2);

                    if (valor_calculado < parseFloat(item.valor_venda_minimo) && parseFloat(item.valor_venda_minimo) != 0.00 && item.valor_venda_minimo != "") {
                        valor_calculado = parseFloat(item.valor_venda_minimo);
                    }

                    if (valor_calculado > parseFloat(item.valor_venda_maximo) && parseFloat(item.valor_venda_maximo) !== 0.00 && item.valor_venda_maximo !== "") {
                        valor_calculado = parseFloat(item.valor_venda_maximo).toFixed(2);
                    }
                }

                item.valor_calculado = valor_calculado;
                novaListaValores = [...novaListaValores, item];
            });
            setListaTaxasDestino(novaListaValores);
        }
        setProcessaDadosTaxas(true);
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);
    }

    function verificacao_add_taxa_carregamento_direto_imo(listaCargasImo) {
        let incluir_taxa_carregamento_direto = 0;
        if(listaCargasImo.length > 0) {
            listaCargasImo.map((item) => {
                if (item.carregamento_direto === "Sim") {
                    incluir_taxa_carregamento_direto = 1;
                }
            });    
        }

        if (incluir_taxa_carregamento_direto == 1) {
            if (TaxaImoCarregamentoDiretoAdicionado === false) {
                let taxa_carregamento_ja_cadastrada = false;
                listaTaxasFretes.map((item) => {
                    if (item.id_taxa === "1268") {
                        taxa_carregamento_ja_cadastrada = true;
                    }
                });
                
                if(taxa_carregamento_ja_cadastrada === false) {
                    setListaTaxasFretes([...listaTaxasFretes, {
                        "id_taxa": "1268",
                        "id_moeda": "42",
                        "id_unidade": "4",
                        "moeda": "USD",
                        "taxa": "IMO DE CARREGAMENTO DIRETO",
                        "ppcc": "PP",
                        "unidade": "BL",
    
                        "valor_tarifario": "1000.00",
                        "valor_compra": "1000.00",
                        "valor_compra_minimo": "1000.00",
                        "valor_compra_maximo": "1000.00",
    
                        "valor_venda": "1000.00",
                        "valor_venda_minimo": "1000.00",
                        "valor_venda_maximo": "1000.00",
    
                        "valor_calculado": "1000.00",
                        "edicao_taxa": "0",
                        "editar_ppcc": "1",
                        "travar_taxa": "0",
                        "taxa_adicional":"0"
                    }]);
                    setTaxaImoCarregamentoDiretoAdicionado(true);    
                }
            }
        } else {
            if (TaxaImoCarregamentoDiretoAdicionado === true) {
                let novaListaTaxas = [];
                listaTaxasFretes.map((item) => {
                    if (item.id_taxa != "1268") {
                        novaListaTaxas = [...novaListaTaxas, item];
                    }
                });
                setListaTaxasFretes(novaListaTaxas);
                setTaxaImoCarregamentoDiretoAdicionado(false);
            }
        }
        setProcessaDadosTaxas(true);
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);

    }



    const [tarifario_alterado_manualmente, setTarifarioAlteradoManualmente] = useState(false);
    useEffect(() => {
        if(props.dados_proposta_salva === null) {
            if(props.buscaTaxasTarifario === true) {
                /*
                setListaTaxasOrigem([]);
                setListaTaxasFretes([]);
                setListaTaxasDestino([]);
                */
                if (props.id_tarifario_selecionado > 0) {
                    buscarTaxasTarifario(props.id_tarifario_selecionado, props.numero_proposta, props.id_cliente_selecionado, props.fretePPCC, props.cargaImo, props.cubagemTotal, props.pesoTotal, true);
                }    
                props.alteraStatusBuscaTarifario(false);
            }
        } else {
            if(props.buscaTaxasTarifario === true) {
                if(tarifario_alterado_manualmente === false) {
                    let mudanca_modalidade = false;
                    let mudanca_status_carga_imo = false;
                    if(props.fretePPCC !== "") {
                        let frete_ppcc_salvo = new Array();
                        let contador_ppcc_salvo = 0;
                        if(props.dados_proposta_salva.dados_rota.pp === "1" || props.dados_proposta_salva.dados_rota.pp === 1) {
                            frete_ppcc_salvo[contador_ppcc_salvo] = "PP";
                            contador_ppcc_salvo++;
                        }
    
                        if(props.dados_proposta_salva.dados_rota.cc === "1" || props.dados_proposta_salva.dados_rota.cc === 1) {
                            frete_ppcc_salvo[contador_ppcc_salvo] = "CC";
                            contador_ppcc_salvo++;
                        }
    
                        if(frete_ppcc_salvo.length < 2) {
                            if(frete_ppcc_salvo[0] !== props.fretePPCC) {
                                mudanca_modalidade = true;
                            }
                        } else {
                            if(props.fretePPCC.length === 2) {
                                if(frete_ppcc_salvo[0] !== props.fretePPCC) {
                                    mudanca_modalidade = true;
                                }    
                            }
                        }   
                    }

                    if(props.dados_proposta_salva.dados_carga.lista_carga_imo.length === 0 && props.listaCargaImo.length > 0) {
                        mudanca_status_carga_imo = true;
                    }
                    
                    if((parseInt(props.id_tarifario_selecionado) !== parseInt(props.dados_proposta_salva.dados_rota.id_tarifario)) || ((parseInt(props.id_tarifario_selecionado) === parseInt(props.dados_proposta_salva.dados_rota.id_tarifario)) && (props.dados_proposta_salva.dados_rota.numero_proposta !== props.numero_proposta) ) || (mudanca_modalidade === true) || (mudanca_status_carga_imo === true) || (props.recarregarTaxas === true)) {                
                        if (props.id_tarifario_selecionado > 0) {
                            /*
                            setListaTaxasOrigem([]);
                            setListaTaxasFretes([]);
                            setListaTaxasDestino([]);    
                            */
                            buscarTaxasTarifario(props.id_tarifario_selecionado, props.numero_proposta, props.id_cliente_selecionado, props.fretePPCC, props.cargaImo, props.cubagemTotal, props.pesoTotal,true);
                            setTarifarioAlteradoManualmente(true);
                            props.alteraStatusRecarregarTaxas(false);
                        }
                    }    
                } else {
                    if (props.id_tarifario_selecionado > 0) {
                        /*
                        setListaTaxasOrigem([]);
                        setListaTaxasFretes([]);
                        setListaTaxasDestino([]);    
                        */
                        buscarTaxasTarifario(props.id_tarifario_selecionado, props.numero_proposta, props.id_cliente_selecionado, props.fretePPCC, props.cargaImo, props.cubagemTotal, props.pesoTotal, true);
                        setTarifarioAlteradoManualmente(true);
                        props.alteraStatusRecarregarTaxas(false);
                    }
                }
                props.alteraStatusBuscaTarifario(false);
            }
        }
    }, [props.buscaTaxasTarifario]);


    useEffect(() => {
        if(props.verificarTaxaCarregamentoDiretoImo === true) {
            verificacao_add_taxa_carregamento_direto_imo(props.listaCargaImo);
            props.handleVerificarTaxaCarregamentoDireto(false);
        }
    }, [props.verificarTaxaCarregamentoDiretoImo]);


    //, , props.fretePPCC, 


    useEffect(() => {
        calcular_totais_taxas();
        setRecalcularTaxas(false);
        calcularTaxaPickup();
        calcularTaxaDoorDelivery();
        //setPuxarTaxasPickupEDoorDelivery(false);
    }, [props.cubagemTotal, props.pesoTotal, recalcularTaxas])

    useEffect(() => {
        calcularTaxaPickup();
        calcularTaxaDoorDelivery();
        setPuxarTaxasPickupEDoorDelivery(false);
        props.alterarClickCalculadoraPickup(false);

    }, [props.clickCalculadora, puxarTaxasPickupEDoorDelivery, props.listaPickup, props.listaDoorDelivery])

    const [valorTotalOrigem, setValorTotalOrigem] = useState(0.00);
    
    

    useEffect(() => {
        if (props.listaCargaImo.length > 0 && listaTaxasOrigem.length > 0) {
            //buscarTaxasTarifario(props.id_tarifario_selecionado, props.numero_proposta, props.id_cliente_selecionado, props.fretePPCC, props.cargaImo, props.cubagemTotal, props.pesoTotal);
            //verificacao_add_taxa_carregamento_direto_imo(props.listaCargaImo);
        }
    }, [props.listaCargaImo, props.alteracaoItemCargaImo])

    function handleExcluirTaxa(indiceExclusao, tipo_lista_taxa) {
        if (tipo_lista_taxa == "origem") {
            let nova_lista_taxa = [];
            listaTaxasOrigem.map((item, contadorTaxa) => {
                if (contadorTaxa !== indiceExclusao) {
                    nova_lista_taxa = [...nova_lista_taxa, item];
                }
            });
            setListaTaxasOrigem(nova_lista_taxa);
        }

        if (tipo_lista_taxa == "frete") {
            let nova_lista_taxa = [];
            listaTaxasFretes.map((item, contadorTaxa) => {
                if (contadorTaxa !== indiceExclusao) {
                    nova_lista_taxa = [...nova_lista_taxa, item];
                }
            });
            setListaTaxasFretes(nova_lista_taxa);
        }

        if (tipo_lista_taxa == "destino") {
            let nova_lista_taxa = [];
            listaTaxasDestino.map((item, contadorTaxa) => {
                if (contadorTaxa !== indiceExclusao) {
                    nova_lista_taxa = [...nova_lista_taxa, item];
                }
            });
            setListaTaxasDestino(nova_lista_taxa);
        }
        setProcessaDadosTaxas(true);
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);
    }

    function fechar_janela_alerta() {
        setExibirModalAlertModalidade(false);
    }

    function handleAlteracaoModalidadeTaxaFrete(valor_option, ppcc_padrao, nome_taxa, item, indexTaxa, tipoLista) {
        if (valor_option !== ppcc_padrao) {
            setExibirModalAlertModalidade(true);
            setNomeTaxa(nome_taxa);
            //setTimeout(fechar_janela_alerta,5000);
        } else {
            setExibirModalAlertModalidade(false);
        }

        let novaListaTaxas = [];
        let novos_valores_item = ({ ...item, ["ppcc"]: valor_option });
        listaTaxasFretes.map((taxa, contTaxa) => {
            if (contTaxa === indexTaxa) {
                novaListaTaxas[contTaxa] = novos_valores_item;
            } else {
                novaListaTaxas[contTaxa] = taxa;
            }
        });
        setListaTaxasFretes(novaListaTaxas);
        setProcessaDadosTaxas(true);
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);

    }

    function alteracao_valores(id_taxa, contador, tipo) {
        if (tipo === "fretes") {
            let nova_lista_fretes_edicao = [];
            listaTaxasFretes.map((item, contador_taxa) => {
                if (item.id_taxa === id_taxa && contador_taxa === contador) {
                    item.edicao_taxa = "1";
                }
                nova_lista_fretes_edicao = [...nova_lista_fretes_edicao, item];
            });
            setListaTaxasFretes(nova_lista_fretes_edicao);
        }

        if (tipo === "origem") {
            let nova_lista_origem_edicao = [];
            listaTaxasOrigem.map((item, contador_taxa) => {
                if (item.id_taxa === id_taxa && contador_taxa === contador) {
                    item.edicao_taxa = "1";
                }
                nova_lista_origem_edicao = [...nova_lista_origem_edicao, item];
            });
            setListaTaxasOrigem(nova_lista_origem_edicao);
        }

        if (tipo === "destino") {
            let nova_lista_destino_edicao = [];
            listaTaxasDestino.map((item, contador_taxa) => {
                if (item.id_taxa === id_taxa && contador_taxa === contador) {
                    item.edicao_taxa = "1";
                }
                nova_lista_destino_edicao = [...nova_lista_destino_edicao, item];
            });
            setListaTaxasDestino(nova_lista_destino_edicao);
        }
    }

    function calculo_wm(valor, valor_minimo, valor_maximo, peso, cubagem) {
        let valor_calculado = 0.00;
        let medida_calculo = 0.000;
        if (peso === "") {
            peso = 0.000;
        }
        if (cubagem === "") {
            cubagem = 0.000;
        }

        let ton = parseFloat(parseFloat(peso).toFixed(3) / 1000);
        cubagem = parseFloat(cubagem).toFixed(3);

        if (ton > cubagem) {
            medida_calculo = parseFloat(ton);
        } else {
            medida_calculo = cubagem;
        }

        if(medida_calculo < 1) {
            medida_calculo = 1;
        }
        valor_calculado = parseFloat(parseFloat(valor) * parseFloat(medida_calculo)).toFixed(2);
        
        if(parseFloat(valor_calculado) < parseFloat(valor_minimo) && parseFloat(valor_minimo) != 0.00 && valor_minimo != "") {
            valor_calculado = parseFloat(valor_minimo);
        }

        if(parseFloat(valor_calculado) > parseFloat(valor_maximo) && parseFloat(valor_maximo) != 0.00 && valor_maximo != "") {
            valor_calculado = parseFloat(valor_maximo);
        }

        return valor_calculado;
    }

    function calculo_ton(valor, valor_minimo, valor_maximo, peso, cubagem) {
        let valor_calculado = 0.00;
        let medida_calculo = 0.000;
        if (peso === "") {
            peso = 0.000;
        }
        if (cubagem === "") {
            cubagem = 0.000;
        }

        let ton = parseFloat(parseFloat(peso).toFixed(3) / 1000);
        cubagem = parseFloat(cubagem).toFixed(3);

        medida_calculo = parseFloat(ton);
        valor_calculado = parseFloat(parseFloat(valor) * parseFloat(medida_calculo)).toFixed(2);
        
        if(parseFloat(valor_calculado) < parseFloat(valor_minimo) && parseFloat(valor_minimo) != 0.00 && valor_minimo != "") {
            valor_calculado = parseFloat(valor_minimo);
        }

        if(parseFloat(valor_calculado) > parseFloat(valor_maximo) && parseFloat(valor_maximo) != 0.00 && valor_maximo != "") {
            valor_calculado = parseFloat(valor_maximo);
        }

        return valor_calculado;
    }

    function calculo_m3(valor, valor_minimo, valor_maximo, peso, cubagem) { // Calculo de Metragem
        let valor_calculado = 0.00;
        let medida_calculo = 0.000;
        if (peso === "") {
            peso = 0.000;
        }
        if (cubagem === "") {
            cubagem = 0.000;
        }

        cubagem = parseFloat(cubagem).toFixed(3);

        medida_calculo = parseFloat(cubagem);
        valor_calculado = parseFloat(parseFloat(valor) * parseFloat(medida_calculo)).toFixed(2);
        
        if(parseFloat(valor_calculado) < parseFloat(valor_minimo) && parseFloat(valor_minimo) != 0.00 && valor_minimo != "") {
            valor_calculado = parseFloat(valor_minimo);
        }

        if(parseFloat(valor_calculado) > parseFloat(valor_maximo) && parseFloat(valor_maximo) != 0.00 && valor_maximo != "") {
            valor_calculado = parseFloat(valor_maximo);
        }

        return valor_calculado;
    }


    function calcularTaxaPickup() {
        let valores_pickup = "";
        let enderecos_pickups_selecionados = [];
        let valor_calculado_compra = 0.00;

        let valor_calculado_venda = 0.00;
        let valorTotalCompraPickup = 0.00;
        let valorTotalVendaPickup = 0.00;
        
        let valor_somado_compra = 0.00;
        let valor_somado_venda = 0.00;
        let valor_minimo_compra = 0.00;
        let valor_maximo_compra = 0.00;
        let valor_minimo_venda = 0.00;
        let valor_maximo_venda = 0.00;


        let valorTotalTaxaPickup = 0.00
        let valores_pickups_atual;
        let valores_item_carga_pickup = [];
        let endereco_pickup_item_carga = "";
        let peso_item_carga = 0;
        let cubagem_item_carga = 0;

        let moeda = "";
        let id_moeda = "";
        let ppcc = "";
        let unidade_pickup = "BL";
        let id_unidade_pickup = "4";

        let objetos_pickup = document.getElementsByName("listaPickups");
        if (objetos_pickup.length > 0) {
            for (let i = 0; i < objetos_pickup.length; i++) {
                if (objetos_pickup[i].options[objetos_pickup[i].selectedIndex].value != "") {
                    endereco_pickup_item_carga = objetos_pickup[i].options[objetos_pickup[i].selectedIndex].value;
                    peso_item_carga = objetos_pickup[i].options[objetos_pickup[i].selectedIndex].getAttribute("peso");
                    cubagem_item_carga = objetos_pickup[i].options[objetos_pickup[i].selectedIndex].getAttribute("cubagem");
                    if (enderecos_pickups_selecionados.indexOf(endereco_pickup_item_carga) < 0) {
                        valores_pickup = props.listaPickup.find(({ endereco_pickup }) => endereco_pickup === endereco_pickup_item_carga);
                        if (valores_pickup) {
                            enderecos_pickups_selecionados = [...enderecos_pickups_selecionados, endereco_pickup_item_carga];
                            if(valores_pickup.valor_compra_pickup !== "") {
                                valor_calculado_compra = valores_pickup.valor_compra_pickup;
                                valor_calculado_venda = valores_pickup.valor_venda_pickup;
                                valor_somado_compra = parseFloat(valor_somado_compra)+parseFloat(valores_pickup.valor_compra_pickup);
                                valor_somado_venda = parseFloat(valor_somado_venda)+parseFloat(valores_pickup.valor_venda_pickup);
                                if(valor_minimo_compra === 0.00) {
                                    valor_minimo_compra = valores_pickup.valor_compra_minimo_pickup;
                                } else {
                                    valor_minimo_compra = valor_somado_compra;
                                }
    
                                if(valor_minimo_venda === 0.00) {
                                    valor_minimo_venda = valores_pickup.valor_venda_minimo_pickup;
                                } else {
                                    valor_minimo_venda = valor_somado_venda;
                                }
    
                                if(valor_calculado_venda !== "") {
                                    if (valores_pickup.unidade_pickup === "WM") {
                                        if(valor_maximo_compra === 0.00) {
                                            valor_maximo_compra = valores_pickup.valor_compra_maximo_pickup;
                                        } else {
                                            valor_maximo_compra = 0.00;
                                        }       
    
                                        if(valor_maximo_venda === 0.00) {
                                            valor_maximo_venda = valores_pickup.valor_compra_maximo_pickup;
                                        } else {
                                            valor_maximo_venda = 0.00;
                                        }       
    
                                        id_unidade_pickup = 3;
                                        unidade_pickup = valores_pickup.unidade_pickup;
                                        valor_calculado_compra = calculo_wm(
                                            valores_pickup.valor_compra_pickup,
                                            valores_pickup.valor_compra_minimo_pickup,
                                            valores_pickup.valor_compra_maximo_pickup,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
        
                                        valor_calculado_venda = calculo_wm(
                                            valores_pickup.valor_venda_pickup,
                                            valores_pickup.valor_venda_minimo_pickup,
                                            valores_pickup.valor_venda_maximo_pickup,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
                                    }
    
                                    if (valores_pickup.unidade_pickup === "TON") {
                                        if(valor_maximo_compra === 0.00) {
                                            valor_maximo_compra = valores_pickup.valor_compra_maximo_pickup;
                                        } else {
                                            valor_maximo_compra = 0.00;
                                        }       
    
                                        if(valor_maximo_venda === 0.00) {
                                            valor_maximo_venda = valores_pickup.valor_compra_maximo_pickup;
                                        } else {
                                            valor_maximo_venda = 0.00;
                                        }       
    
                                        id_unidade_pickup = 2;
                                        unidade_pickup = valores_pickup.unidade_pickup;
                                        valor_calculado_compra = calculo_ton(
                                            valores_pickup.valor_compra_pickup,
                                            valores_pickup.valor_compra_minimo_pickup,
                                            valores_pickup.valor_compra_maximo_pickup,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
        
                                        valor_calculado_venda = calculo_ton(
                                            valores_pickup.valor_venda_pickup,
                                            valores_pickup.valor_venda_minimo_pickup,
                                            valores_pickup.valor_venda_maximo_pickup,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
                                    }
    
                                    if (valores_pickup.unidade_pickup === "M3") {
                                        if(valor_maximo_compra === 0.00) {
                                            valor_maximo_compra = valores_pickup.valor_compra_maximo_pickup;
                                        } else {
                                            valor_maximo_compra = 0.00;
                                        }       
    
                                        if(valor_maximo_venda === 0.00) {
                                            valor_maximo_venda = valores_pickup.valor_compra_maximo_pickup;
                                        } else {
                                            valor_maximo_venda = 0.00;
                                        }       
    
                                        id_unidade_pickup = 1;
                                        unidade_pickup = valores_pickup.unidade_pickup;
                                        valor_calculado_compra = calculo_m3(
                                            valores_pickup.valor_compra_pickup,
                                            valores_pickup.valor_compra_minimo_pickup,
                                            valores_pickup.valor_compra_maximo_pickup,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
        
                                        valor_calculado_venda = calculo_m3(
                                            valores_pickup.valor_venda_pickup,
                                            valores_pickup.valor_venda_minimo_pickup,
                                            valores_pickup.valor_venda_maximo_pickup,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
                                    }
                                    
                                    moeda = valores_pickup.moeda_pickup;
                                    ppcc = valores_pickup.modalidade_pickup;
                                    if (moeda == "USD") {
                                        id_moeda = 42;
                                    } else if (moeda == "EUR") {
                                        id_moeda = 113;
                                    } else { // BRL
                                        id_moeda = 88;
                                    }
    
                                    valorTotalCompraPickup = parseFloat(parseFloat(valorTotalCompraPickup) + parseFloat(valor_calculado_compra)).toFixed(2);
                                    valorTotalVendaPickup = parseFloat(parseFloat(valorTotalVendaPickup) + parseFloat(valor_calculado_venda)).toFixed(2);    
                                }    
                            }
                        }
                    }
                }
            }

            if (valorTotalVendaPickup > 0.00) {
                let novaListaTaxasOrigem = [];
                listaTaxasOrigem.map((item, contadorTaxas) => {
                    if (item.id_taxa !== "1107") {
                        novaListaTaxasOrigem = [...novaListaTaxasOrigem, item];
                    }
                });

                novaListaTaxasOrigem = [...novaListaTaxasOrigem, {
                    "id_taxa": "1107",
                    "id_moeda": id_moeda,
                    "id_unidade": id_unidade_pickup,
                    "moeda": String(moeda),
                    "taxa": "PICK UP",
                    "ppcc": ppcc,
                    "unidade": unidade_pickup,
                    "valor_tarifario": " - ",
                    "valor_compra": String(valor_somado_compra),
                    "valor_compra_minimo": String(valor_minimo_compra),
                    "valor_compra_maximo": String(valor_maximo_compra),

                    "valor_venda": String(valor_somado_venda),
                    "valor_venda_minimo": String(valor_minimo_venda),
                    "valor_venda_maximo": String(valor_maximo_venda),

                    "valor_calculado": String(valorTotalVendaPickup),
                    "edicao_taxa": "0",
                    "editar_ppcc": "0",
                    "travar_taxa": "1"
                }];
                setListaTaxasOrigem(novaListaTaxasOrigem);
            } else {
                let novaListaTaxasOrigem = [];
                listaTaxasOrigem.map((item, contadorTaxas) => {
                    if (item.id_taxa !== "1107") {
                        novaListaTaxasOrigem = [...novaListaTaxasOrigem, item];
                    }
                });
                setListaTaxasOrigem(novaListaTaxasOrigem);
            }
        } else {
            let novaListaTaxasOrigem = [];
            listaTaxasOrigem.map((item, contadorTaxas) => {
                if (item.id_taxa !== "1107") {
                    novaListaTaxasOrigem = [...novaListaTaxasOrigem, item];
                }
            });
            setListaTaxasOrigem(novaListaTaxasOrigem);
        }
        props.alterarClickCalculadoraPickup(false);
        setProcessaDadosTaxas(true);
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);

    }

    function calcularTaxaDoorDelivery() {
        let valores_door_delivery = "";
        let enderecos_door_delivery_selecionados = [];
        let valorTotalTaxaDoorDelivery = 0.00
        let endereco_door_delivery_item_carga = "";
        let peso_item_carga = 0;
        let cubagem_item_carga = 0;
        let objetos_door_delivery = document.getElementsByName("listaDoorDelivery");

        let valor_calculado_compra = 0.00;
        let valor_calculado_venda = 0.00;
        let valorTotalCompraDoorDelivery = 0.00;
        let valorTotalVendaDoorDelivery = 0.00;

        let valor_somado_compra = 0.00;
        let valor_somado_venda = 0.00;
        let valor_minimo_compra = 0.00;
        let valor_maximo_compra = 0.00;
        let valor_minimo_venda = 0.00;
        let valor_maximo_venda = 0.00;


        let moeda = "";
        let id_moeda = "";
        let id_unidade_door_delivery = "4";
        let ppcc = "";
        let unidade_door_delivery = "BL"

        if (objetos_door_delivery.length > 0) {
            for (let i = 0; i < objetos_door_delivery.length; i++) {
                if (objetos_door_delivery[i].options[objetos_door_delivery[i].selectedIndex].value != "") {
                    endereco_door_delivery_item_carga = objetos_door_delivery[i].options[objetos_door_delivery[i].selectedIndex].value;
                    peso_item_carga = objetos_door_delivery[i].options[objetos_door_delivery[i].selectedIndex].getAttribute("peso");
                    cubagem_item_carga = objetos_door_delivery[i].options[objetos_door_delivery[i].selectedIndex].getAttribute("cubagem");
                    if (enderecos_door_delivery_selecionados.indexOf(endereco_door_delivery_item_carga) < 0) {
                        valores_door_delivery = props.listaDoorDelivery.find(({ endereco_door_delivery }) => endereco_door_delivery === endereco_door_delivery_item_carga);
                        if (valores_door_delivery) {
                            enderecos_door_delivery_selecionados = [...enderecos_door_delivery_selecionados, endereco_door_delivery_item_carga];

                            if(valores_door_delivery.valor_compra_door_delivery !== "") {
                                valor_calculado_compra = valores_door_delivery.valor_compra_door_delivery;
                                valor_calculado_venda = valores_door_delivery.valor_venda_door_delivery;
    
                                valor_somado_compra = parseFloat(valor_somado_compra)+parseFloat(valores_door_delivery.valor_compra_door_delivery);
                                valor_somado_venda = parseFloat(valor_somado_venda)+parseFloat(valores_door_delivery.valor_venda_door_delivery);
    
                                if(valor_minimo_compra === 0.00) {
                                    valor_minimo_compra = valores_door_delivery.valor_compra_minimo_door_delivery;
                                } else {
                                    valor_minimo_compra = valor_somado_compra;
                                }
    
                                if(valor_minimo_venda === 0.00) {
                                    valor_minimo_venda = valores_door_delivery.valor_venda_minimo_door_delivery;
                                } else {
                                    valor_minimo_venda = valor_somado_venda;
                                }
    
    
                                if(valor_calculado_venda !== "") {
                                    if (valores_door_delivery.unidade_door_delivery === "WM") {
                                        if(valor_maximo_compra === 0.00) {
                                            valor_maximo_compra = valores_door_delivery.valor_compra_maximo_door_delivery;
                                        } else {
                                            valor_maximo_compra = 0.00;
                                        }       
    
                                        if(valor_maximo_venda === 0.00) {
                                            valor_maximo_venda = valores_door_delivery.valor_venda_maximo_door_delivery;
                                        } else {
                                            valor_maximo_venda = 0.00;
                                        }       
    
                                        id_unidade_door_delivery = "3";
                                        unidade_door_delivery = "WM";
                                        valor_calculado_compra = calculo_wm(
                                            valores_door_delivery.valor_compra_door_delivery,
                                            valores_door_delivery.valor_compra_minimo_door_delivery,
                                            valores_door_delivery.valor_compra_maximo_door_delivery,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
        
                                        valor_calculado_venda = calculo_wm(
                                            valores_door_delivery.valor_venda_door_delivery,
                                            valores_door_delivery.valor_venda_minimo_door_delivery,
                                            valores_door_delivery.valor_venda_maximo_door_delivery,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
                                    }
    
    
                                    if (valores_door_delivery.unidade_door_delivery === "TON") {
                                        if(valor_maximo_compra === 0.00) {
                                            valor_maximo_compra = valores_door_delivery.valor_compra_maximo_door_delivery;
                                        } else {
                                            valor_maximo_compra = 0.00;
                                        }       
    
                                        if(valor_maximo_venda === 0.00) {
                                            valor_maximo_venda = valores_door_delivery.valor_venda_maximo_door_delivery;
                                        } else {
                                            valor_maximo_venda = 0.00;
                                        }       
    
                                        id_unidade_door_delivery = "2";
                                        unidade_door_delivery = "TON";
                                        valor_calculado_compra = calculo_ton(
                                            valores_door_delivery.valor_compra_door_delivery,
                                            valores_door_delivery.valor_compra_minimo_door_delivery,
                                            valores_door_delivery.valor_compra_maximo_door_delivery,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
        
                                        valor_calculado_venda = calculo_ton(
                                            valores_door_delivery.valor_venda_door_delivery,
                                            valores_door_delivery.valor_venda_minimo_door_delivery,
                                            valores_door_delivery.valor_venda_maximo_door_delivery,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
                                    }
    
                                    if (valores_door_delivery.unidade_door_delivery === "M3") {
                                        if(valor_maximo_compra === 0.00) {
                                            valor_maximo_compra = valores_door_delivery.valor_compra_maximo_door_delivery;
                                        } else {
                                            valor_maximo_compra = 0.00;
                                        }       
    
                                        if(valor_maximo_venda === 0.00) {
                                            valor_maximo_venda = valores_door_delivery.valor_venda_maximo_door_delivery;
                                        } else {
                                            valor_maximo_venda = 0.00;
                                        }       
    
                                        id_unidade_door_delivery = "1";
                                        unidade_door_delivery = "M3";
                                        valor_calculado_compra = calculo_m3(
                                            valores_door_delivery.valor_compra_door_delivery,
                                            valores_door_delivery.valor_compra_minimo_door_delivery,
                                            valores_door_delivery.valor_compra_maximo_door_delivery,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
        
                                        valor_calculado_venda = calculo_m3(
                                            valores_door_delivery.valor_venda_door_delivery,
                                            valores_door_delivery.valor_venda_minimo_door_delivery,
                                            valores_door_delivery.valor_venda_maximo_door_delivery,
                                            peso_item_carga,
                                            cubagem_item_carga
                                        );
                                    }
                                    
                                    moeda = valores_door_delivery.moeda_door_delivery;
                                    ppcc = valores_door_delivery.modalidade_door_delivery;
                                    if (moeda == "USD") {
                                        id_moeda = 42;
                                    } else if (moeda == "EUR") {
                                        id_moeda = 113;
                                    } else { // BRL
                                        id_moeda = 88;
                                    }
                                    valorTotalCompraDoorDelivery = parseFloat(parseFloat(valorTotalCompraDoorDelivery) + parseFloat(valor_calculado_compra)).toFixed(2);
                                    valorTotalVendaDoorDelivery = parseFloat(parseFloat(valorTotalVendaDoorDelivery) + parseFloat(valor_calculado_venda)).toFixed(2);    
                                }    
                            }
                        }
                    }
                }
            }

            if (valorTotalVendaDoorDelivery > 0.00) {
                let novaListaTaxasDestino = [];
                listaTaxasDestino.map((item, contadorTaxas) => {
                    if (item.id_taxa !== "31") {
                        novaListaTaxasDestino = [...novaListaTaxasDestino, item];
                    }
                });

                novaListaTaxasDestino = [...novaListaTaxasDestino, {
                    "id_taxa": "31",
                    "id_moeda": id_moeda,
                    "id_unidade": id_unidade_door_delivery,
                    "moeda": moeda,
                    "taxa": "DOOR DELIVERY",
                    "ppcc": ppcc,
                    "unidade": unidade_door_delivery,
                    "valor_tarifario": " - ",
                    "valor_compra": valor_somado_compra,
                    "valor_compra_minimo": valor_minimo_compra,
                    "valor_compra_maximo": valor_maximo_compra,

                    "valor_venda": valor_somado_venda,
                    "valor_venda_minimo": valor_minimo_venda,
                    "valor_venda_maximo": valor_maximo_venda,

                    "valor_calculado": valorTotalVendaDoorDelivery,
                    "edicao_taxa": "0",
                    "editar_ppcc": "0",
                    "travar_taxa": "1",
                    "taxa_adicional":"0"
                }];

                setListaTaxasDestino(novaListaTaxasDestino);
            } else {
                let novaListaTaxasDestino = [];
                listaTaxasDestino.map((item, contadorTaxas) => {
                    if (item.id_taxa !== "31") {
                        novaListaTaxasDestino = [...novaListaTaxasDestino, item];
                    }
                });
                setListaTaxasDestino(novaListaTaxasDestino);
                setProcessaDadosTaxas(true);
                let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
                setAtualizarDadosTaxas(atualizacaoDadosTaxas);
            }
        } else {
            let novaListaTaxasDestino = [];
            listaTaxasDestino.map((item, contadorTaxas) => {
                if (item.id_taxa !== "31") {
                    novaListaTaxasDestino = [...novaListaTaxasDestino, item];
                }
            });
            setListaTaxasDestino(novaListaTaxasDestino);
        }
        props.alterarClickCalculadoraPickup(false);
    }

    var desabilitar_linha_taxa = 0;

    const testando = () => {
        if (desabilitar_linha_taxa === 0) {
            desabilitar_linha_taxa = 1;
        }
    }

    /*const [inputsTaxas, setInputsTaxas] = useState({
        "id_taxa": "",
        "id_moeda": "",
        "id_unidade": "",
        "moeda": "",
        "taxa": "",
        "ppcc": "",
        "unidade": "",
        "valor_tarifario": "",
        "valor_compra": "",
        "valor_compra_minimo": "",
        "valor_compra_maximo": "",

        "valor_venda": "",
        "valor_venda_minimo": "",
        "valor_venda_maximo": "",

        "valor_calculado": "",
        "edicao_taxa": ""
    })*/

    function handleAlteracaoModalidadeTaxaLocal(valor, item, campo, indice, tipoLista) {
        if (tipoLista === "origem") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, [campo]: valor });
            listaTaxasOrigem.map((taxa, contTaxa) => {
                if (contTaxa === indice) {
                    novaListaTaxas[indice] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasOrigem(novaListaTaxas);
        } else if (tipoLista === "destino") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, [campo]: valor });
            listaTaxasDestino.map((taxa, contTaxa) => {
                if (contTaxa === indice) {
                    novaListaTaxas[indice] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasDestino(novaListaTaxas);
        }
        setProcessaDadosTaxas(true);    
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);

    }

    function handleMudancaUnidade(objeto, item, indice, tipo_lista) {
        let id_unidade = objeto.target[objeto.target.selectedIndex].value;
        let unidade = objeto.target[objeto.target.selectedIndex].text;

        if (tipo_lista === "origem") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, ["id_unidade"]: id_unidade });
            novos_valores_item = ({ ...novos_valores_item, ["unidade"]: unidade });
            listaTaxasOrigem.map((taxa, contTaxa) => {
                if (contTaxa === indice) {
                    novaListaTaxas[indice] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasOrigem(novaListaTaxas);
        }

        if (tipo_lista === "frete") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, ["id_unidade"]: id_unidade });
            novos_valores_item = ({ ...novos_valores_item, ["unidade"]: unidade });
            listaTaxasFretes.map((taxa, contTaxa) => {
                if (contTaxa === indice) {
                    novaListaTaxas[indice] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasFretes(novaListaTaxas);
        }

        if (tipo_lista === "destino") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, ["id_unidade"]: id_unidade });
            novos_valores_item = ({ ...novos_valores_item, ["unidade"]: unidade });
            listaTaxasDestino.map((taxa, contTaxa) => {
                if (contTaxa === indice) {
                    novaListaTaxas[indice] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasDestino(novaListaTaxas);
        }
        setRecalcularTaxas(true);
        setProcessaDadosTaxas(true);
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);
    
    }

    function handleMudancaMoeda(objeto, item, indice, tipo_lista) {
        let id_moeda = objeto.target[objeto.target.selectedIndex].value;
        let moeda = objeto.target[objeto.target.selectedIndex].text;

        if (tipo_lista === "origem") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, ["id_moeda"]: id_moeda });
            novos_valores_item = ({ ...novos_valores_item, ["moeda"]: moeda });
            listaTaxasOrigem.map((taxa, contTaxa) => {
                if (contTaxa === indice) {
                    novaListaTaxas[indice] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasOrigem(novaListaTaxas);
        }

        if (tipo_lista === "frete") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, ["id_moeda"]: id_moeda });
            novos_valores_item = ({ ...novos_valores_item, ["moeda"]: moeda });
            listaTaxasFretes.map((taxa, contTaxa) => {
                if (contTaxa === indice) {
                    novaListaTaxas[indice] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasFretes(novaListaTaxas);
        }

        if (tipo_lista === "destino") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, ["id_moeda"]: id_moeda });
            novos_valores_item = ({ ...novos_valores_item, ["moeda"]: moeda });
            listaTaxasDestino.map((taxa, contTaxa) => {
                if (contTaxa === indice) {
                    novaListaTaxas[indice] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasDestino(novaListaTaxas);
        }
        setProcessaDadosTaxas(true);
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);
    }

    function handleChangeNumericField(nome_campo, valor, tipoListaTaxas, item, contador) {

        //let novos_valores_tem = item;
        if (tipoListaTaxas === "origem") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, [nome_campo]: valor });
            listaTaxasOrigem.map((taxa, contTaxa) => {
                if (contTaxa === contador) {
                    novaListaTaxas[contador] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasOrigem(novaListaTaxas);
        } else if (tipoListaTaxas === "frete") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, [nome_campo]: valor });
            listaTaxasFretes.map((taxa, contTaxa) => {
                if (contTaxa === contador) {
                    novaListaTaxas[contador] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasFretes(novaListaTaxas);
        } else if (tipoListaTaxas === "destino") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, [nome_campo]: valor });
            listaTaxasDestino.map((taxa, contTaxa) => {
                if (contTaxa === contador) {
                    novaListaTaxas[contador] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasDestino(novaListaTaxas);
        }
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;

        setRecalcularTaxas(true);
        setProcessaDadosTaxas(true);
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);        
        //setInputsTaxa(values => ({ ...values, [nome_campo]: valor }))
    }

    const formata_moeda = (nome_campo, objeto, tipoListaTaxas, item, contador) => {
        let valor_auxiliar = objeto.target.value
        let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
        if(valor_auxiliar.indexOf("O") >=0) {
            while(valor_auxiliar.indexOf("O") >= 0) {
                valor_auxiliar = valor_auxiliar.replace("O","");
            }        
        }
        if(valor_auxiliar.indexOf("o") >=0) {
            while(valor_auxiliar.indexOf("o") >= 0) {
                valor_auxiliar = valor_auxiliar.replace("o","");
            }
        }
        
        if(valor_auxiliar.indexOf(".") >=0) {
            while(valor_auxiliar.indexOf(".") >= 0) {
                valor_auxiliar = valor_auxiliar.replace(".",",");
            }        
        }
        
        let qtde_decimal = 2;
        while(valor_auxiliar.indexOf(",") >= 0) {
            valor_auxiliar = valor_auxiliar.replace(",","");
        }        
        let primeiro_caracter = valor_auxiliar.substr(0,1) 
        let caracter_atual = valor_auxiliar.substr(valor_auxiliar.length-1,1)
        if((caracter_atual != 1 && caracter_atual != 2 && caracter_atual != 3 && caracter_atual != 4 && caracter_atual != 5 && caracter_atual != 6 && caracter_atual != 7 && caracter_atual != 8 && caracter_atual != 9 && caracter_atual != 0) || caracter_atual === " ") {
            objeto.target.value = objeto.target.value.substr(0,objeto.target.value.length-1);
            return false
        } else {
            if(primeiro_caracter != 1 && primeiro_caracter != 2 && primeiro_caracter != 3 && primeiro_caracter != 4 && primeiro_caracter != 5 && primeiro_caracter != 6 && primeiro_caracter != 7 && primeiro_caracter != 8 && primeiro_caracter != 9 && primeiro_caracter != 0) {
                objeto.target.value = objeto.target.value.substr(1,objeto.target.value.length);
                return false                    
            }
        }
        let qtde_caracter = valor_auxiliar.length
        if(primeiro_caracter == 0 && qtde_caracter == 1) {
            valor_auxiliar = valor_auxiliar.substr(0,valor_auxiliar.length) 
        } else if(primeiro_caracter == 0 && qtde_caracter > 1) {
            valor_auxiliar = valor_auxiliar.substr(1,valor_auxiliar.length) 
        }
        qtde_caracter = valor_auxiliar.length
        let valor_formatado = "";
        if(qtde_caracter > qtde_decimal) {
            let valores = valor_auxiliar.substr(0,valor_auxiliar.length-qtde_decimal)
            let valores_decimais = valor_auxiliar.substr(valor_auxiliar.length-qtde_decimal,qtde_decimal)
            valor_formatado = valores+","+valores_decimais
        } else if(qtde_caracter < qtde_decimal && qtde_caracter > 0){
            valor_formatado = "0,0"+valor_auxiliar
        }else if(qtde_caracter == qtde_decimal) {
            valor_formatado = "0,"+valor_auxiliar
        } else {
            valor_formatado=""
        }
        /// Regras para atualização

        //let novos_valores_tem = item;
        if (tipoListaTaxas === "origem") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, [nome_campo]: valor_formatado.replace(",",".") });
            listaTaxasOrigem.map((taxa, contTaxa) => {
                if (contTaxa === contador) {
                    novaListaTaxas[contador] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasOrigem(novaListaTaxas);
        } else if (tipoListaTaxas === "frete") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, [nome_campo]: valor_formatado.replace(",",".") });
            listaTaxasFretes.map((taxa, contTaxa) => {
                if (contTaxa === contador) {
                    novaListaTaxas[contador] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasFretes(novaListaTaxas);
        } else if (tipoListaTaxas === "destino") {
            let novaListaTaxas = [];
            let novos_valores_item = ({ ...item, [nome_campo]: valor_formatado.replace(",",".") });
            listaTaxasDestino.map((taxa, contTaxa) => {
                if (contTaxa === contador) {
                    novaListaTaxas[contador] = novos_valores_item;
                } else {
                    novaListaTaxas[contTaxa] = taxa;
                }
            });
            setListaTaxasDestino(novaListaTaxas);
        }
        setRecalcularTaxas(true);
        setProcessaDadosTaxas(true);
        setAtualizarDadosTaxas(atualizacaoDadosTaxas);
    }


    useEffect(() => {
        if(processaDadosTaxas === true) {
            let valor_total_taxas_usd = 0.00;
            let valor_total_taxas_eur = 0.00;
            let valor_total_taxas_brl = 0.00;

            if(listaTaxasOrigem.length > 0) {
                let valor_total_origem = new Array();
                valor_total_origem["USD"] = 0.00;
                valor_total_origem["BRL"] = 0.00;
                valor_total_origem["EUR"] = 0.00;

                listaTaxasOrigem.map((item)=>{
                    let valor_calculado_item = String(item.valor_calculado);
                    valor_total_origem[item.moeda] = parseFloat(valor_total_origem[item.moeda])+parseFloat(valor_calculado_item);                    
                });
                dadosTaxas.valor_total_taxas_origem_usd = valor_total_origem["USD"];                
                dadosTaxas.valor_total_taxas_origem_brl = valor_total_origem["BRL"];
                dadosTaxas.valor_total_taxas_origem_eur = valor_total_origem["EUR"];
                
                valor_total_taxas_usd = valor_total_taxas_usd + valor_total_origem["USD"];
                valor_total_taxas_eur = valor_total_taxas_eur + valor_total_origem["EUR"];
                valor_total_taxas_brl = valor_total_taxas_brl + valor_total_origem["BRL"];
        
        
            }

            if(listaTaxasFretes.length > 0) {
                let valor_total_fretes = new Array();
                valor_total_fretes["USD"] = 0.00;
                valor_total_fretes["BRL"] = 0.00;
                valor_total_fretes["EUR"] = 0.00;
                listaTaxasFretes.map((item)=>{
                    valor_total_fretes[item.moeda] = parseFloat(valor_total_fretes[item.moeda])+parseFloat(item.valor_calculado);                    
                });

                dadosTaxas.valor_total_taxas_frete_usd = valor_total_fretes["USD"];
                dadosTaxas.valor_total_taxas_frete_brl = valor_total_fretes["BRL"];
                dadosTaxas.valor_total_taxas_frete_eur = valor_total_fretes["EUR"];

                valor_total_taxas_usd = valor_total_taxas_usd + valor_total_fretes["USD"];
                valor_total_taxas_eur = valor_total_taxas_eur + valor_total_fretes["EUR"];
                valor_total_taxas_brl = valor_total_taxas_brl + valor_total_fretes["BRL"];

            }

            if(listaTaxasDestino.length > 0) {
                let valor_total_destino = new Array();
                valor_total_destino["USD"] = 0.00;
                valor_total_destino["BRL"] = 0.00;
                valor_total_destino["EUR"] = 0.00;
                listaTaxasDestino.map((item)=>{
                    valor_total_destino[item.moeda] = parseFloat(valor_total_destino[item.moeda])+parseFloat(item.valor_calculado);                    
                });
        
                dadosTaxas.valor_total_taxas_destino_usd = valor_total_destino["USD"];
                dadosTaxas.valor_total_taxas_destino_brl = valor_total_destino["BRL"];
                dadosTaxas.valor_total_taxas_destino_eur = valor_total_destino["EUR"];

                valor_total_taxas_usd = valor_total_taxas_usd +  valor_total_destino["USD"];
                valor_total_taxas_eur = valor_total_taxas_eur + valor_total_destino["EUR"];
                valor_total_taxas_brl = valor_total_taxas_brl + valor_total_destino["BRL"];

            }

            dadosTaxas.valor_total_taxas_usd = valor_total_taxas_usd;
            dadosTaxas.valor_total_taxas_eur = valor_total_taxas_eur;
            dadosTaxas.valor_total_taxas_brl = valor_total_taxas_brl;

            dadosTaxas.taxas_origem = listaTaxasOrigem;
            dadosTaxas.taxas_destino = listaTaxasDestino;
            dadosTaxas.taxas_frete = listaTaxasFretes;
            props.dados_taxas(dadosTaxas);
            setProcessaDadosTaxas(false);            
        }
    },[atualizaDadosTaxas,processaDadosTaxas])

    useEffect(()=>{
       if(props.dados_proposta_carregado === true) {
            if(TaxasSalvasCarregadas === false) {
                setImpExp(props.dados_proposta_salva.sentido_proposta);
                setListaTaxasOrigem(props.dados_proposta_salva.dados_taxas.taxas_origem);
                setListaTaxasFretes(props.dados_proposta_salva.dados_taxas.taxas_frete);
                setListaTaxasDestino(props.dados_proposta_salva.dados_taxas.taxas_destino);
                setProcessaDadosTaxas(true);
                let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
                setAtualizarDadosTaxas(atualizacaoDadosTaxas);
                setTaxasSalvasCarregadas(true);    
            }
        }
    },[props.dados_proposta_carregado])

    useEffect(()=>{
       if(props.atualizarTaxasPropostaGemea === true) {
            setListaTaxasOrigem(props.dadosTaxasPropostaGemea.taxas_origem);
            setListaTaxasFretes(props.dadosTaxasPropostaGemea.taxas_frete);
            setProcessaDadosTaxas(true);
            let atualizacaoDadosTaxas = atualizaDadosTaxas+1;
            setAtualizarDadosTaxas(atualizacaoDadosTaxas);            
            props.mudarStatusAtulizarTaxaPropostaGemea(false);
        }
    },[props.atualizarTaxasPropostaGemea])



    return (
        <>
            <div className="container shadow-lg p-3 mb-4 bg-white rounded no-gutters m-0">
                <div className='row'>
                    <div className="col-10 border-bottom titulo">
                        <b>Custos de Origem</b>
                        {listaTaxasOrigem.length > 0 ?
                            <>
                            <span className="formatacao_totais">{"Total USD: "+dadosTaxas.valor_total_taxas_origem_usd.toFixed(2)}</span>
                            <span className="formatacao_totais">{"Total EUR: "+dadosTaxas.valor_total_taxas_origem_eur.toFixed(2)}</span>
                            <span className="formatacao_totais">{"Total BRL: "+dadosTaxas.valor_total_taxas_origem_brl.toFixed(2)}</span>
                            </>
                        :
                        ''}
                    </div>
                    <div className="col-2 border-bottom titulo alinhamento_objeto_direito">
                        <button type="button" onClick={() => handleExibirModalAdicionarTaxa(true, "origem")} name="adicionar_custo_origem" className="btn btn-outline-dark btn-sm">Adicionar Taxa</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col alinhamento_objeto_center titulo">
                        <br />
                        {listaTaxasOrigem.length > 0 ? (
                            <table id="taxas_origem" className="tabelasTaxas">
                                <thead>
                                    <tr className="linha_titulo">
                                        <td width="16.66%">Taxa</td>
                                        <td width="10.66%">Tarifário</td>
                                        <td width="22.66%">Compra (Min/Max)</td>
                                        <td width="22.66%">Venda (Min/Max)</td>
                                        <td width="10.66%">Total</td>
                                        <td width="13.66%">Modalidade</td>
                                        <td width="3.66%"></td>
                                    </tr>
                                </thead>
                                {listaTaxasOrigem.map((item, contadorTaxas) => (
                                    <tbody key={contadorTaxas}>
                                        <tr>
                                            <td>
                                                {item.travar_taxa == "0" ? (
                                                    <Link onClick={() => alteracao_valores(item.id_taxa, contadorTaxas, "origem")}>{item.taxa}</Link>
                                                ) : (
                                                    <>
                                                        {item.taxa}
                                                    </>
                                                )
                                                }
                                            </td>
                                            <td>{item.valor_tarifario} {item.unidade}</td>
                                            <td>
                                                {item.edicao_taxa === "1" ? (
                                                    <>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*<NumericFormat
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={item.valor_compra}
                                                                name="valor_compra"
                                                                onValueChange={(values) => handleChangeNumericField("valor_compra", values.value, "origem", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />*/
                                                            }
                                                            <input
                                                                type="text"
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={String(item.valor_compra).replace(".",",")}
                                                                name="valor_compra"
                                                                onChange={(e) => formata_moeda("valor_compra", e, "origem", item, contadorTaxas)}
                                                            />

                                                        </div>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                            value={item.valor_compra_minimo}
                                                            className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                            name="valor_compra_minimo"
                                                            onValueChange={(values) => handleChangeNumericField("valor_compra_minimo", values.value, "origem", item, contadorTaxas)}
                                                            decimalSeparator=','
                                                            decimalScale={2}
                                                            />
                                                            */
                                                            }
                                                            <input
                                                                type="text"
                                                                value={String(item.valor_compra_minimo).replace(".",",")}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_minimo"
                                                                onChange={(e) => formata_moeda("valor_compra_minimo", e, "origem", item, contadorTaxas)}
                                                            />


                                                        </div>

                                                        <div className="campos_valores_taxas_tabela">                                                            
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                value={item.valor_compra_maximo}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_maximo"
                                                                onValueChange={(values) => handleChangeNumericField("valor_compra_maximo", values.value, "origem", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />
                                                            */
                                                            }
                                                            <input
                                                                type="text"
                                                                value={String(item.valor_compra_maximo).replace(".",",")}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_maximo"
                                                                onChange={(e) => formata_moeda("valor_compra_maximo", e, "origem", item, contadorTaxas)}
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {item.valor_compra} ({item.valor_compra_minimo}/{item.valor_compra_maximo})
                                                    </>
                                                )
                                                }

                                            </td>
                                            <td>
                                                {item.edicao_taxa === "1" ? (
                                                    <>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {/*
                                                            <NumericFormat
                                                            className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                            value={item.valor_venda}
                                                            name="valor_venda"
                                                            onValueChange={(values) => handleChangeNumericField("valor_venda", values.value, "origem", item, contadorTaxas)}
                                                            decimalSeparator=','
                                                            decimalScale={2}
                                                            />
                                                            */
                                                            }
                                                            <input
                                                                type="text"
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={String(item.valor_venda).replace(".",",")}
                                                                name="valor_venda"
                                                                onChange={(e) => formata_moeda("valor_venda", e, "origem", item, contadorTaxas)}
                                                            />

                                                        </div>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {/*
                                                            <NumericFormat
                                                            value={item.valor_venda_minimo}
                                                            className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                            name="valor_venda_minimo"
                                                            onValueChange={(values) => handleChangeNumericField("valor_venda_minimo", values.value, "origem", item, contadorTaxas)}
                                                            decimalSeparator=','
                                                            decimalScale={2}
                                                            />
                                                            */
                                                            }

                                                            <input
                                                            type="text"
                                                            value={String(item.valor_venda_minimo).replace(".",",")}
                                                            className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                            name="valor_venda_minimo"
                                                            onChange={(e) => formata_moeda("valor_venda_minimo", e, "origem", item, contadorTaxas)}
                                                            />
                                                        </div>

                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                                /*
                                                                <NumericFormat
                                                                    value={item.valor_venda_maximo}
                                                                    className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                    name="valor_venda_maximo"
                                                                    onValueChange={(values) => handleChangeNumericField("valor_venda_maximo", values.value, "origem", item, contadorTaxas)}
                                                                    decimalSeparator=','
                                                                    decimalScale={2}
                                                                />                                                                
                                                                */                                                                
                                                            }
                                                            <input
                                                                type="text"
                                                                value={String(item.valor_venda_maximo).replace(".",",")}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_venda_maximo"
                                                                onChange={(e) => formata_moeda("valor_venda_maximo", e, "origem", item, contadorTaxas)}
                                                            />                                                                
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {item.valor_venda}({item.valor_venda_minimo} / {item.valor_venda_maximo})
                                                    </>
                                                )}
                                            </td>
                                            <td>{item.valor_calculado} {item.moeda}</td>
                                            <td>
                                                {item.editar_ppcc === "1" ? (
                                                    <select defaultValue={item.ppcc} onChange={(e) => handleAlteracaoModalidadeTaxaLocal(e.target.value, item, "ppcc", contadorTaxas, "origem")} name="ppcc_taxa" className='form_select'>
                                                        <option value="PP">PP</option>
                                                        <option value="CC">CC</option>
                                                    </select>

                                                ) : (
                                                    <>
                                                        {item.ppcc}
                                                    </>
                                                )
                                                }
                                            </td>
                                            <td>
                                                <button name="excluir_taxa" onClick={() => handleExcluirTaxa(contadorTaxas, "origem")} className="botao_excluir_taxa"> X </button>
                                            </td>
                                        </tr>
                                        {item.edicao_taxa === "1" && (
                                            <tr>
                                                <td colSpan={7}>
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <label>Moeda</label>
                                                            <select defaultValue={item.id_moeda} onChange={(e) => handleMudancaMoeda(e, item, contadorTaxas, "origem")} name="moeda_taxa" className='form-select'>
                                                                <option value="">Selecione</option>
                                                                <option value="42">USD</option>
                                                                <option value="113">EUR</option>
                                                                <option value="88">BRL</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-2">
                                                            <label>Unidade</label>
                                                            <select defaultValue={item.id_unidade} onChange={(e) => handleMudancaUnidade(e, item, contadorTaxas, "origem")} name="unidade_taxa" className='form-select'>
                                                                <option value="3">WM</option>
                                                                <option value="4">BL</option>
                                                                <option value="1">M3</option>
                                                                <option value="2">TON</option>
                                                                <option value="5">%</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                ))}
                            </table>
                        ) : (
                            <b>Sem taxas no Momento</b>
                        )}
                    </div>
                </div>
            </div>

            <div className="container shadow-lg p-3 mb-4 bg-white rounded no-gutters m-0">
                <div className='row'>
                    <div className="col-10 border-bottom titulo">
                        <b>Fretes e Adicionais</b>
                        {listaTaxasFretes.length > 0 ?
                            <>
                            <span className="formatacao_totais">{"Total USD: "+dadosTaxas.valor_total_taxas_frete_usd.toFixed(2)}</span>
                            <span className="formatacao_totais">{"Total EUR: "+dadosTaxas.valor_total_taxas_frete_eur.toFixed(2)}</span>
                            <span className="formatacao_totais">{"Total BRL: "+dadosTaxas.valor_total_taxas_frete_brl.toFixed(2)}</span>
                            </>
                        :
                        ''}
                    </div>
                    <div className="col-2 border-bottom titulo alinhamento_objeto_direito">
                        <button name="adicionar_taxa_frete" onClick={() => handleExibirModalAdicionarTaxa(true, "frete")} className="btn btn-outline-dark btn-sm">Adicionar Taxa</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col alinhamento_objeto_center titulo">
                        <br />
                        {listaTaxasFretes.length > 0 ? (
                            <table id="taxas_fretes_adicionais" className="tabelasTaxas">
                                <thead>
                                    <tr>
                                        <td width="16.66%">Taxa</td>
                                        <td width="10.66%">Tarifário</td>
                                        <td width="22.66%">Compra (Min/Max)</td>
                                        <td width="22.66%">Venda (Min/Max)</td>
                                        <td width="10.66%">Total</td>
                                        <td width="13.66%">Modalidade</td>
                                        <td width="3.66%"></td>
                                    </tr>
                                </thead>
                                {listaTaxasFretes.map((item, contadorTaxas) => (
                                    <tbody key={contadorTaxas}>
                                        <tr>
                                            <td><Link onClick={() => alteracao_valores(item.id_taxa, contadorTaxas, "fretes")}>{item.taxa}</Link></td>
                                            <td>{item.valor_tarifario} {item.unidade}</td>
                                            <td>
                                                {item.edicao_taxa === "1" ? (
                                                    <>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={item.valor_compra}
                                                                name="valor_compra"
                                                                onValueChange={(values) => handleChangeNumericField("valor_compra", values.value, "frete", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />
                                                            */
                                                            }

                                                            <input
                                                                type="text"
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={String(item.valor_compra).replace(".",",")}
                                                                name="valor_compra"
                                                                onChange={(e) => formata_moeda("valor_compra", e, "frete", item, contadorTaxas)}
                                                            />

                                                        </div>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                value={item.valor_compra_minimo}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_minimo"
                                                                onValueChange={(values) => handleChangeNumericField("valor_compra_minimo", values.value, "frete", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />
                                                            */
                                                            }
                                                            <input
                                                                type="text"
                                                                value={String(item.valor_compra_minimo).replace(".",",")}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_minimo"
                                                                onChange={(e) => formata_moeda("valor_compra_minimo", e, "frete", item, contadorTaxas)}
                                                            />

                                                        </div>

                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                value={item.valor_compra_maximo}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_maximo"
                                                                onValueChange={(values) => handleChangeNumericField("valor_compra_maximo", values.value, "frete", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />
                                                            
                                                            */
                                                            }
                                                            <input
                                                                type="text"
                                                                value={String(item.valor_compra_maximo).replace(".",",")}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_maximo"
                                                                onChange={(e) => formata_moeda("valor_compra_maximo", e, "frete", item, contadorTaxas)}
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {item.valor_compra} ({item.valor_compra_minimo}/{item.valor_compra_maximo})
                                                    </>
                                                )}

                                            </td>
                                            <td>
                                                {item.edicao_taxa === "1" ? (
                                                    <>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={item.valor_venda}
                                                                name="valor_venda"
                                                                onValueChange={(values) => handleChangeNumericField("valor_venda", values.value, "frete", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />                                                                
                                                            */
                                                            }
                                                            <input
                                                                type="text"
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={String(item.valor_venda).replace(".",",")}
                                                                name="valor_venda"
                                                                onChange={(e) => formata_moeda("valor_venda", e, "frete", item, contadorTaxas)}
                                                            />
                                                        </div>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                value={item.valor_venda_minimo}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_venda_minimo"
                                                                onValueChange={(values) => handleChangeNumericField("valor_venda_minimo", values.value, "frete", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />                                                            
                                                            */
                                                            }

                                                            <input
                                                                type="text"
                                                                value={String(item.valor_venda_minimo).replace(".",",")}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_venda_minimo"
                                                                onChange={(e) => formata_moeda("valor_venda_minimo", e, "frete", item, contadorTaxas)}
                                                            />                                                            
                                                        </div>

                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                                /*
                                                                <NumericFormat
                                                                    value={item.valor_venda_maximo}
                                                                    className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                    name="valor_venda_maximo"
                                                                    onValueChange={(values) => handleChangeNumericField("valor_venda_maximo", values.value, "frete", item, contadorTaxas)}
                                                                    decimalSeparator=','
                                                                    decimalScale={2}
                                                                />                                                                
                                                                */
                                                                <input
                                                                    type="text"
                                                                    value={String(item.valor_venda_maximo).replace(".",",")}
                                                                    className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                    name="valor_venda_maximo"
                                                                    onChange={(e) => formata_moeda("valor_venda_maximo", e, "frete", item, contadorTaxas)}
                                                                />                                                                
                                                            }
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {item.valor_venda} ({item.valor_venda_minimo}/{item.valor_venda_maximo})
                                                    </>
                                                )}

                                            </td>
                                            <td>{item.valor_calculado} {item.moeda}</td>
                                            <td>
                                                {(item.editar_ppcc === 0 || item.editar_ppcc === "0") ? (
                                                    <>
                                                        {item.ppcc}
                                                    </>
                                                ) : (
                                                    <>
                                                        <select defaultValue={item.ppcc} onChange={(e) => handleAlteracaoModalidadeTaxaFrete(e.target.value, item.ppcc, item.taxa, item, contadorTaxas, "frete")} name="ppcc_taxa" className='form_select'>
                                                            <option value="">Selecione</option>
                                                            <option value="PP">PP</option>
                                                            <option value="CC">CC</option>
                                                            <option value="AF">AF</option>
                                                        </select>
                                                    </>
                                                )
                                                }
                                            </td>
                                            <td>
                                                <button name="excluir_taxa" onClick={() => handleExcluirTaxa(contadorTaxas, "frete")} className="botao_excluir_taxa"> X </button>
                                            </td>
                                        </tr>
                                        {item.edicao_taxa === "1" && (
                                            <tr>
                                                <td colSpan={7}>
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <label>Moeda</label>
                                                            <select defaultValue={item.id_moeda} onChange={(e) => handleMudancaMoeda(e, item, contadorTaxas, "frete")} name="moeda_taxa" className='form-select'>
                                                                <option value="">Selecione</option>
                                                                <option value="42">USD</option>
                                                                <option value="113">EUR</option>
                                                                <option value="88">BRL</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-2">
                                                            <label>Unidade</label>
                                                            <select defaultValue={item.id_unidade} onChange={(e) => handleMudancaUnidade(e, item, contadorTaxas, "frete")} name="unidade_taxa" className='form-select'>
                                                                <option value="3">WM</option>
                                                                <option value="4">BL</option>
                                                                <option value="1">M3</option>
                                                                <option value="2">TON</option>
                                                                <option value="5">%</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                ))}
                            </table>
                        ) : (
                            <b>Sem taxas no Momento</b>
                        )}
                    </div>
                </div>
            </div>

            <div className="container shadow-lg p-3 mb-4 bg-white rounded no-gutters m-0">
                <div className='row'>
                    <div className="col-10 border-bottom titulo">
                        <b>Custos de Destino</b>
                        {listaTaxasDestino.length > 0 ?
                            <>
                            <span className="formatacao_totais">{"Total USD: "+dadosTaxas.valor_total_taxas_destino_usd.toFixed(2)}</span>
                            <span className="formatacao_totais">{"Total EUR: "+dadosTaxas.valor_total_taxas_destino_eur.toFixed(2)}</span>
                            <span className="formatacao_totais">{"Total BRL: "+dadosTaxas.valor_total_taxas_destino_brl.toFixed(2)}</span>
                            </>
                        :
                        ''}
                    </div>
                    <div className="col-2 border-bottom titulo alinhamento_objeto_direito">
                        <button name="adicionar_taxa_destino" onClick={() => handleExibirModalAdicionarTaxa(true, "destino")} className="btn btn-outline-dark btn-sm">Adicionar Taxa</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col alinhamento_objeto_center titulo">
                        <br />
                        {listaTaxasDestino.length > 0 ? (
                            <table id="taxas_destino" className="tabelasTaxas">
                                <thead>
                                    <tr>
                                        <td width="16.66%">Taxa</td>
                                        <td width="10.66%">Tarifário</td>
                                        <td width="22.66%">Compra (Min/Max)</td>
                                        <td width="22.66%">Venda (Min/Max)</td>
                                        <td width="10.66%">Total</td>
                                        <td width="13.66%">Modalidade</td>
                                        <td width="3.66%"></td>
                                    </tr>
                                </thead>
                                {listaTaxasDestino.map((item, contadorTaxas) => (
                                    <tbody key={contadorTaxas}>
                                        <tr>
                                            <td>
                                                {item.travar_taxa == "0" ? (
                                                    <Link onClick={() => alteracao_valores(item.id_taxa, contadorTaxas, "destino")}>{item.taxa}</Link>
                                                ):(
                                                    <>
                                                    {item.taxa}
                                                    </>
                                                )}                                                
                                            </td>
                                            <td>{item.valor_tarifario} {item.unidade}</td>
                                            <td>
                                                {item.edicao_taxa === "1" ? (
                                                    <>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={item.valor_compra}
                                                                name="valor_compra"
                                                                onValueChange={(values) => handleChangeNumericField("valor_compra", values.value, "destino", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />                                                                
                                                            */
                                                            }
                                                            <input
                                                                type="text"
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={String(item.valor_compra).replace(".",",")}
                                                                name="valor_compra"
                                                                onChange={(e) => formata_moeda("valor_compra", e, "destino", item, contadorTaxas)}
                                                            />
                                                        </div>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                                /*
                                                            <NumericFormat
                                                                value={item.valor_compra_minimo}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_minimo"
                                                                onValueChange={(values) => handleChangeNumericField("valor_compra_minimo", values.value, "destino", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />                                                                
                                                                */
                                                            }

                                                            <input
                                                                type="text"
                                                                value={String(item.valor_compra_minimo).replace(".",",")}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_minimo"
                                                                onChange={(e) => formata_moeda("valor_compra_minimo", e, "destino", item, contadorTaxas)}
                                                            />

                                                        </div>

                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                value={item.valor_compra_maximo}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_maximo"
                                                                onValueChange={(values) => handleChangeNumericField("valor_compra_maximo", values.value, "destino", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />                                                            
                                                            */
                                                            }
                                                            <input
                                                                type="text"
                                                                value={String(item.valor_compra_maximo).replace(".",",")}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_compra_maximo"
                                                                onChange={(e) => formata_moeda("valor_compra_maximo", e, "destino", item, contadorTaxas)}
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {item.valor_compra} ({item.valor_compra_minimo}/{item.valor_compra_maximo})
                                                    </>
                                                )}

                                            </td>
                                            <td>
                                                {item.edicao_taxa === "1" ? (
                                                    <>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={item.valor_venda}
                                                                name="valor_venda"
                                                                onValueChange={(values) => handleChangeNumericField("valor_venda", values.value, "destino", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />                                                            
                                                            */
                                                            }
                                                            <input
                                                                type="text"
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                value={String(item.valor_venda).replace(".",",")}
                                                                name="valor_venda"
                                                                onChange={(e) => formata_moeda("valor_venda", e, "destino", item, contadorTaxas)}
                                                            />

                                                        </div>
                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                value={item.valor_venda_minimo}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_venda_minimo"
                                                                onValueChange={(values) => handleChangeNumericField("valor_venda_minimo", values.value, "destino", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />                                                            
                                                            */
                                                            <input
                                                                type="text"
                                                                value={String(item.valor_venda_minimo).replace(".",",")}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_venda_minimo"
                                                                onChange={(e) => formata_moeda("valor_venda_minimo", e, "destino", item, contadorTaxas)}
                                                            />                                                            
                                                            }                                                            
                                                        </div>

                                                        <div className="campos_valores_taxas_tabela">
                                                            {
                                                            /*
                                                            <NumericFormat
                                                                value={item.valor_venda_maximo}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_venda_maximo"
                                                                onValueChange={(values) => handleChangeNumericField("valor_venda_maximo", values.value, "destino", item, contadorTaxas)}
                                                                decimalSeparator=','
                                                                decimalScale={2}
                                                            />                                                            
                                                            
                                                            */                                                                
                                                            }
                                                            <input
                                                                type="text"
                                                                value={String(item.valor_venda_maximo).replace(".",",")}
                                                                className="form-control texto_edicao_taxas alinhamento_texto_direito"
                                                                name="valor_venda_maximo"
                                                                onChange={(e) => formata_moeda("valor_venda_maximo", e, "destino", item, contadorTaxas)}
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {item.valor_venda} ({item.valor_venda_minimo}/{item.valor_venda_maximo})
                                                    </>
                                                )}

                                            </td>
                                            <td>{item.valor_calculado} {item.moeda}</td>
                                            <td>
                                                {item.editar_ppcc === "0" ? (
                                                    <>
                                                        {item.ppcc}
                                                    </>
                                                ) : (
                                                    <>
                                                        <select defaultValue={item.ppcc} onChange={(e) => handleAlteracaoModalidadeTaxaLocal(e.target.value, item, "ppcc", contadorTaxas, "destino")} name="ppcc_taxa" className='form_select'>
                                                            <option value="PP">PP</option>
                                                            <option value="CC">CC</option>
                                                        </select>
                                                    </>
                                                )
                                                }
                                            </td>
                                            <td>
                                                <button name="excluir_taxa" onClick={() => handleExcluirTaxa(contadorTaxas, "destino")} className="botao_excluir_taxa"> X </button>
                                            </td>
                                        </tr>
                                        {item.edicao_taxa === "1" && (
                                            <tr>
                                                <td colSpan={7}>
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <label>Moeda</label>
                                                            <select defaultValue={item.id_moeda} onChange={(e) => handleMudancaMoeda(e, item, contadorTaxas, "destino")} name="moeda_taxa" className='form-select'>
                                                                <option value="42">USD</option>
                                                                <option value="113">EUR</option>
                                                                <option value="88">BRL</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-2">
                                                            <label>Unidade</label>
                                                            <select defaultValue={item.id_unidade} onChange={(e) => handleMudancaUnidade(e, item, contadorTaxas, "destino")} name="unidade_taxa" className='form-select'>
                                                                <option value="3">WM</option>
                                                                <option value="4">BL</option>
                                                                <option value="1">M3</option>
                                                                <option value="2">TON</option>
                                                                <option value="5">%</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                ))}
                            </table>
                        ) : (
                            <b>Sem taxas no Momento</b>
                        )
                        }
                    </div>
                </div>
            </div>
            {exibirModalTaxas === true && (
                <ModalAdicionarTaxa
                    apiDados={props.apiDados}
                    taxas_origem={listaTaxasOrigem}
                    taxas_destino={listaTaxasDestino}
                    taxas_frete={listaTaxasFretes}
                    exibirModalAdicionarTaxa={handleExibirModalAdicionarTaxa}
                    urlApis={props.urlApis}
                    ppcc_adicionar_taxa={ppcc_adicionar_taxa}
                    adicionarTaxa={handleAdicionarTaxa}
                    tipoListaAdicionarTaxa={tipoListaAdicionarTaxa}
                />
            )}

            {exibirModalAlertModalidade === true && (
                <ModalAlertModalidade
                    nome_taxa={nomeTaxa}
                    fechar_alerta={() => fechar_janela_alerta()}
                />
            )}
        </>
    )
}
