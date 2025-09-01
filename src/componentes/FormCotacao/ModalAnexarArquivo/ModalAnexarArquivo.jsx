import { useEffect, useState } from "react";
import ReactSelectAsync from 'react-select/async';
import api from "../../../api";
import apiHomol from '../../../api_homol';

import { NumericFormat } from 'react-number-format';
import './ModalAnexarArquivo.css';

export default (props) => {
    const handleFecharModal = () => {
        props.fecharModalAnexarArquivo(false)
    }

    const [listaArquivosExternos, setListaArquivosExternos] = useState(props.lista_arquivos_externos);
    const [listaArquivosInternos, setListaArquivosInternos] = useState(props.lista_arquivos_internos); 
    const [mensagensValidacao, setMensagensValidacao] = useState({
        "arquivos_externo": "",
        "arquivos_interno": ""
    });

    function salvar_anexos() {
        props.atualizaListaArquivosInterno(listaArquivosInternos);
        props.atualizaListaArquivosExterno(listaArquivosExternos);
        props.fecharModalAnexarArquivo(false);
    }

    const [arquivoUpload, setArquivoUpload] = useState("");

    const handleAdicionarArquivoExterno = async (e) => {
        e.preventDefault();
        let adicionar_arquivo = true;
        if (document.querySelector('#anexar_arquivos_externo').value == "") {
            setMensagensValidacao({ ...mensagensValidacao, ["arquivos_externo"]: "Por favor selecione um arquivo para Anexar." });
            adicionar_arquivo = false;
        } else {
            setMensagensValidacao({ ...mensagensValidacao, ["arquivos_externo"]: "" });
        }

        if (adicionar_arquivo === true) {
            const formData = new FormData();
            formData.append("arquivo", arquivoUpload);
            formData.append("id_usuario", props.id_usuario)
            formData.append("tipo_arquivo", "arquivos_externos");

            const headers = {
                'headers': {
                    'Content-Type': 'multipart/form-data'
                }
            }

            let resultado = await api.post("https://allinkscoa.com.br"+props.apiDados+"uploadArquivos.php", formData, headers).then((response) => {
                return response.data
            }).catch((err) => {
                console.error("Ocorreu um erro" + err);
            });

            let arquivo = document.querySelector('#anexar_arquivos_externo');

            setListaArquivosExternos([...listaArquivosExternos, {
                "name": arquivo.files[0].name,
                "arquivo": arquivo.files[0]
            }
            ]);
            arquivo.value = "";
        }

        /*
        if(tipo_lista === "arquivos_interno") {
            if (document.querySelector('#anexar_arquivos_interno').value == "") {
                setMensagensValidacao({ ...mensagensValidacao, ["arquivos_interno"]: "Por favor selecione um arquivo para Anexar." });
                adicionar_arquivo = false;
            } else {
                setMensagensValidacao({ ...mensagensValidacao, ["arquivos_interno"]: "" });
            }
    
            if (adicionar_arquivo === true) {
                let arquivo = document.querySelector('#anexar_arquivos_interno');
                setListaArquivosInternos([...listaArquivosInternos, {
                    "name": arquivo.files[0].name,
                    "arquivo": arquivo.files[0]
                }
                ]);
                arquivo.value = "";
            }    
        }
        */
    }

    const [arquivoUploadInterno, setArquivoUploadInterno] = useState("");
    const handleAdicionarArquivoInterno = async (e) => {
        e.preventDefault();
        let adicionar_arquivo = true;
        if (document.querySelector('#anexar_arquivos_interno').value == "") {
            setMensagensValidacao({ ...mensagensValidacao, ["arquivos_interno"]: "Por favor selecione um arquivo para Anexar." });
            adicionar_arquivo = false;
        } else {
            setMensagensValidacao({ ...mensagensValidacao, ["arquivos_interno"]: "" });
        }

        if (adicionar_arquivo === true) {
            const formData = new FormData();
            formData.append("arquivo", arquivoUploadInterno);
            formData.append("id_usuario", props.id_usuario)
            formData.append("tipo_arquivo", "arquivos_internos");

            const headers = {
                'headers': {
                    'Content-Type': 'multipart/form-data'
                }
            }

            let resultado = await api.post("https://allinkscoa.com.br"+props.apiDados+"uploadArquivos.php", formData, headers).then((response) => {
                return response.data
            }).catch((err) => {
                console.error("Ocorreu um erro" + err);
            });

            let arquivo = document.querySelector('#anexar_arquivos_interno');

            setListaArquivosInternos([...listaArquivosInternos, {
                "name": arquivo.files[0].name,
                "arquivo": arquivo.files[0]
            }
            ]);
            arquivo.value = "";
        }

        /*
        if(tipo_lista === "arquivos_interno") {
            if (document.querySelector('#anexar_arquivos_interno').value == "") {
                setMensagensValidacao({ ...mensagensValidacao, ["arquivos_interno"]: "Por favor selecione um arquivo para Anexar." });
                adicionar_arquivo = false;
            } else {
                setMensagensValidacao({ ...mensagensValidacao, ["arquivos_interno"]: "" });
            }
    
            if (adicionar_arquivo === true) {
                let arquivo = document.querySelector('#anexar_arquivos_interno');
                setListaArquivosInternos([...listaArquivosInternos, {
                    "name": arquivo.files[0].name,
                    "arquivo": arquivo.files[0]
                }
                ]);
                arquivo.value = "";
            }    
        }
        */
    }


    function handleExcluirArquivo(contadorLista, tipoLista) {
        if (tipoLista === "arquivos_externo") {
            let novaListaArquivos = [];
            listaArquivosExternos.map((item, indexLista) => {
                if (indexLista !== contadorLista) {
                    novaListaArquivos = [...novaListaArquivos, item];
                }
            });
            setListaArquivosExternos(novaListaArquivos);
        }

        if (tipoLista === "arquivos_interno") {
            let novaListaArquivos = [];
            listaArquivosInternos.map((item, indexLista) => {
                if (indexLista !== contadorLista) {
                    novaListaArquivos = [...novaListaArquivos, item];
                }
            });
            setListaArquivosInternos(novaListaArquivos);
        }
    }


    useEffect(() => {
        if (props.lista_arquivos_internos.length > 0) {
            setListaArquivosInternos(props.lista_arquivos_internos);
        }

        if (props.lista_arquivos_externos.length > 0) {
            setListaArquivosExternos(props.lista_arquivos_externos);
        }
    }, [props.lista_arquivos_internos, props.lista_arquivos_externos])

    return (
        <div className='modal_registro container shadow-lg bg-white rounded no-gutters m-0'>
            <div className='row modal_registro-titulo'>
                <div className='col-11'>Anexar Arquivo a Proposta</div>
                <div className='col'>
                    <button onClick={handleFecharModal} name="fechar_modal" className='btn btn-outline-light btn-sm'> X </button>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-10">&nbsp;</div>
                <div className="col">
                    <button type="button" name="salvar_anexos" onClick={() => salvar_anexos()} id="salvar_anexos" className="btn btn-outline-dark btn-sm">Salvar</button>&nbsp;
                </div>
            </div>

            <form onSubmit={handleAdicionarArquivoExterno}>
                <div className="row">
                    <div className="col titulo border-bottom"><b>Arquivos para Enviar por Email</b></div>
                </div>
                <div className="row">
                    <div className="col-10">
                        <label className="titulo" for="anexar_arquivos_externo">Anexar Arquivos Proposta</label>
                        <div className="input-group custom-file-button">
                            <label className="input-group-text" for="anexar_arquivos_externo">Arquivos</label>
                            <input type="file" onChange={(e) => setArquivoUpload(e.target.files[0])} name="anexar_arquivos_proposta_arquivos_externo" id="anexar_arquivos_externo" className="form-control" />
                        </div>
                        <span className="campos_validacao">{mensagensValidacao.arquivos_externo}</span>
                    </div>
                    <div className="col">
                        <label className="titulo">&nbsp;</label><br />
                        <button type="submit" name="adicionar_arquivo_externo" className="btn btn-outline-dark btn-sm">Adicionar</button>
                    </div>
                    <br />
                </div>
                <div name="lista_arquivos_externos" className="lista_anexos">
                    {listaArquivosExternos.length > 0 && (
                        <table width="100%" className="table table-hover">
                            <tbody>
                                {listaArquivosExternos.map((item, contadorLista) => (
                                    <tr key={contadorLista}>
                                        <td width="90%">{item.name}</td>
                                        <td width="10%">
                                            <button type="button" name="cmd_excluir_arquivo" onClick={() => handleExcluirArquivo(contadorLista, "arquivos_externo")}> X </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                    }
                </div>
            </form>

            <br />
            <form onSubmit={handleAdicionarArquivoInterno}>
                <div className="row">
                    <div className="col titulo border-bottom"><b>Arquivos para Uso Interno Allink</b></div>
                </div>
                <div className="row">
                    <div className="col-10">
                        <label className="titulo">Anexar Arquivos Proposta</label>
                        <div className="input-group custom-file-button">
                            <label className="input-group-text" for="anexar_arquivos_interno">Arquivos</label>
                            <input type="file" onChange={(e) => setArquivoUploadInterno(e.target.files[0])} name="anexar_arquivos_proposta_arquivos_interno" id="anexar_arquivos_interno" className="form-control" />
                        </div>
                        <span className="campos_validacao">{mensagensValidacao.arquivos_interno}</span>
                    </div>
                    <div className="col">
                        <label className="titulo">&nbsp;</label><br />
                        <button
                            type="submit"
                            name="adicionar_arquivo_interno"
                            className="btn btn-outline-dark btn-sm"
                        >
                            Adicionar
                        </button>
                    </div>
                </div>
                <div name="lista_arquivos_externos" className="lista_anexos">
                    {listaArquivosInternos.length > 0 && (
                        <table width="100%" className="table table-hover">
                            <tbody>
                                {listaArquivosInternos.map((item, contadorLista) => (
                                    <tr key={contadorLista}>
                                        <td width="90%">{item.name}</td>
                                        <td width="10%">
                                            <button type="button" name="cmd_excluir_arquivo" onClick={() => handleExcluirArquivo(contadorLista, "arquivos_interno")}> X </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                    }
                </div>
            </form>
        </div>
    );
}