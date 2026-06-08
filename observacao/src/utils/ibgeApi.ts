/**
 * Integração com API do IBGE para estados e cidades
 */

export interface State {
  id: number;
  name: string;
  sigla: string;
}

export interface City {
  id: number;
  name: string;
}

// Cache para evitar chamadas desnecessárias
const statesCache: State[] = [];
const citiesCache: Map<number, City[]> = new Map();

// Buscar todos os estados
export const fetchStates = async (): Promise<State[]> => {
  try {
    // Retornar cache se disponível
    if (statesCache.length > 0) {
      return statesCache;
    }

    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
    );
    if (!response.ok) throw new Error("Erro ao buscar estados");

    const data = await response.json();

    // Ordenar alfabeticamente e filtrar valores inválidos
    const sorted = (data as State[])
      .filter((state) => state && state.name)
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    // Armazenar no cache
    statesCache.push(...sorted);

    return sorted;
  } catch (error) {
    console.error("Erro ao buscar estados:", error);
    return [];
  }
};

// Buscar cidades de um estado
export const fetchCities = async (stateId: number): Promise<City[]> => {
  try {
    // Retornar cache se disponível
    if (citiesCache.has(stateId)) {
      return citiesCache.get(stateId) || [];
    }

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`,
    );
    if (!response.ok) throw new Error("Erro ao buscar cidades");

    const data = await response.json();

    // Ordenar alfabeticamente e filtrar valores inválidos
    const sorted = (data as City[])
      .filter((city) => city && city.name)
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    // Armazenar no cache
    citiesCache.set(stateId, sorted);

    return sorted;
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
    return [];
  }
};
