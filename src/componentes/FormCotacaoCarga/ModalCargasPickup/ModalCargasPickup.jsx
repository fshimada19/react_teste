import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import '../../../assets/css/Switch.css'

export default (props) => {
    const handleFecharModalPickup = () => {
        props.exibirModalPickup(false)
    }

    const [inputsPickup, setInputsPickup] = useState(
        {
            "endereco_pickup": '',
            "zip_code_pickup": '',
            "moeda_pickup": '',
            "unidade_pickup": '',
            "modalidade_pickup": '',
            "valor_compra_pickup": '',
            "valor_compra_minimo_pickup": "",
            "valor_compra_maximo_pickup": "",
            "valor_venda_pickup": "",
            "valor_venda_minimo_pickup": "",
            "valor_venda_maximo_pickup": "",
            "pickup_incluso": false
        }
    );

    const [mensagem_validacao,setMensagemValidacao] = useState(
        {
            "endereco_pickup": '',
            "zip_code_pickup": '',
            "moeda_pickup": '',
            "unidade_pickup": '',
            "modalidade_pickup": '',
            "valor_compra_pickup": '',
            "valor_compra_minimo_pickup": "",
            "valor_compra_maximo_pickup": "",
            "valor_venda_pickup": "",
            "valor_venda_minimo_pickup": "",
            "valor_venda_maximo_pickup": "",
            "pickup_incluso": "",
            "registro_ja_existe": ""
        }

    )

    const [isCheckedPickupIncluso, setIsCheckedPickupIncluso] = useState(false);


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputsPickup(values => ({ ...values, [name]: value }))
    }

    function handleChangeNumeric(campo, valor) {
        const name = campo;
        const value = valor;
        setInputsPickup(values => ({ ...values, [name]: value }))
    }

    const handleSalvarPickup = (event) => {
        event.preventDefault();
        let salvar_pickup = true;
        if(inputsPickup.endereco_pickup == "") {
            setMensagemValidacao(values => ({...values,["endereco_pickup"]:"Preencha o Endereço do Pickup."}));
            salvar_pickup = false;
        } else {
            setMensagemValidacao(values => ({...values,["endereco_pickup"]:""}));
        }

        if(inputsPickup.zip_code_pickup == "") {
            setMensagemValidacao(values => ({...values,["zip_code_pickup"]:"Preencha o campo Zip Code."}));
            salvar_pickup = false;
        } else {
            setMensagemValidacao(values => ({...values,["zip_code_pickup"]:""}));
        }
        
        if(inputsPickup.pickup_incluso !== true) {
            if(inputsPickup.moeda_pickup == "") {
                setMensagemValidacao(values => ({...values,["moeda_pickup"]:"Selecione uma Moeda."}));
                salvar_pickup = false;
            } else {
                setMensagemValidacao(values => ({...values,["moeda_pickup"]:""}));
            }
    
            if(inputsPickup.unidade_pickup == "") {
                setMensagemValidacao(values => ({...values,["unidade_pickup"]:"Selecione uma Unidade."}));
                salvar_pickup = false;
            } else {
                setMensagemValidacao(values => ({...values,["unidade_pickup"]:""}));
            }
    
            if(inputsPickup.modalidade_pickup == "") {
                setMensagemValidacao(values => ({...values,["modalidade_pickup"]:"Selecione uma Modalidade."}));
                salvar_pickup = false;
            } else {
                setMensagemValidacao(values => ({...values,["modalidade_pickup"]:""}));
            }
    

            if(inputsPickup.valor_compra_pickup == "") {
                setMensagemValidacao(values => ({...values,["valor_compra_pickup"]:"Preencha o valor de compra do Pickup."}));
                salvar_pickup = false;
            } else {
                setMensagemValidacao(values => ({...values,["valor_compra_pickup"]:""}));
            }
            
            if(inputsPickup.valor_venda_pickup == "") {
                setMensagemValidacao(values => ({...values,["valor_venda_pickup"]:"Preencha o valor de venda do Pickup."}));
                salvar_pickup = false;
            } else {
                setMensagemValidacao(values => ({...values,["valor_venda_pickup"]:""}));
            }            
        }

        if(props.novoItem === false) {
            let listaVerificacaoPickup = [];
            props.listaPickups.map((item,contador)=>{
                if(contador != props.indiceElementoAlteracao) {
                    listaVerificacaoPickup = [...listaVerificacaoPickup, item];
                }
            });
            
            let valores_pickup = listaVerificacaoPickup.find(({ endereco_pickup }) => endereco_pickup === inputsPickup.endereco_pickup);
            if (valores_pickup) {
                setMensagemValidacao(values => ({ ...values, ["registro_ja_existe"]: "Endereço do Pickup já esta incluido" }));
                salvar_pickup = false;
            }    
        } else {
            let valores_pickup = props.listaPickups.find(({ endereco_pickup }) => endereco_pickup === inputsPickup.endereco_pickup);
            if (valores_pickup) {
                setMensagemValidacao(values => ({ ...values, ["registro_ja_existe"]: "Endereço do Pickup já esta incluido" }));
                salvar_pickup = false;
            }    
        } 
        

        if(salvar_pickup === true) {
            if (props.novoItem === true) {
                props.adicionarPickups(inputsPickup);
            } else {
                props.atualizarPickups(inputsPickup, props.indiceElementoAlteracao);
            }
        }
    }

    const handleExcluir = () => {
        props.excluirElemento(props.indiceElementoAlteracao)
    }

    const handlePickupIncluso = (objeto) => {
        setIsCheckedPickupIncluso(!isCheckedPickupIncluso);

        setInputsPickup(values => ({ ...values, ["moeda_pickup"]: "" }))
        setInputsPickup(values => ({ ...values, ["unidade_pickup"]: "" }))
        setInputsPickup(values => ({ ...values, ["modalidade_pickup"]: "" }))
        setInputsPickup(values => ({ ...values, ["valor_compra_pickup"]: "" }))
        setInputsPickup(values => ({ ...values, ["valor_compra_minimo_pickup"]: "" }))
        setInputsPickup(values => ({ ...values, ["valor_compra_maximo_pickup"]: "" }))
        setInputsPickup(values => ({ ...values, ["valor_venda_pickup"]: "" }))
        setInputsPickup(values => ({ ...values, ["valor_venda_minimo_pickup"]: "" }))
        setInputsPickup(values => ({ ...values, ["valor_venda_maximo_pickup"]: "" }))

        setInputsPickup(values => ({ ...values, ["pickup_incluso"]: objeto.target.checked }))
    }

    const [tituloModalPickup, setTituloModalPickup] = useState('Adicionar');

    useEffect(() => {
        if (props.listaPickups.length > 0 && props.novoItem === false) {
            setInputsPickup(values => ({
                ...values,
                ["endereco_pickup"]: props.listaPickups[props.indiceElementoAlteracao].endereco_pickup,
                ["zip_code_pickup"]: props.listaPickups[props.indiceElementoAlteracao].zip_code_pickup,
                ["moeda_pickup"]: props.listaPickups[props.indiceElementoAlteracao].moeda_pickup,
                ["unidade_pickup"]: props.listaPickups[props.indiceElementoAlteracao].unidade_pickup,
                ["modalidade_pickup"]: props.listaPickups[props.indiceElementoAlteracao].modalidade_pickup,
                ["valor_compra_pickup"]: props.listaPickups[props.indiceElementoAlteracao].valor_compra_pickup,
                ["valor_compra_minimo_pickup"]: props.listaPickups[props.indiceElementoAlteracao].valor_compra_minimo_pickup,
                ["valor_compra_maximo_pickup"]: props.listaPickups[props.indiceElementoAlteracao].valor_compra_maximo_pickup,
                ["valor_venda_pickup"]: props.listaPickups[props.indiceElementoAlteracao].valor_venda_pickup,
                ["valor_venda_minimo_pickup"]: props.listaPickups[props.indiceElementoAlteracao].valor_venda_minimo_pickup,
                ["valor_venda_maximo_pickup"]: props.listaPickups[props.indiceElementoAlteracao].valor_venda_maximo_pickup,
                ["pickup_incluso"]: props.listaPickups[props.indiceElementoAlteracao].pickup_incluso
            }))
            setTituloModalPickup("Alterar");
            setIsCheckedPickupIncluso(props.listaPickups[props.indiceElementoAlteracao].pickup_incluso);
        } else {
            setInputsPickup(values => ({
                ...values,
                ["modalidade_pickup"]: props.modalidadeFreteSelecionada
            }))
        }
    }, [])

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
        setInputsPickup(values => ({ ...values, [name]: value }))
    }


    return (
        <div className='modal_registro container shadow-lg bg-white rounded no-gutters m-0'>
            <div className='row modal_registro-titulo'>
                <div className='col-11'>{tituloModalPickup} Pickup</div>
                <div className='col'>
                    <button onClick={handleFecharModalPickup} name="fechar_modal_pickup" className='btn btn-outline-light btn-sm'> X </button>
                </div>
            </div>
            <form onSubmit={handleSalvarPickup}>
                <div className="row">
                    <div className="col-3">
                        <label className="titulo">Zip Code {props.dadosAlteracaoPickup}</label>
                        <input type="text"
                            className="form-control"
                            name="zip_code_pickup"
                            onChange={handleChange}
                            value={inputsPickup.zip_code_pickup}
                        />
                        <span className="campos_validacao">{mensagem_validacao.zip_code_pickup}</span>                        
                    </div>
                    <div className="col">
                        <label className="titulo">Endereço</label>
                        <input
                            type="text"
                            className="form-control"
                            name="endereco_pickup"
                            onChange={handleChange}
                            value={inputsPickup.endereco_pickup}
                        />
                        <span className="campos_validacao">{mensagem_validacao.endereco_pickup}</span>                        
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <br />
                        <label className='switch'>
                            <input type="checkbox" onChange={handlePickupIncluso} checked={isCheckedPickupIncluso} name="check_pickup_incluso" />
                            <span className="slider round"></span>
                        </label>
                        <label className='titulo'>Pickup Incluso</label>                        
                    </div>

                    {isCheckedPickupIncluso === false && (
                        <>
                            <div className="col-2">
                                <label className="titulo">Moeda</label>
                                <select name="moeda_pickup" onChange={handleChange} value={inputsPickup.moeda_pickup} className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="USD">USD</option>
                                    <option value="BRL">BRL</option>
                                    <option value="EUR">EUR</option>
                                </select>
                                <span className="campos_validacao">{mensagem_validacao.moeda_pickup}</span>                        
                            </div>
                            <div className="col-2">
                                <label className="titulo">Unidade</label>
                                <select name="unidade_pickup" onChange={handleChange} value={inputsPickup.unidade_pickup} className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="WM">WM</option>
                                    <option value="BL">BL</option>
                                    <option value="M3">M3</option>
                                    <option value="TON">TON</option>
                                </select>
                                <span className="campos_validacao">{mensagem_validacao.unidade_pickup}</span>
                            </div>
                            <div className="col-2">
                                <label className="titulo">Modalidade</label>
                                <select name="modalidade_pickup" onChange={handleChange} value={inputsPickup.modalidade_pickup} className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="PP">PP</option>
                                    <option value="CC">CC</option>
                                </select>
                                <span className="campos_validacao">{mensagem_validacao.modalidade_pickup}</span>
                            </div>
                        </>
                    )}
                </div>
                {isCheckedPickupIncluso === false && (
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
                                    name="valor_compra_pickup"
                                    value={inputsPickup.valor_compra_pickup}
                                    onValueChange={(values) => handleChangeNumeric("valor_compra_pickup", values.value)}
                                    decimalSeparator=','
                                    decimalScale={2}
                                />
                                
                                */
                                }
                                <input
                                    type="text"
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_compra_pickup"
                                    defaultValue={String(inputsPickup.valor_compra_pickup).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_compra_pickup", e)}
                                />

                                <span className="campos_validacao">{mensagem_validacao.valor_compra_pickup}</span>
                            </div>
                            <div className="col">
                                <label className="titulo">Minimo</label>
                                {
                                /*
                                <NumericFormat
                                className="form-control alinhamento_texto_direito"
                                name="valor_compra_minimo_pickup"
                                value={String(inputsPickup.valor_compra_minimo_pickup).replace(".",",")}
                                onValueChange={(values) => handleChangeNumeric("valor_compra_minimo_pickup", values.value)}
                                decimalSeparator=','
                                decimalScale={2}
                                />
                                */
                                }
                                <input
                                    type="text"
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_compra_minimo_pickup"
                                    defaultValue={String(inputsPickup.valor_compra_minimo_pickup).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_compra_minimo_pickup", e)}
                                />

                            </div>
                            <div className="col">
                                <label className="titulo">Maximo</label>
                                {
                                /*
                                <NumericFormat
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_compra_maximo_pickup"
                                    value={inputsPickup.valor_compra_maximo_pickup}
                                    onValueChange={(values) => handleChangeNumeric("valor_compra_maximo_pickup", values.value)}
                                    decimalSeparator=','
                                    decimalScale={2}
                                />
                                */
                                }
                                <input
                                    type="text"
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_compra_maximo_pickup"
                                    defaultValue={String(inputsPickup.valor_compra_maximo_pickup).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_compra_maximo_pickup", e)}
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
                                {
                                /*
                                <NumericFormat
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_venda_pickup"
                                    value={inputsPickup.valor_venda_pickup}
                                    onValueChange={(values) => handleChangeNumeric("valor_venda_pickup", values.value)}
                                    decimalSeparator=','
                                    decimalScale={2}
                                />
                                
                                */}
                                <input
                                    type="text"
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_venda_pickup"
                                    defaultValue={String(inputsPickup.valor_venda_pickup).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_venda_pickup", e)}
                                />

                                <span className="campos_validacao">{mensagem_validacao.valor_venda_pickup}</span>
                            </div>
                            <div className="col">
                                <label className="titulo">Minimo</label>
                                {
                                /*
                                <NumericFormat
                                type="text"
                                className="form-control alinhamento_texto_direito"
                                name="valor_venda_minimo_pickup"
                                defaultValue={String(inputsPickup.valor_venda_minimo_pickup).replace(".",",")}
                                onChange={(e) => formata_moeda("valor_venda_minimo_pickup", e)}
                                />
                                */
                                }
                                <input
                                    type="text"
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_venda_minimo_pickup"
                                    defaultValue={String(inputsPickup.valor_venda_minimo_pickup).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_venda_minimo_pickup", e)}
                                />
                            </div>
                            <div className="col">
                                <label className="titulo">Maximo</label>
                                <input
                                    className="form-control alinhamento_texto_direito"
                                    name="valor_venda_maximo_pickup"
                                    value={String(inputsPickup.valor_venda_maximo_pickup).replace(".",",")}
                                    onChange={(e) => formata_moeda("valor_venda_maximo_pickup", e)}
                                />
                            </div>
                        </div>
                    </>
                )}
                <br />
                <div className="row">
                    <div className="col">
                        <span className="campos_validacao">{mensagem_validacao.registro_ja_existe}</span>
                        <br />
                        <button type="submit" name="salvar" className="btn btn-outline-dark btn-sm">Salvar</button>&nbsp;
                        {props.novoItem === false && (
                            <button type="button" onClick={handleExcluir} name="excluir" className="btn btn-outline-dark btn-sm">Excluir</button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}