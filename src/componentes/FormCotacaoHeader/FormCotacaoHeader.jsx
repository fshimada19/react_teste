import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Switch.css';
import './FormCotacaoHeader.css';
import Swal from 'sweetalert2';
import api from '../../api';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default (props) => {


    const [dados_header, setDadosHeader] = useState({
        "pendente": false,
        "data_validade":""
    });

    const handleSalvarCotacao = () => {
        props.clickSalvar(true);
    }

    const handleCalcularProposta = () => {
        props.clickCalculadora(true);
    }

    const handleAbrirModalAnexarArquivo = () => {
        props.abrirModalAnexo(true)
    }

    const [propostaPendente,setPropostaPendente] = useState(false);
    const handlePendente = (valor) => {
        if (valor.target.checked === true) {
            dados_header.pendente = true;
            setPropostaPendente(true);
        } else {
            dados_header.pendente = false;
            setPropostaPendente(false);
        }
        props.dados_header(dados_header);
    }

    const [dataValidade, setDataValidade] = useState(null);
    useEffect(()=>{
        if(props.dados_proposta_salva !== null) {
            if(props.dados_proposta_salva.dados_header.pendente) {
                setPropostaPendente(props.dados_proposta_salva.dados_header.pendente);
                dados_header.pendente = props.dados_proposta_salva.dados_header.pendente;
            }
            
            let data_validade = props.dados_proposta_salva.data_validade;

            if(props.dataValidadeProposta !== "" && props.dataValidadeProposta !== null) {
                data_validade = props.dataValidadeProposta;                
            }
             
            let data_validade_array = data_validade.split("/");
            let data_validade_object = new Date(data_validade_array[2]+"-"+data_validade_array[1]+"-"+data_validade_array[0]+" 00:00:00");
            setDataValidade(new Date(data_validade_object));
            dados_header.data_validade = data_validade_array[2]+"-"+data_validade_array[1]+"-"+data_validade_array[0];
            props.dados_header(dados_header);
        } else {
            if(props.dataValidadeProposta !== "") {
                let data_validade = props.dataValidadeProposta;
                let data_validade_array = data_validade.split("/");
                let data_validade_object = new Date(data_validade_array[2]+"-"+data_validade_array[1]+"-"+data_validade_array[0]+" 00:00:00");    
                setDataValidade(data_validade_object);
                dados_header.data_validade = data_validade_array[2]+"-"+data_validade_array[1]+"-"+data_validade_array[0];
                props.dados_header(dados_header);
            }
        }
    },[props.dados_proposta_salva, props.dataValidadeProposta])

    const [valorTotalUsd, setValorTotalUsd] = useState(null);
    const [valorTotalEur, setValorTotalEur] = useState(null);
    const [valorTotalBrl, setValorTotalBrl] = useState(null);
 
    useEffect(()=>{
        if(props.processar_totais === true) {
            if(props.dados_taxas !== null) {
                setValorTotalUsd(parseFloat(props.dados_taxas.valor_total_taxas_usd).toFixed(2));
                setValorTotalEur(parseFloat(props.dados_taxas.valor_total_taxas_eur).toFixed(2));
                setValorTotalBrl(parseFloat(props.dados_taxas.valor_total_taxas_brl).toFixed(2));
            }
            props.handle_processar_totais(false);         
        }
    },[props.processar_totais])

    const style = {
        '--bs-tooltip-max-width': '400px', ...props.style
     };
    const tooltip = (
        <Tooltip id="tooltip" style={style}>
            Alterações<br />
            {
                (() => {
                    if(props.dados_proposta_salva !== null) {
                        return (
                            props.dados_proposta_salva.versoes_cotacao.map((item,contadorVersaoCotacao)=> (
                                <li key={contadorVersaoCotacao}>{item.nome_usuario_inclusao} em {item.data_inclusao_versao}</li>
                            ))
                        )
                    }
                })()
            }
        </Tooltip>
      );
    
    function abrir_proposta_formalizada(id_cotacao, token_proposta) {
        window.open(props.urlServer+"propostaFormalizada/"+id_cotacao+"/"+token_proposta)
    }

    function abrir_vinculacao_exp(token_proposta) {
        //console.log(props.urlServer)
        window.open("https://allinkscoa.com.br/Exportacao/booking.php?token="+token_proposta);
    }

    function abrir_vinculacao_imp(token_proposta) {
        window.open("https://allinkscoa.com.br/routing_order/reservas/form/cadastro?token="+token_proposta);
    }

    async function handleEnviarProposta(id_item_proposta) 
    {
        
        Swal.fire({
            title: "Enviando Proposta !",
            text: "Por favor Aguarde",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        let resultado = await api.post("https://allinkscoa.com.br"+props.apiDados+"enviarProposta.php",
            {
                id_item_proposta:id_item_proposta,
                id_usuario_envio:props.id_usuario_logado
            }
        ).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });

        if(resultado.success === 1) {
            Swal.close();
            Swal.fire({
                title: "Proposta Enviada com sucesso !",
                text: "Proposta Número: " + resultado.numero_proposta,
                icon: "success"
            });                        
        } else {
            Swal.close();
            Swal.fire({
                title: "Nao foi possivel enviar a Proposta !",
                text: resultado.msg,
                icon: "error"
            });                        
        }
    }

    const handleDataValidade = (date) => {
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1; // Months start at 0!
        let dd = date.getDate();
        
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        const formattedToday = yyyy + '-' + mm + '-' + dd;
        dados_header.data_validade = formattedToday;
        setDataValidade(date);        
    }
    const [startDate, setStartDate] = useState(new Date("2025-01-29"));
    
    async function duplicar_proposta(id_proposta) {
        Swal.fire({
            title: "Duplicando Proposta !",
            text: "Por favor Aguarde",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
        
        let resultado = await api.post("https://allinkscoa.com.br"+props.apiDados+"salvarProposta_duplicada.php",
            {
                "id_usuario": props.id_usuario_logado,
                "id_item_proposta": id_proposta
            }
        ).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });
        if(resultado.numero_proposta) {
            Swal.close();
            window.location=props.urlServer+"alteracao_cotacao/" + resultado.id_proposta
        }
    }

    async function handleDuplicarProposta(id_proposta) {
        //let duplicar_proposta = false;
        if(id_proposta === null) {
            Swal.fire({
                title: "Não é Possível duplicar a Proposta !",
                text: "Proposta Ainda não esta Salva para poder ser duplicada",
                icon: "error"
            });                        
            return false;
        } 
        Swal.fire({
            title: "Deseja Duplicar a Proposta?",
            text: "Esta ação é irreversível!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            cancelButtonText:"Não"
          }).then((result) =>  {
            if (result.isConfirmed) {
                duplicar_proposta(id_proposta);    
            }
          });
        
    }
    
    
    return (
        <>
            <div className="container shadow-lg p-3 mb-4 bg-white rounded m-0 fixar_posicao">
                <div className="row g-3 align-items-start">
                    {
                        (() => {
                            if (props.numeroProposta !== null && props.numeroProposta !== '' && props.dados_proposta_salva !== null) {
                                return (
                                    <div className="col-auto">
                                        <label>Número Proposta</label><br />
                                        <OverlayTrigger placement="bottom" overlay={tooltip}>                                        
                                            <Link className="link-proposta" onClick={()=>abrir_proposta_formalizada(props.dados_proposta_salva.id_item_cotacao, props.dados_proposta_salva.token_proposta)}>
                                                {props.numeroProposta}
                                            </Link>                                                                                
                                        </OverlayTrigger>
                                    </div>            
                                ) 
                            } else if(props.numeroProposta !== null && props.numeroProposta !== '' && props.dados_proposta_salva === null && props.id_item_proposta !== null) {
                                return (
                                    <div className="col-auto">
                                        <label>Número Proposta</label><br />
                                            <Link className="link-proposta" onClick={()=>abrir_proposta_formalizada(props.id_item_proposta, props.token_proposta)}>
                                                {props.numeroProposta}
                                            </Link>                                                                                
                                    </div>
                                )
                            }
                        })()
                    }
                    <div className="col-1">
                        <i aria-hidden="true" className="v-icon notranslate mdi mdi-calendar theme--light"></i>
                    </div>
                    <div className="col-2">
                        {
                        /*
                            <input type="text" name="data_cotacao" value={dataValidade} onChange={handleDataCotacao} id="data_cotacao"  className="form-control" />
                        */
                        }
                        <DatePicker name='data_cotacao' dateFormat={"dd/MM/yyyy"} className="form-control" value={dataValidade} selected={dataValidade}  onChange={handleDataValidade} />
                    </div>
                    <div className="col-2" >
                    <label className="switch">
                        <input type="checkbox" onChange={handlePendente} checked={propostaPendente} label="Pendente" id="pendente" name='pendente' />
                            <span className="slider round"></span>
                        </label>Pendente
                    </div>
                    <div className="col-md-4 text-center">
                        <b>Total:</b>
                        {valorTotalUsd !== null ? 
                        <span className='formatacao_totais'>{"USD: "+valorTotalUsd}</span>
                        :
                        ''
                        }

                        {valorTotalEur !== null ? 
                        <span className='formatacao_totais'>{"EUR: "+valorTotalEur}</span>
                        :
                        ''
                        }

                        {valorTotalBrl !== null ? 
                            <span className='formatacao_totais'>{"BRL: "+valorTotalBrl}</span>
                        :
                            ''
                        }

                        <br />
                        <button type="button" onClick={handleAbrirModalAnexarArquivo} className="btn btn-outline-dark">
                            <i aria-hidden="true" className="v-icon notranslate mr-2 mdi mdi-paperclip theme--light"></i>
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        {
                        /*
                        <button type="button" onClick={handleCalcularProposta} className="btn btn-outline-dark">
                            <i aria-hidden="true" className="v-icon notranslate mr-2 mdi mdi-calculator theme--light"></i>
                        </button>
                        */
                        }
                        <button type="button" onClick={()=>handleDuplicarProposta(props.dados_proposta_salva !== null ? props.dados_proposta_salva.id_item_cotacao : props.id_item_proposta)} className="btn btn-outline-dark v-icon notranslate v-icon--link mdi mdi-content-duplicate theme--light dark-grey-purple--text"></button>
                        &nbsp;&nbsp;&nbsp;
                        <button type="button" disabled={props.desabilitarSalvar} onClick={handleSalvarCotacao} className="btn btn-outline-dark"><i aria-hidden="true" className="v-icon notranslate mr-1 mdi mdi-content-save-outline theme--light"></i> Salvar</button>
                        &nbsp;&nbsp;&nbsp;
                        {(props.dados_proposta_salva !== null && props.id_item_proposta === null) && (
                            <>
                            <button type="button" onClick={()=>handleEnviarProposta(props.dados_proposta_salva !== null ? props.dados_proposta_salva.id_item_cotacao : props.id_item_proposta)} className="btn btn-outline-dark">Enviar</button>
                            </>
                        )}  

                        {(props.dados_proposta_salva === null && props.id_item_proposta !== null) && (
                            <>
                            <button type="button" onClick={()=>handleEnviarProposta(props.id_item_proposta)} className="btn btn-outline-dark">Enviar</button>
                            </>
                        )}                        


                        {(props.dados_proposta_salva === null && props.id_item_proposta === null) && (
                            <>
                            <button type="button" disabled="disabled" className="btn btn-outline-dark">Enviar</button>
                            </>
                        )}                        


                    </div>
                </div>
                {
                    (props.dados_proposta_salva === null && props.sentido_proposta !== "") && (
                        <div className='row g-3 align-items-start'>
                            <div className='col-3'>
                                {
                                    props.sentido_proposta === "EXP" ? (
                                        <button name="vincular_booking" onClick={()=>abrir_vinculacao_exp(props.token_proposta)} className="btn btn-outline-dark" type='button'>Vincular Booking</button> 
                                    ):(
                                        <button name="vincular_ro" onClick={()=>abrir_vinculacao_imp(props.token_proposta)} className="btn btn-outline-dark" type='button'>Vincular RO</button>
                                    )                                    
                                }                                
                            </div>
                        </div>    
                    )
                }
                {
                    props.dados_proposta_salva !== null && (                        
                        <div className='row g-3 align-items-start'>
                            <div className='col-3'>
                                {
                                    props.dados_proposta_salva.sentido_proposta === "EXP" ? (
                                        (props.dados_proposta_salva.numero_booking_vinculado === "") ? (
                                            <button name="vincular_booking" onClick={()=>abrir_vinculacao_exp(props.dados_proposta_salva.token_proposta)} className="btn btn-outline-dark" type='button'>Vincular Booking</button>
                                        ):(
                                            <div>
                                                Número Booking Vinculado<br /> 
                                                <b>{props.dados_proposta_salva.numero_booking_vinculado}</b>
                                            </div>                                                                                                                             
                                        )
                                    ):(
                                        (props.dados_proposta_salva.numero_routing_vinculado === "") ? (
                                            <button name="vincular_ro" onClick={()=>abrir_vinculacao_imp(props.dados_proposta_salva.token_proposta)} className="btn btn-outline-dark" type='button'>Vincular RO</button>
                                        ):(
                                            <div>
                                                Número Routing Vinculado<br /> 
                                                <b>{props.dados_proposta_salva.numero_routing_vinculado}</b>
                                            </div>                                                                                                                             
                                        )                                        
                                    )                                    
                                }                                
                            </div>
                            <div className='col-2'>
                                {
                                    ((props.dados_proposta_salva.ferramenta_proposta_duplicada) && props.dados_proposta_salva.ferramenta_proposta_duplicada === "S") && (
                                        (props.indicacao_proposta_duplicada === "" || props.indicacao_proposta_duplicada === "S") && (
                                            <div><b>Proposta Duplicada</b></div>
                                        )
                                    )
                                
                                }
                            </div>
                        </div>    
                    )
                }
            </div>
        </>
    )
}
