import { Fragment, useEffect, useState } from "react";
import ReactSelectAsync from 'react-select/async';
import api from "../../../api";
import '../SmartPanel.css';
import './ModalPropostaGemea.css';
import XMLJS from 'xml-js'
//import { NumericFormat } from 'react-number-format';

/*
    exemplo numeric format
    <NumericFormat
                            className="form-control alinhamento_texto_direito"
                            name="valor_compra"
                            onValueChange={(values) => handleChangeNumericField("valor_compra", values.value)}
                            decimalSeparator=','
                            decimalScale={2}
                        />

*/

export default (props) => {
    const [id_proposta_spot_selecionada, setIdPropostaSpotSelecionada] = useState(0);
    const [dadosPropostaCarregada, setDadosPropostaCarregada] = useState(false);

    const [nomeCliente, setNomeCliente] = useState("");
    const [impEXP, setImpExp] = useState("");
    const [origem, setOrigem] = useState("");
    const [portoEmbarque, setPortoEmbarque] = useState("");
    const [portoDescarga, setPortoDescarga] = useState("");
    const [destinoFinal, setDestinoFinal] = useState("");
    const [textoTransitTime, setTextoTransitTime] = useState("");

    const [qtdeVolumes, setQtdeVolumes] = useState("");
    const [peso, setPeso] = useState("");
    const [cubagem, setCubagem] = useState("");
    const [incoterm, setIncoterm] = useState("");
    const [ppccFrete, setPpCcFrete] = useState("");
    const [empilhavel, setEmpilhavel] = useState("");
    const [cargaIMO, setCargaIMO] = useState("");
    const [mercadoria, setMercadoria] = useState("");

    const [listaPickus, setListaPickups] = useState([]);
    const [listaDoorDelivery, setListaDoorDelivery] = useState([]);
    const [listaCargaImo, setListaCargaImo] = useState([]);

    const [numeroPropostaRotaGemea, setNumeroPropostaRotaGemea] = useState("");
    const [observacaoInterna, setObservacaoInterna] = useState("");
    const [observacaoCliente, setObservacaoCliente] = useState("");

    const [listaTaxasOrigem, setListaTaxasOrigem] = useState([]);
    const [listaTaxasFrete, setListaTaxasFrete] = useState([]);
    const [listaTaxasDestino, setListaTaxasDestino] = useState([]);
    const [selecionarTodasTaxasOrigem, setSelecionarTodasTaxasOrigem] = useState(false);
    const [selecionarTodasTaxasFrete, setSelecionarTodasTaxasFrete] = useState(false);
    const [selecionarTodasTaxasDestino, setSelecionarTodasTaxasDestino] = useState(false);
    const [DadosAddImo, setDadosAddImo] = useState(false);
    const [DadosTaxaCarregamentoDireto, setDadosTaxaCarregamentoDireto] = useState(false);

    const handleFecharModal = () => {
        props.fecharModalPropostaGemea();
    }

    const BuscarDadosPropostaSpot = {
        "id_proposta_spot": ""
    }

    async function busca_dados_proposta_spot(id_proposta_spot) {
        BuscarDadosPropostaSpot.id_proposta_spot = id_proposta_spot;

        let resultado = await api.post("https://allinkscoa.com.br" + props.apiDados + "buscar_dados_proposta_gemea.php",
            BuscarDadosPropostaSpot
        ).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });

        if (resultado.dados_cliente) {
            setNomeCliente(resultado.dados_cliente.nome_cliente);
            if (resultado.propsta_imp_exp == "EXP") {
                setImpExp("Exportação");
            } else {
                setImpExp("Importação");
            }

            setOrigem(resultado.dados_rota.rota_completa.origem);
            setPortoEmbarque(resultado.dados_rota.rota_completa.porto_embarque);
            setPortoDescarga(resultado.dados_rota.rota_completa.porto_desembarque);
            setDestinoFinal(resultado.dados_rota.rota_completa.destino);
            let texto_transit_time = "";
            if (resultado.dados_rota.transit_receipt_x_loading !== 0 && resultado.dados_rota.transit_receipt_x_loading !== null && resultado.dados_rota.transit_receipt_x_loading !== "0") {
                texto_transit_time += String(resultado.dados_rota.transit_receipt_x_loading) + " DIAS APROX. | FREQUENCIA: " + resultado.dados_rota.frequencia_receipt_x_loading + " ";
            }
            if (resultado.dados_rota.transit_loading_x_via !== 0 && resultado.dados_rota.transit_loading_x_via !== null && resultado.dados_rota.transit_loading_x_via !== "0") {
                texto_transit_time += resultado.dados_rota.rota_completa.porto_embarque + " / " + resultado.dados_rota.rota_completa.porto_desembarque + ": " + String(resultado.dados_rota.transit_loading_x_via) + " DIAS APROX. | FREQUENCIA: " + resultado.dados_rota.frequencia_loading_x_via + " ONBOARD ";
            }

            if (resultado.dados_rota.transit_via_x_place_delivery !== 0 && resultado.dados_rota.transit_via_x_place_delivery !== null && resultado.dados_rota.transit_via_x_place_delivery !== "0") {
                texto_transit_time += resultado.dados_rota.rota_completa.porto_desembarque + " / " + resultado.dados_rota.rota_completa.destino + ": " + String(resultado.dados_rota.transit_via_x_place_delivery) + " DIAS APROX. | FREQUENCIA: " + resultado.dados_rota.frequencia_via_x_place_delivery;
            }

            if (resultado.dados_rota.transit_via_x_via_adicional !== 0 && resultado.dados_rota.transit_via_x_via_adicional !== null && resultado.dados_rota.transit_via_x_via_adicional !== "0") {
                texto_transit_time += resultado.dados_rota.rota_completa.porto_desembarque + " / " + resultado.dados_rota.rota_completa.via_adicional + ": " + String(resultado.dados_rota.transit_via_x_via_adicional) + " DIAS APROX. | FREQUENCIA: " + resultado.dados_rota.frequencia_via_x_via_adicional + " ";
            }

            if (resultado.dados_rota.transit_via_adicional_x_place_delivery !== 0 && resultado.dados_rota.transit_via_adicional_x_place_delivery !== null && resultado.dados_rota.transit_via_adicional_x_place_delivery !== "0") {
                texto_transit_time += resultado.dados_rota.rota_completa.via_adicional + " / " + resultado.dados_rota.rota_completa.destino + ": " + String(resultado.dados_rota.transit_via_adicional_x_place_delivery) + " DIAS APROX. | FREQUENCIA: " + resultado.dados_rota.frequencia_via_adicional_x_place_delivery;
            }

            setTextoTransitTime(texto_transit_time);

            setQtdeVolumes(resultado.dados_carga.volume_total);
            setPeso(resultado.dados_carga.peso_total);
            setCubagem(resultado.dados_carga.cubagem_total);
            setIncoterm(resultado.dados_rota.incoterm);
            setNumeroPropostaRotaGemea(resultado.dados_rota.numero_proposta);
            setObservacaoInterna(resultado.observacao_proposta.observacao_interna);
            setObservacaoCliente(resultado.observacao_proposta.observacao);


            let texto_ppcc_frete = new Array();
            let contador_ppcc_frete = 0;
            if (resultado.dados_rota.pp === 1) {
                texto_ppcc_frete[contador_ppcc_frete] = "Prepaid";
                contador_ppcc_frete++;
            }
            if (resultado.dados_rota.cc === 1) {
                texto_ppcc_frete[contador_ppcc_frete] = "Collect";
                contador_ppcc_frete++;
            }
            if (texto_ppcc_frete.length > 0) {
                setPpCcFrete(texto_ppcc_frete.join("/"));
            }

            let carga_empilhavel = "";
            if (resultado.dados_carga.itens_nao_empilhaveis === 1) {
                carga_empilhavel = "Não";
            } else if (resultado.dados_carga.itens_nao_empilhaveis === 0) {
                carga_empilhavel = "Sim";
            }
            setEmpilhavel(carga_empilhavel);

            if (resultado.dados_carga.lista_carga_imo.length > 0) {
                setCargaIMO("Sim");

                let id_tarifario_pesquisa = resultado.dados_rota.id_tarifario;
                let carga_imo_pesquisa = "S";
                let ppcc_busca_tarifas = "";
                let cargaImo = "S";
                let fretePPCC = "";

                if(resultado.propsta_imp_exp === "EXP") {
                    ppcc_busca_tarifas = "PP";
                } else {
                    ppcc_busca_tarifas = "CC";
                }
 
                let url = "";
                if(props.numero_proposta_rota !== "") {
                    if(props.numero_proposta_rota.substring(0,2) === "PT") {
                        url = "https://allinkscoa.com.br/Clientes/propostas/index.php/api/tarifas/buscarTarifarioCompleto/" + id_tarifario_pesquisa + "/" + props.id_cliente_selecionado + "/" + carga_imo_pesquisa + "/" + ppcc_busca_tarifas + "/";
                    } else {
                        url = "https://allinkscoa.com.br/Clientes/propostas/index.php/api/tarifas/buscarTarifarioNacCompleto/" + id_tarifario_pesquisa + "/" + props.id_cliente_selecionado + "/" + carga_imo_pesquisa + "/" + ppcc_busca_tarifas + "/";
                    }    
                } else {
                    url = "https://allinkscoa.com.br/Clientes/propostas/index.php/api/tarifas/buscarTarifarioCompletoSemAcordo/" + id_tarifario_pesquisa + "/" + props.id_cliente_selecionado + "/" + carga_imo_pesquisa + "/" + ppcc_busca_tarifas + "/";
                }
                    
                // Busca Info dados Tarifario
                let response_tarifarios = await api.get(url, {
                    "Content-Type": "application/xml; charset=utf-8"
                }).then((response) => {
                    return response.data
                }).catch((err) => {
                    console.error("Ocorreu um erro" + err);
                });
                let json_result = XMLJS.xml2json(response_tarifarios, { compact: true, spaces: 2 })
                json_result = JSON.parse(json_result);

                let taxaPPCC = "";
                let editar_ppcc = ""; 
                let taxas_frete_e_adicionais = [];
                let taxa_carregamento_direto = "";
                let taxa_imo = "";

                if (Array.isArray(json_result.tarifario.taxas_adicionais.taxa)) {
                    json_result.tarifario.taxas_adicionais.taxa.map(function (item) {
                        if(item.id_taxa._text === "14") {
                            taxaPPCC = item.ppcc._text;
                            editar_ppcc = "1";
                            if (taxaPPCC === "AF") {
                                json_result.tarifario.sentido._text
                                if(fretePPCC.length > 2) {
                                    if(json_result.tarifario.sentido._text === "EXP") {
                                        fretePPCC = "PP";
                                    } else {
                                        fretePPCC = "CC";
                                    }
                                } else {
                                    fretePPCC = props.fretePPCC;
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
        
                            let valor_calculado = item.valor._text;
                            valor_calculado = valor_calculado.replace(",","");
                            let medida_calculo = 0;
                            if (item.id_unidade._text === "3") {
                                let valor_ton = parseFloat(pesoTotal / 1000).toFixed(3);
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
    
                            taxa_imo = {
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
                            };
                            setDadosAddImo(taxa_imo);
                            let carregar_taxa_carregamento_direto = 0;
                            if (resultado.dados_carga.lista_carga_imo.length > 0) {
                                let listaCargaImo = resultado.dados_carga.lista_carga_imo;
                                listaCargaImo.map((item) => {
                                    if (item.carregamento_direto === "Sim") {
                                        carregar_taxa_carregamento_direto = 1;
                                    }
                                });
    
                                if (carregar_taxa_carregamento_direto === 1) {
                                    taxa_carregamento_direto =  {
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
                                    };
                                    setDadosTaxaCarregamentoDireto(taxa_carregamento_direto);
                                }
                            }                            
                        }                        
                    });
                } else {
                    if(json_result.tarifario.taxas_adicionais.taxa.id_taxa._text === "14") {

                        let taxaPPCC = json_result.tarifario.taxas_adicionais.taxa.ppcc._text;
                        let editar_ppcc = "1";
                        let freteProposta = "";
                        if (taxaPPCC === "AF") {
                            if(props.fretePPCC.length > 2) {
                                if(json_result.tarifario.sentido._text === "EXP") {
                                    freteProposta = "PP";
                                } else {
                                    freteProposta = "CC";
                                }
                            } else {
                                freteProposta = props.fretePPCC; 
                            }
                            taxaPPCC = freteProposta;
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
    
                        taxa_imo = {
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
                        }
                        setDadosAddImo(taxa_imo);
    
                        if (cargaImo === "S") { // Carrega a taxa de Carregamento Direto
                            let carregar_taxa_carregamento_direto = 0;
                            if (resultado.dados_carga.lista_carga_imo.length > 0) {
                                let listaCargaImo = resultado.dados_carga.lista_carga_imo;
                                listaCargaImo.map((item) => {
                                    if (item.carregamento_direto === "Sim") {
                                        carregar_taxa_carregamento_direto = 1;
                                    }
                                });
    
                                if (carregar_taxa_carregamento_direto === 1) {
                                    taxa_carregamento_direto = {
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
                                    };
                                    setDadosTaxaCarregamentoDireto(taxa_carregamento_direto);
                                }
                            }
                        }    
                    }                
                }                
                                
            } else {
                setDadosTaxaCarregamentoDireto("");
                setDadosAddImo("");
                setCargaIMO("Não");
            }

            if (resultado.dados_carga.lista_itens_cargas.length > 0) {
                if (resultado.dados_carga.descricao_unica !== "") {
                    setMercadoria(resultado.dados_carga.descricao_unica);
                } else {
                    let mercadoria = new Array();
                    let contador_mercadoria = 0;
                    for (let j = 0; j < resultado.dados_carga.lista_itens_cargas.length; j++) {
                        if (mercadoria.indexOf(resultado.dados_carga.lista_itens_cargas[j].descricao) < 0) {
                            mercadoria[contador_mercadoria] = resultado.dados_carga.lista_itens_cargas[j].descricao;
                        }
                    }
                    if (mercadoria.length > 0) {
                        setMercadoria(mercadoria.join("; "));
                    }
                }
            }

            if (resultado.dados_carga.lista_carga_imo.length > 0) {
                setListaCargaImo(resultado.dados_carga.lista_carga_imo);
            }

            if (resultado.dados_carga.lista_pickup.length > 0) {
                let dados_pickup_selecionado_proposta = new Array();
                let contador_pickup_selecionado_proposta = 0;
                for (let j = 0; j < resultado.dados_carga.lista_pickup.length; j++) {
                    let endereco_pickup = resultado.dados_carga.lista_pickup[j].endereco_pickup;
                    let zip_code_pickup = resultado.dados_carga.lista_pickup[j].zip_code_pickup;
                    let moeda_pickup = resultado.dados_carga.lista_pickup[j].moeda_pickup;
                    let modalidade_pickup = resultado.dados_carga.lista_pickup[j].modalidade_pickup;
                    let valor_venda_pickup = resultado.dados_carga.lista_pickup[j].valor_venda_pickup;
                    let valor_venda_minimo_pickup = resultado.dados_carga.lista_pickup[j].valor_venda_minimo_pickup;
                    let valor_venda_maximo_pickup = resultado.dados_carga.lista_pickup[j].valor_venda_maximo_pickup;

                    let unidade_pickup = resultado.dados_carga.lista_pickup[j].unidade_pickup;
                    let pickup_selecionado_encontrado = resultado.dados_carga.lista_pickups_selecionados.find(({ endereco }) => endereco === endereco_pickup);

                    let valor_compra_pickup = resultado.dados_carga.lista_pickup[j].valor_compra_pickup;
                    let valor_compra_minimo_pickup = resultado.dados_carga.lista_pickup[j].valor_compra_minimo_pickup;
                    let valor_compra_maximo_pickup = resultado.dados_carga.lista_pickup[j].valor_compra_maximo_pickup;
                    let pickup_incluso = resultado.dados_carga.lista_pickup[j].pickup_incluso;

                    if (pickup_selecionado_encontrado) {
                        dados_pickup_selecionado_proposta[contador_pickup_selecionado_proposta] =
                        {
                            "endereco_pickup": endereco_pickup,
                            "zip_code_pickup": zip_code_pickup,
                            "moeda_pickup": moeda_pickup,
                            "unidade_pickup": unidade_pickup,
                            "modalidade_pickup": modalidade_pickup,

                            "valor_compra_pickup": valor_compra_pickup,
                            "valor_compra_minimo_pickup": valor_compra_minimo_pickup,
                            "valor_compra_maximo_pickup": valor_compra_maximo_pickup,

                            "valor_venda_pickup": valor_venda_pickup,
                            "valor_venda_minimo_pickup": valor_venda_minimo_pickup,
                            "valor_venda_maximo_pickup": valor_venda_maximo_pickup,
                            "pickup_incluso": pickup_incluso,
                            "cubagem_proposta_gemea_copiado": pickup_selecionado_encontrado.cubagem,
                            "peso_proposta_gemea_copiado": pickup_selecionado_encontrado.peso,
                            "volume_proposta_gemea_copiado": pickup_selecionado_encontrado.volume
                        }
                        contador_pickup_selecionado_proposta++;
                    }
                }
                setListaPickups(dados_pickup_selecionado_proposta);
            }

            if (resultado.dados_carga.lista_door_delivery.length > 0) {
                let dados_door_delivery_selecionado_proposta = new Array();
                let contador_door_delivery_selecionado_proposta = 0;
                for (let j = 0; j < resultado.dados_carga.lista_door_delivery.length; j++) {
                    let zip_code_door_delivery = resultado.dados_carga.lista_door_delivery[j].zip_code_door_delivery;
                    let endereco_door_delivery = resultado.dados_carga.lista_door_delivery[j].endereco_door_delivery;
                    let modalidade_door_delivery = resultado.dados_carga.lista_door_delivery[j].modalidade_door_delivery;
                    let moeda_door_delivery = resultado.dados_carga.lista_door_delivery[j].moeda_door_delivery;
                    let unidade_door_delivery = resultado.dados_carga.lista_door_delivery[j].unidade_door_delivery;

                    let valor_compra_door_delivery = resultado.dados_carga.lista_door_delivery[j].valor_compra_door_delivery;
                    let valor_compra_minimo_door_delivery = resultado.dados_carga.lista_door_delivery[j].valor_compra_minimo_door_delivery;
                    let valor_compra_maximo_door_delivery = resultado.dados_carga.lista_door_delivery[j].valor_compra_maximo_door_delivery;

                    let valor_venda_door_delivery = resultado.dados_carga.lista_door_delivery[j].valor_venda_door_delivery;
                    let valor_venda_minimo_door_delivery = resultado.dados_carga.lista_door_delivery[j].valor_venda_minimo_door_delivery;
                    let valor_venda_maximo_door_delivery = resultado.dados_carga.lista_door_delivery[j].valor_venda_maximo_door_delivery;

                    let door_delivery_incluso = resultado.dados_carga.lista_door_delivery[j].door_delivery_incluso;

                    let door_delivery_selecionado_encontrado = resultado.dados_carga.lista_door_delivery_selecionados.find(({ endereco }) => endereco === endereco_door_delivery);
                    if (door_delivery_selecionado_encontrado) {
                        dados_door_delivery_selecionado_proposta[contador_door_delivery_selecionado_proposta] =
                        {
                            "endereco_door_delivery": endereco_door_delivery,
                            "zip_code_door_delivery": zip_code_door_delivery,
                            "moeda_door_delivery": moeda_door_delivery,
                            "unidade_door_delivery": unidade_door_delivery,
                            "modalidade_door_delivery": modalidade_door_delivery,
                            "valor_compra_door_delivery": valor_compra_door_delivery,
                            "valor_compra_minimo_door_delivery": valor_compra_minimo_door_delivery,
                            "valor_compra_maximo_door_delivery": valor_compra_maximo_door_delivery,
                            "valor_venda_door_delivery": valor_venda_door_delivery,
                            "valor_venda_minimo_door_delivery": valor_venda_minimo_door_delivery,
                            "valor_venda_maximo_door_delivery": valor_venda_maximo_door_delivery,
                            "door_delivery_incluso": door_delivery_incluso,
                            "cubagem": door_delivery_selecionado_encontrado.cubagem,
                            "peso": door_delivery_selecionado_encontrado.peso,
                            "volume": door_delivery_selecionado_encontrado.volume
                        }
                        contador_door_delivery_selecionado_proposta++;
                    }
                }
                setListaDoorDelivery(dados_door_delivery_selecionado_proposta);
            }

            if (resultado.dados_taxas.taxas_origem) {
                if (resultado.dados_rota.numero_proposta !== "" || props.numero_proposta_rota !== "") {
                    let encontrou_taxas_adicionais = resultado.dados_taxas.taxas_origem.find((dados_taxas_origem) => dados_taxas_origem.taxa_adicional === "1")
                    if (encontrou_taxas_adicionais) {
                        setSelecionarTodasTaxasOrigem(true);
                    } else {
                        setSelecionarTodasTaxasOrigem(false);
                    }
                } else {
                    setSelecionarTodasTaxasOrigem(true);
                }
                setListaTaxasOrigem(resultado.dados_taxas.taxas_origem);
            }
            if (resultado.dados_taxas.taxas_frete) {
                if (resultado.dados_rota.numero_proposta !== "" || props.numero_proposta_rota !== "") {
                    let encontrou_taxas_adicionais = resultado.dados_taxas.taxas_frete.find((dados_taxas_frete) => dados_taxas_frete.taxa_adicional === "1")
                    if (encontrou_taxas_adicionais) {
                        setSelecionarTodasTaxasFrete(true);
                    } else {
                        setSelecionarTodasTaxasFrete(false);
                    }
                } else {
                    setSelecionarTodasTaxasFrete(true);
                }
                setListaTaxasFrete(resultado.dados_taxas.taxas_frete);
            }
            if (resultado.dados_taxas.taxas_destino) {
                if (resultado.dados_rota.numero_proposta !== "" || props.numero_proposta_rota !== "") {
                    let encontrou_taxas_adicionais = resultado.dados_taxas.taxas_destino.find((dados_taxas_destino) => dados_taxas_destino.taxa_adicional === "1")
                    if (encontrou_taxas_adicionais) {
                        setSelecionarTodasTaxasDestino(true);
                    } else {
                        setSelecionarTodasTaxasDestino(false);
                    }
                } else {
                    setSelecionarTodasTaxasDestino(true);
                }
                setListaTaxasDestino(resultado.dados_taxas.taxas_destino);
            }
            setDadosPropostaCarregada(true);
        }
    }

    function selecionar_todos_objetos(e, nome_objeto_selecao) {
        let elementos = document.querySelectorAll("input[name='" + nome_objeto_selecao + "']");
        for (let i = 0; i < elementos.length; i++) {
            elementos[i].checked = e.target.checked;
        }
    }

    function verificar_todos_objetos(e, nome_objeto_selecao, nome_objeto_selecao_todos) {
        let qtde_elementos_checados = document.querySelectorAll("input[name='" + nome_objeto_selecao + "']:checked").length;
        let qtde_elementos = document.querySelectorAll("input[name='" + nome_objeto_selecao + "']").length;
        if(qtde_elementos_checados !== qtde_elementos) {
            document.querySelector("input[name='" + nome_objeto_selecao_todos + "']").checked = false;
        } else {
            document.querySelector("input[name='" + nome_objeto_selecao_todos + "']").checked = true;
        }
    }

    function copiar_dados() {
        let elementos_origem = document.querySelectorAll("input[name='chk_taxa_origem']:checked");
        let elementos_destino = document.querySelectorAll("input[name='chk_taxa_destino']:checked");
        let elementos_frete = document.querySelectorAll("input[name='chk_taxa_frete']:checked");
        let elementos_pickup = document.querySelectorAll("input[name='chk_copiar_pickup']:checked");
        let elementos_door_delivery = document.querySelectorAll("input[name='chk_copiar_door_delivery']:checked");
        let elementos_imo = document.querySelectorAll("input[name='chk_copiar_imo']:checked");
        let elemento_nao_epilhavel = document.querySelectorAll("input[name='copiar_carga_empilhavel']:checked");
        let elemento_incoterm = document.querySelectorAll("input[name='copiar_incoterm']:checked");
        let elemento_observacao_interna = document.querySelectorAll("input[name='copiar_observacao_interna']:checked");
        let elemento_observacao_cliente = document.querySelectorAll("input[name='copiar_observacao_cliente']:checked");
                
        let dados_taxas_nova_proposta = props.dados_cotacao_taxas;
        let dados_pickup_nova_proposta = props.lista_pickup;
        let dados_door_delivery_nova_proposta = props.lista_door_delivery;
        let dados_carga_imo_nova_proposta = props.lista_carga_imo;
        let itens_nao_empilhaveis = props.marcarNaoEmpilhavelPropostaGemea;

        if (elementos_origem.length > 0) {
            let taxas_origem = dados_taxas_nova_proposta.taxas_origem;
            for (let i = 0; i < elementos_origem.length; i++) {
                let dados_taxa_copiar = listaTaxasOrigem.find((dados_taxas_pesquisa) => dados_taxas_pesquisa.id_taxa === elementos_origem[i].value);
                if (dados_taxa_copiar) {
                    dados_taxa_copiar.edicao_taxa = "0";

                    let indice_taxa_nova_proposta = taxas_origem.findIndex((dados_taxas_pesquisa_nova_proposta) => dados_taxas_pesquisa_nova_proposta.id_taxa === elementos_origem[i].value);
                    if (indice_taxa_nova_proposta >= 0) {
                        dados_taxas_nova_proposta.taxas_origem[indice_taxa_nova_proposta] = dados_taxa_copiar;
                    } else {
                        dados_taxas_nova_proposta.taxas_origem[taxas_origem.length] = dados_taxa_copiar;
                    }
                }
            }
        }

        let taxas_frete = dados_taxas_nova_proposta.taxas_frete;
        if (elementos_frete.length > 0) {
            for (let i = 0; i < elementos_frete.length; i++) {
                let dados_taxa_copiar = listaTaxasFrete.find((dados_taxas_pesquisa) => dados_taxas_pesquisa.id_taxa === elementos_frete[i].value);
                if (dados_taxa_copiar) {
                    dados_taxa_copiar.edicao_taxa = "0";
                    let indice_taxa_nova_proposta = taxas_frete.findIndex((dados_taxas_pesquisa_nova_proposta) => dados_taxas_pesquisa_nova_proposta.id_taxa === elementos_frete[i].value);
                    if (indice_taxa_nova_proposta >= 0) {
                        dados_taxas_nova_proposta.taxas_frete[indice_taxa_nova_proposta] = dados_taxa_copiar;
                    } else {
                        dados_taxas_nova_proposta.taxas_frete[taxas_frete.length] = dados_taxa_copiar;
                    }
                }
            }

        }



        if (elementos_destino.length > 0) {
            let taxas_destino = dados_taxas_nova_proposta.taxas_destino;
            for (let i = 0; i < elementos_destino.length; i++) {
                let dados_taxa_copiar = listaTaxasDestino.find((dados_taxas_pesquisa) => dados_taxas_pesquisa.id_taxa === elementos_destino[i].value);
                if (dados_taxa_copiar) {
                    dados_taxa_copiar.edicao_taxa = "0";

                    let indice_taxa_nova_proposta = taxas_destino.findIndex((dados_taxas_pesquisa_nova_proposta) => dados_taxas_pesquisa_nova_proposta.id_taxa === elementos_destino[i].value);
                    if (indice_taxa_nova_proposta >= 0) {
                        dados_taxas_nova_proposta.taxas_destino[indice_taxa_nova_proposta] = dados_taxa_copiar;
                    } else {
                        dados_taxas_nova_proposta.taxas_destino[taxas_destino.length] = dados_taxa_copiar;
                    }

                }
            }
        }
        
        
        if(elementos_imo.length > 0) {
            for (let i = 0; i < elementos_imo.length; i++) {
                let dados_imo_copiar = listaCargaImo.find((dados_pesquisa) => dados_pesquisa.classe_imo_value === elementos_imo[i].value);
                if (dados_imo_copiar) {
                    let indice_dados_imo_nova_proposta = dados_carga_imo_nova_proposta.findIndex((dados_pesquisa) => dados_pesquisa.classe_imo_value === elementos_imo[i].value);
                    if (indice_dados_imo_nova_proposta < 0) {
                        dados_carga_imo_nova_proposta[dados_carga_imo_nova_proposta.length] = dados_imo_copiar;
                    } else {
                        dados_carga_imo_nova_proposta[indice_dados_imo_nova_proposta] = dados_imo_copiar;
                    }

                    props.marcarImoPropostaGemea("imo", true);
                }
            }
            
            if(DadosAddImo !== false) {
                let indice_taxa_nova_proposta = taxas_frete.findIndex((dados_taxas_pesquisa_nova_proposta) => dados_taxas_pesquisa_nova_proposta.id_taxa === "14");                
                if (indice_taxa_nova_proposta >= 0) {
                    dados_taxas_nova_proposta.taxas_frete[indice_taxa_nova_proposta] = DadosAddImo;
                } else {
                    dados_taxas_nova_proposta.taxas_frete[taxas_frete.length] = DadosAddImo;
                }
            }
    
            if(DadosTaxaCarregamentoDireto !== false) {
                let indice_taxa_nova_proposta = taxas_frete.findIndex((dados_taxas_pesquisa_nova_proposta) => dados_taxas_pesquisa_nova_proposta.id_taxa === "1268");                
                if (indice_taxa_nova_proposta >= 0) {
                    dados_taxas_nova_proposta.taxas_frete[indice_taxa_nova_proposta] = DadosTaxaCarregamentoDireto;
                } else {
                    dados_taxas_nova_proposta.taxas_frete[taxas_frete.length] = DadosTaxaCarregamentoDireto;
                }
            }    
        }

        props.dadosRetornoCopiaPropostaGemea(dados_taxas_nova_proposta);

        if (elementos_pickup.length > 0) {
            for (let i = 0; i < elementos_pickup.length; i++) {
                let dados_pickup_copiar = listaPickus.find((dados_pesquisa) => dados_pesquisa.endereco_pickup === elementos_pickup[i].value);
                if (dados_pickup_copiar) {
                    let indice_dados_pickup_nova_proposta = dados_pickup_nova_proposta.findIndex((dados_pesquisa) => dados_pesquisa.endereco_pickup === elementos_pickup[i].value);
                    if (indice_dados_pickup_nova_proposta < 0) {
                        dados_pickup_nova_proposta[dados_pickup_nova_proposta.length] = dados_pickup_copiar;
                    } else {
                        dados_pickup_nova_proposta[indice_dados_pickup_nova_proposta] = dados_pickup_copiar;
                    }

                    props.marcarPickupPropostaGemea("pickup", true);
                }
            }
        }

        if (elementos_door_delivery.length > 0) {
            for (let i = 0; i < elementos_door_delivery.length; i++) {
                let dados_door_delivery_copiar = listaDoorDelivery.find((dados_pesquisa) => dados_pesquisa.endereco_door_delivery === elementos_door_delivery[i].value);
                if (dados_door_delivery_copiar) {
                    let indice_dados_door_delivery_nova_proposta = dados_door_delivery_nova_proposta.findIndex((dados_pesquisa) => dados_pesquisa.endereco_door_delivery === elementos_door_delivery[i].value);
                    if (indice_dados_door_delivery_nova_proposta < 0) {
                        dados_door_delivery_nova_proposta[dados_door_delivery_nova_proposta.length] = dados_door_delivery_copiar;
                    } else {
                        dados_door_delivery_nova_proposta[indice_dados_door_delivery_nova_proposta] = dados_door_delivery_copiar;
                    }
                    props.marcarDoorDeliveryPropostaGemea("door_delivery", true);
                }
            }
        }

        if(elemento_nao_epilhavel.length > 0) {
            if(empilhavel === "Sim") {
                itens_nao_empilhaveis = 0;
                props.marcacaoNaoEmpilhavelPropostaGemea("itens_nao_empilhaveis",false);
            } else {
                props.marcacaoNaoEmpilhavelPropostaGemea("itens_nao_empilhaveis",true);
                itens_nao_empilhaveis = 1;
            }
        }

        if(elemento_incoterm.length > 0) {
            props.definirIncotermPropostaGemea(incoterm);
        }

        if(elemento_observacao_interna.length > 0) {
            props.observacaoInternaPropostaGemea(observacaoInterna);
        }

        if(elemento_observacao_cliente.length > 0) {
            props.observacaoClientePropostaGemea(observacaoCliente);
        }

        props.fecharModalPropostaGemea();
    }

    function selecionar_todos_campos() 
    {
        let elementos_selecao = document.querySelectorAll("input[type='checkbox'][objeto_selecao_proposta_gemea='objeto_selecao_proposta_gemea']");
        let qtde_elementos_selecao = elementos_selecao.length;
        for(let i=0; i<qtde_elementos_selecao; i++) {
            elementos_selecao[i].checked = true;
        }
        //let qtde_elementos_selecao = document.querySelectorAll("input[type='checkbox']");        
        //console.log(qtde_elementos_selecao.length);
    }


    useEffect(() => {
        busca_dados_proposta_spot(props.id_proposta_spot);
    }, [])
    

    return (
        <div className='modal_proposta_gemea container shadow-lg bg-white rounded no-gutters m-0'>
            <div className='row modal_proposta_gemea-titulo'>
                <div className='col-6'>Sugestão de Proposta</div>
                <div className='col-3'>
                    <button onClick={() => selecionar_todos_campos()} name="selecionar_todos_campos" className='btn btn-primary btn-sm'>Selec. Todos Campos</button>
                </div>
                <div className='col'>
                    <button onClick={() => copiar_dados()} name="copiar_dados" className='btn btn-primary btn-sm'>Copiar</button>
                </div>
                <div className='col'>
                    <button onClick={handleFecharModal} name="fechar_modal" className='btn btn-outline-light btn-sm'> X </button>
                </div>
            </div>
            {dadosPropostaCarregada === true ? (
                <div className="class_body_proposta_gemea">
                    <div className="row class_bloco_cliente_proposta_gemea">
                        <div className="col">
                            <span className="class_proposta_gemea_titulo_proposta_comercial">Proposta Comercial de {impEXP}</span><br />
                            <span className="class_proposta_gemea_cliente">{nomeCliente}</span>
                        </div>
                    </div>
                    <div className="row class_bloco_proposta_gemea_rota">
                        <div className="col-3">
                            <span className="class_proposta_gemea_titulo_rota">Origem</span><br />
                            <span className="class_proposta_gemea_texto_rota">{origem}</span>
                        </div>
                        <div className="col-3" >
                            <span className="class_proposta_gemea_titulo_rota">Porto Embarque</span><br />
                            <span className="class_proposta_gemea_texto_rota">{portoEmbarque}</span>
                        </div>
                        <div className="col-3" >
                            <span className="class_proposta_gemea_titulo_rota">Porto Desembarque</span><br />
                            <span className="class_proposta_gemea_texto_rota">{portoDescarga}</span>
                        </div>
                        <div className="col-3" >
                            <span className="class_proposta_gemea_titulo_rota">Destino Final</span><br />
                            <span className="class_proposta_gemea_texto_rota">{destinoFinal}</span>
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-5 class_bloco_proposta_gemea" >
                            <span className="class_titulo_transit_time">Transit Time</span><br />
                            <span className="class_texto_transit_time">{textoTransitTime}</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="class_bloco_proposta_gemea_dados_carga">
                            <span className="class_proposta_gemea_titulo_rota">Qtde. Volumes</span><br />
                            <span className="class_proposta_gemea_texto_rota">{qtdeVolumes}</span>
                        </div>
                        <div className="class_bloco_proposta_gemea_dados_carga" >
                            <span className="class_proposta_gemea_titulo_rota">Peso Bruto (Kgs)</span><br />
                            <span className="class_proposta_gemea_texto_rota">{peso}</span>
                        </div>
                        <div className="class_bloco_proposta_gemea_dados_carga" >
                            <span className="class_proposta_gemea_titulo_rota">Cubagem (CBM)</span><br />
                            <span className="class_proposta_gemea_texto_rota">{cubagem}</span>
                        </div>
                        <div className="class_bloco_proposta_gemea_dados_carga" >
                            <span className="class_proposta_gemea_titulo_rota">Incoterm <input type="checkbox" name="copiar_incoterm" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" id="copiar_incoterm" value={"S"} /></span>
                            <br />
                            <span className="class_proposta_gemea_texto_rota">{incoterm}</span>
                        </div>
                        <div className="class_bloco_proposta_gemea_dados_carga" >
                            <span className="class_proposta_gemea_titulo_rota">Mod. de Frete</span><br />
                            <span className="class_proposta_gemea_texto_rota">{ppccFrete}</span>
                        </div>
                        <div className="class_bloco_proposta_gemea_dados_carga" >
                            <span className="class_proposta_gemea_titulo_rota">Carga Empilhável <input type="checkbox" name="copiar_carga_empilhavel" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" value={"S"} /></span>
                            <br />
                            <span className="class_proposta_gemea_texto_rota">{empilhavel}</span>
                        </div>
                        <div className="class_bloco_proposta_gemea_dados_carga" >
                            <span className="class_proposta_gemea_titulo_rota">Carga IMO</span><br />
                            <span className="class_proposta_gemea_texto_rota">{cargaIMO}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="class_bloco_proposta_gemea_mercadoria" >
                            <span className="class_titulo_mercadoria">Mercadoria: </span>{mercadoria}<br />
                            {listaCargaImo.length > 0 && (
                                <Fragment>
                                    <table className="class_table_pickup">
                                        <thead>
                                            <tr>
                                                <td width="8%" className="class_titulo_imo">
                                                    <input type="checkbox" name="selecionar_todos_imo" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" onClick={(e) => selecionar_todos_objetos(e, "chk_copiar_imo")} />
                                                </td>
                                                <td width="20%" className="class_titulo_imo">Carreg. Direto</td>
                                                <td width="32%" className="class_titulo_imo">Classe IMO</td>
                                                <td width="20%" className="class_titulo_imo">UN</td>
                                                <td width="20%" className="class_titulo_imo">Packing Group</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listaCargaImo.map((item, contador)=>(
                                                <tr key={contador}>
                                                    <td width="8%" className="class_texto_imo">
                                                        <input type="checkbox" value={item.classe_imo_value} name="chk_copiar_imo" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" onClick={(e) => verificar_todos_objetos(e, "chk_copiar_imo", "selecionar_todos_imo")} />
                                                    </td>
                                                    <td width="20%" className="class_texto_imo">{item.carregamento_direto}</td>
                                                    <td width="32%" className="class_texto_imo">{item.classe_imo_value}</td>
                                                    <td width="20%" className="class_texto_imo">{item.un_imo}</td>
                                                    <td width="20%" className="class_texto_imo">{item.packing_group}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Fragment>
                            )}
                        </div>
                        {(listaPickus.length > 0 || listaDoorDelivery.length > 0) && (
                            <div className="class_bloco_proposta_gemea_pickup" >
                                {listaPickus.length > 0 && (
                                    <Fragment>
                                        <table className="class_table_pickup">
                                            <thead>
                                                <tr>
                                                    <td width="8.33%" className="class_titulo_pickup">
                                                        <input type="checkbox" name="selecionar_todos_pickup" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" onClick={(e) => selecionar_todos_objetos(e, "chk_copiar_pickup")} />
                                                    </td>
                                                    <td width="67.33%" className="class_titulo_pickup">Pickup</td>
                                                    <td width="24.33%" className="class_titulo_pickup">Valor</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listaPickus.length > 0 && (
                                                    listaPickus.map((item, contador) => (
                                                        <tr key={contador}>
                                                            <td className="class_texto_pickup">
                                                                <input type="checkbox" name="chk_copiar_pickup" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" onClick={(e) => verificar_todos_objetos(e, "chk_copiar_pickup", "selecionar_todos_pickup")} value={item.endereco_pickup} />
                                                            </td>
                                                            <td className="class_texto_pickup">{item.endereco_pickup}</td>
                                                            <td className="class_texto_pickup">{item.moeda_pickup + " " + item.valor_venda_pickup + " " + item.unidade_pickup}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                        <br />
                                    </Fragment>
                                )}
                                {listaDoorDelivery.length > 0 && (
                                    <table className="class_table_pickup">
                                        <thead>
                                            <tr>
                                                <td width="8.33%" className="class_titulo_pickup"><input type="checkbox" onClick={(e) => selecionar_todos_objetos(e, "chk_copiar_door_delivery")} objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" name="selecionar_todos_door_delivery" /></td>
                                                <td width="67.33%" className="class_titulo_pickup">Door Delivery</td>
                                                <td width="24.33%" className="class_titulo_pickup">Valor</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listaDoorDelivery.length > 0 && (
                                                listaDoorDelivery.map((item, contador) => (
                                                    <tr key={contador}>
                                                        <td className="class_texto_pickup">
                                                            <input type="checkbox" name="chk_copiar_door_delivery" onClick={(e) => verificar_todos_objetos(e, "chk_copiar_door_delivery", "selecionar_todos_door_delivery")}  value={item.endereco_door_delivery} objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" />
                                                        </td>
                                                        <td className="class_texto_pickup">{item.endereco_door_delivery}</td>
                                                        <td className="class_texto_pickup">{item.moeda_door_delivery + " " + item.valor_venda_door_delivery + " " + item.unidade_door_delivery}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                )}

                            </div>
                        )}
                    </div>
                    {(observacaoInterna !== "" || observacaoCliente !== "") && (
                        <div className="row">
                            {observacaoInterna !== "" && (
                                <div className="class_bloco_proposta_observacao">
                                    <span className="class_proposta_gemea_titulo_rota">Observação Interna <input type="checkbox" name="copiar_observacao_interna" id="copiar_observacao_interna" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" /></span><br />
                                    <span className="class_proposta_gemea_dados_observacao">{observacaoInterna}</span>
                                </div>
                            )}
                            {observacaoCliente !== "" && (
                                <div className="class_bloco_proposta_observacao">
                                    <span className="class_proposta_gemea_titulo_rota">Observação Cliente <input type="checkbox" name="copiar_observacao_cliente" id="copiar_observacao_cliente" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" /></span><br />
                                    <span className="class_proposta_gemea_dados_observacao">{observacaoCliente}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {listaTaxasOrigem.length > 0 && (
                        <div className="row class_bloco_proposta_gemea_taxas">
                            <div className="class_titulo_bloco_taxas">Custos de Origem</div>
                            <table>
                                <thead>
                                    <tr>
                                        <td className="class_proposta_gemeas_titulo_taxas">
                                            {selecionarTodasTaxasOrigem === true && (
                                                <input type="checkbox" onClick={(e) => selecionar_todos_objetos(e, "chk_taxa_origem")} name="chk_todas_taxas_origem" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" />
                                            )
                                            }
                                        </td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Taxa</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Tarifario</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Compra (min/max)</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Venda (min/max)</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Valor Total</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Modal.</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaTaxasOrigem.map((item, contador) => (
                                        <tr key={contador}>
                                            <td className="class_proposta_gemeas_texto_taxas">
                                                {((numeroPropostaRotaGemea !== "" && numeroPropostaRotaGemea !== null) || (props.numero_proposta_rota !== "" && props.numero_proposta_rota !== null)) ? (
                                                    ((item.taxa_adicional !== "0" && item.taxa_adicional !== 0) && (item.id_taxa != "1107" && item.id_taxa != 1107)) && (
                                                        <input type="checkbox" onClick={(e) => verificar_todos_objetos(e, "chk_taxa_origem", "chk_todas_taxas_origem")} name="chk_taxa_origem" value={item.id_taxa} objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" />
                                                    )
                                                ) : (
                                                    (item.id_taxa != "1107" && item.id_taxa != 1107) && (
                                                        <input type="checkbox" name="chk_taxa_origem" value={item.id_taxa} onClick={(e) => verificar_todos_objetos(e, "chk_taxa_origem", "chk_todas_taxas_origem")} objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" />
                                                    )
                                                )}

                                            </td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.taxa}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.valor_tarifario + " " + item.unidade}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.valor_compra + " (" + item.valor_compra_minimo + "/" + item.valor_compra_maximo + ")"}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.valor_venda} ({item.valor_venda_minimo}/{item.valor_venda_maximo})</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.moeda+" "+item.valor_calculado}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.ppcc}</td>
                                        </tr>
                                    )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {listaTaxasFrete.length > 0 && (
                        <div className="row class_bloco_proposta_gemea_taxas">
                            <div className="class_titulo_bloco_taxas">Fretes e Adicionais</div>
                            <table>
                                <thead>
                                    <tr>
                                        <td className="class_proposta_gemeas_titulo_taxas">
                                            {selecionarTodasTaxasFrete === true && (
                                                <input type="checkbox" onClick={(e) => selecionar_todos_objetos(e, "chk_taxa_frete")} name="chk_todas_taxas_frete" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" />
                                            )}
                                        </td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Taxa</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Tarifario</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Compra (min/max)</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Venda (min/max)</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Valor Total</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Modal.</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaTaxasFrete.map((item, contador) => (
                                        <tr key={contador}>
                                            <td className="class_proposta_gemeas_texto_taxas">
                                                {((numeroPropostaRotaGemea !== "" && numeroPropostaRotaGemea !== null) || (props.numero_proposta_rota !== "" && props.numero_proposta_rota !== null)) ? (
                                                    (item.taxa_adicional !== "0" && item.taxa_adicional !== 0) && (
                                                        <input type="checkbox" name="chk_taxa_frete" value={item.id_taxa} onClick={(e) => verificar_todos_objetos(e, "chk_taxa_frete", "chk_todas_taxas_frete")} objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" />
                                                    )
                                                ) : (
                                                    (item.id_taxa !== "14" && item.id_taxa !== 14 && item.id_taxa !== "1268" && item.id_taxa !== 1268) && (
                                                        <input type="checkbox" name="chk_taxa_frete" value={item.id_taxa} onClick={(e) => verificar_todos_objetos(e, "chk_taxa_frete", "chk_todas_taxas_frete")} objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" />
                                                    )                                                    
                                                )}
                                            </td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.taxa}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.valor_tarifario + " " + item.unidade}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.valor_compra + " (" + item.valor_compra_minimo + "/" + item.valor_compra_maximo + ")"}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.valor_venda} ({item.valor_venda_minimo}/{item.valor_venda_maximo})</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.moeda+" "+item.valor_calculado}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.ppcc}</td>
                                        </tr>
                                    )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {listaTaxasDestino.length > 0 && (
                        <div className="row class_bloco_proposta_gemea_taxas">
                            <div className="class_titulo_bloco_taxas">Custos de Destino</div>
                            <table>
                                <thead>
                                    <tr>
                                        <td className="class_proposta_gemeas_titulo_taxas">
                                            {selecionarTodasTaxasDestino === true && (
                                                <input type="checkbox" onClick={(e) => selecionar_todos_objetos(e, "chk_taxa_destino")} name="chk_todas_taxas_destino" objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" />
                                            )}
                                        </td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Taxa</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Tarifario</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Compra (min/max)</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Venda (min/max)</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Valor Total</td>
                                        <td className="class_proposta_gemeas_titulo_taxas">Modal.</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaTaxasDestino.map((item, contador) => (
                                        <tr key={contador}>
                                            <td className="class_proposta_gemeas_texto_taxas">
                                                {((numeroPropostaRotaGemea !== "" && numeroPropostaRotaGemea !== null) || (props.numero_proposta_rota !== "" && props.numero_proposta_rota !== null)) ? (
                                                    (item.taxa_adicional !== "0" && item.taxa_adicional !== 0) && (
                                                        <input type="checkbox" name="chk_taxa_destino" value={item.id_taxa} objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" />
                                                    )
                                                ) : (
                                                    (item.id_taxa !== "31" && item.id_taxa !== 31) && (
                                                        <input type="checkbox" name="chk_taxa_destino" value={item.id_taxa} objeto_selecao_proposta_gemea="objeto_selecao_proposta_gemea" />
                                                    )
                                                )}
                                            </td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.taxa}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.valor_tarifario + " " + item.unidade}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.valor_compra + " (" + item.valor_compra_minimo + "/" + item.valor_compra_maximo + ")"}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.valor_venda} ({item.valor_venda_minimo}/{item.valor_venda_maximo})</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.moeda+" "+item.valor_calculado}</td>
                                            <td className="class_proposta_gemeas_texto_taxas">{item.ppcc}</td>
                                        </tr>
                                    )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="class_loading">
                    <img src="https://allinkscoa.com.br/Imagens/carregando_dados.gif"></img>
                </div>
            )}

        </div>
    );
}