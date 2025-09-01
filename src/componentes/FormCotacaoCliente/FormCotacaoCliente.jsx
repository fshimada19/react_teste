import { Fragment, useEffect, useState } from 'react';
import { default as ReactSelect, components } from 'react-select';
import ReactSelectAsync from 'react-select/async';
import api from '../../api';
import CreatableSelect from 'react-select/creatable';
import Swal from 'sweetalert2'

function FormCotacaoCliente(props) {
    const [processarDadosCliente, setProcessarDadosCliente] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
    const [valueCnpjPrincipal, setValueCnpjPrincipal] = useState([])
    const [valueCnpjSecundario, setValueCnpjSecundario] = useState([])
    const [valuesContatos, setValuesContatos] = useState([])
    const [idClienteSelecionadoProposta, setIdClienteSelecionadoProposta] = useState(0);
    const [valueResponsaveisCliente, setValueResponsaveisCliente] = useState([]);



    const layout_cliente_selecionado = {
        id_cliente: '',
        razao_social: ''
    }

    const [dados_cliente, setDadosCliente] = useState({
        "id_cliente": "",
        "label_cliente": "",
        "ids_clientes_secundarios": [],
        "contatos_cliente": [],
        "referencia_cliente": ""
    });

    const [valoresClienteSelecionado, setValoresClienteSelecionado] = useState(layout_cliente_selecionado);

    const [listaCnpjPrincipal, setListaCnpjPrincipal] = useState([]);
    const [listaCnpjSecundario, setListaCnpjSecundario] = useState([]);
    const [listaContatosCliente, setListaContatosCliente] = useState([]);
    const [listaResponsaveisCliente, setListaResponsaveisCliente] = useState([]);

    var id_cliente_selecionado_proposta = 0;
    var quantidade_cnpjs_secundarios = 0;
    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        name='cnpj_secundario_option'
                        onChange={() => null}
                    />{" "}
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const loadOptionsCliente = (searchValue) => {
        if (searchValue != null) {
            if (searchValue.length >= 3) {
                return api.post(props.urlApis +props.apiDados+"buscarClienteCombo.php", {
                    cliente: searchValue
                }).then((response) => {
                    return response.data
                }).catch((err) => {
                    console.error("Ocorreu um erro" + err);
                });
            }
        }
    }

    async function busca_grupo_comercial_cliente(id_cliente) {
        // Busca Grupo Comercial
        let resultado = await api.post(props.urlApis+props.apiDados+"buscaGrupoComercialCliente.php", {
            id_cliente: id_cliente
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });
        let valor_option = [];
        let i = 0;
        let contador_contato = 0;
        valor_option[contador_contato] = { "value": 0, "label": "TODOS" };
        contador_contato++;
        
        for (i = 0; i < resultado.length; i++) {
            valor_option[contador_contato] = { "value": resultado[i].id_cliente, "label": resultado[i].cnpj + " - " + resultado[i].cidade + " - " + resultado[i].razao_social }
            contador_contato++;
        }
        setListaCnpjSecundario(valor_option);
    }

    async function busca_contatos_cliente(id_cliente) {
        // Busca Contatos
        let resultadoBuscaContatosCliente = await api.post(props.urlApis +props.apiDados+"buscaContatosClienteEnvioAutomatico.php", {
            id_cliente: id_cliente
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });

        let valor_option_contato = [];
        for (let i = 0; i < resultadoBuscaContatosCliente.length; i++) {
            valor_option_contato[i] = { "value": resultadoBuscaContatosCliente[i].email, "label": resultadoBuscaContatosCliente[i].contato + " - (" + resultadoBuscaContatosCliente[i].email + ")" }
        }

        setListaContatosCliente(valor_option_contato);
    }

    const handleChangeCliente = async (selectedOption) => {
        setSelectedValue(selectedOption);
        if (selectedOption != null) {
            let id_cliente_selecionado = selectedOption.value;
            setValoresClienteSelecionado({ ...valoresClienteSelecionado, ["id_cliente"]: id_cliente_selecionado });
            setListaCnpjPrincipal([]);
            setValueCnpjPrincipal([]);
            setListaContatosCliente([]);
            setListaCnpjSecundario([]);
            setValuesContatos([]);
            setIdClienteSelecionadoProposta(id_cliente_selecionado);
            props.idClienteSelecionado(id_cliente_selecionado);
            dados_cliente.id_cliente = id_cliente_selecionado;
            dados_cliente.label_cliente = selectedOption.label;

            id_cliente_selecionado_proposta = id_cliente_selecionado;
            // Busca Grupo Comercial
            let resultado = await api.post(props.urlApis +props.apiDados+"buscaGrupoComercialCliente.php", {
                id_cliente: id_cliente_selecionado
            }).then((response) => {
                return response.data
            }).catch((err) => {
                console.error("Ocorreu um erro" + err);
            });
            let valor_option = [];
            let i = 0;
            for (i = 0; i < resultado.length; i++) {
                valor_option[i] = { "value": resultado[i].id_cliente, "label": resultado[i].cnpj + " - " + resultado[i].cidade + " - " + resultado[i].razao_social }
            }

            let valor_option_secundario = [];
            let j = 0;
            let contador_cnpj_secundario = 0;
            valor_option_secundario[contador_cnpj_secundario] = { "value": 0, "label": "TODOS" }
            contador_cnpj_secundario++;
            for (j = 0; j < resultado.length; j++) {
                valor_option_secundario[contador_cnpj_secundario] = { "value": resultado[j].id_cliente, "label": resultado[j].cnpj + " - " + resultado[j].cidade + " - " + resultado[j].razao_social }
                contador_cnpj_secundario++;
            }


            // Busca Contatos
            let resultadoBuscaContatosCliente = await api.post(props.urlApis + props.apiDados+"buscaContatosClienteEnvioAutomatico.php", {
                id_cliente: id_cliente_selecionado
            }).then((response) => {
                return response.data
            }).catch((err) => {
                console.error("Ocorreu um erro" + err);
            });

            let valor_option_contato = [];
            for (i = 0; i < resultadoBuscaContatosCliente.length; i++) {
                valor_option_contato[i] = { "value": resultadoBuscaContatosCliente[i].email, "label": resultadoBuscaContatosCliente[i].contato + " - (" + resultadoBuscaContatosCliente[i].email + ")" }
            }

            setListaCnpjPrincipal(valor_option);
            setListaCnpjSecundario(valor_option_secundario);
            setListaContatosCliente(valor_option_contato);
            setClienteSelecionado(true);

        } else {
            dados_cliente.id_cliente = "";
            setListaCnpjPrincipal([]);
            setValueCnpjPrincipal([]);
            setListaCnpjSecundario([]);
            setValueCnpjSecundario([]);
            setListaContatosCliente([]);
            setValuesContatos([]);

        }
        setProcessarDadosCliente(true);
    }

    const handleChangeCnpjPrincipal = async (selectedOption) => {
        setValueCnpjPrincipal(selectedOption);
        let idClienteSelecionadoCnpjPrincipal = selectedOption.value;

        // Busca Responsaveis Cliente
        let resultadoBuscaResponsaveisCliente = await api.post(props.urlApis+props.apiDados+"buscarResponsaveis.php", {
            id_cliente: idClienteSelecionadoCnpjPrincipal
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });

        let valor_option = [];
        let i = 0;
        for (i = 0; i < resultadoBuscaResponsaveisCliente.length; i++) {
            valor_option[i] = { "value": resultadoBuscaResponsaveisCliente[i].id_responsavel, "label": resultadoBuscaResponsaveisCliente[i].responsavel }
        }

        setListaResponsaveisCliente(valor_option);
        setValueResponsaveisCliente(valor_option);
    }

    const [listaClientesSecundarios, setListaClientesSecundarios] = useState([]);
    const handleChangeCnpjSecundario = (selectedOption) => {
        let cnpjs_secundarios = selectedOption;
        let qtde_cnpjs_secundarios = cnpjs_secundarios.length;
        if(qtde_cnpjs_secundarios > 0) {
            let valor_option = cnpjs_secundarios[qtde_cnpjs_secundarios-1].value;
            if(valor_option === 0 || valor_option === "0") {
                let valores_options = [];
                let contador_options_selecao = 0;
                for (let i = 0; i < listaCnpjSecundario.length; i++) {
                    if(listaCnpjSecundario[i].value !== 0 && listaCnpjSecundario[i].value !== "0") {
                        valores_options[contador_options_selecao] = { "value": listaCnpjSecundario[i].value, "label": listaCnpjSecundario[i].label }
                        contador_options_selecao++;
                    }
                }                        
                setValueCnpjSecundario(valores_options);
                setListaClientesSecundarios(valores_options);
                dados_cliente.ids_clientes_secundarios = valores_options;
                setProcessarDadosCliente(true);
            } else {
                setValueCnpjSecundario(selectedOption);
                setListaClientesSecundarios(selectedOption);
                dados_cliente.ids_clientes_secundarios = selectedOption;
                setProcessarDadosCliente(true);    
            }    
        } else {
            setValueCnpjSecundario(selectedOption);
            setListaClientesSecundarios(selectedOption);
            dados_cliente.ids_clientes_secundarios = selectedOption;
            setProcessarDadosCliente(true);
        }

    }

    const handleChangeContatos = (selectedOption) => {
        let email_invalido = false;
        if(selectedOption !== null) {
            let emails = selectedOption;
            if(emails.length > 0) {
                emails.map((itemEmail,contador)=>{
                    if(itemEmail.value.indexOf(" ") >= 0) {
                        Swal.fire({
                            title: "Email Inválido!",
                            text: "O Email "+itemEmail.value+" esta digitado incorretamente",
                            icon: "error"
                        });
                        email_invalido = true;
                        return false;
                    }                               
                })                
            }
            /*
            if(email.indexOf(" ") >= 0) {
                Swal.fire({
                    title: "Email Inválido!",
                    text: "Email Invalido",
                    icon: "error"
                });
                return false;
            } else {
                setValuesContatos(selectedOption);
            }
            */
            if(email_invalido === false) {
                setValuesContatos(selectedOption);    
            }
        } else {
            setValuesContatos([]);
        }
        setProcessarDadosCliente(true);
    }

    const handleCreateContato = (selectedOption) => {
        if(selectedOption !== "") {
            if(selectedOption.indexOf(" ") >= 0) {
                Swal.fire({
                    title: "Email Inválido!",
                    text: "Email Invalido",
                    icon: "error"
                });
                return false;
            }
        }

        Swal.fire({
            title: "Incluir contato",
            text: "Deseja Incluir o contato para novas propostas ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        }).then(async (result) => {
            if (result.isConfirmed) {
                let retorno_funcao = await api.post(props.urlApis +props.apiDados+"incluirContatoScoa.php", {
                    id_cliente: idClienteSelecionadoProposta,
                    email_contato: selectedOption
                }).then((response) => {
                    return response.data
                }).catch((err) => {
                    console.error("Ocorreu um erro" + err);
                });

                if (retorno_funcao.status == "sucesso") {
                    Swal.fire({
                        title: "Contato Incluido!",
                        text: retorno_funcao.mensagem,
                        icon: "success"
                    });
                }
                setValuesContatos([...valuesContatos, { label: selectedOption, value: selectedOption }]);
            } else {
                setValuesContatos([...valuesContatos, { label: selectedOption, value: selectedOption }]);
            }
            setProcessarDadosCliente(true);
        });

    }

    const [referenciaCliente, setReferenciaCliente] = useState("");
    const handleReferencia = (valorText) => {
        setReferenciaCliente(valorText.target.value);
        dados_cliente.referencia_cliente = valorText.target.value;
        setProcessarDadosCliente(true);
    }

    const handleChangeResponsavel = (selectedOption) => {
        setValueResponsaveisCliente(selectedOption);
    }

    const [mensagens_validacao, setMensagensValidacao] = useState({
        "mensagem_cliente_selecionado": "",
        "mensagem_contatos": ""
    });

    useEffect(() => {
        if (processarDadosCliente === true) {
            dados_cliente.contatos_cliente = valuesContatos;
            props.dadosCliente(dados_cliente);
            setProcessarDadosCliente(false);
        }
    }, [processarDadosCliente])

    useEffect(() => {
        if (props.limpar_dados === true) {
            setSelectedValue("");
            setValueCnpjSecundario("");
            setValuesContatos("");
            setReferenciaCliente("");
            props.campos_limpos();
        }
    }, [props.limpar_dados]);

    useEffect(() => {
        if (props.salvarCotacao === true) {
            let campos_validados = true;
            if (dados_cliente.id_cliente === "") {
                setMensagensValidacao(values => ({ ...values, ["mensagem_cliente_selecionado"]: 'Selecione um Cliente' }));
            } else {
                campos_validados = false;
                setMensagensValidacao(values => ({ ...values, ["mensagem_cliente_selecionado"]: '' }));
            }

            if (dados_cliente.contatos_cliente.length === 0) {
                setMensagensValidacao(values => ({ ...values, ["mensagem_contatos"]: "Selecione um contato" }));
            } else {
                campos_validados = false;
                setMensagensValidacao(values => ({ ...values, ["mensagem_contatos"]: "" }));
            }
            props.respostaCamposValidacao(campos_validados, "cliente");
        }


    }, [props.salvarCotacao])


    useEffect(() => {
        if (props.dados_proposta_salva !== null) {
            // Seta o cliente
            setSelectedValue({ "value": props.dados_proposta_salva.dados_cliente.id_cliente, "label": props.dados_proposta_salva.dados_cliente.label_cliente })
            setIdClienteSelecionadoProposta(props.dados_proposta_salva.dados_cliente.id_cliente);
            props.idClienteSelecionado(props.dados_proposta_salva.dados_cliente.id_cliente);
            dados_cliente.id_cliente = props.dados_proposta_salva.dados_cliente.id_cliente;
            dados_cliente.label_cliente = props.dados_proposta_salva.dados_cliente.label_cliente;

            // Seta o id_cliente Selecionado
            setClienteSelecionado(true);

            // Seta o cliente Secundario
            busca_grupo_comercial_cliente(props.dados_proposta_salva.dados_cliente.id_cliente);
            setValueCnpjSecundario(props.dados_proposta_salva.dados_cliente.ids_clientes_secundarios);
            dados_cliente.ids_clientes_secundarios = props.dados_proposta_salva.dados_cliente.ids_clientes_secundarios;

            // Seta Contatos do Cliente
            busca_contatos_cliente(props.dados_proposta_salva.dados_cliente.id_cliente);
            setValuesContatos(props.dados_proposta_salva.dados_cliente.contatos_cliente);

            // Seta a referencia Cliente
            setReferenciaCliente(props.dados_proposta_salva.dados_cliente.referencia_cliente);
            dados_cliente.referencia_cliente = props.dados_proposta_salva.dados_cliente.referencia_cliente;
            setProcessarDadosCliente(true);
        }
    }, [props.dados_proposta_salva])

    return (
        <>
            <div className="container shadow p-3 mb-4 bg-white rounded no-gutters m-0">
                <div className='row'>
                    <div className="col-1 border-bottom titulo">
                        <b>Cliente</b>
                    </div>
                    <div className="col-11 border-bottom titulo_informacao">
                        <b>Informações Sobre o Cliente são Obrigatórias</b>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label className='titulo'>Nome ou CNPJ (Principal)</label>
                        <ReactSelectAsync
                            loadOptions={loadOptionsCliente}
                            isClearable
                            name='cliente'
                            noOptionsMessage={() => "Digite a Razão Social do Cliente"}
                            value={selectedValue}
                            cacheOptions
                            onChange={handleChangeCliente}
                            placeholder="Digite a Razão Social do Cliente"
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
                        <span className='campos_validacao'>{props.mensagens_validacao.mensagem_cliente_selecionado}</span>
                        <br />
                    </div>
                    <div className='col-6'>
                        <label className='titulo'>CNPJs Secundarios</label>
                        <ReactSelect
                            placeholder="Selecione"
                            options={listaCnpjSecundario}
                            onChange={handleChangeCnpjSecundario}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={{
                                Option
                            }}
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
                            isMulti='true'
                            value={valueCnpjSecundario}
                            noOptionsMessage={() => "Não há opções para selecionar"}
                            isSearchable="true"
                            name='cmpj_sencundarios'
                        />
                        <br />
                    </div>
                </div>
                {clienteSelecionado != false &&
                    <>
                        <div className='row'>
                            {
                            /*
                            <div className='col-6'>
                                <label className='titulo'>CNPJ Principal*</label>
                                <ReactSelect
                                    placeholder="Selecione"
                                    options={listaCnpjPrincipal}
                                    onChange={handleChangeCnpjPrincipal}
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
                                    value={valueCnpjPrincipal}
                                    isSearchable="true"
                                    name='cnpj_principal'
                                />
                            </div>
                            */ }
                            <div className='col-6'>
                                <label className='titulo'>Contatos</label>
                                <CreatableSelect
                                    formatCreateLabel={(inputText) => `Novo Contato "${inputText}"`}
                                    onChange={handleChangeContatos}
                                    placeholder="Selecione"
                                    onCreateOption={handleCreateContato}
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
                                    isMulti='true'
                                    noOptionsMessage={() => "Não há opções para selecionar"}
                                    hideSelectedOptions={false}
                                    options={listaContatosCliente}
                                    isSearchable="true"
                                    value={valuesContatos}
                                    name='contatos'
                                />
                                <span className='campos_validacao'>{props.mensagens_validacao.mensagem_contatos}</span>
                            </div>

                            <div className='col-6'>
                                <label className="titulo">Referência (Origem da Solicitação da Cotação)</label>
                                <input className="form-control" value={referenciaCliente} onChange={handleReferencia} name="referencia_origem_solicitacao" />
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default FormCotacaoCliente;
