import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importe o CSS do Bootstrap

function ListaDeCartas() {
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCartas, setFilteredCartas] = useState([]);

  useEffect(() => {
    const fetchCartas = async () => {
      try {
        const response = await fetch('https://api.pokemontcg.io/v2/cards');
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        setCartas(data.data);
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
              carta.name.toLowerCase().includes(term) || carta.id.toLowerCase().includes(term)
          );
          setFilteredCartas(results);
        } else {
          setFilteredCartas(cartas);
        }
      }, [searchTerm, cartas]);

  if (loading) {
    return <p className="text-center mt-4">Carregando cartas...</p>;
  }

  if (error) {
    return <p className="text-danger text-center mt-4">Erro ao carregar as cartas: {error.message}</p>;
  }

  return (
    <div className="container-fluid">
      <h1 className="text-center my-4 display-4">Lista de Cartas Pokémon</h1>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar por nome ou ID da carta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="row justify-content-center">
        {filteredCartas.map(carta => (
          <div key={carta.id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column align-items-center">
                <h2 className="card-title h5 mb-2 text-center">{carta.name}</h2>
                <p className="card-subtitle text-muted mb-2 text-center">{carta.set.name}</p>
                {carta.images?.small && (
                  <img
                    src={carta.images.small}
                    alt={carta.name}
                    className="img-fluid rounded mb-3"
                    style={{ maxWidth: '200px' }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredCartas.length === 0 && searchTerm && (
        <div className="text-center mt-4">
          <p>Nenhuma carta encontrada.</p>
        </div>
      )}
    </div>
  );
}

export default ListaDeCartas;
