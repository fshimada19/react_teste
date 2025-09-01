import './Header.css';
function Header() {
    return (
        <header className="v-sheet theme--light v-toolbar v-toolbar--dense v-app-bar dark-blue header-size-proposta"> 
            <div className="v-toolbar__content" style={{height:'48px'}}>
                <div className="row no-gutters">
                    <div className='d-flex align-center col col-2'>
                        <div className='d-flex align-center'>
                            <button type="button" className="v-icon notranslate v-icon--link mdi mdi-home theme--light"></button>
                        </div>
                        <div className="white--text"> AMBIENTE DE TESTES </div>
                    </div>
                    <div className='justify-center d-flex col col-7'>
                        <div className="v-tabs d-flex justify-center dark-blue">

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header