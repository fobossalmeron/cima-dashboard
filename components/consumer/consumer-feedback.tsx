'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ConsumerFeedbackData } from './consumer.types'

/**
 * Componente que muestra los comentarios de los consumidores con paginación.
 *
 * @param {ConsumerFeedbackData[]} props.data
 * @property {string} comment - Texto del comentario del consumidor
 */

export function ConsumerFeedback({ data }: { data: ConsumerFeedbackData[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(data.length / itemsPerPage)

  const currentFeedback = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentarios de consumidores</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ScrollArea className="h-auto pr-4">
          <div className="space-y-3">
            {currentFeedback.map((item, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">
                    {item.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Pagination className="mt-4 mb-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage((p) => p - 1)
                }}
                className={
                  currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 text-sm">
                Página {currentPage} de {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1)
                }}
                className={
                  currentPage >= totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}
