import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ListaDeCartas.module.css';

function ListaDeCartas() {
  
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCartas, setFilteredCartas] = useState([]);
  const [selectedCarta, setSelectedCarta] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

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

      const newSuggestions = cartas
        .filter(carta =>
          carta.name.toLowerCase().startsWith(term)
        )
        .slice(0, 10);
      setSuggestions(newSuggestions);

      const cartaEncontradaPelaDigitacao = cartas.find(c => c.name.toLowerCase() === term || c.id.toLowerCase() === term);
      if (cartaEncontradaPelaDigitacao && (!selectedCarta || selectedCarta.id !== cartaEncontradaPelaDigitacao.id)) {
        setSelectedCarta(cartaEncontradaPelaDigitacao);
      } else if (!cartaEncontradaPelaDigitacao && results.length > 0 && (!selectedCarta || !selectedCarta.name.toLowerCase().includes(term))) {
         setSelectedCarta(results[0]);
      } else if (!cartaEncontradaPelaDigitacao && results.length === 0 && selectedCarta) {
        setSelectedCarta(null);
      }

    } else {
      setFilteredCartas(cartas);
      setSuggestions([]);
      if (cartas.length > 0 && selectedCarta?.id !== cartas[0].id) {
          setSelectedCarta(cartas[0]);
      } else if (cartas.length === 0) {
          setSelectedCarta(null);
      }
    }
  }, [searchTerm, cartas]);

  const handleSuggestionClick = (cartaSugerida) => {
    setSearchTerm(cartaSugerida.name);
    setSelectedCarta(cartaSugerida);
    setSuggestions([]);
  };

  if (loading) {
    return <p className="text-center mt-4">Carregando cartas...</p>;
  }

  if (error) {
    return <p className="text-danger text-center mt-4">Erro ao carregar as cartas: {error.message}</p>;
  }

  return (
    <div className={`container ${styles.containerPrincipal}`}>
      <div className={`row mb-4 p-3 border ${styles.searchBar}`}>
        <div className="col-12">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar por nome ou ID da carta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && suggestions.length > 0 && (
            <ul className={styles.suggestionsList}>
              {suggestions.map((carta) => (
                <li key={carta.id} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSuggestionClick(carta)}>
                  <img
                    src={carta.images?.small}
                    alt={carta.name}
                    className={styles.suggestionImage}
                  />
                  <span>{carta.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={`row mb-4 p-3 border ${styles.selectedCardSection}`}>
        {selectedCarta && (
          <>
            <div className={`col-6 ${styles.selectedCardImageContainer}`}>
              {selectedCarta.images?.small && (
                <img
                  src={selectedCarta.images.small}
                  alt={selectedCarta.name}
                  className={`img-fluid rounded ${styles.cardImage}`}
                />
              )}
            </div>

            <div className={`col-6 ${styles.cardDetails}`}>
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
          </>
        )}
      </div>

      <div className={`row mb-4 p-3 border ${styles.infoSection}`}>
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

      <div className={`row mb-4 p-2 border ${styles.footerInfo}`}>
        <div className="col-12 text-center">
          <p className="mb-0 text-muted">Dados fornecidos pela API Pokémon TCG</p>
        </div>
      </div>
    </div>
  );
}
export default ListaDeCartas;
