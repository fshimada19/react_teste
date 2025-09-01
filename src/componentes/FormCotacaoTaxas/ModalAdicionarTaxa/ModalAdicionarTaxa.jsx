import { useEffect, useState } from "react";
import ReactSelectAsync from 'react-select/async';
import api from "../../../api";
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
    const handleFecharModal = () => {
        props.exibirModalAdicionarTaxa(false)
    }

    const [inputsTaxa, setInputsTaxa] = useState(
        {
            "id_taxa": "",
            "taxa": "",
            "id_moeda": "",
            "id_unidade": "3",
            "moeda": "",
            "unidade": "WM",
            "ppcc": props.ppcc_adicionar_taxa,
            "valor_tarifario":" - ",
            "valor_compra": "",
            "valor_compra_minimo": "0.00",
            "valor_compra_maximo": "0.00",

            "valor_venda": "",
            "valor_venda_minimo": "0.00",
            "valor_venda_maximo": "0.00",

            "valor_calculado": "",
            "edicao_taxa": "0",
            "editar_ppcc": "1",
            "travar_taxa": "0",
            "taxa_adicional":"1"          
        }
    );

    const loadOptionsTaxas = (searchValue) => {
        if (searchValue !== null && searchValue !== '') {
            if (searchValue.length >= 3) {
                return api.post(props.apiDados+"buscarTaxasCombo.php", {
                    taxa: searchValue
                }).then((response) => {
                    return response.data
                }).catch((err) => {
                    console.error("Ocorreu um erro" + err);
                });
            }
        }
    }


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;        
        if (name == "id_moeda") {
            const textoSelectedOption = event.target.options[event.target.selectedIndex].text;
            setInputsTaxa(values => ({ ...values, [name]: value }))
            setInputsTaxa(values => ({ ...values, ["moeda"]: textoSelectedOption }))

        } else if (name == "id_unidade") {
            const textoSelectedOption = event.target.options[event.target.selectedIndex].text;
            setInputsTaxa(values => ({ ...values, [name]: value }))
            setInputsTaxa(values => ({ ...values, ["unidade"]: textoSelectedOption }))
        } else if (name == "ppcc") {
            const textoSelectedOption = event.target.options[event.target.selectedIndex].value;
            setInputsTaxa(values => ({ ...values, [name]: value }))
            setInputsTaxa(values => ({ ...values, ["ppcc"]: textoSelectedOption }))
        } else {
            setInputsTaxa(values => ({ ...values, [name]: value }))
        }
    }

    function handleChangeNumericField(nome_campo,valor) {
        setInputsTaxa(values => ({ ...values, [nome_campo]: valor }))
    }

    const [mensagem_validacao,setMensagemValidacao] = useState({
        "taxa": "",
        "moeda":"",
        "unidade":"",
        "ppcc":"",
        "valor_compra":"",
        "valor_compra_minimo":"",
        "valor_compra_maximo":"",
        "valor_venda":"",
        "valor_venda_minimo":"",
        "valor_venda_maximo":""
    })

    const handleSalvar = (event) => {
        event.preventDefault();
        setMensagemValidacao([]);        

        let adicionar_taxa = true;
        if(inputsTaxa.id_taxa == "") {
            setMensagemValidacao(values => ({...values,["taxa"]:"Selecione uma taxa."}));
            adicionar_taxa = false;
        }

        if(inputsTaxa.id_moeda == "") {
            setMensagemValidacao(values => ({...values,["moeda"]:"Selecione uma Moeda."}));
            adicionar_taxa = false;
        }

        if(inputsTaxa.id_unidade == "") {
            setMensagemValidacao(values => ({...values,["unidade"]:"Selecione uma unidade."}));
            adicionar_taxa = false;
        }

        if(inputsTaxa.ppcc == "") {
            setMensagemValidacao(values => ({...values,["ppcc"]:"Selecione uma Modalidade."}));
            adicionar_taxa = false;
        }

        if(inputsTaxa.valor_compra == "") {
            setMensagemValidacao(values => ({...values,["valor_compra"]:"Preencha com o Valor."}));
            adicionar_taxa = false;
        }

        if(inputsTaxa.valor_venda == "") {
            setMensagemValidacao(values => ({...values,["valor_venda"]:"Preencha com o Valor."}));
            adicionar_taxa = false;
        }

        if(adicionar_taxa === true) {
            props.adicionarTaxa(inputsTaxa, props.tipoListaAdicionarTaxa);
            props.exibirModalAdicionarTaxa(false);    
        }
    }


    const [selectedValue, setSelectedValue] = useState(null)

    const handleChangeTaxa = (selectedOption) => {
        if(selectedOption !== null) {
            let adicionar_taxa = true;            
            if(props.taxas_origem.length > 0) {
                let taxas_origem = props.taxas_origem;
                for(let i=0;i<taxas_origem.length;i++) {
                    if(taxas_origem[i].id_taxa === selectedOption.value) {
                        setMensagemValidacao(values => ({...values,["taxa"]:"Taxa "+selectedOption.label+" já existe na Proposta"}));
                        adicionar_taxa = false;
                    }
                }
            }

            if(props.taxas_frete.length > 0) {
                let taxas_frete = props.taxas_frete;
                for(let i=0;i<taxas_frete.length;i++) {
                    if(taxas_frete[i].id_taxa === selectedOption.value) {
                        setMensagemValidacao(values => ({...values,["taxa"]:"Taxa "+selectedOption.label+" já existe na Proposta"}));
                        adicionar_taxa = false;
                    }
                }    
            }

            if(props.taxas_destino.length > 0) {
                let taxas_destino = props.taxas_destino;
                for(let i=0;i<taxas_destino.length;i++) {
                    if(taxas_destino[i].id_taxa === selectedOption.value) {
                        setMensagemValidacao(values => ({...values,["taxa"]:"Taxa "+selectedOption.label+" já existe na Proposta"}));
                        adicionar_taxa = false;
                    }
                }    
            }
    
            
            if(adicionar_taxa === true) {
                setSelectedValue(selectedOption);
                setInputsTaxa(values => ({ ...values, ["id_taxa"]: selectedOption.value }));
                setInputsTaxa(values => ({ ...values, ["taxa"]: selectedOption.label }));    
            }
        }
    }

    const formata_moeda = (objeto, nome_campo) => {
        let valor_auxiliar = objeto.target.value
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
            valor_auxiliar = valor_auxiliar.replace(".",",");
        }
        let qtde_decimal = 2;
        valor_auxiliar = valor_auxiliar.replace(",","")
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
        setInputsTaxa(values => ({ ...values, [nome_campo]: objeto.target.value.replace(",",".") }))
    }
    

    return (
        <div className='modal_registro container shadow-lg bg-white rounded no-gutters m-0'>
            <div className='row modal_registro-titulo'>
                <div className='col-11'>Adicionar Taxa</div>
                <div className='col'>
                    <button onClick={handleFecharModal} name="fechar_modal" className='btn btn-outline-light btn-sm'> X </button>
                </div>
            </div>
            <form onSubmit={handleSalvar}>
                <div className="row">
                    <div className="col">
                        <label className="titulo">Taxa</label>
                        <ReactSelectAsync
                            loadOptions={loadOptionsTaxas}
                            isClearable
                            name='taxa'
                            noOptionsMessage={() => "Digite o nome da Taxa"}
                            value={selectedValue}
                            cacheOptions
                            onChange={handleChangeTaxa}
                            placeholder="Digite o nome da Taxa"
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
                        <span className="campos_validacao">{mensagem_validacao.taxa}</span>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-3">
                        <label className="titulo">Moeda</label>
                        <select name="id_moeda" onChange={handleChange} className="form-select">
                            <option value="">Selecione</option>
                            <option value="42">USD</option>
                            <option value="88">BRL</option>
                            <option value="113">EUR</option>
                        </select>
                        <span className="campos_validacao">{mensagem_validacao.moeda}</span>                        
                    </div>
                    <div className="col-3">
                        <label className="titulo">Unidade</label>
                        <select name="id_unidade" onChange={handleChange} className="form-select">
                            <option value="3">WM</option>
                            <option value="4">BL</option>
                            <option value="1">M3</option>
                            <option value="2">TON</option>
                            <option value="5">%</option>
                        </select>
                        <span className="campos_validacao">{mensagem_validacao.unidade}</span>                        
                    </div>
                    <div className="col-3">
                        <label className="titulo">Modalidade</label>
                        <select name="ppcc" defaultValue={props.ppcc_adicionar_taxa} onChange={handleChange} className="form-select">
                            <option value="">Selecione</option>
                            <option value="PP">PP</option>
                            <option value="CC">CC</option>
                            {props.tipoListaAdicionarTaxa === "frete" && (
                                <option value="AF">Acompanha o Frete</option>
                            )}                            
                        </select>
                        <span className="campos_validacao">{mensagem_validacao.ppcc}</span>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col titulo border-bottom"><b>Compra</b></div>
                </div>
                <div className="row">
                    <div className="col">
                        <label className="titulo">Valor</label>
                        <input
                            type="text"
                            className="form-control alinhamento_texto_direito"
                            name="valor_compra"
                            onChange={(e)=>formata_moeda(e,'valor_compra')}
                        />                        
                        
                        <span className="campos_validacao">{mensagem_validacao.valor_compra}</span>
                    </div>
                    <div className="col">
                        <label className="titulo">Minimo</label>
                        <input
                            className="form-control alinhamento_texto_direito"
                            name="valor_compra_minimo"
                            onChange={(e)=>formata_moeda(e,'valor_compra_minimo')}                            
                        />
                    </div>
                    <div className="col">
                        <label className="titulo">Maximo</label>
                        <input
                            className="form-control alinhamento_texto_direito"
                            name="valor_compra_maximo"
                            onChange={(e)=>formata_moeda(e,'valor_compra_maximo')}                            
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col titulo border-bottom"><b>Venda</b></div>
                </div>
                <div className="row">
                    <div className="col">
                        <label className="titulo">Valor</label>
                        <input
                            className="form-control alinhamento_texto_direito"
                            name="valor_venda"
                            onChange={(e)=>formata_moeda(e,'valor_venda')}                            
                        />

                        <span className="campos_validacao">{mensagem_validacao.valor_venda}</span>
                    </div>
                    <div className="col">
                        <label className="titulo">Minimo</label>
                        <input
                            className="form-control alinhamento_texto_direito"
                            name="valor_venda_minimo"
                            onChange={(e)=>formata_moeda(e,'valor_venda_minimo')}                            
                        />
                    </div>
                    <div className="col">
                        <label className="titulo">Maximo</label>
                        <input
                            className="form-control alinhamento_texto_direito"
                            name="valor_venda_maximo"
                            onChange={(e)=>formata_moeda(e,'valor_venda_maximo')}                            
                        />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col">
                        <button type="submit" name="salvar" className="btn btn-outline-dark btn-sm">Salvar</button>&nbsp;
                    </div>
                </div>
            </form>
        </div>
    );
}