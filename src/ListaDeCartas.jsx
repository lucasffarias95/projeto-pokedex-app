import React, { useState, useEffect } from 'react';

function ListaDeCartas() {
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartas = async () => {
      try {
        const response = await fetch('https://api.pokemontcg.io/v2/cards');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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

  if (loading) {
    return <p>Carregando cartas...</p>;
  }

  if (error) {
    return <p>Erro ao carregar as cartas: {error.message}</p>;
  }

  return (
    <div>
      <h2>Lista de Cartas Pokémon</h2>
      <ul>
        {cartas.map(carta => (
          <li key={carta.id}>
            {carta.name} - {carta.set.name}
            {carta.images?.small && <img src={carta.images.small} alt={carta.name} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaDeCartas;