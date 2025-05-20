import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function ListaDeCartas() {
  
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCartas, setFilteredCartas] = useState([]);
  const [selectedCarta, setSelectedCarta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;

  
  useEffect(() => {
    const fetchCartas = async () => {
      try {
        const response = await fetch('https://api.pokemontcg.io/v2/cards');
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        setCartas(data.data);
        setFilteredCartas(data.data);
        
        if (data.data.length > 0) {
          setSelectedCarta(data.data[0]);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCartas();
  }, []);
      
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const results = cartas.filter(carta =>
        carta.name.toLowerCase().includes(term) || 
        carta.id.toLowerCase().includes(term)
      );
      setFilteredCartas(results);
      setCurrentPage(1);
      
      if (results.length > 0) {
        setSelectedCarta(results[0]);
        setSelectedCarta(null);}
    } else {
      setFilteredCartas(cartas);
      if (cartas.length > 0 && !selectedCarta) {
        setSelectedCarta(cartas[0]);
      }
    }
  }, [searchTerm, cartas]);

  // Cálculos para paginação
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCartas.slice(indexOfFirstCard, indexOfLastCard);
  
  const totalPages = Math.ceil(filteredCartas.length / cardsPerPage);
  
  // Funções para navegar entre páginas
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Função para selecionar uma carta quando o usuário clica
  const handleSelectCarta = (carta) => {
    setSelectedCarta(carta);                          // Atualiza a carta selecionada
  };

  // Mensagens de carregamento e erro
  if (loading) {
    return <p className="text-center mt-4">Carregando cartas...</p>;
  }

  if (error) {
    return <p className="text-danger text-center mt-4">Erro ao carregar as cartas: {error.message}</p>;
  }

  return (
    <div className="container">
      {/* Barra de pesquisa no topo */}
      <div className="row mb-4 p-3 border">
        <div className="col-12">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar por nome ou ID da carta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Área principal para exibir a carta selecionada */}
      <div className="row mb-4 p-3 border">
        {selectedCarta ? (
          <div className="col-12 d-flex">
            {/* Lado esquerdo: Imagem da carta */}
            <div className="col-6 d-flex justify-content-center align-items-center">
              {selectedCarta.images?.small && (
                <img
                  src={selectedCarta.images.small}
                  alt={selectedCarta.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: '350px' }}
                />
              )}
            </div>
            
            {/* Lado direito: Atributos da carta */}
            <div className="col-6">
              <h2 className="h4 mb-3">{selectedCarta.name}</h2>
              <div className="card">
                <div className="card-body">
                  <p><strong>ID:</strong> {selectedCarta.id}</p>
                  <p><strong>Set:</strong> {selectedCarta.set.name}</p>
                  <p><strong>Raridade:</strong> {selectedCarta.rarity || 'N/A'}</p>
                  {selectedCarta.types && (
                    <p><strong>Tipos:</strong> {selectedCarta.types.join(', ')}</p>
                  )}
                  {selectedCarta.hp && (
                    <p><strong>HP:</strong> {selectedCarta.hp}</p>
                  )}
                  {selectedCarta.attacks && selectedCarta.attacks.length > 0 && (
                    <>
                      <p><strong>Ataques:</strong></p>
                      <ul className="list-group list-group-flush">
                        {selectedCarta.attacks.map((attack, index) => (
                          <li key={index} className="list-group-item">
                            <strong>{attack.name}</strong> - Dano: {attack.damage || 'N/A'}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-12 text-center p-5">
            <p>Nenhuma carta selecionada ou encontrada.</p>
          </div>
        )}
      </div>
      
      {/* Barra de navegação com as miniaturas das cartas */}
      <div className="row mb-4 p-3 border">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              className="btn btn-primary" 
              onClick={prevPage} 
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button
              className="btn btn-primary" 
              onClick={nextPage} 
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Próximo
            </button>
          </div>
          
          <div className="row">
            {currentCards.map(carta => (
              <div key={carta.id} className="col-4 mb-3">
                <div 
                  className={`card h-100 ${selectedCarta?.id === carta.id ? 'border-primary' : ''}`}
                  onClick={() => handleSelectCarta(carta)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body d-flex flex-column align-items-center">
                    <h3 className="card-title h6 mb-2 text-center">{carta.name}</h3>
                    {carta.images?.small && (
                      <img
                        src={carta.images.small}
                        alt={carta.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '100px' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Área para informações adicionais */}
      <div className="row mb-4 p-3 border">
        <div className="col-12">
          <h3 className="h5">Informações da Coleção</h3>
          <p>Total de cartas disponíveis: {filteredCartas.length}</p>
          {selectedCarta && (
            <p>
              Você está visualizando a carta <strong>{selectedCarta.name}</strong> da coleção <strong>{selectedCarta.set.name}</strong>.
            </p>
          )}
        </div>
      </div>
      
      {/* Rodapé */}
      <div className="row mb-4 p-2 border">
        <div className="col-12 text-center">
          <p className="mb-0 text-muted">Dados fornecidos pela API Pokémon TCG</p>
        </div>
      </div>
    </div>
  );
}
export default ListaDeCartas;
