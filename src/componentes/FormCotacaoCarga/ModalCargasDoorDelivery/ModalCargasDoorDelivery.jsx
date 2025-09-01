import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import '../../../assets/css/Switch.css'

export default (props) => {
    const handleFecharModal = () => {
        props.exibirModalDoorDelivery(false)
    }
    const [tituloModalDoorDelivery, setTituloModalDoorDelivery] = useState('Adicionar');
    const [isCheckedDoorDeliveryIncluso, setIsCheckedDoorDeliveryIncluso] = useState(false);

    const [inputsDoorDelivery, setInputsDoorDelivery] = useState(
        {
            "endereco_door_delivery": '',
            "zip_code_door_delivery": '',
            "moeda_door_delivery": '',
            "unidade_door_delivery": '',
            "modalidade_door_delivery": '',
            "valor_compra_door_delivery": '',
            "valor_compra_minimo_door_delivery": "",
            "valor_compra_maximo_door_delivery": "",
            "valor_venda_door_delivery": "",
            "valor_venda_minimo_door_delivery": "",
            "valor_venda_maximo_door_delivery": "",
            "door_delivery_incluso": false
        }
    );

    const [mensagem_validacao, setMensagemValidacao] = useState(
        {
            "endereco_door_delivery": '',
            "zip_code_door_delivery": '',
            "moeda_door_delivery": '',
            "unidade_door_delivery": '',
            "modalidade_door_delivery": '',
            "valor_compra_door_delivery": '',
            "valor_compra_minimo_door_delivery": "",
            "valor_compra_maximo_door_delivery": "",
            "valor_venda_door_delivery": "",
            "valor_venda_minimo_door_delivery": "",
            "valor_venda_maximo_door_delivery": "",
            "door_delivery_incluso": "",
            "registro_ja_existe": ""
        }

    )


    useEffect(() => {
        if (props.listaDoorDelivery.length > 0 && props.novoItem === false) {
            setInputsDoorDelivery(values => ({
                ...values,
                ["endereco_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].endereco_door_delivery,
                ["zip_code_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].zip_code_door_delivery,
                ["moeda_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].moeda_door_delivery,
                ["unidade_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].unidade_door_delivery,
                ["modalidade_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].modalidade_door_delivery,
                ["valor_compra_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].valor_compra_door_delivery,
                ["valor_compra_minimo_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].valor_compra_minimo_door_delivery,
                ["valor_compra_maximo_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].valor_compra_maximo_door_delivery,
                ["valor_venda_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].valor_venda_door_delivery,
                ["valor_venda_minimo_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].valor_venda_minimo_door_delivery,
                ["valor_venda_maximo_door_delivery"]: props.listaDoorDelivery[props.indiceElementoAlteracao].valor_venda_maximo_door_delivery,
                ["door_delivery_incluso"]: props.listaDoorDelivery[props.indiceElementoAlteracao].door_delivery_incluso
            }))
            setTituloModalDoorDelivery("Alterar");
            setIsCheckedDoorDeliveryIncluso(props.listaDoorDelivery[props.indiceElementoAlteracao].door_delivery_incluso);
        } else {
            setInputsDoorDelivery(values => ({
                ...values,
                ["modalidade_door_delivery"]: props.modalidadeFreteSelecionada
            }))
        }
    }, [])


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputsDoorDelivery(values => ({ ...values, [name]: value }))
    }

    const handleChangeNumeric = (campo, valor) => {
        const name = campo;
        const value = valor;
        setInputsDoorDelivery(values => ({ ...values, [name]: value }))
    }

    const handleAdicionarDoorDelivery = (event) => {
        event.preventDefault();
        let salvar_door_delivery = true;

        if (inputsDoorDelivery.endereco_door_delivery == "") {
            setMensagemValidacao(values => ({ ...values, ["endereco_door_delivery"]: "Preencha o Endereço." }));
            salvar_door_delivery = false;
        } else {
            setMensagemValidacao(values => ({ ...values, ["endereco_door_delivery"]: "" }));
        }

        if (inputsDoorDelivery.zip_code_door_delivery == "") {
            setMensagemValidacao(values => ({ ...values, ["zip_code_door_delivery"]: "Preencha o campo Zip Code." }));
            salvar_door_delivery = false;
        } else {
            setMensagemValidacao(values => ({ ...values, ["zip_code_door_delivery"]: "" }));
        }

        if (inputsDoorDelivery.door_delivery_incluso !== true) {
            if (inputsDoorDelivery.moeda_door_delivery == "") {
                setMensagemValidacao(values => ({ ...values, ["moeda_door_delivery"]: "Selecione uma Moeda." }));
                salvar_door_delivery = false;
            } else {
                setMensagemValidacao(values => ({ ...values, ["moeda_door_delivery"]: "" }));
            }

            if (inputsDoorDelivery.unidade_door_delivery == "") {
                setMensagemValidacao(values => ({ ...values, ["unidade_door_delivery"]: "Selecione uma Unidade." }));
                salvar_door_delivery = false;
            } else {
                setMensagemValidacao(values => ({ ...values, ["unidade_door_delivery"]: "" }));
            }

            if (inputsDoorDelivery.modalidade_door_delivery == "") {
                setMensagemValidacao(values => ({ ...values, ["modalidade_door_delivery"]: "Selecione uma Modalidade." }));
                salvar_door_delivery = false;
            } else {
                setMensagemValidacao(values => ({ ...values, ["modalidade_door_delivery"]: "" }));
            }

            if (inputsDoorDelivery.valor_compra_door_delivery == "") {
                setMensagemValidacao(values => ({ ...values, ["valor_compra_door_delivery"]: "Preencha o valor de Compra." }));
                salvar_door_delivery = false;
            } else {
                setMensagemValidacao(values => ({ ...values, ["valor_compra_door_delivery"]: "" }));
            }

            if (inputsDoorDelivery.valor_venda_door_delivery == "") {
                setMensagemValidacao(values => ({ ...values, ["valor_venda_door_delivery"]: "Preencha o valor de Venda." }));
                salvar_door_delivery = false;
            } else {
                setMensagemValidacao(values => ({ ...values, ["valor_venda_door_delivery"]: "" }));
            }
        }

        if (props.novoItem === false) {
            let listaVerificacaoDoorDelivery = [];
            props.listaDoorDelivery.map((item, contador) => {
                if (contador != props.indiceElementoAlteracao) {
                    listaVerificacaoDoorDelivery = [...listaVerificacaoDoorDelivery, item];
                }
            });

            let valores_door_delivery = listaVerificacaoDoorDelivery.find(({ endereco_door_delivery }) => endereco_door_delivery === inputsDoorDelivery.endereco_door_delivery);
            if (valores_door_delivery) {
                setMensagemValidacao(values => ({ ...values, ["registro_ja_existe"]: "Endereço do Door Delivery já esta incluido" }));
                salvar_door_delivery = false;
            }
        } else {
            let valores_door_delivery = props.listaDoorDelivery.find(({ endereco_door_delivery }) => endereco_door_delivery === inputsDoorDelivery.endereco_door_delivery);
            if (valores_door_delivery) {
                setMensagemValidacao(values => ({ ...values, ["registro_ja_existe"]: "Endereço do Door Delivery já esta incluido" }));
                salvar_door_delivery = false;
            }
        }



        if (salvar_door_delivery === true) {
            if (props.novoItem === true) {
                props.atualizaDoorDelivery(inputsDoorDelivery);
                props.exibirModalDoorDelivery(false,false);

            } else {
                props.alteracaoItemDoorDelivery(inputsDoorDelivery, props.indiceElementoAlteracao)
                props.exibirModalDoorDelivery(false,false);
            }
        }
    }

    const handleExcluir = () => {
        props.excluirElemento(props.indiceElementoAlteracao)
        props.exibirModalDoorDelivery(false, true);
    }

    const handleDoorDeliveryIncluso = (objeto) => {
        setIsCheckedDoorDeliveryIncluso(!isCheckedDoorDeliveryIncluso);

        setInputsDoorDelivery(values => ({ ...values, ["moeda_door_delivery"]: "" }))
        setInputsDoorDelivery(values => ({ ...values, ["unidade_door_delivery"]: "" }))
        setInputsDoorDelivery(values => ({ ...values, ["modalidade_door_delivery"]: "" }))
        setInputsDoorDelivery(values => ({ ...values, ["valor_compra_door_delivery"]: "" }))
        setInputsDoorDelivery(values => ({ ...values, ["valor_compra_minimo_door_delivery"]: "" }))
        setInputsDoorDelivery(values => ({ ...values, ["valor_compra_maximo_door_delivery"]: "" }))
        setInputsDoorDelivery(values => ({ ...values, ["valor_venda_door_delivery"]: "" }))
        setInputsDoorDelivery(values => ({ ...values, ["valor_venda_minimo_door_delivery"]: "" }))
        setInputsDoorDelivery(values => ({ ...values, ["valor_venda_maximo_door_delivery"]: "" }))

        setInputsDoorDelivery(values => ({ ...values, ["door_delivery_incluso"]: objeto.target.checked }))
    }

    const formata_moeda = (campo,  objeto) => {
        let valor_auxiliar = objeto.target.value
        if(valor_auxiliar.indexOf(".") >=0) {
            valor_auxiliar = valor_auxiliar.replace(",");
        }
        let qtde_decimal = 2;
        valor_auxiliar = valor_auxiliar.replace(",","")
        let primeiro_caracter = valor_auxiliar.substr(0,1) 
        let caracter_atual = valor_auxiliar.substr(valor_auxiliar.length-1,1)
        if(caracter_atual != 1 && caracter_atual != 2 && caracter_atual != 3 && caracter_atual != 4 && caracter_atual != 5 && caracter_atual != 6 && caracter_atual != 7 && caracter_atual != 8 && caracter_atual != 9 && caracter_atual != 0) {
            objeto.target.value = objeto.target.value.substr(0,objeto.target.value.length-1);
            return false
        }
        let qtde_caracter = valor_auxiliar.length
        if(primeiro_caracter == 0 && qtde_caracter == 1) {
            valor_auxiliar = valor_auxiliar.substr(0,valor_auxiliar.length) 
        } else if(primeiro_caracter == 0 && qtde_caracter > 1) {
            valor_auxiliar = valor_auxiliar.substr(1,valor_auxiliar.length) 
        }
        qtde_caracter = valor_auxiliar.length

        if(qtde_caracter > qtde_decimal) {
            let valores = valor_auxiliar.substr(0,valor_auxiliar.length-qtde_decimal)
            let valores_decimais = valor_auxiliar.substr(valor_auxiliar.length-qtde_decimal,qtde_decimal)
            objeto.target.value = valores+","+valores_decimais
        } else if(qtde_caracter < qtde_decimal && qtde_caracter > 0){
            objeto.target.value = "0,0"+valor_auxiliar
        }else if(qtde_caracter == qtde_decimal) {
            objeto.target.value = "0,"+valor_auxiliar
        } else {
            objeto.target.value=""
        }

        const name = campo;
        const value = objeto.target.value.replace(",",".");
        setInputsDoorDelivery(values => ({ ...values, [name]: value }))
    }


    return (
        <div className='modal_registro container shadow-lg bg-white rounded no-gutters m-0'>
            <div className='row modal_registro-titulo'>
                <div className='col-11'>{tituloModalDoorDelivery} Door Delivery</div>
                <div className='col'>
                    <button onClick={handleFecharModal} name="fechar_modal_pickup" className='btn btn-outline-light btn-sm'> X </button>
                </div>
            </div>
            <form onSubmit={handleAdicionarDoorDelivery} >
                <div className="row">
                    <div className="col-3">
                        <label className="titulo">Zip Code</label>
                        <input type="text" className="form-control" value={inputsDoorDelivery.zip_code_door_delivery} onChange={handleChange} name="zip_code_door_delivery" />
                        <span className="campos_validacao">{mensagem_validacao.zip_code_door_delivery}</span>
                    </div>
                    <div className="col">
                        <label className="titulo">Endereço</label>
                        <input type="text" className="form-control" value={inputsDoorDelivery.endereco_door_delivery} onChange={handleChange} name="endereco_door_delivery" />
                        <span className="campos_validacao">{mensagem_validacao.endereco_door_delivery}</span>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-4">
                        <br />
                        <label className='switch'>
                            <input className="form-check-input" type="checkbox" onChange={handleDoorDeliveryIncluso} checked={isCheckedDoorDeliveryIncluso} name="check_door_delivery_incluso" />
                            <span className="slider round"></span>
                        </label>
                        <label className='titulo'>Door Delivery Incluso</label>
                    </div>
                    {isCheckedDoorDeliveryIncluso === false && (
                        <>
                            <div className="col-2">
                                <label className="titulo">Moeda</label>
                                <select name="moeda_door_delivery" onChange={handleChange} value={inputsDoorDelivery.moeda_door_delivery} className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="USD">USD</option>
                                    <option value="BRL">BRL</option>
                                    <option value="EUR">EUR</option>
                                </select>
                                <span className="campos_validacao">{mensagem_validacao.moeda_door_delivery}</span>
                            </div>
                            <div className="col-3">
                                <label className="titulo">Unidade</label>
                                <select name="unidade_door_delivery" onChange={handleChange} value={inputsDoorDelivery.unidade_door_delivery} className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="WM">WM</option>
                                    <option value="BL">BL</option>
                                    <option value="M3">M3</option>
                                    <option value="TON">TON</option>
                                </select>
                                <span className="campos_validacao">{mensagem_validacao.unidade_door_delivery}</span>
                            </div>
                            <div className="col-2">
                                <label className="titulo">Modalidade</label>
                                <select name="modalidade_door_delivery" onChange={handleChange} value={inputsDoorDelivery.modalidade_door_delivery} className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="PP">PP</option>
                                    <option value="CC">CC</option>
                                </select>
                                <span className="campos_validacao">{mensagem_validacao.modalidade_door_delivery}</span>
                            </div>
                        </>
                    )}
                </div>
                {isCheckedDoorDeliveryIncluso === false && (
                    <>
                        <br />
                        <div className="row">
                            <div className="col titulo border-bottom"><b>Compra</b></div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label className="titulo">Valor</label>
                                {
                                /*
                                <NumericFormat
                                className="form-control alinhamento_texto_direito"
                                name="valor_compra_door_delivery"
                                value={inputsDoorDelivery.valor_compra_door_delivery}
                                onValueChange={(values) => handleChangeNumeric("valor_compra_door_delivery", values.value)}
                                decimalSeparator=','
                                decimalScale={2}
                                />
                                */
                                }
                                <input
                                    type="text"
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_compra_door_delivery"
                                    defaultValue={String(inputsDoorDelivery.valor_compra_door_delivery).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_compra_door_delivery", e)}
                                />
                                <span className="campos_validacao">{mensagem_validacao.valor_compra_door_delivery}</span>
                            </div>
                            <div className="col">
                                <label className="titulo">Minimo</label>
                                {
                                /*
                                <NumericFormat
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_compra_minimo_door_delivery"
                                    value={inputsDoorDelivery.valor_compra_minimo_door_delivery}
                                    onValueChange={(values) => handleChangeNumeric("valor_compra_minimo_door_delivery", values.value)}
                                    decimalSeparator=','
                                    decimalScale={2}
                                />                                
                                */
                                }
                                <input
                                    type="text"
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_compra_minimo_door_delivery"
                                    defaultValue={String(inputsDoorDelivery.valor_compra_minimo_door_delivery).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_compra_minimo_door_delivery", e)}
                                />
                            </div>
                            <div className="col">
                                <label className="titulo">Maximo</label>
                                <input
                                    type="text"
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_compra_maximo_door_delivery"
                                    defaultValue={String(inputsDoorDelivery.valor_compra_maximo_door_delivery).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_compra_maximo_door_delivery", e)}
                                />
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col titulo border-bottom"><b>Venda</b></div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label className="titulo">Valor</label>
                                {/*
                                <NumericFormat
                                className="form-control alinhamento_texto_direito"
                                name="valor_venda_door_delivery"
                                value={inputsDoorDelivery.valor_venda_door_delivery}
                                onValueChange={(values) => handleChangeNumeric("valor_venda_door_delivery", values.value)}
                                decimalSeparator=','
                                decimalScale={2}
                                />
                                */
                                }
                                <input
                                type="text"
                                className="form-control alinhamento_texto_direito"
                                name="valor_venda_door_delivery"
                                defaultValue={String(inputsDoorDelivery.valor_venda_door_delivery).replace(".",",")}
                                onChange={(e) => formata_moeda("valor_venda_door_delivery", e)}
                                />
                                <span className="campos_validacao">{mensagem_validacao.valor_venda_door_delivery}</span>
                            </div>
                            <div className="col">
                                <label className="titulo">Minimo</label>
                                {/*
                                <NumericFormat
                                className="form-control alinhamento_texto_direito"
                                name="valor_venda_minimo_door_delivery"
                                value={inputsDoorDelivery.valor_venda_minimo_door_delivery}
                                onValueChange={(values) => handleChangeNumeric("valor_venda_minimo_door_delivery", values.value)}
                                decimalSeparator=','
                                decimalScale={2}
                                />
                                */
                                }
                                <input
                                    type="text"
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_venda_minimo_door_delivery"
                                    defaultValue={String(inputsDoorDelivery.valor_venda_minimo_door_delivery).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_venda_minimo_door_delivery", e)}
                                />
                            </div>
                            <div className="col">
                                <label className="titulo">Maximo</label>
                                {/*
                                <NumericFormat
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_venda_maximo_door_delivery"
                                    value={inputsDoorDelivery.valor_venda_maximo_door_delivery}
                                    onValueChange={(values) => handleChangeNumeric("valor_venda_maximo_door_delivery", values.value)}
                                    decimalSeparator=','
                                    decimalScale={2}
                                />                                
                                */
                                <input
                                    type="text"
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_venda_maximo_door_delivery"
                                    defaultValue={String(inputsDoorDelivery.valor_venda_maximo_door_delivery).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_venda_maximo_door_delivery", e)}
                                />
                                }
                            </div>
                        </div>
                    </>
                )}
                <br />
                <div className="row">
                    <div className="col">
                        <span className="campos_validacao">{mensagem_validacao.registro_ja_existe}</span>
                        <br />
                        <button name="salvar" className="btn btn-outline-dark btn-sm">Salvar</button>&nbsp;
                        {props.novoItem === false && (
                            <button type="button" onClick={handleExcluir} name="excluir" className="btn btn-outline-dark btn-sm">Excluir</button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}