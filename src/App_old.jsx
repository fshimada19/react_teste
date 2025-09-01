import { useState } from 'react'
import Header from './componentes/Header/Header'
import Cotacao from './componentes/Cotacao/Cotacao'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Usuarios from './componentes/Usuarios/Usuarios'
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
          <PrimeReactProvider>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path='/' element={<Cotacao />} />
                <Route path='/cotacao' element={<Cotacao />}></Route>
                <Route path='/usuarios' element={<Usuarios />}></Route>
              </Routes>
            </BrowserRouter>
          </PrimeReactProvider>                  
      </div>
  )
}
export default App
