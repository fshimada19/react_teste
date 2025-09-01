import { useEffect, useState } from 'react';
import ItemCarga from './ItemCarga/ItemCarga';
import ModalCargasPickup from './ModalCargasPickup/ModalCargasPickup';
import ModalCargasDoorDelivery from './ModalCargasDoorDelivery/ModalCargasDoorDelivery';
import ModalCargaImo from './ModalCargaImo/ModalCargaImo';
import './FormCotacaoCarga.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api';
import CreatableSelect from 'react-select/creatable';
import { NumericFormat } from 'react-number-format';

import '../../assets/css/Switch.css'

export default (props) => {
    const [exibirModalPickup, setExibirModalPickup] = useState(false);
    const [exibirModalDoorDelivery, setExibirModalDoorDelivery] = useState(false);
    const [exibirModalCargaImo, setExibirModalCargaImo] = useState(false);

    const [cargaPickup, setCargaPickup] = useState(false);
    const [cargaDoorDelivery, setCargaDoorDelivery] = useState(false);
    const [cargaImo, setCargaImo] = useState(false);
    const [novoItemPickup, setNovoItemPickup] = useState(true);
    const [novoItemDoorDelivery, setNovoItemDoorDelivery] = useState(true);
    const [novoItemCargaImo, setNovoItemCargaImo] = useState(true);
    const [pesoTotal, setPesoTotal] = useState(0.000);
    const [cubagemTotal, setCubagemTotal] = useState(0.000);
    const [quantidadeTotal, setQuantidadeTotal] = useState(0);
    const [pesoTotalDigitado, setpesoTotalDigitado] = useState(0);
    const [pickupOuDoorDeliverySelecionado, setPickupOuDoorDeliverySelecionado] = useState(false);
    const [processarListaItemCarga, setProcessarListaItemCarga] = useState(false);
    const [limparItemCarga, setLimparItemCarga] = useState(false);


    function calculoTotalMedidas() {
        let valor_total_volume = 0;
        for (let i = 0; i < document.getElementsByName("total_volumes_item_carga").length; i++) {
            if (document.getElementsByName("total_volumes_item_carga")[i].value != "") {
                valor_total_volume = parseInt(valor_total_volume) + parseInt(document.getElementsByName("total_volumes_item_carga")[i].value);
            }
        }
        setQuantidadeTotal(valor_total_volume);
    }

    const handleAdicionarPickup = () => {
        setExibirModalPickup(true);
        setNovoItemPickup(true);
    }
    const handleFecharModalPickup = (exibir) => {
        setExibirModalPickup(exibir);
        if (listaPickups.length === 0) {
            setCargaPickup(false);
            setIsCheckedPickup(false);
        }
    }

    const handleFecharModalDoorDelivery = (exibir, verificarListaDoorDelivery) => {
        setExibirModalDoorDelivery(exibir)
        if(verificarListaDoorDelivery === true) {
            if (listaDoorDelivery.length === 0) {
                setCargaDoorDelivery(false);
                setIsCheckedDoorDelivery(false);
                setProcessarListaItemCarga(true);
            }    
        }
    }

    const handleFecharModalCargaImo = (exibir) => {
        setExibirModalCargaImo(exibir);
        if (listaCargasImo.length === 0) {
            setCargaImo(false);
            setIsCheckedCargaImo(false);
        }
    }

    const handleAdicionarDoorDelivery = () => {
        setExibirModalDoorDelivery(true);
        setNovoItemDoorDelivery(true);
    }

    const handleAdicionarCargaImo = () => {
        setNovoItemCargaImo(true);
        setExibirModalCargaImo(true);
    }

    const [isCheckedPickup, setIsCheckedPickup] = useState(false);
    const [isCheckedDoorDelivery, setIsCheckedDoorDelivery] = useState(false);
    const [isCheckedCargaImo, setIsCheckedCargaImo] = useState(false);

    const handleCheckboxPickup = (objeto) => {
        setIsCheckedPickup(!isCheckedPickup);
        if (objeto.target.checked == true) {
            setExibirModalPickup(true);
            setCargaPickup(true);
        } else {
            setCargaPickup(false);
            setExibirModalPickup(false);
            setListaPickups([]);
            props.clickCalculadora(true);
        }
    }

    const handleCheckboxDoorDelivery = (objeto) => {
        setIsCheckedDoorDelivery(!isCheckedDoorDelivery);
        if (objeto.target.checked == true) {
            setExibirModalDoorDelivery(true);
            setCargaDoorDelivery(true);
        } else {
            setExibirModalDoorDelivery(false);
            setCargaDoorDelivery(false);
            setListaDoorDelivery([]);
            setProcessarListaItemCarga(true);
        }
    }

    const handleAtualizarListaItensCargas = (indiceItemCarga) => {
        let ordenacaoItensCargas = [];
        delete (listaItensCargas[indiceItemCarga]);
        let contadorNovaLista = 0;
        listaItensCargas.map((item, contadorElemento) => {
            ordenacaoItensCargas[contadorElemento] = item;
        });

        let chavesListaItensCargas = Object.keys(ordenacaoItensCargas);
        let novaListaItensCargas = [];

        if (chavesListaItensCargas.length > 0) {
            for (let i = 0; i < chavesListaItensCargas.length; i++) {
                novaListaItensCargas[i] = ordenacaoItensCargas[chavesListaItensCargas[i]]
            }
        }

        setListaItensCargas(novaListaItensCargas);
        atualiza_medidas_totais_carga_exclusao_item(novaListaItensCargas);
        dadosCarga.lista_itens_cargas = novaListaItensCargas;        
        setProcessarListaItemCarga(true);
    }

    function atualiza_medidas_totais_carga_exclusao_item(lista_itens_carga) {
        let volume_total = 0;
        let peso_total = 0.000;
        let cubagem_total = 0.000;
        lista_itens_carga.map((item, contador) => {
            if (item.volume !== "") {
                volume_total = parseInt(volume_total) + parseInt(item.volume);
            }

            if(dadosCarga.peso_total_editavel_selecionado === "0") {
                if (item.peso !== "") {
                    if (item.pesoLibra !== "") {
                        peso_total = parseFloat(peso_total) + parseFloat(item.pesoLibra)
                    } else {
                        if(item.peso_quantidade === "") {
                            peso_total = parseFloat(peso_total) + parseFloat(item.peso);
                        } else {
                            peso_total = parseFloat(peso_total) + parseFloat(item.peso_quantidade);
                        }
                    }
                    peso_total = peso_total.toFixed(3);
                }    
            } else {
                peso_total = dadosCarga.peso_total;
            }

            if (item.cubagem !== "") {
                cubagem_total = parseFloat(cubagem_total) + parseFloat(item.cubagem);
                cubagem_total = cubagem_total.toFixed(3);
            }

            if (item.valor_cubagem_dimensao != "") {
                cubagem_total = parseFloat(cubagem_total) + parseFloat(item.valor_cubagem_dimensao);
                cubagem_total = cubagem_total.toFixed(3);
            }
        })
        setQuantidadeTotal(volume_total);

        if(!isNaN(peso_total)) {
            setPesoTotal(peso_total);
        } else {
            setPesoTotal(0.000);
        } 
        setCubagemTotal(cubagem_total);
        props.cubagemTotal(cubagem_total);
        if(!isNaN(peso_total)) {
            props.pesoTotal(peso_total);
        } else {
            props.pesoTotal(0.000);            
        }

        if(!isNaN(peso_total)) {
            dadosCarga.peso_total = peso_total;
        } else {
            dadosCarga.peso_total = 0.000;
        }
        dadosCarga.cubagem_total = cubagem_total;
        dadosCarga.volume_total = volume_total;

    }

    const [listaItensCargas, setListaItensCargas] = useState([
        {
            "peso": '',
            'cubagem': '',
            'volume': '',
            'altura': '',
            'largura': '',
            'comprimento': '',
            'pesoLibra': '',
            'peso_quantidade':'',
            'cubagemInches': '',
            'valor_cubagem_dimensao': '',
            'exibir_campos_dimensoes': false,
            'pickupSelecionado': '',
            'doorDeliverySelecionado': '',
            "imoSelecionado": "",
            'ncm': 'Nao informado',
            'descricao': '',
            "valores_em_inches": false
        }
    ]);

    const handleAdicionarItemCarga = () => {
        setListaItensCargas([...listaItensCargas, {
            "peso": '',
            'cubagem': '',
            'volume': '',
            'altura': '',
            'largura': '',
            'comprimento': '',
            'pesoLibra': '',
            'peso_quantidade':'',
            'cubagemInches': '',
            'valor_cubagem_dimensao': '',
            'exibir_campos_dimensoes': false,
            'pickupSelecionado': '',
            'doorDeliverySelecionado': '',
            "imoSelecionado": "",
            'ncm': 'Nao informado',
            'descricao': '',
            'valores_em_inches':false
        }]);
    }

    const [dadosCarga, setDadosCarga] = useState({
        "peso_total": "",
        "peso_total_editavel_selecionado":"0",
        "cubagem_total": "",
        "volume_total": "",
        "descricao_unica_marcado": '',
        "ncm_unico": '',
        "descricao_unica": '',
        "itens_nao_empilhaveis": 0,
        "lista_pickup": [],
        "lista_door_delivery": [],
        "lista_carga_imo": [],
        "lista_itens_cargas": []
    });

    const handlePickupOuDoorDeliverySelecionado = (selecao) => {
        props.clickCalculadora(selecao);
    }

    const [listaPickups, setListaPickups] = useState([]);
    const handleAdicionarListaPickup = (itemPickup) => {
        setListaPickups([...listaPickups, itemPickup]);
        setProcessarListaItemCarga(true);
        setExibirModalPickup(false);
    }

    const [indiceElementoAlteracaoPickup, setIndiceElementoAlteracaoPickup] = useState(0);
    function handleAlteracaoPickup(indiceElemento) {
        setIndiceElementoAlteracaoPickup(indiceElemento);
        setNovoItemPickup(false);
        setExibirModalPickup(true);
    }
    const handleAtualizarListaPickup = (itemPickup, indiceElemento) => {
        let novaListaPickup = [];
        listaPickups.map((item, contador) => {
            if (contador === indiceElemento) {
                novaListaPickup[indiceElemento] = itemPickup;
            } else {
                novaListaPickup[contador] = item;
            }
        });
        setListaPickups(novaListaPickup);
        dadosCarga.lista_pickup = novaListaPickup;
        setProcessarListaItemCarga(true);
        setExibirModalPickup(false);
    }

    const handleExluirLinhaPickup = (indiceElemento) => {
        let novaListaPickup = []
        listaPickups.map((item, contadorElemento) => {
            if (indiceElemento !== contadorElemento) {
                novaListaPickup = [...novaListaPickup, item];
            }
        });
        if (listaPickups.length === 0) {
            setCargaPickup(false);
            setIsCheckedPickup(false);
        }
        setListaPickups(novaListaPickup);
        dadosCarga.lista_pickup = novaListaPickup;
        setProcessarListaItemCarga(true);
        setExibirModalPickup(false);
    }


    const [listaDoorDelivery, setListaDoorDelivery] = useState([]);
    const handleAdicionarListaDoorDelivery = (itemDoorDelivery) => {
        setListaDoorDelivery([...listaDoorDelivery, itemDoorDelivery])
    }
    const [indiceElementoAlteracaoDoorDelivery, setIndiceElementoAlteracaoDoorDelivery] = useState(0);
    function handleAlteracaoDoorDelivery(indiceElemento) {
        setIndiceElementoAlteracaoDoorDelivery(indiceElemento);
        setNovoItemDoorDelivery(false);
        setExibirModalDoorDelivery(true);
    }
    const handleAlteracaoItemDoorDelivery = (itemDoorDelivery, indiceElemento) => {
        let nova_lista_door_delivery = [];
        listaDoorDelivery.map((item, contador) => {
            if (contador === indiceElemento) {
                nova_lista_door_delivery[indiceElemento] = itemDoorDelivery;
            } else {
                nova_lista_door_delivery[contador] = item;
            }
        })
        setListaDoorDelivery(nova_lista_door_delivery);

        dadosCarga.lista_door_delivery = nova_lista_door_delivery;
        setProcessarListaItemCarga(true);
        setExibirModalDoorDelivery(false);
    }

    const handleExluirLinhaDoorDelivery = (indiceElemento) => {
        let novaListaDoorDelivery = []
        listaDoorDelivery.map((item, contadorElemento) => {
            if (indiceElemento !== contadorElemento) {
                novaListaDoorDelivery = [...novaListaDoorDelivery, item];
            }
        })

        if (novaListaDoorDelivery.length === 0) {
            setCargaDoorDelivery(false);
            setIsCheckedDoorDelivery(false);
        }
        setListaDoorDelivery(novaListaDoorDelivery);
        dadosCarga.lista_door_delivery = novaListaDoorDelivery;
        setProcessarListaItemCarga(true);
        setExibirModalDoorDelivery(false);
    }

    // Controles do Modal Carga IMO e Lista da CargaIMO
    const [listaCargasImo, setListaCargasImo] = useState([]);

    const handleCheckboxCargaImo = (objeto) => {
        setIsCheckedCargaImo(!isCheckedCargaImo);
        if (objeto.target.checked == true) {
            setExibirModalCargaImo(true);
            setCargaImo(true);
        } else {
            setExibirModalCargaImo(false);
            setCargaImo(false);
            setListaCargasImo([]);
        }
    }


    const handleAdicionarListaCargaImo = (itemCargaImo) => {
        //props.alteracaoItemCargaImo(false);
        setListaCargasImo([...listaCargasImo, itemCargaImo]);
        setExibirModalCargaImo(false);
    }

    const [indiceElementoAlteracaoCargaImo, setIndiceElementoAlteracaoCargaImo] = useState(0);
    function handleAlteracaoCargaImo(indiceElemento) {
        props.alteracaoItemCargaImo(false);
        setIndiceElementoAlteracaoCargaImo(indiceElemento);
        setNovoItemCargaImo(false);
        setExibirModalCargaImo(true);
    }

    const [atualizar_lista_cargas_imo, setAtualizaListaCargaImo] = useState(false);
    const handleAlteracaoItemCargaImo = (itemCargaImo, indiceElemento) => {
        listaCargasImo[indiceElemento] = itemCargaImo;
        props.alteracaoItemCargaImo(true);
        setAtualizaListaCargaImo(true);
        setExibirModalCargaImo(false);
    }

    const handleExluirLinhaCargaImo = (indiceElemento) => {
        let novaListaCargaImo = []
        listaCargasImo.map((item, contadorElemento) => {
            if (indiceElemento !== contadorElemento) {
                novaListaCargaImo = [...novaListaCargaImo, item];
            }
        })
        if (novaListaCargaImo.length === 0) {
            props.listaCargasImo("N", novaListaCargaImo);
            setNovoItemCargaImo(true);
            setIsCheckedCargaImo(false);
            setCargaImo(false);
        }
        setListaCargasImo(novaListaCargaImo);
        dadosCarga.lista_carga_imo = novaListaCargaImo;
        setProcessarListaItemCarga(true);
    }

    const handleAtualizaMedidasTotais = (valor_medida, indiceItemCarga, tipo, altura = "", largura = "", comprimento = "", peso_libras = "", totalCubagemInches = "", peso_quantidade="") => {
        listaItensCargas.map((item, contador) => {
            if (contador == indiceItemCarga) {
                item.exibir_campos_dimensoes = false;
                if (tipo === "volume") {
                    item.volume = valor_medida;
                }
                if (tipo === "peso") {
                    item.pesoLibra = peso_libras;
                    item.peso_quantidade = peso_quantidade;
                    item.peso = valor_medida;
                }
                if (tipo === "cubagem") {
                    item.cubagemInches = totalCubagemInches;
                    item.cubagem = valor_medida;
                }
                if (tipo === "dimensoes") {
                    item.altura = altura;
                    item.largura = largura;
                    item.comprimento = comprimento;
                    item.valor_cubagem_dimensao = valor_medida;
                    item.exibir_campos_dimensoes = true;
                }
                if(tipo === "valores_em_inches") {
                    if(valor_medida === "1") {
                        item.valores_em_inches = true;
                    } else {
                        item.valores_em_inches = false;
                    }
                }
            }
        });

        let volume_total = 0;
        let peso_total = 0.000;
        let cubagem_total = 0.000;
        listaItensCargas.map((item, contador) => {
            if (item.volume !== "") {
                volume_total = parseInt(volume_total) + parseInt(item.volume);
            }

            if(dadosCarga.peso_total_editavel_selecionado === "0") {
                if (item.peso !== "") {
                    if (item.pesoLibra !== "") {
                        peso_total = parseFloat(peso_total) + parseFloat(item.pesoLibra)
                    } else {
                        if(item.peso_quantidade === "") {
                            peso_total = parseFloat(peso_total) + parseFloat(item.peso);
                        } else {
                            peso_total = parseFloat(peso_total) + parseFloat(item.peso_quantidade);
                        }
                    }
                    peso_total = peso_total.toFixed(3);
                }    
            } else {
                peso_total = dadosCarga.peso_total;
            }

            if (item.cubagem !== "") {
                cubagem_total = parseFloat(cubagem_total) + parseFloat(item.cubagem);
                cubagem_total = cubagem_total.toFixed(3);
            }

            if (item.valor_cubagem_dimensao != "") {
                cubagem_total = parseFloat(cubagem_total) + parseFloat(item.valor_cubagem_dimensao);
                cubagem_total = cubagem_total.toFixed(3);
            }
        })
        setQuantidadeTotal(volume_total);

        if(!isNaN(peso_total)) {
            setPesoTotal(peso_total);
        } else {
            setPesoTotal(0.000);
        } 
        setCubagemTotal(cubagem_total);
        props.cubagemTotal(cubagem_total);
        if(!isNaN(peso_total)) {
            props.pesoTotal(peso_total);
        } else {
            props.pesoTotal(0.000);            
        }


        dadosCarga.lista_itens_cargas = listaItensCargas;
        if(!isNaN(peso_total)) {
            dadosCarga.peso_total = peso_total;
        } else {
            dadosCarga.peso_total = 0.000;
        }
        dadosCarga.cubagem_total = cubagem_total;
        dadosCarga.volume_total = volume_total;
        setProcessarListaItemCarga(true);
        return false;
    }


    const [isCheckedItensNaoEmpilhaveis, setIsCheckedItensNaoEmpilhaveis] = useState(false);
    const handleItensNaoEmpilhaveis = (objeto) => {
        setIsCheckedItensNaoEmpilhaveis(!isCheckedItensNaoEmpilhaveis);
        if (objeto.target.checked === true) {
            dadosCarga.itens_nao_empilhaveis = 1;
        } else {
            dadosCarga.itens_nao_empilhaveis = 0;
        }
        setProcessarListaItemCarga(true);
    }


    const [isCheckedDescricaoUnica, setIsCheckedDescricaoUnica] = useState(false);

    const handleDescricaoUnica = (objeto) => {
        setIsCheckedDescricaoUnica(!isCheckedDescricaoUnica);
        if (objeto.target.checked == false) {
            setNcmDescricaoUnica("");
            dadosCarga.descricao_unica_marcado = 0;
        } else {
            dadosCarga.descricao_unica_marcado = 1;
        }
        setProcessarListaItemCarga(true);
    }

    const [ncmDescricaoUnica, setNcmDescricaoUnica] = useState('Não Informado');
    const handleChangeNcmDescricaoUnica = (event) => {
        setNcmDescricaoUnica(event.target.value);
        dadosCarga.ncm_unico = event.target.value;
        setProcessarListaItemCarga(true);
    }

    const [listaDescricaoMercadoria, setListaDescricaoMercadoria] = useState([]);
    const [carregarDescricoes, setCarregarDescricoes] = useState(true);

    const [valueDescricao, setValueDescricao] = useState([]);
    const handleChangeDescricao = (selectedOption) => {
        setValueDescricao(selectedOption);
        dadosCarga.descricao_unica = selectedOption.value;
        setProcessarListaItemCarga(true);
    }

    async function listarDescricoes() {
        let listaDescricaoMercadoria = await api.get(props.urlApis + props.apiDados + "ListarDescricoesMercadoriaCombo.php", {
            "Content-Type": "application/json; charset=utf-8"
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });
        let valor_option_descricao_mercadoria = [];
        for (let i = 0; i < listaDescricaoMercadoria.length; i++) {
            valor_option_descricao_mercadoria[i] = { "value": listaDescricaoMercadoria[i].value, "label": listaDescricaoMercadoria[i].label }
        }
        setListaDescricaoMercadoria(valor_option_descricao_mercadoria);
        setCarregarDescricoes(false);
    }


    const handleCreateDescricao = (selectedOption) => {
        setValueDescricao({ label: selectedOption, value: selectedOption });
        Swal.fire({
            title: "Incluir Descrição Mercadoria",
            text: "Deseja Incluir a Descrição da Mercadoria para novas propostas ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        }).then(async (result) => {
            if (result.isConfirmed) {
                let retorno_funcao = await api.post(props.urlApis + props.apiDados + "incluirDescricaoMercadoriaProposta.php", {
                    descricao_mercadoria: selectedOption
                }).then((response) => {
                    return response.data
                }).catch((err) => {
                    console.error("Ocorreu um erro" + err);
                });

                if (retorno_funcao.status == "sucesso") {
                    Swal.fire({
                        title: "Mercadoria Incluida!",
                        text: retorno_funcao.mensagem,
                        icon: "success"
                    });
                }
            }
        });
    }

    const [isCheckedPesoTotal, setIsCheckedPesoTotal] = useState(false);
    const handleChangeSetIsCheckedPesoTotal = (objeto) => {
        setIsCheckedPesoTotal(!isCheckedPesoTotal);
        if(objeto.target.checked === true) {
            dadosCarga.peso_total_editavel_selecionado = "1";
        } else {
            dadosCarga.peso_total_editavel_selecionado = "0";
        }
        setProcessarListaItemCarga(true);
    }

    function handleChangeNumericField(tipo, valor) {
        if (tipo == "peso") {
            setpesoTotalDigitado(valor);
            dadosCarga.peso_total = valor;
            dadosCarga.peso_total_editavel_selecionado = "1";
            props.pesoTotal(valor);
            setProcessarListaItemCarga(true);
        }
    }

    const handleAtualizaDadosItemCarga = (campo, valor_campo, indice) => {
        //console.log("Indice ItemCarga: "+indice, "Nome Campo: "+campo, "valor_campo: "+valor_campo);
        if (campo === "ncm") {
            listaItensCargas[indice].ncm = valor_campo;
        }

        if (campo === "descricao") {
            listaItensCargas[indice].descricao = valor_campo;
        }

        if (campo === "pickupSelecionado") {
            listaItensCargas[indice].pickupSelecionado = valor_campo;
        }

        if (campo === "doorDeliverySelecionado") {
            listaItensCargas[indice].doorDeliverySelecionado = valor_campo;
        }

        if (campo === "imoSelecionado") {
            listaItensCargas[indice].imoSelecionado = valor_campo;
        }

        dadosCarga.lista_itens_cargas = listaItensCargas;
        setProcessarListaItemCarga(true);
    }


    useEffect(() => {
        if (carregarDescricoes == true) {
            listarDescricoes();
        }

    }, [carregarDescricoes]);

    useEffect(() => {
        if (carregarDescricoes == true) {
            listarDescricoes();
        }

    }, [carregarDescricoes]);

    useEffect(() => {
        if (listaPickups.length > 0) {
            props.lista_pickups(listaPickups);
            props.clickCalculadora(true);
        } else {
            props.lista_pickups(listaPickups);
        }

        if (listaDoorDelivery.length > 0) {
            props.lista_door_delivery(listaDoorDelivery);
            props.clickCalculadora(true);
        } else {
            props.lista_door_delivery(listaDoorDelivery);
        }

        dadosCarga.lista_pickup = listaPickups;
        dadosCarga.lista_door_delivery = listaDoorDelivery;
        setProcessarListaItemCarga(true);

    }, [listaPickups, listaDoorDelivery]);

    useEffect(() => {
        if (listaCargasImo.length > 0) {
            props.listaCargasImo("S", listaCargasImo);
        } else {
            props.listaCargasImo("N", listaCargasImo);
        }
        dadosCarga.lista_carga_imo = listaCargasImo;
        setProcessarListaItemCarga(true);
    }, [listaCargasImo]);

    useEffect(() => {
        if (atualizar_lista_cargas_imo === true) {
            dadosCarga.lista_carga_imo = listaCargasImo;
            setAtualizaListaCargaImo(false);
            setProcessarListaItemCarga(true);
        }
    }, [atualizar_lista_cargas_imo]);

    useEffect(() => {
        props.dados_carga(dadosCarga);
        setProcessarListaItemCarga(false);        
    }, [processarListaItemCarga]);

    useEffect(() => {
        if (props.limpar_dados === true) {
            setIsCheckedCargaImo(false);
            setIsCheckedDoorDelivery(false);
            setIsCheckedPickup(false);
            setListaPickups([]);
            setListaDoorDelivery([]);
            setLimparItemCarga(true);
            setListaCargasImo([]);
            setListaItensCargas([
                {
                    "peso": '',
                    'cubagem': '',
                    'volume': '',
                    'altura': '',
                    'largura': '',
                    'comprimento': '',
                    'valor_cubagem_dimensao': '',
                    'exibir_campos_dimensoes': false,
                    'pickupSelecionado': '',
                    'doorDeliverySelecionado': '',
                    "imoSelecionado": "",
                    'ncm': 'Nao Informado',
                    'descricao': '',
                    'valores_em_inches':false
                }
            ]);

            props.campos_limpos()
        }
    }, [props.limpar_dados]);

    const handleItemCargaLimpo = () => {
        setLimparItemCarga(false);
    }


    useEffect(() => {
        if (props.dados_proposta_salva !== null) {
            let lista_itens_carga = props.dados_proposta_salva.dados_carga.lista_itens_cargas;
            setListaItensCargas(lista_itens_carga);

            let lista_carga_imo = props.dados_proposta_salva.dados_carga.lista_carga_imo;
            if (lista_carga_imo.length > 0) {
                setListaCargasImo(lista_carga_imo);
                setIsCheckedCargaImo(true);
                setCargaImo(true);
            } else {
                setIsCheckedCargaImo(false);
                setCargaImo(false);
            }

            if(props.dados_proposta_salva.dados_carga.peso_total_editavel_selecionado) {
                if(props.dados_proposta_salva.dados_carga.peso_total_editavel_selecionado === "1") {
                    setIsCheckedPesoTotal(true);
                    setpesoTotalDigitado(props.dados_proposta_salva.dados_carga.peso_total);
                    dadosCarga.peso_total_editavel_selecionado = "1";
                    dadosCarga.peso_total = props.dados_proposta_salva.dados_carga.peso_total;
                    props.pesoTotal(props.dados_proposta_salva.dados_carga.peso_total);
                } else {
                    setIsCheckedPesoTotal(false);
                    dadosCarga.peso_total_editavel_selecionado = "0";

                }
            }

            let lista_pickup = props.dados_proposta_salva.dados_carga.lista_pickup;
            if (lista_pickup.length > 0) {
                setListaPickups(lista_pickup);
                setIsCheckedPickup(true);
                setCargaPickup(true);
            } else {
                setIsCheckedPickup(false);
                setCargaPickup(false);
            }

            let lista_door_delivery = props.dados_proposta_salva.dados_carga.lista_door_delivery;
            if (lista_door_delivery.length > 0) {
                setListaDoorDelivery(lista_door_delivery);
                setIsCheckedDoorDelivery(true);
                setCargaDoorDelivery(true);
            } else {
                setIsCheckedDoorDelivery(false);
                setCargaDoorDelivery(false);
            }

            if (props.dados_proposta_salva.dados_carga.itens_nao_empilhaveis === 1) {
                setIsCheckedItensNaoEmpilhaveis(true);
                dadosCarga.itens_nao_empilhaveis = props.dados_proposta_salva.dados_carga.itens_nao_empilhaveis;
            } else {
                setIsCheckedItensNaoEmpilhaveis(false);
            }


            if (props.dados_proposta_salva.dados_carga.descricao_unica_marcado === 1) {
                setIsCheckedDescricaoUnica(true);
                setValueDescricao({ "value": props.dados_proposta_salva.dados_carga.descricao_unica, "label": props.dados_proposta_salva.dados_carga.descricao_unica });
                dadosCarga.descricao_unica = props.dados_proposta_salva.dados_carga.descricao_unica;
                dadosCarga.ncm_unico = props.dados_proposta_salva.dados_carga.ncm_unico;
                dadosCarga.descricao_unica_marcado = props.dados_proposta_salva.dados_carga.descricao_unica_marcado;
            }


            setProcessarListaItemCarga(true);
        }
    }, [props.dados_proposta_salva])

    const [desabilitarBotaoImo, setDesabilitarBotaoImo] = useState(false);
    useEffect(()=>{
        if(props.bloqueio_imo === true) {
            if(isCheckedCargaImo === false) {
                setIsCheckedCargaImo(false);
                setCargaImo(false);
                setDesabilitarBotaoImo(true);
            } else {
                setDesabilitarBotaoImo(false);
            }
        } else {
            setDesabilitarBotaoImo(false);
        }

    },[props.bloqueio_imo])

    /* Funcionalidades Proposta Gemea */
    const [removerSelecaoPickupPropostaGemea, setRemoverSelecaoPickupPropostaGemea] = useState(false);    
    const [removerSelecaoDoorDeliveryPropostaGemea, setRemoverSelecaoDoorDeliveryPropostaGemea] = useState(false);    

    useEffect(() => {
        if(props.checkMarcacaoPickupPickupPropostaGemea === true) {
            setIsCheckedPickup(props.marcarPickupPropostaGemea);
            setCargaPickup(props.marcarPickupPropostaGemea);
            setRemoverSelecaoPickupPropostaGemea(props.marcarPickupPropostaGemea);
            props.mudarStatusMarcacaoPickupPropostaGemea(false);    
        }
    }, [props.checkMarcacaoPickupPickupPropostaGemea]);

    useEffect(() => {
        setIsCheckedDoorDelivery(props.marcarDoorDeliveryPropostaGemea);
        setCargaDoorDelivery(props.marcarDoorDeliveryPropostaGemea);
        setRemoverSelecaoDoorDeliveryPropostaGemea(props.marcarDoorDeliveryPropostaGemea);
        setProcessarListaItemCarga(true);
    }, [props.marcarDoorDeliveryPropostaGemea]);

    useEffect(() => {
        setIsCheckedCargaImo(props.marcarImoPropostaGemea);
        setCargaImo(props.marcarImoPropostaGemea);
        setProcessarListaItemCarga(true);
    }, [props.marcarImoPropostaGemea]);

    useEffect(() => {
        if(props.checkItensNaoEmpilhaveis === true) {
            setIsCheckedItensNaoEmpilhaveis(props.marcarItensNaoEmpilhaveisPropostaGemea);
            if(props.marcarItensNaoEmpilhaveisPropostaGemea === true) {
                dadosCarga.itens_nao_empilhaveis = 1;
            } else {
                dadosCarga.itens_nao_empilhaveis = 0;
            }
            setProcessarListaItemCarga(true);
            props.verificacaocheckItensNaoEmpilhaveis(false);    
        }
    }, [props.checkItensNaoEmpilhaveis]);

    
    return (
        <>
            <div className="container shadow-lg p-3 mb-4 bg-white rounded no-gutters m-0">
                <div className='row'>
                    <div className="col-1 border-bottom titulo">
                        <b>Carga</b>
                    </div>
                    <div className="col-5 border-bottom titulo_informacao">
                        <b>Informações da Carga</b>
                    </div>
                    <div className="col-6 border-bottom d-flex justify-content-end titulo_informacao">
                        {isCheckedCargaImo === true && (
                            <>
                                <button name="adicionar_cargaImo" onClick={handleAdicionarCargaImo} className="btn btn-outline-dark btn-sm mr-1">Adicionar Carga Imo</button>
                                <span className='espaco'></span>
                            </>
                        )}
                        {cargaPickup === true && (
                            <>
                                <button name="adicionar_pickup" onClick={handleAdicionarPickup} className="btn btn-outline-dark btn-sm mr-1">Adicionar Pickup</button>
                                <span className='espaco'></span>
                            </>
                        )}
                        {cargaDoorDelivery === true && (
                            <>
                                <button name="adicionar_door_delivery" onClick={handleAdicionarDoorDelivery} className="btn btn-outline-dark btn-sm">Add Door Delivery</button>
                                <span className='espaco'></span>
                            </>
                        )
                        }
                        <button onClick={handleAdicionarItemCarga} name="adicionar_carga" className="btn btn-outline-dark btn-sm">Adicionar Carga</button>
                    </div>
                </div>
                <div className="row">
                    <div className="row">
                        <div className="col-1 border-bottom titulo">
                            <br />
                            <b>Informações</b>
                        </div>
                        <div className="col-11 border-bottom titulo">
                            <br />
                        </div>
                    </div>
                    {props.bloqueio_imo === true && (
                            <div className="row">
                                <div className="col-12 bloco_imo_bloqueio">
                                    <b>A inclusão de IMO para esta rota é bloqueada! Para prosseguir com esta cotação certifique-se que a carga não é IMO.</b>
                                </div>
                            </div>
                        )
                    }


                    <div className="row mb-1">
                        <div className="col titulo">
                            <label>Qtde. Total</label><br />
                            <label id="quantidade_total_carga">{quantidadeTotal}</label>
                        </div>
                        <div className="col titulo">
                            <label>Peso Total</label><br />
                            {isCheckedPesoTotal === false ? (
                                <label id="peso_total_carga titulo"><span id="valor_peso_total_carga">{pesoTotal}</span> KG</label>
                            ) : (
                                <NumericFormat
                                    value={pesoTotalDigitado}
                                    className="form-control border-bottom alinhamento_texto_direito"
                                    name="total_peso_carga_digitado"
                                    onValueChange={(values) => handleChangeNumericField('peso', values.value)}
                                    decimalSeparator=','
                                    decimalScale={3}
                                    suffix={" KG"}
                                />

                            )

                            }
                        </div>
                        <div className="col titulo">
                            <label>CBM Total</label><br />
                            <label id="cubagem_total_carga titulo"><span id="valor_cubagem_total_carga">{cubagemTotal}</span> M³</label>
                        </div>
                        <div className="col-2 col-2-personalizado-peso">
                            <br />
                            <label className='switch'>
                                <input type="checkbox" onChange={handleChangeSetIsCheckedPesoTotal} checked={isCheckedPesoTotal} name="check_peso_total" />
                                <span className="slider round"></span>
                            </label>
                            <label className='titulo'>Peso Total</label>
                        </div>
                        <div className="col-2 col-2-personalizado-itens_nao_empilhaveis">
                            <br />
                            <label className='switch'>
                                <input type="checkbox" onChange={handleItensNaoEmpilhaveis} checked={isCheckedItensNaoEmpilhaveis} name="check_itens_nao_empilhaveis" />
                                <span className="slider round"></span>
                            </label>
                            <label className='titulo'>Itens não empilhaveis</label>
                        </div>
                        <div className="col-2 col-2-personalizado-imo">
                            <br />
                            <label className='switch'>
                                <input onChange={handleCheckboxCargaImo} disabled={desabilitarBotaoImo} checked={isCheckedCargaImo} type="checkbox" name="check_imo" />
                                <span className="slider round"></span>
                            </label>
                            <label className='titulo'>IMO</label>
                        </div>
                        <div className="col-2">
                            <br />
                            <label className='switch'>
                                <input onChange={handleCheckboxDoorDelivery} type="checkbox" checked={isCheckedDoorDelivery} name="door_delivery" />
                                <span className="slider round"></span>
                            </label>
                            <label className='titulo'>Door Delivery</label>

                        </div>
                        <div className="col-2 col-2-personalizado-pickup">
                            <br />
                            <label className='switch'>
                                <input className="form-check-input" onChange={handleCheckboxPickup} checked={isCheckedPickup} type="checkbox" name="pickup" />
                                <span className="slider round"></span>
                            </label>
                            <label className='titulo'>Pickup</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <label className='switch'>
                                <input className="form-check-input" type="checkbox" name="descricao_unica" onChange={handleDescricaoUnica} checked={isCheckedDescricaoUnica} />
                                <span className="slider round"></span>
                            </label>
                            <label className='titulo'>Descrição Única</label>
                        </div>
                        {isCheckedDescricaoUnica === true && (
                            <>
                                <div className="col-2">
                                    <label className='titulo'>NCM</label>
                                    <input type="text" className='form-control' name="ncm_descricao_unica" value={ncmDescricaoUnica} onChange={handleChangeNcmDescricaoUnica} checked={isCheckedDescricaoUnica} />
                                </div>
                                <div className="col">
                                    <label className='titulo'>Descrição</label>
                                    <CreatableSelect
                                        formatCreateLabel={(inputText) => `Nova Descrição "${inputText}"`}
                                        onChange={handleChangeDescricao}
                                        placeholder="Selecione"
                                        onCreateOption={handleCreateDescricao}
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
                                        }}
                                        noOptionsMessage={() => "Não há opções para selecionar"}
                                        options={listaDescricaoMercadoria}
                                        isSearchable="true"
                                        value={valueDescricao}
                                        name='descricao_mercadoria'
                                        isClearable
                                    />
                                    <span className='campos_validacao'>{props.mensagens_validacao.descricao_unica}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='row'>
                        {
                            listaPickups.length > 0 && (
                                <div className='col-6'>
                                    <table className='tabelas'>
                                        <thead>
                                            <tr>
                                                <td colSpan="3"><b>Pickup</b></td>
                                            </tr>
                                            <tr>
                                                <td>Endereço</td>
                                                <td width="36%">Valor Compra</td>
                                                <td width="37%">Valor Venda</td>
                                            </tr>
                                        </thead>
                                        {
                                            listaPickups.map((item, contadorItemPickup) => (
                                                <tbody key={contadorItemPickup}>
                                                    <tr>
                                                        <td><Link onClick={() => handleAlteracaoPickup(contadorItemPickup)} >{item.endereco_pickup}</Link></td>
                                                        <td>
                                                            {item.pickup_incluso === false ? (
                                                                <>
                                                                    {item.moeda_pickup}{item.valor_compra_pickup} {item.unidade_pickup} Min:{item.valor_compra_minimo_pickup} Max:{item.valor_compra_maximo_pickup} {item.modalidade_pickup}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Pickup Incluso
                                                                </>
                                                            )
                                                            }
                                                        </td>
                                                        <td>
                                                            {item.pickup_incluso === false ? (
                                                                <>
                                                                    {item.moeda_pickup}{item.valor_venda_pickup} {item.unidade_pickup} Min:{item.valor_venda_minimo_pickup} Max:{item.valor_venda_maximo_pickup} {item.modalidade_pickup}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Pickup Incluso
                                                                </>
                                                            )
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            ))
                                        }
                                    </table>
                                </div>
                            )
                        }
                        {
                            listaDoorDelivery.length > 0 && (
                                <div className='col-6'>
                                    <table className='tabelas'>
                                        <thead>
                                            <tr>
                                                <td colSpan="3"><b>Door Delivery</b></td>
                                            </tr>
                                            <tr>
                                                <td>Endereço</td>
                                                <td width="36%">Valor Compra</td>
                                                <td width="37%">Valor Venda</td>
                                            </tr>
                                        </thead>
                                        {
                                            listaDoorDelivery.map((item, contadorItemDoorDelivery) => (
                                                <tbody key={contadorItemDoorDelivery}>
                                                    <tr>
                                                        <td><Link onClick={() => handleAlteracaoDoorDelivery(contadorItemDoorDelivery)}>{item.endereco_door_delivery}</Link></td>
                                                        <td>
                                                            {item.door_delivery_incluso === false ? (
                                                                <>
                                                                    {item.moeda_door_delivery}{item.valor_compra_door_delivery} {item.unidade_door_delivery} Min:{item.valor_compra_minimo_door_delivery} Max:{item.valor_compra_maximo_door_delivery} {item.modalidade_door_delivery}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Door Delivery Incluso
                                                                </>
                                                            )
                                                            }
                                                        </td>
                                                        <td>
                                                            {item.door_delivery_incluso === false ? (
                                                                <>
                                                                    {item.moeda_door_delivery}{item.valor_venda_door_delivery} {item.unidade_door_delivery} Min:{item.valor_venda_minimo_door_delivery} Max:{item.valor_venda_maximo_door_delivery} {item.modalidade_door_delivery}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Door Delivery Incluso
                                                                </>
                                                            )}

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            ))
                                        }
                                    </table>
                                </div>
                            )
                        }
                    </div>
                    {
                        listaCargasImo.length > 0 && (
                            <div className='col-6'>
                                <br />
                                <table className='tabelas'>
                                    <thead>
                                        <tr>
                                            <td colSpan="4"><b>Carga Imo</b></td>
                                        </tr>
                                        <tr>
                                            <td width="50%">Classe</td>
                                            <td width="30%">Carregamento Direto</td>
                                            <td width="10%">UN</td>
                                            <td width="10%">Packing Group</td>

                                        </tr>
                                    </thead>
                                    {
                                        listaCargasImo.map((item, contadorItemCargaImo) => (
                                            <tbody key={contadorItemCargaImo}>
                                                <tr>
                                                    <td><Link onClick={() => handleAlteracaoCargaImo(contadorItemCargaImo)}>{item.classe_imo_label}</Link></td>
                                                    <td>{item.carregamento_direto}</td>
                                                    <td>{item.un_imo}</td>
                                                    <td>{item.packing_group}</td>
                                                </tr>
                                            </tbody>
                                        ))
                                    }
                                </table>
                            </div>
                        )
                    }

                    <div className="row ">
                        <div className="row">
                            <div className="col-13 border-bottom titulo_atencao">
                                <br />
                            </div>
                        </div>
                        {
                            listaItensCargas.map((item, contadorItem) => (
                                <div key={contadorItem}>
                                    <ItemCarga
                                        apiDados={props.apiDados}
                                        cubagemItemCarga={item.cubagem}
                                        pesoItemCarga={item.peso}
                                        volumeItemCarga={item.volume}
                                        descricaoItemCarga={item.descricao}
                                        ncmItemCarga={item.ncm}
                                        dadosImoSelecionadoItemCarga={item.imoSelecionado}
                                        dadosPickupSelecionado={item.pickupSelecionado}
                                        dadosDoorDeliverySelecionado={item.doorDeliverySelecionado}
                                        valor_cubagem_dimensao_item_carga={item.valor_cubagem_dimensao}

                                        alturaItemCarga={item.altura}
                                        larguraItemCarga={item.largura}
                                        comprimentoItemCarga={item.comprimento}
                                        atualizaMedidasTotais={handleAtualizaMedidasTotais}
                                        listaPickups={listaPickups}
                                        listaDoorDelivery={listaDoorDelivery}
                                        listaCargaImo={listaCargasImo}
                                        key={contadorItem}
                                        contadorItem={contadorItem + 1}
                                        indexItemCarga={contadorItem}
                                        listaItensCarga={listaItensCargas}
                                        descricaoUnicaChecado={isCheckedDescricaoUnica}
                                        pesoTotalDigitadoChecado={isCheckedPesoTotal}
                                        atualizarListaItensCarga={handleAtualizarListaItensCargas}
                                        urlApis={props.urlApis}
                                        pickupOuDoorDeliverySelecionado={handlePickupOuDoorDeliverySelecionado}
                                        mensagens_validacao={props.mensagens_validacao}
                                        atualizaDadosListaItemCarga={handleAtualizaDadosItemCarga}
                                        limpar_dados={limparItemCarga}
                                        dados_item_carga_limpo={handleItemCargaLimpo}
                                        dados_proposta_salva={props.dados_proposta_salva !== null ? props.dados_proposta_salva : null}
                                        item_carga_salvo={props.dados_proposta_salva !== null ? props.dados_proposta_salva.dados_carga.lista_itens_cargas[contadorItem] : null}
                                        
                                        remover_selecao_pickup_proposta_gemea={removerSelecaoPickupPropostaGemea}
                                        removerSelecaoDoorDeliveryPropostaGemea={removerSelecaoDoorDeliveryPropostaGemea}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            {exibirModalPickup === true &&
                <ModalCargasPickup
                    apiDados={props.apiDados}
                    listaPickups={listaPickups}
                    indiceElementoAlteracao={indiceElementoAlteracaoPickup}
                    adicionarPickups={handleAdicionarListaPickup}
                    exibirModalPickup={handleFecharModalPickup}
                    atualizarPickups={handleAtualizarListaPickup}
                    novoItem={novoItemPickup}
                    excluirElemento={handleExluirLinhaPickup}
                    modalidadeFreteSelecionada={props.fretePPCC}
                />
            }

            {exibirModalDoorDelivery === true &&
                <ModalCargasDoorDelivery
                    apiDados={props.apiDados}
                    listaDoorDelivery={listaDoorDelivery}
                    indiceElementoAlteracao={indiceElementoAlteracaoDoorDelivery}
                    exibirModalDoorDelivery={handleFecharModalDoorDelivery}
                    atualizaDoorDelivery={handleAdicionarListaDoorDelivery}
                    alteracaoItemDoorDelivery={handleAlteracaoItemDoorDelivery}
                    novoItem={novoItemDoorDelivery}
                    excluirElemento={handleExluirLinhaDoorDelivery}
                    modalidadeFreteSelecionada={props.fretePPCC}
                />
            }

            {exibirModalCargaImo === true &&
                <ModalCargaImo
                    apiDados={props.apiDados}
                    listaCargaImo={listaCargasImo}
                    exibirModalCargaImo={handleFecharModalCargaImo}
                    atualizarListaCargaImo={handleAdicionarListaCargaImo}
                    novoItem={novoItemCargaImo}
                    indiceElementoAlteracao={indiceElementoAlteracaoCargaImo}
                    alteracaoItemCargaImo={handleAlteracaoItemCargaImo}
                    excluirElemento={handleExluirLinhaCargaImo}
                />
            }
        </>
    )
}
