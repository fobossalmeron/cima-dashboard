import { ItemWithGroup, TextGroup } from '@/types/api'

export class TextClusteringService {
  /**
   * Calcula la distancia Jaro-Winkler entre dos strings
   * Especialmente buena para comparar nombres cortos
   */
  private static jaroWinkler(s1: string, s2: string): number {
    // Si las cadenas son iguales, retornar 1
    if (s1 === s2) return 1

    // Si alguna cadena está vacía, retornar 0
    if (s1.length === 0 || s2.length === 0) return 0

    // Encontrar coincidencias
    const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1
    const s1Matches: boolean[] = new Array(s1.length).fill(false)
    const s2Matches: boolean[] = new Array(s2.length).fill(false)
    let matches = 0

    for (let i = 0; i < s1.length; i++) {
      const start = Math.max(0, i - matchDistance)
      const end = Math.min(i + matchDistance + 1, s2.length)

      for (let j = start; j < end; j++) {
        if (!s2Matches[j] && s1[i] === s2[j]) {
          s1Matches[i] = true
          s2Matches[j] = true
          matches++
          break
        }
      }
    }

    // Si no hay coincidencias, retornar 0
    if (matches === 0) return 0

    // Contar transposiciones
    let transpositions = 0
    let k = 0

    for (let i = 0; i < s1.length; i++) {
      if (!s1Matches[i]) continue

      while (!s2Matches[k]) k++

      if (s1[i] !== s2[k]) transpositions++
      k++
    }

    // Calcular distancia Jaro
    const jaro =
      (matches / s1.length +
        matches / s2.length +
        (matches - transpositions / 2) / matches) /
      3

    // Calcular prefijo común
    let commonPrefix = 0
    const maxPrefix = Math.min(4, Math.min(s1.length, s2.length))

    for (let i = 0; i < maxPrefix; i++) {
      if (s1[i] === s2[i]) commonPrefix++
      else break
    }

    // Calculate Jaro-Winkler
    return jaro + commonPrefix * 0.1 * (1 - jaro)
  }

  /**
   * Group texts based on it's
   * @param texts Array de textos a agrupar
   * @param similarityThreshold Umbral de similitud (0-1) para considerar textos relacionados
   * @returns Array de grupos de texto
   */
  static async groupSimilarTexts(
    texts: string[],
    similarityThreshold: number = 0.85,
  ): Promise<ItemWithGroup[]> {
    const groups: TextGroup[] = []
    const used = new Set<number>()

    // Para cada texto no procesado
    for (let i = 0; i < texts.length; i++) {
      if (used.has(i)) continue

      const currentGroup: string[] = [texts[i]]
      used.add(i)
      const groupIndexes: number[] = [i]

      // Encontrar textos similares
      for (let j = i + 1; j < texts.length; j++) {
        if (used.has(j)) continue

        // Verificar que el texto es similar a TODOS los elementos del grupo
        let isCompatibleWithGroup = true
        for (const groupText of currentGroup) {
          const similarity = this.jaroWinkler(
            groupText.toLowerCase(),
            texts[j].toLowerCase(),
          )
          if (similarity < similarityThreshold) {
            isCompatibleWithGroup = false
            break
          }
        }

        if (isCompatibleWithGroup) {
          currentGroup.push(texts[j])
          used.add(j)
          groupIndexes.push(j)
        }
      }

      // Encontrar el texto base usando un enfoque más sofisticado
      let baseName = currentGroup[0]
      let maxCommonPrefix = 0

      // Para cada par de textos en el grupo
      for (const text of currentGroup) {
        let minCommonPrefix = Number.MAX_VALUE

        // Encontrar el prefijo común más corto con todos los demás textos
        for (const otherText of currentGroup) {
          if (text === otherText) continue

          let commonPrefix = 0
          const minLength = Math.min(text.length, otherText.length)

          for (let k = 0; k < minLength; k++) {
            if (text[k].toLowerCase() !== otherText[k].toLowerCase()) break
            commonPrefix++
          }

          minCommonPrefix = Math.min(minCommonPrefix, commonPrefix)
        }

        // Si este texto tiene un prefijo común más largo, es mejor candidato
        if (minCommonPrefix > maxCommonPrefix) {
          maxCommonPrefix = minCommonPrefix
          baseName = text.substring(0, minCommonPrefix).trim()
        }
      }

      // Si no se encontró un prefijo común significativo, usar el texto más corto
      if (maxCommonPrefix < 3) {
        baseName = currentGroup.reduce((a, b) => (a.length <= b.length ? a : b))
      }

      groups.push({
        baseName,
        items: currentGroup,
        similarity: currentGroup.length > 1 ? similarityThreshold : 1,
        indexes: groupIndexes,
      })
    }

    return texts.map(
      (text: string, index: number): ItemWithGroup => ({
        item: text,
        group: groups.find((group) => group.indexes.includes(index)) ?? null,
      }),
    )
  }
}
