import { Option, SearchConfig } from './types'

export const localFetch = (searchTerm: string, options: Option[]) => {
  return options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )
}

export const apiFetch = async (
  searchTerm: string,
  searchConfig: SearchConfig,
): Promise<Option[]> => {
  try {
    const response = await fetch(searchConfig.url, {
      method: searchConfig.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...searchConfig.headers,
      },
      body:
        searchConfig.method === 'POST'
          ? JSON.stringify(
              searchConfig.transformRequest?.(searchTerm) || {
                search: searchTerm,
              },
            )
          : undefined,
    })

    if (!response.ok) {
      throw new Error('Error en la búsqueda')
    }

    const data = await response.json()
    const transformedResults = searchConfig.transformResponse?.(data) || []
    return transformedResults
  } catch (error) {
    console.error('Error en la búsqueda:', error)
    return []
  }
}

export const fetchAutocomplete = async (
  searchTerm: string,
  searchConfig?: SearchConfig,
  options?: Option[],
): Promise<Option[]> => {
  return searchConfig
    ? apiFetch(searchTerm, searchConfig)
    : localFetch(searchTerm, options || [])
}
