import React from 'react';
import './App.css';
import ListaDeCartas from './ListaDeCartas'

function App() {
  return(
    <div className="bg-light min-vh-100 d-flex flex-column">
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">PokeDex Digital</h1>
        <p className="App-intro">
          Bem-vindo a sua PokeDex!
        </p>
      </header>
      <main className="App-main">
        <ListaDeCartas />
      </main>
      <footer className="App-footer">
        <p>Dados da API Pokemon TCG</p>
      </footer>
    </div>
  </div>
  );
}
export default App;