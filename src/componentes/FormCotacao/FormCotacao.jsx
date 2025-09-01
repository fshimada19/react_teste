import './FormCotacao.css';
import FormCotacaoHeader from '../FormCotacaoHeader/FormCotacaoHeader';
import FormCotacaoCliente from '../FormCotacaoCliente/FormCotacaoCliente';
import FormCotacaoCarga from '../FormCotacaoCarga/FormCotacaoCarga';
import { useEffect, useState } from 'react';
import FormCotacaoRota from '../FormCotacaoRota/FormCotacaoRota';
import FormCotacaoTaxas from '../FormCotacaoTaxas/FormCotacaoTaxas';
import ModalAnexarArquivo from './ModalAnexarArquivo/ModalAnexarArquivo';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import api from '../../api';
import Swal from 'sweetalert2'
import ModalPropostaGemea from '../SmartPanel/ModalPropostaGemea/ModalPropostaGemea';


export default function FormCotacao(props) {
    const [dadosSalvosCarregados, setDadosSalvosCarregados] = useState(false);
    const [processarDadosCotacao, setProcessarDadosCotacao] = useState(false);
    const [limparDados, setLimparDados] = useState(false);

    const [modo_alteracao, setModoAlteracao] = useState(props.modo_alteracao);
    const [alteracao_arquivos_anexos, setAlteracaoArquivosAnexos] = useState(false);
    const [processarTotais, setProcessarTotais] = useState(false);

    const [dadosCotacao, setDadosCotacao] = useState({
        "dados_cliente": "",
        "dados_header": {},
        "dados_rota": {},
        "dados_carga": {},
        "dados_taxas": {},
        "observacao_proposta": {
            "observacao_interna": "",
            "observacao": ""
        },
        "lista_anexos": {
            "lista_arquivos_interno": {},
            "lista_arquivos_externo": {},
        },
        "dados_usuario": {
            "id_usuario": props.id_usuario
        },
        "numero_proposta": "",
        "id_proposta": "",
        "data_validade_proposta": ""
    });
    const [desabilitarSalvar, setDesabilitarSalvar] = useState(false);
    const [clickSalvar, setClickSalvar] = useState(false);
    const [clickCalculadora, setClickCalculadora] = useState(false);
    const [idTarifarioSelecionado, setIdTarifarioSelecionado] = useState(0);
    const [numeroPropostaSelecinada, setNumeroPropostaSelecionada] = useState('');
    const [fretePPCCSelecionado, setFretePPCCSelecionado] = useState('');
    const [cargaImo, setCargaImo] = useState("N");
    const [pesoTotal, setPesoTotal] = useState(0.000);
    const [cubagemTotal, setCubagemTotal] = useState(0.000);
    const [listaDoorDelivery, setListaDoorDelivery] = useState([]);
    const [listaPickup, setListaPickup] = useState([]);
    const [listaCargasImo, setListaCargasImo] = useState([]);
    const [alteracaoItemCargaImo, setAlteracaoItemCargaImo] = useState(false);

    const [listaArquivosExternos, setListaArquivosExternos] = useState([]);
    const [listaArquivosInternos, setListaArquivosInternos] = useState([]);


    const [numeroProposta, setNumeroProposta] = useState(null);
    const [dataValidadeProposta,setDataValidadeProposta] = useState("");
    const [id_proposta, setIdProposta] = useState(null)
    const [token_proposta, setTokenProposta] = useState("");
    const [sentidoProposta, setSentidoProposta] = useState("");

    const [propostaDuplicada, setPropostaDuplicada] = useState("");

    const [mensagens_validacao, setMensagensValidacao] = useState({
        "mensagem_cliente_selecionado": "",
        "mensagem_contatos": "",
        "origem": "",
        "destino": "",
        "ppcc": "",
        "incoterm": "",
        "cubagem_total": "",
        "descricao_unica": "",
        "peso_item_carga": "",
        "cubagem_item_carga": "",
        "volume_item_carga": "",
        "largura_item_carga": "",
        "altura_item_carga": "",
        "descricao_item_carga": "",
        "taxas":""  
    });


    const [abrirModalAnexarArquivo, setAbrirModalAnexarArquivo] = useState(false);
    const [abrirModalPropostaGemea, setAbrirModalPropostaGemea] = useState(props.abrir_modal_proposta_gemea);

    const handleAbrirModalAnexarArquivo = () => {
        setAbrirModalAnexarArquivo(true);
    }

    const handleFecharModalAnexarArquivo = () => {
        setAbrirModalAnexarArquivo(false);
    }

    const handleAtualizaListaArquivosInternos = (listaArquivosInterno) => {
        setListaArquivosInternos(listaArquivosInterno);
        dadosCotacao.lista_anexos.lista_arquivos_interno = listaArquivosInterno;
    }

    const handleAtualizaListaArquivosExternos = (listaArquivosExterno) => {
        setListaArquivosExternos(listaArquivosExterno);
        dadosCotacao.lista_anexos.lista_arquivos_externo = listaArquivosExterno;
    }


    const handleClickSalvar = async (salvar) => {
        if (salvar === true) {
            let todas_validacoes_campos = true;
            let nova_lista_itens_carga = new Array();
            let contador_item_carga = 0;
            for(let i=0;i<dadosCotacao["dados_carga"].lista_itens_cargas.length;i++) {
                if(dadosCotacao["dados_carga"].lista_itens_cargas[i]) {
                    nova_lista_itens_carga[contador_item_carga] = dadosCotacao["dados_carga"].lista_itens_cargas[i];
                    contador_item_carga++;                
                } 
            }
            dadosCotacao["dados_carga"].lista_itens_cargas = nova_lista_itens_carga;
            
            if (dadosCotacao["dados_cliente"] === "" || dadosCotacao["dados_cliente"]["id_cliente"] === "") {
                setMensagensValidacao(values => ({ ...values, ["mensagem_contatos"]: 'Selecione um contato' }));
                setMensagensValidacao(values => ({ ...values, ["mensagem_cliente_selecionado"]: 'Selecione um Cliente' }));
                todas_validacoes_campos = false;
            } else {
                setMensagensValidacao(values => ({ ...values, ["mensagem_cliente_selecionado"]: '' }));
            }

            /*
            if (dadosCotacao["dados_cliente"] != "") {
                if (dadosCotacao["dados_cliente"]["contatos_cliente"].length === 0) {
                    setMensagensValidacao(values => ({ ...values, ["mensagem_contatos"]: 'Selecione um contato' }));
                    todas_validacoes_campos = false;
                } else {
                    setMensagensValidacao(values => ({ ...values, ["mensagem_contatos"]: '' }));
                }
            }
            */
           
            if (!dadosCotacao["dados_rota"].origem) {
                setMensagensValidacao(values => ({ ...values, ["origem"]: 'Preencha com a Origem' }));
                todas_validacoes_campos = false;
            } else {
                setMensagensValidacao(values => ({ ...values, ["origem"]: '' }));
            }

            if (!dadosCotacao["dados_rota"].destino) {
                setMensagensValidacao(values => ({ ...values, ["destino"]: 'Preencha com o Destino' }));
                todas_validacoes_campos = false;
            } else {
                setMensagensValidacao(values => ({ ...values, ["destino"]: '' }));
            }

            if ((!dadosCotacao["dados_rota"].pp) && (!dadosCotacao["dados_rota"].cc)) {
                setMensagensValidacao(values => ({ ...values, ["ppcc"]: 'Selecione a modalidade de frete.' }));
                todas_validacoes_campos = false;
            } else {
                if (dadosCotacao["dados_rota"].pp === 0 && dadosCotacao["dados_rota"].cc === 0) {
                    setMensagensValidacao(values => ({ ...values, ["ppcc"]: 'Selecione a modalidade de frete.' }));
                    todas_validacoes_campos = false;
                } else {
                    setMensagensValidacao(values => ({ ...values, ["ppcc"]: '' }));
                }
            }

            if ((!dadosCotacao["dados_rota"].incoterm)) {
                setMensagensValidacao(values => ({ ...values, ["incoterm"]: 'Selecione o Incoterm.' }));
                todas_validacoes_campos = false;
            } else {
                if (dadosCotacao["dados_rota"].incoterm === "") {
                    setMensagensValidacao(values => ({ ...values, ["incoterm"]: 'Selecione a modalidade de frete.' }));
                } else {
                    setMensagensValidacao(values => ({ ...values, ["incoterm"]: '' }));
                }
            }

            let descricao_unica_marcado = dadosCotacao["dados_carga"].descricao_unica_marcado;
            let qtde_elementos_pickup = dadosCotacao["dados_carga"].lista_pickup.length;
            let qtde_elementos_door_delivery = dadosCotacao["dados_carga"].lista_door_delivery.length;
            let qtde_elementos_imo = dadosCotacao["dados_carga"].lista_carga_imo.length;

            let remover_pickups_itens_carga = true;
            if(qtde_elementos_pickup > 0) {
                remover_pickups_itens_carga = false;
                let pickup_incluso = 1;
                let pickup_encontrado = 1;
                for(let i=0;i<qtde_elementos_pickup;i++) {
                    let endereco_pickup_lista = dadosCotacao["dados_carga"].lista_pickup[i].endereco_pickup;
                    let pickup_selecionado_encontrado = dadosCotacao["dados_carga"].lista_itens_cargas.find(({ pickupSelecionado }) => pickupSelecionado === endereco_pickup_lista);
                    if(!pickup_selecionado_encontrado) {
                        pickup_encontrado = 0;
                    } else {
                        if(pickup_selecionado_encontrado.pickup_incluso === false) {
                            pickup_incluso = 0;
                        }
                    }                    
                }
                if(pickup_encontrado === 0) {
                    todas_validacoes_campos = false;
                    Swal.fire({
                        title: "Existem Pickups não vinculados ao Item de Carga.",
                        text: "Caso não utilize o Pickup por favor exclua o registro." ,
                        icon: "error"
                    });    
                } else {
                    if(pickup_incluso === 0) {
                        let taxa_pickup_encontrado = dadosCotacao.dados_taxas.taxas_origem.find((dados_taxa)=> dados_taxa.id_taxa === "1107");
                        if(!taxa_pickup_encontrado) {
                            taxa_pickup_encontrado = dadosCotacao.dados_taxas.taxas_origem.find((dados_taxa)=> dados_taxa.id_taxa === 1107);
                            if(!taxa_pickup_encontrado) {
                                todas_validacoes_campos = false;
                                Swal.fire({
                                    title: "Taxa de Pickup não esta nas lista de taxas para Salvar.",
                                    text: "Por favor exclua o Pickup e inclua novamente para carregar a taxa." ,
                                    icon: "error"
                                });            
                            }
                        }    
                    }
                }                
            }

            let remover_door_delivery_itens_carga = true;
            if(qtde_elementos_door_delivery > 0) {
                remover_door_delivery_itens_carga = false;

                let door_delivery_encontrado = 1;
                let door_delivery_incluso = 1;
                for(let i=0;i<qtde_elementos_door_delivery;i++) {
                    let endereco_door_delivery_lista = dadosCotacao["dados_carga"].lista_door_delivery[i].endereco_door_delivery;
                    let door_delivery_selecionado_encontrado = dadosCotacao["dados_carga"].lista_itens_cargas.find(({ doorDeliverySelecionado }) => doorDeliverySelecionado === endereco_door_delivery_lista);
                    if(!door_delivery_selecionado_encontrado) {
                        door_delivery_encontrado = 0;
                    } else {
                        if(door_delivery_selecionado_encontrado.door_delivery_incluso === false) {
                            door_delivery_incluso = 0;
                        }
                    }                    
                }
                if(door_delivery_encontrado === 0) {
                    todas_validacoes_campos = false;
                    Swal.fire({
                        title: "Existem Door Delivery(s) não vinculados ao Item de Carga.",
                        text: "Caso não utilize o Door Delivery por favor exclua o registro." ,
                        icon: "error"
                    });    
                } else {
                    if(door_delivery_incluso === 0) {
                        let taxa_door_delivery_encontrado = dadosCotacao.dados_taxas.taxas_destino.find((dados_taxa)=> dados_taxa.id_taxa === "31") 
                        if(!taxa_door_delivery_encontrado) {
                            taxa_door_delivery_encontrado = dadosCotacao.dados_taxas.taxas_destino.find((dados_taxa)=> dados_taxa.id_taxa === 31)
                            if(!taxa_door_delivery_encontrado) {
                                todas_validacoes_campos = false;
                                Swal.fire({
                                    title: "Taxa de Door Delivery não esta nas lista de taxas para Salvar.",
                                    text: "Por favor exclua o Pickup e inclua novamente para carregar a taxa." ,
                                    icon: "error"
                                });    
                            } 
                        }    
                    }
                }
            }



            /*            
            // Verificacao Imos
            let remover_imos_itens_carga = true;
            if(qtde_elementos_imo > 0) {
                
                remover_imos_itens_carga = false;

                let imo_encontrado = 1;
                for(let i=0;i<qtde_elementos_imo;i++) {
                    let classe_imo = dadosCotacao["dados_carga"].lista_carga_imo[i].classe_imo_value;
                    let carregamento_direto = dadosCotacao["dados_carga"].lista_carga_imo[i].carregamento_direto;
                    let un_imo = dadosCotacao["dados_carga"].lista_carga_imo[i].un_imo;
                    let packing_group_imo = dadosCotacao["dados_carga"].lista_carga_imo[i].packing_group;
                    let dados_imo_busca = classe_imo+"|"+carregamento_direto+"|"+un_imo+"|"+packing_group_imo;
                    
                    let imo_selecionado_encontrado = dadosCotacao["dados_carga"].lista_itens_cargas.find(({ imoSelecionado }) => imoSelecionado === dados_imo_busca);
                    if(!imo_selecionado_encontrado) {
                        imo_encontrado = 0;
                    }                    
                }
                if(imo_encontrado === 0) {
                    todas_validacoes_campos = false;
                    Swal.fire({
                        title: "Existem IMOS não vinculados ao Item de Carga.",
                        text: "Caso não utilize o Imo por favor exclua o registro." ,
                        icon: "error"
                    });    
                }                                
            }
            */
           
            for (let z = 0; z < dadosCotacao["dados_carga"].lista_itens_cargas.length; z++) {

                if(remover_pickups_itens_carga === true) {
                    if(dadosCotacao["dados_carga"].lista_itens_cargas[z].pickupSelecionado !== "") {
                        dadosCotacao["dados_carga"].lista_itens_cargas[z].pickupSelecionado = "";
                    }
                }
                
                if(remover_door_delivery_itens_carga === true) {
                    if(dadosCotacao["dados_carga"].lista_itens_cargas[z].doorDeliverySelecionado !== "") {
                        dadosCotacao["dados_carga"].lista_itens_cargas[z].doorDeliverySelecionado = "";
                    }
                }                
                if(dadosCotacao["dados_carga"].peso_total_editavel_selecionado === 0 || dadosCotacao["dados_carga"].peso_total_editavel_selecionado === "0") {
                    if (dadosCotacao["dados_carga"].lista_itens_cargas[z].peso === "") {
                        setMensagensValidacao(values => ({ ...values, ["peso_item_carga"]: 'Preencha o Peso.' }));
                        todas_validacoes_campos = false;
                    } else {
                        setMensagensValidacao(values => ({ ...values, ["peso_item_carga"]: '' }));
                    }    
                }

                if (dadosCotacao["dados_carga"].lista_itens_cargas[z].cubagem === "") {
                    setMensagensValidacao(values => ({ ...values, ["cubagem_item_carga"]: 'Preencha a Cubagem.' }));
                    todas_validacoes_campos = false;
                } else {
                    setMensagensValidacao(values => ({ ...values, ["cubagem_item_carga"]: '' }));
                }

                if (dadosCotacao["dados_carga"].lista_itens_cargas[z].volume === "") {
                    setMensagensValidacao(values => ({ ...values, ["volume_item_carga"]: 'Preencha o Volume.' }));
                    todas_validacoes_campos = false;
                } else {
                    setMensagensValidacao(values => ({ ...values, ["volume_item_carga"]: '' }));
                }

                if(descricao_unica_marcado !== 1) {
                    if (dadosCotacao["dados_carga"].lista_itens_cargas[z].descricao === "") {
                        setMensagensValidacao(values => ({ ...values, ["descricao_item_carga"]: 'Selecione uma Descrição.' }));
                        todas_validacoes_campos = false;
                    } else {
                        setMensagensValidacao(values => ({ ...values, ["descricao_item_carga"]: '' }));
                    }    
                }
            }

            if(descricao_unica_marcado === 1) {
                if(dadosCotacao["dados_carga"].descricao_unica === "") {
                    setMensagensValidacao(values => ({ ...values, ["descricao_unica"]: 'Por favor preencha a Descrição' }));
                    todas_validacoes_campos = false;
                }                
            }
            if(dadosCotacao.dados_taxas.taxas_destino.length === 0 && dadosCotacao.dados_taxas.taxas_origem.length === 0 && dadosCotacao.dados_taxas.taxas_frete.length === 0) {
                todas_validacoes_campos = false;
                Swal.fire({
                    title: "Taxas Não adicionadas para Salvar a Proposta !",
                    text: "Adicione uma taxa" ,
                    icon: "error"
                });           
            }

            if(dadosCotacao.dados_taxas.taxas_origem.length > 0) {
                if(dadosCotacao.dados_taxas.taxas_frete.length > 0) {
                    for(let i=0;i<dadosCotacao.dados_taxas.taxas_origem.length;i++) {
                        let id_taxa_origem = dadosCotacao.dados_taxas.taxas_origem[i].id_taxa;
                        let id_taxa_encontrada = dadosCotacao.dados_taxas.taxas_frete.find(( dados_taxa_frete ) => dados_taxa_frete.id_taxa === id_taxa_origem);                        
                        if(id_taxa_encontrada) {
                            todas_validacoes_campos = false;
                            Swal.fire({
                                title: "Existem taxas Duplicadas na Proposta Por favor verificar.",
                                text: "Taxas Duplicadas" ,
                                icon: "error"
                            });            
                        }
                    }   
                }                
            }

            if(dadosCotacao.dados_taxas.taxas_destino.length > 0) {
                if(dadosCotacao.dados_taxas.taxas_frete.length > 0) {
                    for(let i=0;i<dadosCotacao.dados_taxas.taxas_destino.length;i++) {
                        let id_taxa_destino = dadosCotacao.dados_taxas.taxas_destino[i].id_taxa;
                        let id_taxa_encontrada = dadosCotacao.dados_taxas.taxas_frete.find(( dados_taxa_frete ) => dados_taxa_frete.id_taxa === id_taxa_destino);
                        if(id_taxa_encontrada) {
                            todas_validacoes_campos = false;
                            Swal.fire({
                                title: "Existem taxas Duplicadas na Proposta Por favor verificar.",
                                text: "Taxas Duplicadas" ,
                                icon: "error"
                            });            
                        }
                    }   
                }                
            }

            if (todas_validacoes_campos === true) {
                if (modo_alteracao !== true) {
                    Swal.fire({
                        title: "Salvando Dados !",
                        text: "Por favor Aguarde",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });

                    let resultado = await api.post("https://allinkscoa.com.br"+props.apiDados+"salvarProposta.php",
                        dadosCotacao
                    ).then((response) => {
                        return response.data
                    }).catch((err) => {
                        console.error("Ocorreu um erro" + err);
                    });

                    if (resultado.numero_proposta) {
                        Swal.close();
                        setNumeroProposta(resultado.numero_proposta);
                        setIdProposta(resultado.id_proposta);
                        dadosCotacao.id_proposta = resultado.id_proposta;
                        setDataValidadeProposta(resultado.data_validade);
                        setTokenProposta(resultado.token_proposta);
                        setModoAlteracao(true);
                        setSentidoProposta(resultado.sentido_proposta);
                        props.numero_proposta_salva(resultado.numero_proposta);    
                    } else {
                        Swal.close();
                        Swal.fire({
                            title: "Ocorreu um erro !",
                            text: resultado.msg ,
                            icon: "error"
                        });                        
                    }
                } else {
                    Swal.fire({
                        title: "Salvando Dados !",
                        text: "Por favor Aguarde",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });


                    let resultado = await api.post("https://allinkscoa.com.br"+props.apiDados+"salvarAlteracaoProposta.php",
                        dadosCotacao
                    ).then((response) => {
                        return response.data
                    }).catch((err) => {
                        console.error("Ocorreu um erro" + err);
                    });

                    if (resultado.numero_proposta) {
                        props.numero_proposta_salva(resultado.numero_proposta);
                        setPropostaDuplicada("N");
                        Swal.close();
                    } else {
                        Swal.fire({
                            title: "Ocorreu um erro ao salvar a proposta !",
                            text: resultado.msg ,
                            icon: "error"
                        });                        
                    }
                }
                //setLimparDados(true);                
            }
        }
    }

    const urlApis = "https://allinkscoa.com.br";

    const [idClienteSelecionado, setIdClienteSelecionado] = useState(0);

    const handleIdClienteSelecionado = (idClienteSelecionado) => {
        setIdClienteSelecionado(idClienteSelecionado);
    }

    const dadosTarfariosProposta = { "id_tarifario": "", "numero_proposta": "" }
    const [buscaTaxasTarifario,setBuscaTaxasTarifario] = useState(false);

    const handleDadosRotaSelecionada = (id_tarifario, numero_proposta, fretePPCC) => {
        setIdTarifarioSelecionado(id_tarifario);
        setNumeroPropostaSelecionada(numero_proposta);
        setFretePPCCSelecionado(fretePPCC);
        setBuscaTaxasTarifario(true);
        /*dadosTarfariosProposta.id_tarifario = id_tarifario;
        dadosTarfariosProposta.numero_proposta = numero_proposta;
        */
    }

    const handleAlterarStatusBuscarTarifario = (buscarTaxasTarifario) => {
        setBuscaTaxasTarifario(buscarTaxasTarifario);
    }

    const handleCargaImo = (cargaImo) => {
        setCargaImo(cargaImo);
    }

    const handlePesoTotal = (valorPesoTotal) => {
        setPesoTotal(valorPesoTotal);
    }

    const handleCubagemTotal = (valorCubagemTotal) => {
        setCubagemTotal(valorCubagemTotal);
    }

    const handleListaPickup = (listaPickup) => {
        setListaPickup(listaPickup);
    }

    const handleListaDoorDelivery = (listaDoorDelivery) => {
        setListaDoorDelivery(listaDoorDelivery);
    }

    const handleListaCargasImo = (carga_imo, listaCargasImo) => {
        setListaCargasImo(listaCargasImo);
        setCargaImo(carga_imo);
    }

    const [verificarTaxaCarregamentoDiretoImo, setVerificarTaxaCarregamentoDiretoImo] = useState(false);

    const handleAlteracaoItemCargaImo = (alteracaoCargaImo) => {
        setAlteracaoItemCargaImo(alteracaoCargaImo);
        setVerificarTaxaCarregamentoDiretoImo(true);
    }

    const handleVerificarTaxaCarregamentoDireto = (status) => {
        setVerificarTaxaCarregamentoDiretoImo(status);
    }



    const [calcularPickups, setCalcularPickups] = useState(false);
    const handleCalcularPickups = (calcular_pickups) => {
        setCalcularPickups(calcular_pickups);
    }

    const handleClickCalculadora = (clickCalculadora) => {
        setClickCalculadora(clickCalculadora);
    }

    const handleHabilitarSalvar = (habilitar_salvar) => {
        setDesabilitarSalvar(habilitar_salvar);
    }

    const handleSalvarAnexos = (lista_anexos_internos, lista_anexos_externos) => {
        setListaArquivosInternos(lista_anexos_internos);
        setListaArquivosExternos(lista_anexos_externos);
    }

    const handleDadosCliente = (dados_cliente) => {
        dadosCotacao.dados_cliente = dados_cliente;
        if (props.id_cotacao !== null) {
            dadosCotacao.id_proposta = props.id_cotacao;
        } else if (id_proposta !== null) {
            dadosCotacao.id_proposta = id_proposta;
        }
    }

    const handleDadosCarga = (dados_carga) => {
        dadosCotacao.dados_carga = dados_carga;
        if (props.id_cotacao !== null) {
            dadosCotacao.id_proposta = props.id_cotacao;
        } else if (id_proposta !== null) {
            dadosCotacao.id_proposta = id_proposta;
        }
        props.busca_proposta_gemea(dadosCotacao);
    }

    const [alterarStatusProcessarRota, setAlterarStatusProcessarRota] = useState(false);
    const handleAlterarStatusProcessar = () => {
        setAlterarStatusProcessarRota(false);
    }

    const handleDadosRota = (dados_rota) => {
        dadosCotacao.dados_rota = dados_rota;
        if (props.id_cotacao !== null) {
            dadosCotacao.id_proposta = props.id_cotacao;
        } else if (id_proposta !== null) {
            dadosCotacao.id_proposta = id_proposta;
        }

        props.busca_proposta_gemea(dadosCotacao);

        if(dadosCotacao.dados_rota.id_tarifario === 0 || dadosCotacao.dados_rota.id_tarifario === "0") {
            setDesabilitarSalvar(true);
        } else {
            setDesabilitarSalvar(false);
        }
        setAlterarStatusProcessarRota(true);
    }

    const handleDadosTaxas = (dados_taxas) => {
        dadosCotacao.dados_taxas = dados_taxas;
        if (props.id_cotacao !== null) {
            dadosCotacao.id_proposta = props.id_cotacao;
        } else if (id_proposta !== null) {
            dadosCotacao.id_proposta = id_proposta;
        }

        setDadosTaxasCotacao(dados_taxas);
        setProcessarTotais(true);
    }

    const [observacaoInterna, setObservacaoInterna] = useState("");
    const handleDadosObservacaoInterna = (valor) => {
        dadosCotacao.observacao_proposta.observacao_interna = valor.target.value;
        setObservacaoInterna(valor.target.value);
        if (props.id_cotacao !== null) {
            dadosCotacao.id_proposta = props.id_cotacao;
        } else if (id_proposta !== null) {
            dadosCotacao.id_proposta = id_proposta;
        }
    }

    const [observacaoCliente, setObservacaoCliente] = useState("");
    const handleObsCliente = (valor) => {
        dadosCotacao.observacao_proposta.observacao = valor.target.value;
        setObservacaoCliente(valor.target.value);
        if (props.id_cotacao !== null) {
            dadosCotacao.id_proposta = props.id_cotacao;
        } else if (id_proposta !== null) {
            dadosCotacao.id_proposta = id_proposta;
        }
    }

    const handleDadosHeader = (dados_header) => {
        dadosCotacao.dados_header = dados_header;
        if (props.id_cotacao !== null) {
            dadosCotacao.id_proposta = props.id_cotacao;
        } else if (id_proposta !== null) {
            dadosCotacao.id_proposta = id_proposta;
        }
    }

    const handleDataValidadeProposta = (dataValidade) => {
        setDataValidadeProposta(dataValidade);
    }

    const handleCamposLimpos = () => {
        setLimparDados(false);
    }

    useEffect(() => {
        if (props.dados_proposta !== null) {
            if (dadosSalvosCarregados === false) {
                setListaArquivosExternos(props.dados_proposta.lista_anexos.lista_arquivos_externo);
                setListaArquivosInternos(props.dados_proposta.lista_anexos.lista_arquivos_interno);

                dadosCotacao.lista_anexos.lista_arquivos_interno = props.dados_proposta.lista_anexos.lista_arquivos_interno;
                dadosCotacao.lista_anexos.lista_arquivos_externo = props.dados_proposta.lista_anexos.lista_arquivos_externo;

                dadosCotacao.observacao_proposta.observacao_interna = props.dados_proposta.observacao_proposta.observacao_interna;
                dadosCotacao.observacao_proposta.observacao = props.dados_proposta.observacao_proposta.observacao;
                setObservacaoInterna(props.dados_proposta.observacao_proposta.observacao_interna);
                setObservacaoCliente(props.dados_proposta.observacao_proposta.observacao);

                setDadosSalvosCarregados(true);
            }

        }
    }, [props.dados_proposta])

    useEffect(() => {
        setAbrirModalPropostaGemea(props.abrir_modal_proposta_gemea);
    },[props.abrir_modal_proposta_gemea])

    const [dadosTaxasCotacao, setDadosTaxasCotacao] = useState(null)

    const handleProcessarTotais = (processarTotais) => {
        setProcessarTotais(processarTotais);
    }

    const [bloqueioImo, setbloqueioImo] = useState(false);
    const handleBloqueioImo = (status_bloqueio_imo) => {
        setbloqueioImo(status_bloqueio_imo);
    }

    const [recarregarTaxas, setRecarregarTaxas] = useState(false);
    const handleRecarregarTaxas = (recarregar_taxas) => {
        setRecarregarTaxas(recarregar_taxas);
    }

    const handleFecharModalPropostaGemea = () => {
        props.fechar_modal_proposta_gemea();
    }


    const [checkMarcacaoPickupPickupPropostaGemea, setCheckMarcacaoPickupPickupPropostaGemea] = useState(false);
    const handleCheckMarcacaoPickupPropostaGemea = (status) => {
        setCheckMarcacaoPickupPickupPropostaGemea(status);
    }

    const [marcarPickupPropostaGemea, setMarcarPickupPropostaGemea] = useState(false);


    const [marcarDoorDeliveryPropostaGemea,setMarcarDoorDeliveryPropostaGemea] = useState(false);
    const [marcarImoPropostaGemea, setMarcarImoPropostaGemea] = useState(false);
    const [marcarItensNaoEmpilhaveisPropostaGemea, setMarcarItensNaoEmpilhaveisPropostaGemea] = useState(false);

    const [checkItensNaoEmpilhaveis, setCheckItensNaoEmpilhaveis] = useState(false);
    const handleVerificacaoCheckItensNaoEmpilhaveis = (status_check) => {
        setCheckItensNaoEmpilhaveis(status_check);
    } 

    const handleMarcarObjetoPropostaGemea = (objeto, marcacao) => {
        if(objeto === "pickup") {
            setMarcarPickupPropostaGemea(marcacao);
            setCheckMarcacaoPickupPickupPropostaGemea(marcacao);
        }
        
        if(objeto === "door_delivery") {
            setMarcarDoorDeliveryPropostaGemea(marcacao);
        }

        if(objeto === "imo") {
            setMarcarImoPropostaGemea(marcacao);
        }

        if(objeto === "itens_nao_empilhaveis") {
            setMarcarItensNaoEmpilhaveisPropostaGemea(marcacao);
            setCheckItensNaoEmpilhaveis(true);
        }
    }

    const [checkIncotermPropostaGemea, setCheckIncotermPropostaGemea] = useState(false);
    const handleCheckPropostaGemea = (status) => {
        setCheckIncotermPropostaGemea(status)
    }

    const [incotermPropostaGemea,setIncotermPropostaGemea] = useState("");
    const handleDefinirIncotermPropostaGemea = (incoterm) => {
        setIncotermPropostaGemea(incoterm);
        setCheckIncotermPropostaGemea(true);
    }

    const handleObservacaoInternaPropostaGemea = (dados_observacao) => {
        let dados_observacao_interna = "";
        if(observacaoInterna !== "") {
            dados_observacao_interna = observacaoInterna+"\n"+dados_observacao;
        } else {
            dados_observacao_interna = dados_observacao;
        }
        dadosCotacao.observacao_proposta.observacao_interna = dados_observacao_interna;
        setObservacaoInterna(dados_observacao_interna);
    }

    const handleObservacaoClientePropostaGemea = (dados_observacao) => {
        let dados_observacao_cliente = "";
        if(observacaoCliente !== "") {
            dados_observacao_cliente = observacaoCliente+"\n"+dados_observacao;
        } else {
            dados_observacao_cliente = dados_observacao;
        }

        dadosCotacao.observacao_proposta.observacao = dados_observacao_cliente;       
        setObservacaoCliente(dados_observacao_cliente);
    }
    
    const [DadosTaxasPropostaGemea, setDadosPropostaGemea] = useState("");
    const [atualizarTaxasPropostaGemea,setAtualizarTaxaPropostaGemea] = useState(false);
    const handleDadosRetornoCopiaPropostaGemea = (dados_taxas) => {
        setDadosPropostaGemea(dados_taxas);
        setAtualizarTaxaPropostaGemea(true);
    }

    const handleAtualizarTaxasPropostaGemea = (status) => {
        setAtualizarTaxaPropostaGemea(status);
    }
    return (
        <div className="col col-9">
            <FormCotacaoHeader
                apiDados={props.apiDados}
                urlServer={props.urlServer}
                clickCalculadora={handleClickCalculadora}
                clickSalvar={handleClickSalvar}
                desabilitarSalvar={desabilitarSalvar}
                abrirModalAnexo={handleAbrirModalAnexarArquivo}
                nome_usuario={props.nome_usuario}
                dados_header={handleDadosHeader}
                modo_alteracao={modo_alteracao}
                token_proposta={token_proposta}
                sentido_proposta={sentidoProposta}
                indicacao_proposta_duplicada={propostaDuplicada}

                dados_proposta_salva={props.dados_proposta !== null ? props.dados_proposta : null}
                id_item_proposta={id_proposta}
                numeroProposta={numeroProposta === null ? props.numero_proposta : numeroProposta}
                dataValidadeProposta={dataValidadeProposta}

                processar_totais={processarTotais}
                handle_processar_totais={handleProcessarTotais}
                id_usuario_logado={props.id_usuario}

                dados_taxas={dadosTaxasCotacao !== null ? dadosTaxasCotacao : null}
            />
            <div className='class_corpo_cotacao'>
                <FormCotacaoCliente
                    apiDados={props.apiDados}
                    urlServer={props.urlServer}
                    dadosCliente={handleDadosCliente}
                    idClienteSelecionado={handleIdClienteSelecionado}
                    urlApis={urlApis}
                    mensagens_validacao={mensagens_validacao}
                    limpar_dados={limparDados}
                    campos_limpos={handleCamposLimpos}
                    modo_alteracao={modo_alteracao}
                    dados_proposta_salva={props.dados_proposta !== null ? props.dados_proposta : null}
                />
                <FormCotacaoRota
                    apiDados={props.apiDados}
                    urlServer={props.urlServer}
                    dadosRotaSelecionada={handleDadosRotaSelecionada}
                    idClienteSelecionado={idClienteSelecionado}
                    listaCargaImo={listaCargasImo}
                    cargaImo={cargaImo}
                    urlApis={urlApis}
                    dados_rota={handleDadosRota}
                    mensagens_validacao={mensagens_validacao}
                    limpar_dados={limparDados}
                    campos_limpos={handleCamposLimpos}
                    modo_alteracao={modo_alteracao}
                    dados_proposta_salva={props.dados_proposta !== null ? props.dados_proposta : null}
                    alterarStatusProcessarRota={alterarStatusProcessarRota}
                    handleAlterarStatusProcessar={handleAlterarStatusProcessar}
                    handleBloqueioImo={handleBloqueioImo}
                    recarregar_taxas={handleRecarregarTaxas}
                    
                    checkIncotermPropostaGemea={checkIncotermPropostaGemea}
                    mudarStatusCheckPropostaGemea={handleCheckPropostaGemea}                    
                    incotermPropostaGemea={incotermPropostaGemea}
                />

                <FormCotacaoCarga
                    apiDados={props.apiDados}
                    urlServer={props.urlServer}
                    pesoTotal={handlePesoTotal}
                    cubagemTotal={handleCubagemTotal}
                    lista_pickups={handleListaPickup}
                    clickCalculadora={handleClickCalculadora}
                    lista_door_delivery={handleListaDoorDelivery}
                    listaCargasImo={handleListaCargasImo}
                    alteracaoItemCargaImo={handleAlteracaoItemCargaImo}
                    urlApis={urlApis}
                    calcularPickups={handleCalcularPickups}
                    dados_carga={handleDadosCarga}
                    clickSalvar={clickSalvar}
                    mensagens_validacao={mensagens_validacao}
                    limpar_dados={limparDados}
                    campos_limpos={handleCamposLimpos}
                    modo_alteracao={modo_alteracao}
                    dados_proposta_salva={props.dados_proposta !== null ? props.dados_proposta : null}
                    bloqueio_imo={bloqueioImo}
                   
                    checkMarcacaoPickupPickupPropostaGemea={checkMarcacaoPickupPickupPropostaGemea}
                    mudarStatusMarcacaoPickupPropostaGemea={handleCheckMarcacaoPickupPropostaGemea}
                    marcarPickupPropostaGemea={marcarPickupPropostaGemea}
                    
                    marcarDoorDeliveryPropostaGemea={marcarDoorDeliveryPropostaGemea}
                    marcarImoPropostaGemea={marcarImoPropostaGemea}
                    
                    checkItensNaoEmpilhaveis={checkItensNaoEmpilhaveis}
                    verificacaocheckItensNaoEmpilhaveis={handleVerificacaoCheckItensNaoEmpilhaveis}
                    marcarItensNaoEmpilhaveisPropostaGemea={marcarItensNaoEmpilhaveisPropostaGemea}

                    fretePPCC={fretePPCCSelecionado}
                />

                <FormCotacaoTaxas
                    apiDados={props.apiDados}
                    urlServer={props.urlServer}
                    verificarTaxaCarregamentoDiretoImo={verificarTaxaCarregamentoDiretoImo}
                    handleVerificarTaxaCarregamentoDireto={handleVerificarTaxaCarregamentoDireto}
                    buscaTaxasTarifario={buscaTaxasTarifario}
                    alteraStatusBuscaTarifario={handleAlterarStatusBuscarTarifario}
                    id_cliente_selecionado={idClienteSelecionado}
                    numero_proposta={numeroPropostaSelecinada}
                    id_tarifario_selecionado={idTarifarioSelecionado}
                    fretePPCC={fretePPCCSelecionado}
                    cargaImo={cargaImo}
                    cubagemTotal={cubagemTotal}
                    pesoTotal={pesoTotal}
                    listaPickup={listaPickup}
                    listaDoorDelivery={listaDoorDelivery}
                    listaCargaImo={listaCargasImo}
                    alteracaoItemCargaImo={alteracaoItemCargaImo}
                    clickCalculadora={clickCalculadora}
                    alterarClickCalculadoraPickup={handleClickCalculadora}
                    urlApis={urlApis}
                    dados_taxas={handleDadosTaxas}
                    modo_alteracao={modo_alteracao}
                    dados_proposta_carregado={props.dados_proposta_carregado}
                    dados_proposta_salva={props.dados_proposta !== null ? props.dados_proposta : null}
                    data_validade_proposta={handleDataValidadeProposta}
                    recarregarTaxas={recarregarTaxas}
                    alteraStatusRecarregarTaxas={handleRecarregarTaxas}
                    
                    atualizarTaxasPropostaGemea={atualizarTaxasPropostaGemea}
                    dadosTaxasPropostaGemea={DadosTaxasPropostaGemea}
                    mudarStatusAtulizarTaxaPropostaGemea={handleAtualizarTaxasPropostaGemea}
                />


                <div className="container shadow-lg p-3 mb-4 bg-white rounded no-gutters m-0">
                    <div className='row'>
                        <div className="col-1 border-bottom titulo">
                            <b>Observações</b>
                        </div>
                        <div className="col-11 border-bottom titulo_informacao">
                            <b>Informações Adicionais para o Cliente</b>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 alinhamento_objeto_center titulo">
                            <TextareaAutosize aria-label="minimum height"
                                onChange={handleObsCliente}
                                className="form-control text_area_resize" name="observacao_cliente" minRows={1}
                                value={observacaoCliente} />
                        </div>
                    </div>
                </div>

                <div className="container shadow-lg p-3 mb-4 bg-white rounded no-gutters m-0">
                    <div className='row'>
                        <div className="col-2 border-bottom titulo">
                            <b>Observações Internas</b>
                        </div>
                        <div className="col-10 border-bottom titulo_informacao">
                            <b>Informações adicionais internas (Max 500 caracteres).</b>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 alinhamento_objeto_center titulo">
                            <TextareaAutosize
                                aria-label="minimum height"
                                className="form-control text_area_resize"
                                name="observacao_interna" minRows={1}
                                onChange={handleDadosObservacaoInterna}
                                value={observacaoInterna}
                            />
                        </div>
                    </div>
                </div>
            </div>            
            {abrirModalAnexarArquivo === true && (
                <ModalAnexarArquivo
                    apiDados={props.apiDados}
                    fecharModalAnexarArquivo={handleFecharModalAnexarArquivo}
                    salvarAnexos={handleSalvarAnexos}
                    lista_arquivos_internos={listaArquivosInternos}
                    lista_arquivos_externos={listaArquivosExternos}
                    atualizaListaArquivosInterno={handleAtualizaListaArquivosInternos}
                    atualizaListaArquivosExterno={handleAtualizaListaArquivosExternos}
                    id_usuario={props.id_usuario}
                    dados_proposta_salva={props.dados_proposta !== null ? props.dados_proposta : null}
                />
            )}

            {abrirModalPropostaGemea === true && (
                <ModalPropostaGemea
                    apiDados={props.apiDados}
                    fecharModalPropostaGemea={handleFecharModalPropostaGemea}
                    id_proposta_spot={props.id_proposta_gemea}
                    dados_cotacao_taxas={dadosCotacao.dados_taxas}
                    numero_proposta_rota={dadosCotacao.dados_rota.numero_proposta}
                    lista_pickup={dadosCotacao.dados_carga.lista_pickup}
                    lista_door_delivery={dadosCotacao.dados_carga.lista_door_delivery}
                    lista_carga_imo={dadosCotacao.dados_carga.lista_carga_imo}
                    marcarPickupPropostaGemea={handleMarcarObjetoPropostaGemea}
                    marcarDoorDeliveryPropostaGemea={handleMarcarObjetoPropostaGemea}
                    marcarImoPropostaGemea={handleMarcarObjetoPropostaGemea}
                    marcarNaoEmpilhavelPropostaGemea={dadosCotacao.dados_carga.itens_nao_empilhaveis}
                    marcacaoNaoEmpilhavelPropostaGemea={handleMarcarObjetoPropostaGemea}
                    definirIncotermPropostaGemea={handleDefinirIncotermPropostaGemea}
                    observacaoInternaPropostaGemea={handleObservacaoInternaPropostaGemea}
                    observacaoClientePropostaGemea={handleObservacaoClientePropostaGemea}
                    id_cliente_selecionado={idClienteSelecionado}
                    fretePPCC={fretePPCCSelecionado}
                    dadosRetornoCopiaPropostaGemea={handleDadosRetornoCopiaPropostaGemea}
                />
            )}
        </div>

    )
}
