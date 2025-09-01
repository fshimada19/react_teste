import './HeaderPropostaFormalizada.css';
import { useState, useEffect } from 'react';

function HeaderPropostaFormalizada(props) {
    const [numeroProposta, setNumeroProposta] = useState("");
    const [dataEmissao, setDataEmissao] = useState("");
    const [dataValidade, setDataValidade] = useState("");
    const [numeroVersao, setNumeroVersao] = useState([]);
    const [statusProposta, setStatusProposta] = useState("");
    const [exibirImpressao, setExibirImpressao] = useState(0);
    const [propostaPendente, setPropostaPendente] = useState(false);

    useEffect(() => {
        if(props.processarDadosProposta === true) {
            if (!props.tokenAcesso) {
                setExibirImpressao(1)
            } else {
                setExibirImpressao(0)
            }

            setNumeroProposta(props.dados_proposta.numero_proposta);
            setDataEmissao(props.dados_proposta.data_emissao);
            setDataValidade(props.dados_proposta.data_validade);
            setStatusProposta(props.dados_proposta.status_proposta);

            if(props.dados_proposta.dados_header.pendente) {
                setPropostaPendente(props.dados_proposta.dados_header.pendente);
            }

            if(props.dados_proposta.versoes_cotacao.length > 0) {
                setNumeroVersao(props.dados_proposta.versoes_cotacao);
            }
            props.handleProcessarDadosProposta(false);
        }
    }, [props.processarDadosProposta]);
    
    function handleNumeroVersao(numero_versao) {
        props.processarVersaoProposta(numero_versao);
        document.querySelectorAll("span[name='versoes_proposta']").className = "";
    }
    
    return (
        <>
            <header>
                <div className="navbar navbar-expand-md dark--blue header-size-proposta_formalizada" >
                    <div className="container-fluid conteudo_header_proposta_formalizada">
                        
                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                            Olá, é muito bom te ver por aqui! Esse é o seu ambiente digital da Allink de proposta comercial<br />
                        </div>
                    </div>
                </div>
            </header>
            <div className='container_cabecalho_proposta_formalizada'>
                <div className='container ml-0'>
                    <div className='row align-end no-gutters'>
                        <div className='col col-3'>
                            <div>
                                <div className='uppercase titulo_numero_proposta_formalizada'>
                                    Número Proposta
                                </div>
                                <div className='conteudo_numero_proposta_formalizada'>
                                    {numeroProposta}
                                </div>
                            </div>
                        </div>
                        <div className='col col-3'>
                            <br />
                            <div className='uppercase pb-2 conteudo_validade_proposta_formalizada'>
                                Valida até {dataValidade}
                            </div>
                        </div>
                        <div className="col col-3 justify-content-end status_proposta_formalizada">
                            {statusProposta}
                        </div>
                    </div>
                </div>
                <div className='container d-flex my-0 pa-0 ml-autopa-0 mr-auto'>
                    {
                        exibirImpressao === 1 ? (
                            <div className='d-flex justify-center mb-2'>                        
                                {numeroVersao.length > 0 && (
                                        numeroVersao.map((item, contadorVersao)=>(
                                            <span key={contadorVersao} className='alinhamento_botoes_versao'>
                                                <button className='btn btn-light' onClick={()=>handleNumeroVersao(item.numero_versao)} numero_versao={String(item.numero_versao)} >
                                                    <span name="versoes_proposta" id={"versao_"+String(item.numero_versao)} className={String(item.numero_versao) === String(numeroVersao.length)?"versao_selecionada":""}>{String(item.numero_versao) === String(numeroVersao.length) ?"ATUAL":"V"+item.numero_versao}</span>
                                                </button>
                                            </span>
                                        ))
                                    )                        
                                }
                            </div>                                        
                        ):(
                            <div className='d-flex justify-center mb-2'> </div>
                        )
                    }
                    <div className='data_emissao_formatacao d-flex justify-center align-center'>
                        <div className='emissao_formatacao'>Emissão: </div>{dataEmissao}
                    </div>
                </div>
                {
                    propostaPendente === true && (
                        <div className='container d-flex my-0 pa-0 ml-autopa-0 mr-auto'>
                            <div className='d-flex justify-center mb-2 pendete_aceite_proposta_formalizada'>
                                Proposta pendente de aceite, por favor contate nosso comercial!
                            </div>
                        </div>    
                    )
                }
            </div>
        </>
    );
}

export default HeaderPropostaFormalizada
