import './FormListaCotacoes.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ListaCotacoesUsuario from './ListaCotacoesUsuario';
import ListaCotacoesTime from './ListaCotacoesTime';
export default (props) => {
    const [listarCotacaoUsuario, setListarCotacaoUsuario] = useState(true);
    const [listarCotacaoTime, setListarCotacaoTime] = useState(false);

    const handleListarCotacaoUsuario = () => {
        setListarCotacaoTime(false);
        setListarCotacaoUsuario(true);
    }

    const handleListaCotacoesTime = () => {
        setListarCotacaoUsuario(false);
        setListarCotacaoTime(true);

    }
    return (
        <>
            <div className="col col-9">
                <div className='shadow-lg p-4 mb-10 bg-blue rounded no-gutters m-0'>
                    <ul className="nav nav-underline">
                        <li className="nav-item">
                            <Link className="nav-link-listacotacao" onClick={handleListarCotacaoUsuario}>
                                Minhas Cotações
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link-listacotacao" onClick={handleListaCotacoesTime}>
                                Cotação do Time
                            </Link>
                        </li>
                    </ul>
                </div>
                <br />
                {
                    listarCotacaoUsuario === true && (
                        <ListaCotacoesUsuario apiDados={props.apiDados} urlServer={props.urlServer} id_usuario={props.id_usuario} />
                    )
                }
                {
                    listarCotacaoTime === true && (
                        <ListaCotacoesTime apiDados={props.apiDados} urlServer={props.urlServer} id_usuario={props.id_usuario} />
                    )
                }

            </div>
        </>
    )
}
