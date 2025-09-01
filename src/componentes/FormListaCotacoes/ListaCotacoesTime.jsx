import { useEffect, useState } from "react";
import "./ListaCotacoes.css";
import api from '../../api';
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
export default (props) => {
    const [listaCotacoes, setListaCotacoes] = useState([]);
    const [passouProposta, setPassouProposta] = useState(false);
    const [pesquisaCotacao, setPesquisaCotacao] = useState("");

    const handleBuscaProposta = async (busca) => {
        setPesquisaCotacao(busca.target.value);

        if(busca.target.value.length >= 3) {
            let resultado = await api.post("https://allinkscoa.com.br"+props.apiDados+"pesquisa_propostas.php",
                {
                    "parametro_pesquisa":busca.target.value
                }
            ).then((response) => {
                return response.data
            }).catch((err) => {
                console.error("Ocorreu um erro" + err);
            });    
            setListaCotacoes(resultado);
        } else {
            if(busca.target.value === "") {
                busca_proposta_time();
            }
        }

    }

    async function busca_proposta_time() {
        Swal.fire({
            title: "Carregando Propostas !",
            text:"Por favor Aguarde",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        let resultado = await api.post("https://allinkscoa.com.br"+props.apiDados+"buscar_propostas_time.php",
                                                    {
                                                        "id_usuario": props.id_usuario
                                                    }
        ).then((response) => {
            return response.data
        }).catch((err) => {
            console.error("Ocorreu um erro" + err);
        });

        setListaCotacoes(resultado);
        Swal.close();
    }



    useEffect(() => {
        busca_proposta_time();
    }, []);

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
                "id_usuario": props.id_usuario,
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
        <div className="shadow-lg m-0 w-100">
            <div className='row'>
                <div className="col-8 p-3 border-bottom titulo">
                    <b>Cotações do Time</b>
                </div>
                <div className="col-4 border-bottom titulo_informacao p-2">
                    <input type="text" placeholder="Buscar" value={pesquisaCotacao} onChange={handleBuscaProposta} name="pesquisar_cotacao" className="form-control h-10" />
                </div>
            </div>
            <div >
                ESTE MÊS
                <div className="Container">
                    <div className="row">
                        <div className="col-md-1 titulo_tabela" >#</div>
                        <div className="col-md-1 titulo_tabela">Status</div>
                        <div className="col-md-2 titulo_tabela">Número Proposta</div>
                        <div className="col-md-3 titulo_tabela">Cliente</div>
                        <div className="col-md-1 titulo_tabela">Origem</div>
                        <div className="col-sm-1 titulo_tabela">Destino</div>
                        <div className="col-sm-2 titulo_tabela">Criação </div>
                        <div className="col-sm-1 titulo_tabela"></div>                        
                    </div>
                </div>
                <div className="dados_result">
                    {
                        listaCotacoes.length > 0 ? (
                            listaCotacoes.map((item, contadorProposta) => (
                                <div className="Container p-2" key={contadorProposta}>
                                    <div className="row shadow p-2 linha">
                                        <div className="col-md-1">
                                            <Link className="link-proposta" to={props.urlServer+"alteracao_cotacao/" + item.id_proposta}>
                                                {item.id_proposta}
                                            </Link>
                                        </div>
                                        <div className="col-md-1">{item.status}</div>
                                        <div className="col-md-2">{item.numero_proposta}</div>
                                        <div className="col-md-3">{item.cliente}</div>
                                        <div className="col-md-1">{item.origem}</div>
                                        <div className="col-sm-1">{item.destino}</div>
                                        <div className="col-sm-2">{item.data_inclusao}</div>                                        
                                        <div className="col-sm-1">                                            
                                            <button type="button" onClick={()=>handleDuplicarProposta(item.id_proposta)} className="btn btn-outline-dark v-icon notranslate v-icon--link mdi mdi-content-duplicate theme--light dark-grey-purple--text"></button>                                        
                                        </div>                                    
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="Container p-2">
                                <div className="row">
                                    <div className="mensagem_sem_registro">Sem Propostas Cadastradas</div>
                                </div>
                            </div>
                        )

                    }
                </div>
            </div>


        </div>
    )
}