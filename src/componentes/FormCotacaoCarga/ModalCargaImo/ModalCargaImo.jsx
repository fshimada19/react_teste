import { useEffect, useState } from "react";
import api from '../../../api';
import ReactSelectAsync from "react-select/async";
import Select from "react-select"

export default (props) => {
    const handleFecharModal = () => {
        props.exibirModalCargaImo(false)
    }
    const [tituloModalCargaImo, setTituloModalCargaImo] = useState('Adicionar');
    const [imoNaoAceito,setImoNaoAceito] = useState("");
    const [carregamentoDiretoSetado, setCarregamentoDiretoSetado] = useState('');

    const [inputsCargaImo, setInputsCargaImo] = useState(
        {
            "carregamento_direto": '',
            "classe_imo_value":"",
            "classe_imo_label":"",
            "un_imo": '',
            "packing_group": ''        
        }
    );
    const [verificacaoUnImo, setVerificacaoUnImo] = useState({"classeImo":"","unImo":""});

    function verifica_imo_x_un(valor,tipo) {
        if(tipo == "classe") {
            verificacaoUnImo.classeImo = valor;
        }
        if(tipo == "input") {
            verificacaoUnImo.unImo = valor;
        }
        if(
            (verificacaoUnImo.classeImo == "9" && verificacaoUnImo.unImo == "2211") || 
            (verificacaoUnImo.classeImo == "9" && verificacaoUnImo.unImo == "2212") || 
            (verificacaoUnImo.classeImo == "9" && verificacaoUnImo.unImo == "2590") ||
            (verificacaoUnImo.classeImo == "5.1" && verificacaoUnImo.unImo == "1442") ||
            (verificacaoUnImo.classeImo == "6.1" && verificacaoUnImo.unImo == "1649") ||
            (verificacaoUnImo.classeImo == "6.1" && verificacaoUnImo.unImo == "2480")
          ) {
                setValueClasseImoSelecionado("");
                setImoNaoAceito("IMO: "+verificacaoUnImo.classeImo+" UN: "+verificacaoUnImo.unImo+" Não aceito");
                verificacaoUnImo.classeImo = "";
          } else {
                setImoNaoAceito("");
          }
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputsCargaImo(values => ({...values, [name]: value}))
        if(event.target.name == "un_imo") {
            verifica_imo_x_un(event.target.value,"input");
        }
        if(event.target.name == "carregamento_direto") {
            if(event.target.value == "Sim") {
                setCarregamentoDiretoSetado("Será Adicionado a Taxa de Carregamento Direto");
            } else {
                setCarregamentoDiretoSetado("");
            }
        }
    }
  
    
    const [valueClasseImoSelecionado,setValueClasseImoSelecionado] = useState('');
    const [listaClassesImo,setListaClassesImo] = useState([]);

    const handleChangeClasse = (selectedOption) => {
        setInputsCargaImo(values => ({...values, ["classe_imo_value"]: selectedOption.value}))
        setInputsCargaImo(values => ({...values, ["classe_imo_label"]: selectedOption.label}))
        setValueClasseImoSelecionado(selectedOption);

        verifica_imo_x_un(selectedOption.value,"classe");
    }

    async function listarClassesImos() {
        let listaImo = await api.get("https://allinkscoa.com.br"+props.apiDados+"buscarClassesImoCombo.php",{
            "Content-Type": "application/xml; charset=utf-8"          
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });    
        let valor_option_classe_imo = [];
        for(let i=0;i<listaImo.length;i++) {
            valor_option_classe_imo[i] = {"value":listaImo[i].value, "label":listaImo[i].label, "isDisabled":listaImo[i].isDisabled}
        }
        setListaClassesImo(valor_option_classe_imo);
    }


    const handleExcluir = () => {
        props.excluirElemento(props.indiceElementoAlteracao)
        props.exibirModalCargaImo(false);
    }

    const handleAdicionarCargaImo = (event) => {
        event.preventDefault();
        if(props.novoItem === true) {
            props.atualizarListaCargaImo(inputsCargaImo);
        } else {
            props.alteracaoItemCargaImo(inputsCargaImo,props.indiceElementoAlteracao)
        }
    }


    useEffect(()=>{
        listarClassesImos();
        if(props.listaCargaImo.length > 0 && props.novoItem === false) {
            setTituloModalCargaImo("Alterar");
            setInputsCargaImo(values => ({...values,
                ["carregamento_direto"]: props.listaCargaImo[props.indiceElementoAlteracao].carregamento_direto,
                ["classe_imo_value"]: props.listaCargaImo[props.indiceElementoAlteracao].classe_imo_value,
                ["classe_imo_label"]: props.listaCargaImo[props.indiceElementoAlteracao].classe_imo_label,
                ["un_imo"]: props.listaCargaImo[props.indiceElementoAlteracao].un_imo,
                ["packing_group"]: props.listaCargaImo[props.indiceElementoAlteracao].packing_group
            }));
            setValueClasseImoSelecionado({"value":props.listaCargaImo[props.indiceElementoAlteracao].classe_imo_value,"label":props.listaCargaImo[props.indiceElementoAlteracao].classe_imo_label});            
        } 
    },[])

    return (
        <div className='modal_registro container shadow-lg bg-white rounded no-gutters m-0'>
            <div className='row modal_registro-titulo'>
                <div className='col-11'>{tituloModalCargaImo} Carga Imo</div>
                <div className='col'>
                    <button onClick={handleFecharModal} name="fechar_modal" className='btn btn-outline-light btn-sm'> X </button>
                </div>
            </div>
            <form onSubmit={handleAdicionarCargaImo} > 
            <div className="row">
                    <div className="col-3">
                        <label className="titulo">Carregamento Direto ?</label>
                        <select value={inputsCargaImo.carregamento_direto} onChange={handleChange} name="carregamento_direto" className="form-select">
                            <option value="">Selecione</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                        {carregamentoDiretoSetado != "" && (
                            <div className="atencao_amarelo">
                                {carregamentoDiretoSetado}                            
                            </div>
                        )}
                    </div>
                    <div className="col">
                        <label className="titulo">Classe Imo</label>
                        <Select 
                            isSearchable
                            options={listaClassesImo}                                                    
                            onChange={handleChangeClasse}
                            name="classe_imo"
                            value={valueClasseImoSelecionado}
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
                                })
                            }}
                        />
                        {imoNaoAceito != "" && (
                            <div className="atencao">
                                {imoNaoAceito}                            
                            </div>
                        )}
                    </div>
                    <div className="col-2">
                        <label className="titulo">UN</label>
                        <input type="text" className="form-control" value={inputsCargaImo.un_imo} onChange={handleChange}  name="un_imo" />
                    </div>
                    <div className="col-2">
                        <label className="titulo">Packing Group</label>
                        <select name="packing_group" value={inputsCargaImo.packing_group} onChange={handleChange}  className="form-select">
                            <option value="">Selecione</option>
                            <option value="I">I High Danger</option>
                            <option value="II">II Medium Danger</option>
                            <option value="III">III Low Danger</option>
                        </select>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col">
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