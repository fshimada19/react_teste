import { Component, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import api from '../../../api';
import Swal from 'sweetalert2';

export default (props) => {
    const [pickupSelecionado, setPickupSelecionado] = useState("");
    const [doorDeliverySelecionado, setDoorDeliverySelecionado] = useState("");
    const [cargaImoSelecionado, setCargaImoSelecionado] = useState("");
    const [valuePeso,setValuePeso] = useState('');
    const [valueCubagem,setValueCubagem] = useState('');
    const [valueVolume,setvalueVolume] = useState('');
    const [valueAltura,setValueAltura] = useState('');
    const [valueLargura,setValueLargura] = useState('');
    const [valueComprimento,setValueComprimento] = useState('')

    const [campoMedidaPeso,setCampoMedidaPeso] = useState('Peso Total');
    const [campoMedidaCubagem,setCampoMedidaCubagem] = useState('Cubagem');
    const [campoTipoCalculoMedida,setCampoTipoCalculoMedida] = useState("M/KG");
    const [labelCampoCubagem,setLabelCampoCubagem] = useState("Cubagem Total")
    const [labelSufixPeso,setLabelSufixPeso] = useState("KG");
    const [labelSufixCubagem,setLabelSufixCubagem] = useState("M");
    const [labelVolumeQuantidade, setlabelVolumeQuantidade] = useState("Total de Volumes");
    const [tipoCalculoMedidaSetado, setTipoCalculoMedidaSetado] = useState("M");

    const [selecaoPickupManual, setSelecaoPickupManual] = useState(0);
    const [selecaoDoorDeliveryManual, setSelecaoManualDoorDelivery] = useState(0);

    

    function excluir_item_carga(indiceItemCarga) {
        props.atualizarListaItensCarga(indiceItemCarga);
    }

    const handleChangePickup = (event) => {
        setPickupSelecionado(event.target.value);
        //console.log("Valor Compra: "+event.target.options[event.target.options.selectedIndex].getAttribute("valor_compra"),"|","Valor Venda: "+event.target.options[event.target.options.selectedIndex].getAttribute("valor_venda"));
        setSelecaoPickupManual(1);

        props.atualizaDadosListaItemCarga("pickupSelecionado", event.target.value, props.indexItemCarga)        
        props.pickupOuDoorDeliverySelecionado(true);
    }
    const handleChangeDoorDelivery = (event) => {
        setDoorDeliverySelecionado(event.target.value);
        setSelecaoManualDoorDelivery(1);

        props.atualizaDadosListaItemCarga("doorDeliverySelecionado", event.target.value, props.indexItemCarga)        
        props.pickupOuDoorDeliverySelecionado(true);
    }

    const handleChangeCargaImo = (event) => {
        setCargaImoSelecionado(event.target.value);
        if(valueDescricao.value === "" && event.target.value !== "") {
            setValueDescricao({"value":"Imo - Hazardous Cargo","label":"Imo - Hazardous Cargo"})
            props.atualizaDadosListaItemCarga("descricao", "Imo - Hazardous Cargo", props.indexItemCarga)        
        } else {
            if(event.target.value === "") {
                setValueDescricao({"value":"","label":""});
                props.atualizaDadosListaItemCarga("descricao", "", props.indexItemCarga);
            }
        }

        props.atualizaDadosListaItemCarga("imoSelecionado", event.target.value, props.indexItemCarga)        
    }

    /*const handleVolumeTotal = (event) => {
        props.atualizaQuantidadeTotal(event.target.value,props.indexItemCarga)
    }*/

    const handlechange = (event) => {
        if(event.target.name == "total_volumes_item_carga") {
            setvalueVolume(event.target.value);
            calculoDimensoes.quantidade = event.target.value;
            if(campoMedidaPeso == "Peso") {
                calculaPeso("peso");
            }
            props.atualizaMedidasTotais(event.target.value,props.indexItemCarga,"volume");
        }
    }



    const [calculoDimensoes,setCalculoDimensoes] = useState({"altura":0.000,"largura":0.000,"comprimento":0.000,"quantidade":0});

    function calcular_inches_to_metters(valorInches) {
        let inches = parseFloat(valorInches);
        if(parseFloat(inches) > 0) {
            return (parseFloat(inches) / parseFloat('61024'));
        }    
    }

    const [valor_inches_calculado, setValorInchesCalculado] = useState(0.00);
    function calcula_valor_inches(tipo) {
        if(tipoCalculoMedidaSetado !== "M" || tipo === "inches") {
            if(valor_inches_calculado !== valueCubagem) {
                let valor_inches = calcular_inches_to_metters(valueCubagem);
                setValueCubagem(parseFloat(valor_inches).toFixed(3));
                setValorInchesCalculado(parseFloat(valor_inches).toFixed(3));
                props.atualizaMedidasTotais("1",props.indexItemCarga,"valores_em_inches");
            }    
        } else {
            props.atualizaMedidasTotais("0",props.indexItemCarga,"valores_em_inches");
        }
    }

    function calcular_libras_to_kg(valorLibras) {
        let libras = parseFloat(valorLibras);
        if(parseFloat(libras) > 0) {
            return (parseFloat(libras)/parseFloat('2.2046'));
        }
    }


    function calculadoraMedidas(tipo,sem_retorno=false) {
        if(tipo != "cubagem") {
            if(sem_retorno === false) {
                props.atualizaMedidasTotais(0,props.indexItemCarga,"cubagem");
            }

            if(calculoDimensoes.altura > 0 && calculoDimensoes.largura > 0 && calculoDimensoes.comprimento > 0 && calculoDimensoes.quantidade > 0) {
                let calculo = (parseFloat(calculoDimensoes.altura) * parseFloat(calculoDimensoes.comprimento) * parseFloat(calculoDimensoes.largura)) * parseFloat(calculoDimensoes.quantidade);
                if(tipoCalculoMedidaSetado !== "M") {
                    calculo = calcular_inches_to_metters(calculo);
                    props.atualizaMedidasTotais("1",props.indexItemCarga,"valores_em_inches");
                } else {
                    props.atualizaMedidasTotais("0",props.indexItemCarga,"valores_em_inches");
                }
                calculo = calculo.toFixed(3);
                if(sem_retorno === false) {
                    props.atualizaMedidasTotais(calculo,props.indexItemCarga,"dimensoes",calculoDimensoes.altura,calculoDimensoes.largura,calculoDimensoes.comprimento);
                } else {
                    return calculo;
                }
            }    
        } else {
            props.atualizaMedidasTotais(0,props.indexItemCarga,"dimensoes",calculoDimensoes.altura,calculoDimensoes.largura,calculoDimensoes.comprimento);
            props.atualizaMedidasTotais(valueCubagem,props.indexItemCarga,"cubagem");
        }
    }

    function calculaPeso(tipo,valor) {
        if(tipo == "peso") {
            let calculo_peso_total = 0.000;
            let peso_mencionado = 0.000;
            if(!valor) {
                if(valuePeso != "" && calculoDimensoes.quantidade != "") {
                    calculo_peso_total = parseFloat(valuePeso) * parseInt(calculoDimensoes.quantidade);
                }
                peso_mencionado  = parseFloat(valuePeso);
            } else {
                calculo_peso_total = parseFloat(valor) * parseInt(calculoDimensoes.quantidade);
                peso_mencionado = parseFloat(valor);
            }
            let calculo_peso_libras = "";
            if(tipoCalculoMedidaSetado != "M") {
                calculo_peso_libras = calcular_libras_to_kg(calculo_peso_total);
            }

            calculo_peso_total = parseFloat(calculo_peso_total).toFixed(3);
            props.atualizaMedidasTotais(peso_mencionado,props.indexItemCarga,"peso", "", "", "", calculo_peso_libras,"", calculo_peso_total);
        } else {
            props.atualizaMedidasTotais(valuePeso,props.indexItemCarga,"peso");
        }
    }

    function handleChangeNumericField(campo, valor) {
        if(campo == "peso") {
            setValuePeso(valor);
            let calculo = "";
            if(tipoCalculoMedidaSetado != "M") {
                calculo = calcular_libras_to_kg(valor);
                calculo = parseFloat(calculo).toFixed(3); 
            }
            if(campoMedidaPeso === "Peso") {                
                calculaPeso("peso",valor);
            } else {
                props.atualizaMedidasTotais(valor,props.indexItemCarga,"peso","", "", "", calculo,"");
            }            
        }
        if(campo == "cubagem") {
            setValueCubagem(valor);
            let calculo = "";
            calculoDimensoes.comprimento = valor;
            if(tipoCalculoMedidaSetado != "M") {
                calculo = calcular_inches_to_metters(valor);                
                calculo = parseFloat(calculo).toFixed(3);
            }
            props.atualizaMedidasTotais(valor,props.indexItemCarga,"cubagem","", "", "", "", calculo);
        }
        if(campo == "comprimento") {
            calculoDimensoes.comprimento = valor;             
            calculadoraMedidas("dimensoes");
        }
        if(campo == "altura") {
            setValueAltura(valor);
            calculoDimensoes.altura = valor;
            calculadoraMedidas("dimensoes");
        }
        if(campo == "largura") {
            setValueLargura(valor);
            calculoDimensoes.largura = valor;
            calculadoraMedidas("dimensoes");
        }
        if(campo == "quantidade") {
            calculoDimensoes.quantidade = valor;
            props.atualizaMedidasTotais(valor,props.indexItemCarga,"volume");
            setvalueVolume(valor);
            calculadoraMedidas("dimensoes");
            if(campoMedidaPeso == "Peso") {
                calculaPeso("peso");
            }
        }

    }


    function alteraCamposMedidas(tipo,tituloCampos) {
        if(tipo == "peso") {
            if(tituloCampos == "Peso") {
                setCampoMedidaPeso("Peso Total");
                calculaPeso("peso_total");
            } else {
                setCampoMedidaPeso("Peso");
                calculaPeso("peso");
            }
        }

        if(tipo == "cubagem") {
            if(tituloCampos == "Cubagem") {
                setCampoMedidaCubagem("Dimensões");
                setLabelCampoCubagem("Comprimento");
                setlabelVolumeQuantidade("Quantidade");
                calculadoraMedidas("dimensoes");
            } else {
                setCampoMedidaCubagem("Cubagem");
                setLabelCampoCubagem("Cubagem Total");
                setlabelVolumeQuantidade("Total de Volumes");
                calculadoraMedidas("cubagem");
            }
        }

        if(tipo == "tipo_calculo_medida") {
            if(tituloCampos == "M/KG") {
                setCampoTipoCalculoMedida("In/Lb");
                setLabelSufixPeso("lb");                
                setLabelSufixCubagem("in");
                setTipoCalculoMedidaSetado("in");
                calcula_valor_inches("inches");
            } else {
                setCampoTipoCalculoMedida("M/KG");
                setLabelSufixPeso("kg");                
                setLabelSufixCubagem("m");
                setTipoCalculoMedidaSetado("M");
            }
        }
    }



    const [ncmItemCarga,setNcmItemCarga] = useState('Não Informado');
    const handleChangeNcmItemCarga = (event) => {
        setNcmItemCarga(event.target.value);
        props.atualizaDadosListaItemCarga("ncm", event.target.value, props.indexItemCarga)
    }
    
    const [valueDescricao, setValueDescricao] = useState([]);
    const handleChangeDescricao = (selectedOption) => {
        if(selectedOption !== null) {
            setValueDescricao(selectedOption);
            props.atualizaDadosListaItemCarga("descricao", selectedOption.value, props.indexItemCarga)    
        } else {
            let selecao_vazia = {"value":"","label":""}
            setValueDescricao(selectedOption);
            props.atualizaDadosListaItemCarga("descricao", "", props.indexItemCarga)    
        }
    }

    const [listaDescricaoMercadoria, setListaDescricaoMercadoria] = useState([]);
    const [carregarDescricoes, setCarregarDescricoes] = useState(true);

    async function listarDescricoes() {
        let listaDescricaoMercadoria = await api.get(props.urlApis+props.apiDados+"ListarDescricoesMercadoriaCombo.php",{
            "Content-Type": "application/json; charset=utf-8"          
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });    
        let valor_option_descricao_mercadoria = [];
        for(let i=0;i<listaDescricaoMercadoria.length;i++) {
            valor_option_descricao_mercadoria[i] = {"value":listaDescricaoMercadoria[i].value, "label":listaDescricaoMercadoria[i].label}
        }
        setListaDescricaoMercadoria(valor_option_descricao_mercadoria);
        setCarregarDescricoes(false);
    }


    const handleCreateDescricao = (selectedOption) => {
        setValueDescricao({label:selectedOption,value:selectedOption});
        props.atualizaDadosListaItemCarga("descricao", selectedOption, props.indexItemCarga);
        Swal.fire({
            title: "Incluir Descrição Mercadoria",
            text: "Deseja Incluir a Descrição da Mercadoria para novas propostas ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            cancelButtonText:"Não"
          }).then(async(result) => {
            if (result.isConfirmed) {                
                let retorno_funcao = await api.post(props.urlApis+props.apiDados+"incluirDescricaoMercadoriaProposta.php",{                    
                    descricao_mercadoria:selectedOption
                  }).then((response) => {
                    return response.data
                }).catch((err) => {
                    console.error("Ocorreu um erro" + err);
                });
        
                if(retorno_funcao.status == "sucesso") {
                    Swal.fire({
                        title: "Mercadoria Incluida!",
                        text: retorno_funcao.mensagem,
                        icon: "success"
                      });                                                            
                }
            }
        });        
    }

    useEffect(() => {
        if(props.listaCargaImo.length === 0) {
            props.atualizaDadosListaItemCarga("imoSelecionado", "", props.indexItemCarga);
        }
    },[props.listaCargaImo])

    useEffect(() => {
    },[props.limpar_dados])

    useEffect(() => {
        if(props.remover_selecao_pickup_proposta_gemea === true) {
            setPickupSelecionado("");
            props.atualizaDadosListaItemCarga("pickupSelecionado", "", props.indexItemCarga);
        }
    },[props.remover_selecao_pickup_proposta_gemea]);

    useEffect(() => {
        if(props.removerSelecaoDoorDeliveryPropostaGemea === true) {
            setDoorDeliverySelecionado("");
            props.atualizaDadosListaItemCarga("doorDeliverySelecionado", "", props.indexItemCarga);
        }
    },[props.removerSelecaoDoorDeliveryPropostaGemea]);

    const [carregarDadosSalvos, setCarregarDadosSalvos] = useState(true);
    useEffect(() => {
        if (props.listaPickups.length > 1) {
            if(selecaoPickupManual === 0) {
                if(props.dados_proposta_salva === null) {
                    setPickupSelecionado("");
                    props.atualizaDadosListaItemCarga("pickupSelecionado", "", props.indexItemCarga);    
                } else {
                    setPickupSelecionado(props.dadosPickupSelecionado);
                    props.atualizaDadosListaItemCarga("pickupSelecionado", props.dadosPickupSelecionado, props.indexItemCarga);
                }
            }
        } else {
            //props.atualizaDadosListaItemCarga("doorDeliverySelecionado", event.target.value, props.indexItemCarga)        
            if (props.listaPickups.length == 1) {
                if(selecaoPickupManual === 0) {
                    if(props.dados_proposta_salva === null) {
                        props.listaPickups.map((item, contadorItem) => {
                            setPickupSelecionado(item.endereco_pickup);
                            props.atualizaDadosListaItemCarga("pickupSelecionado", item.endereco_pickup, props.indexItemCarga);
                        });    
                    } else {
                        setPickupSelecionado(props.dadosPickupSelecionado);
                        props.atualizaDadosListaItemCarga("pickupSelecionado", props.dadosPickupSelecionado, props.indexItemCarga);
                    }
                }
            } else {
                if(props.dados_proposta_salva === null) {
                    props.atualizaDadosListaItemCarga("pickupSelecionado", "", props.indexItemCarga);
                } else {
                    setPickupSelecionado(props.dadosPickupSelecionado);
                    props.atualizaDadosListaItemCarga("pickupSelecionado", props.dadosPickupSelecionado, props.indexItemCarga);
                }
            }
        }

        if(props.item_carga_salvo) {
            if(carregarDadosSalvos === true && props.item_carga_salvo !== null) {
                setValuePeso(props.item_carga_salvo.peso);            
                setValueCubagem(props.item_carga_salvo.cubagem);
                setvalueVolume(props.item_carga_salvo.volume);
                calculoDimensoes.quantidade = props.item_carga_salvo.volume;
                setValueDescricao({"value":props.item_carga_salvo.descricao,"label":props.item_carga_salvo.descricao});
                setNcmItemCarga(props.item_carga_salvo.ncm);
                let medidas_inches = false;
                if(props.item_carga_salvo.altura !== "" && props.item_carga_salvo.altura !== "0" && props.item_carga_salvo.altura !== 0) {
                    setValueAltura(props.item_carga_salvo.altura)
                    calculoDimensoes.altura = props.item_carga_salvo.altura;
                    setValueComprimento(props.item_carga_salvo.comprimento);
                    calculoDimensoes.comprimento = props.item_carga_salvo.comprimento;
                    setValueLargura(props.item_carga_salvo.largura);
                    calculoDimensoes.largura = props.item_carga_salvo.largura;
                    let resultado_calculo_dimensoes = calculadoraMedidas("dimensoes",true);
                    if(parseFloat(resultado_calculo_dimensoes) > parseFloat(props.dados_proposta_salva.dados_carga.cubagem_total)) {
                        medidas_inches = true;
                    }
                    alteraCamposMedidas("cubagem","Cubagem");
                } else {
                    alteraCamposMedidas("dimensoes","Dimensoes");
                }

                if(props.item_carga_salvo.valores_em_inches) {
                    if(props.item_carga_salvo.valores_em_inches === true) {
                        setCampoTipoCalculoMedida("In/Lb");
                        setLabelSufixPeso("lb");                
                        setLabelSufixCubagem("in");
                        setTipoCalculoMedidaSetado("in");
                        setValorInchesCalculado(props.item_carga_salvo.cubagem);
                    }
                } else {
                    if(props.item_carga_salvo.pesoLibra) {
                        if(props.item_carga_salvo.pesoLibra !== "") {
                            setCampoTipoCalculoMedida("In/Lb");
                            setLabelSufixPeso("lb");                
                            setLabelSufixCubagem("in");
                            setTipoCalculoMedidaSetado("in");
                            setValorInchesCalculado(props.item_carga_salvo.cubagem);
                        } else {
                            if(medidas_inches === true) {
                                setCampoTipoCalculoMedida("In/Lb");
                                setLabelSufixPeso("lb");                
                                setLabelSufixCubagem("in");
                                setTipoCalculoMedidaSetado("in");
                                setValorInchesCalculado(props.item_carga_salvo.cubagem);    
                            }
                        }    
                    } else {
                        if(medidas_inches === true) {
                            setCampoTipoCalculoMedida("In/Lb");
                            setLabelSufixPeso("lb");                
                            setLabelSufixCubagem("in");
                            setTipoCalculoMedidaSetado("in");
                            setValorInchesCalculado(props.item_carga_salvo.cubagem);    
                        }
                    }    
                }

                if(props.item_carga_salvo.peso_quantidade) {
                    if(props.item_carga_salvo.peso_quantidade !== "" && props.item_carga_salvo.peso_quantidade !== "0.000") {
                        setCalcularPesoQuantidade(true);
                    }
                }
                
                setCarregarDadosSalvos(false);
            } else {
                setValuePeso(props.pesoItemCarga);
                setValueCubagem(props.cubagemItemCarga)
                setvalueVolume(props.volumeItemCarga)
                setValueDescricao({"value":props.descricaoItemCarga,"label":props.descricaoItemCarga});
                setNcmItemCarga(props.ncmItemCarga);
        
                setValueAltura(props.alturaItemCarga)
                setValueComprimento(props.comprimentoItemCarga)
                setValueLargura(props.larguraItemCarga);
            }    
        } else {
            setValuePeso(props.pesoItemCarga);
            setValueCubagem(props.cubagemItemCarga)
            setvalueVolume(props.volumeItemCarga)
            setValueDescricao({"value":props.descricaoItemCarga,"label":props.descricaoItemCarga});
            setNcmItemCarga(props.ncmItemCarga);
    
            setValueAltura(props.alturaItemCarga)
            setValueComprimento(props.comprimentoItemCarga)
            setValueLargura(props.larguraItemCarga);
        }

        if (props.listaDoorDelivery.length > 1) {
            if(selecaoDoorDeliveryManual === 0) {
                if(props.dados_proposta_salva === null) {
                    setDoorDeliverySelecionado("");
                    props.atualizaDadosListaItemCarga("doorDeliverySelecionado", "", props.indexItemCarga);    
                } else {
                    setDoorDeliverySelecionado(props.dadosDoorDeliverySelecionado);
                    props.atualizaDadosListaItemCarga("doorDeliverySelecionado", props.dadosDoorDeliverySelecionado, props.indexItemCarga);    
                }
            }
        } else {
            if (props.listaDoorDelivery.length == 1) {
                if(selecaoDoorDeliveryManual === 0) {
                    if(props.dados_proposta_salva === null) {
                        props.listaDoorDelivery.map((item, contadorItem) => {
                            setDoorDeliverySelecionado(item.endereco_door_delivery);
                            props.atualizaDadosListaItemCarga("doorDeliverySelecionado", item.endereco_door_delivery, props.indexItemCarga);
                        })    
                    } else {
                        setDoorDeliverySelecionado(props.dadosDoorDeliverySelecionado);                        
                        props.atualizaDadosListaItemCarga("doorDeliverySelecionado", props.dadosDoorDeliverySelecionado, props.indexItemCarga);
                    }
                }
            } else {
                if(props.dados_proposta_salva === null) {
                    props.atualizaDadosListaItemCarga("doorDeliverySelecionado", "", props.indexItemCarga);
                } else {
                    props.atualizaDadosListaItemCarga("doorDeliverySelecionado", props.dadosDoorDeliverySelecionado, props.indexItemCarga);
                }
            }
        }    


        if(carregarDescricoes == true) {
            listarDescricoes();
        }    

    }, [props.listaPickups, 
        props.listaDoorDelivery, 
        props.pesoItemCarga, 
        props.cubagemItemCarga,
        props.volumeItemCarga, 
        props.alturaItemCarga,
        props.comprimentoItemCarga,
        props.larguraItemCarga,
        carregarDescricoes]);


    useEffect(() => {
        if(props.dados_proposta_salva !== null) {
            if(props.item_carga_salvo) {
                setCargaImoSelecionado(props.item_carga_salvo.imoSelecionado);
                props.atualizaDadosListaItemCarga("imoSelecionado", props.item_carga_salvo.imoSelecionado, props.indexItemCarga);    
            }
        }
    },[props.dados_proposta_salva])

    const [calcular_peso_quantidade,setCalcularPesoQuantidade] = useState(false) 
    useEffect(() => {
        if(calcular_peso_quantidade === true) {
            alteraCamposMedidas("peso","Peso Total");
            setCalcularPesoQuantidade(false);
        } 
    },[calcular_peso_quantidade])

    return (
        <div className="row mb-1">
            <div className="col-12">
                <div className="row mb-1">
                    <div className="col-2" >
                        <label className='titulo'><b>Carga#{props.contadorItem}&nbsp;&nbsp;</b> </label>
                    </div>
                    <div className="col d-flex justify-content-end">
                    {props.listaPickups.length > 0 && (
                            <>
                            <span className='titulo'>Pickup:&nbsp;</span>
                                <select name="listaPickups" onChange={handleChangePickup} value={pickupSelecionado} className='form_select'>
                                <option 
                                    value=""
                                    pickup_incluso=""
                                    zip_code=""
                                    unidade=""
                                    moeda=""
                                    valor_compra="" 
                                    valor_compra_minimo=""
                                    valor_compra_maximo=""                             
                                    valor_venda=""
                                    valor_venda_minimo=""
                                    valor_venda_maximo=""

                                >
                                        Sem Pickup
                                    </option>
                                    {
                                        props.listaPickups.map((item, contadorItem) => (
                                        <option 
                                            key={contadorItem}
                                            pickup_incluso={item.pickup_incluso===true?1:0}
                                            zip_code={item.zip_code_pickup}
                                            value={item.endereco_pickup} 
                                            unidade={item.unidade_pickup}
                                            moeda={item.moeda_pickup}
                                            valor_compra={item.valor_compra_pickup} 
                                            valor_compra_minimo={item.valor_compra_minimo_pickup}
                                            valor_compra_maximo={item.valor_compra_maximo_pickup}
                                            valor_venda={item.valor_venda_pickup}
                                            valor_venda_minimo={item.valor_venda_minimo_pickup}
                                            valor_venda_maximo={item.valor_venda_maximo_pickup}
                                            cubagem={(props.valor_cubagem_dimensao_item_carga !== "" && valueCubagem === 0)?props.valor_cubagem_dimensao_item_carga:valueCubagem}
                                            peso={valuePeso}
                                            indice_lista_pickup={contadorItem}
                                        >
                                            {item.endereco_pickup}
                                        </option>
                                    ))
                                }
                            </select>
                            </>
                    )}
                    {props.listaDoorDelivery.length > 0 && (                        
                            <>                            
                            &nbsp;
                            <span className='titulo'>Door Delivery:</span>&nbsp;
                            <select name="listaDoorDelivery" onChange={handleChangeDoorDelivery} value={doorDeliverySelecionado} className='form_select'>
                                <option value="">Sem Door Delivery</option>
                                {
                                    props.listaDoorDelivery.map((item, contadorItem) => (
                                        <option 
                                            key={contadorItem} 
                                            value={item.endereco_door_delivery} 
                                            door_delivery_incluso={item.door_delivery_incluso===true?1:0}
                                            zip_code={item.zip_code_door_delivery}
                                            unidade={item.unidade_door_delivery}
                                            moeda={item.moeda_door_delivery}
                                            valor_compra={item.valor_compra_door_delivery} 
                                            valor_compra_minimo={item.valor_compra_minimo_door_delivery}
                                            valor_compra_maximo={item.valor_compra_maximo_door_delivery}
                                            valor_venda={item.valor_venda_door_delivery}
                                            valor_venda_minimo={item.valor_venda_minimo_door_delivery}
                                            valor_venda_maximo={item.valor_venda_maximo_door_delivery}
                                            peso={valuePeso} 
                                            cubagem={(props.valor_cubagem_dimensao_item_carga !== "" && valueCubagem === 0)?props.valor_cubagem_dimensao_item_carga:valueCubagem}
                                        >
                                            {item.endereco_door_delivery}
                                        </option>
                                    ))
                                }
                            </select>
                            </>
                        )
                    }
                    {props.listaCargaImo.length > 0 && (
                            <>
                            &nbsp;
                            <span className='titulo'>Imo:</span>&nbsp;
                            <select name="listaCargaImo" onChange={handleChangeCargaImo} defaultValue={(cargaImoSelecionado === "" && ((props.item_carga_salvo)))?props.item_carga_salvo.imoSelecionado:cargaImoSelecionado} className='form_select'>
                                <option value="">Sem Carga Imo</option>
                                {
                                    props.listaCargaImo.map((item, contadorItem) => (
                                        <option key={contadorItem} value={item.classe_imo_value+"|"+item.carregamento_direto+"|"+item.un_imo+"|"+item.packing_group} >{item.classe_imo_label}</option>
                                    ))
                                }
                            </select>                    
                            </>
                        )
                    }
                    &nbsp;
                    {props.pesoTotalDigitadoChecado === false && (
                        <span>
                            <Link onClick={()=>alteraCamposMedidas("peso",campoMedidaPeso)} >{campoMedidaPeso}</Link>
                        </span>
                    )}
                    &nbsp;
                    &nbsp;
                    <span>
                        <Link onClick={()=>alteraCamposMedidas("cubagem",campoMedidaCubagem)}>{campoMedidaCubagem}</Link>
                    </span>
                    &nbsp;
                    &nbsp;
                    <span>
                        <Link onClick={()=>alteraCamposMedidas("tipo_calculo_medida",campoTipoCalculoMedida)}>{campoTipoCalculoMedida}</Link>
                    </span>
                    &nbsp;
                    &nbsp;


                    {props.listaItensCarga.length > 1 && (
                        <>
                        &nbsp;&nbsp;&nbsp;
                        <button type="button" onClick={() => excluir_item_carga(props.indexItemCarga)} className='btn btn-outline-dark btn-sm' name="exclui_item_carga"> X </button>
                        </>
                    )}
                    </div>
                </div>
                <div className="row mb-1">
                    <div className="col-2" >
                        <label className='titulo'>{labelVolumeQuantidade}</label>
                        {campoMedidaCubagem === "Dimensões" ? (
                                <NumericFormat 
                                className="form-control border-bottom alinhamento_texto_direito"
                                value={valueVolume}
                                name="total_quantidade"
                                onValueChange={(values)=>handleChangeNumericField('quantidade',values.value)}
                                />
                        ):(
                            <input 
                                type="text" 
                                onChange={handlechange} 
                                className="form-control border-bottom alinhamento_texto_direito" 
                                name="total_volumes_item_carga" 
                                value={valueVolume}
                            />
                        )
                        }
                        <span className='campos_validacao'>{props.mensagens_validacao.volume_item_carga}</span>
                    </div>
                    {
                        props.pesoTotalDigitadoChecado === false && (
                            <div className="col-2">
                                <label className='titulo'>{campoMedidaPeso}</label>
                                <NumericFormat 
                                    value={valuePeso} 
                                    className="form-control border-bottom alinhamento_texto_direito" 
                                    name="total_peso_item_carga"
                                    onValueChange={(values)=>handleChangeNumericField('peso',values.value)}
                                    decimalSeparator=','
                                    decimalScale={3}
                                    suffix={" "+labelSufixPeso}
                                />
                                <span className='campos_validacao'>{props.mensagens_validacao.peso_item_carga}</span>                                
                            </div>    
                        ) 
                    }
                    <div className="col-2">
                        <label className='titulo'>{labelCampoCubagem}</label>
                        {campoMedidaCubagem === "Dimensões" ? 
                        (
                            <NumericFormat 
                            className="form-control border-bottom alinhamento_texto_direito" 
                            name="total_comprimento"
                            value={valueComprimento}
                            onValueChange={(values)=>handleChangeNumericField('comprimento',values.value)}
                            decimalSeparator=','
                            decimalScale={3}
                            suffix={" "+labelSufixCubagem}
                            />

                        ):(
                            <NumericFormat 
                            value={valueCubagem}
                            onBlur={()=>calcula_valor_inches("")}
                            className="form-control border-bottom alinhamento_texto_direito"
                            name="total_cubagem" 
                            onValueChange={(values)=>handleChangeNumericField('cubagem',values.value)}
                            decimalSeparator=','
                            decimalScale={3}
                            suffix={" "+labelSufixCubagem}
                            />
                        )}
                        <span className='campos_validacao'>{props.mensagens_validacao.cubagem_item_carga}</span>
                    </div>
                    {campoMedidaCubagem === "Dimensões" && (
                        <>
                        <div className="col-1">
                            <label className='titulo'>Largura</label>
                            <NumericFormat 
                                className="form-control border-bottom alinhamento_texto_direito"
                                value={valueLargura}
                                name="largura" 
                                onValueChange={(values)=>handleChangeNumericField('largura',values.value)}
                                decimalSeparator=','
                                suffix={" "+labelSufixCubagem} 
                            />
                            <span className='campos_validacao'>{props.mensagens_validacao.largura_item_carga}</span>
                        </div>
                        <div className="col-1">
                            <label className='titulo'>Altura</label>
                            <NumericFormat 
                                className="form-control border-bottom alinhamento_texto_direito"
                                value={valueAltura}
                                name="altura" 
                                onValueChange={(values)=>handleChangeNumericField('altura',values.value)}
                                decimalSeparator=','
                                suffix={" "+labelSufixCubagem}                                
                            />
                            <span className='campos_validacao'>{props.mensagens_validacao.altura_item_carga}</span>                            
                        </div>
                        </>
                    )

                    }
                    {
                        props.descricaoUnicaChecado == false && (
                            <>
                            <div className="col-2">
                                <label className='titulo'>NCM</label>
                                <input type="text" value={ncmItemCarga} onChange={handleChangeNcmItemCarga} className="form-control border-bottom" name="ncm" id="ncm" />
                            </div>
                            <div className="col-2">
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
                                    <span className='campos_validacao'>{props.mensagens_validacao.descricao_item_carga}</span>                            
                            </div>
                            </>    
                        )
                    }
                </div>
            </div>
            <br />
        </div>

    )
}
