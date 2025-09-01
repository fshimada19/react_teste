import './Header.css';
import { Link } from 'react-router-dom';
function Header(props) {

    function nova_cotacao() {
        window.location=props.urlServer;
    }
    return (
        <header className="fixar_posicao">
            <nav className="navbar navbar-expand-md dark--blue header-size-proposta" >
                <div className="container-fluid">
                    <a className="navbar-brand white--text" href="#">
                        <span className='cor_texto_ambiente'>Ambiente de Produção     </span>  
                    </a>
                    <div className="collapse navbar-collapse justify-content-center"  id="navbarSupportedContent">
                        <ul className="nav nav-underline">
                            <li className="nav-item">
                                <Link className="nav-link" onClick={()=>nova_cotacao()}>
                                Nova Cotação
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={props.urlServer+"listaCotacoes"}>
                                Lista Cotações
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="collapse navbar-collapse justify-content-end"  id="navbarSupportedContent">
                        {props.nome_usuario}<br />
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header
