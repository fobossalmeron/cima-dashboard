import { extractNumber } from '@/lib/utils' // Ajusta la ruta según la ubicación de tu función

describe('extractNetPromoterScore', () => {
  it('debería devolver 5 para la entrada "5 - La Recomendaría"', () => {
    const response = '5 - La Recomendaría'
    const result = extractNumber(response)
    expect(result).toBe(5)
  })

  it('debería devolver null para una entrada sin número inicial', () => {
    const response = 'No aplica'
    const result = extractNumber(response)
    expect(result).toBeNull()
  })

  it('debería devolver 10 para la entrada "10 - La Recomendaría Ampliamente"', () => {
    const response = '10 - La Recomendaría Ampliamente'
    const result = extractNumber(response)
    expect(result).toBe(10)
  })

  it('debería devolver null para una entrada vacía', () => {
    const response = ''
    const result = extractNumber(response)
    expect(result).toBeNull()
  })

  it('debería devolver 6 para la entrada "6"', () => {
    const response = '6'
    const result = extractNumber(response)
    expect(result).toBe(6)
  })
})
