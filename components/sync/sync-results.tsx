'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, CheckCircle2, XCircleIcon } from 'lucide-react'
import { ValidationResult } from '@/types/api'
import { SyncItem } from './sync-item'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ErrorItem } from './error-item'
import { UpdatedItem } from './updated-item'

interface SyncResultsProps {
  results: ValidationResult
  onClose: () => void
}

export function SyncResults({ results, onClose }: SyncResultsProps) {
  const totalValid = results.validSubmissions.length
  const totalInvalid = results.invalidSubmissions.length
  const totalSkipped = results.skippedSubmissions.length
  const totalUpdated = results.updatedSubmissions.length
  const total = totalValid + totalInvalid + totalSkipped + totalUpdated

  return (
    <div className="mt-8 space-y-6">
      <Accordion type="single" collapsible defaultValue="">
        <AccordionItem value="results" className="border-none">
          <Card>
            <CardHeader className="px-6 py-4">
              <AccordionTrigger className="flex items-center justify-between w-full [&[data-state=open]>svg]:rotate-180 relative">
                <div className="space-y-1">
                  <CardTitle>Resultados de la Sincronización</CardTitle>
                  <CardDescription>
                    Se procesaron {total} registros en total
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">{totalValid}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">{totalInvalid}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium">{totalUpdated}</span>
                  </div>
                </div>
                <div
                  className="absolute -right-4 -top-2 hover:cursor-pointer"
                  onClick={onClose}
                >
                  <XCircleIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                </div>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <Accordion type="multiple" className="space-y-4">
                  {/* Registros Válidos */}
                  <AccordionItem value="valid" className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-lg font-medium">
                          Registros Válidos ({totalValid})
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <ScrollArea className="h-[300px] w-full">
                        <div className="grid grid-cols-2 gap-4 pr-4">
                          {results.validSubmissions.map((submission, index) => (
                            <SyncItem
                              key={index}
                              index={index}
                              submission={submission}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Registros con Errores */}
                  <AccordionItem value="invalid" className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-lg font-medium">
                          Registros con Errores ({totalInvalid})
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <ScrollArea className="h-[300px]">
                        {results.invalidSubmissions.map((submission, index) => (
                          <ErrorItem
                            key={`${submission.rowIndex}-${index}`}
                            error={submission}
                          />
                        ))}
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Registros Actualizados */}
                  <AccordionItem
                    value="updated"
                    className="border rounded-lg !border-b-1"
                  >
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <span className="text-lg font-medium">
                          Registros Actualizados ({totalUpdated})
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="w-full">
                        <ScrollArea className="h-[300px] w-full">
                          <div className="grid grid-cols-2 gap-4 pr-4">
                            {results.updatedSubmissions.map((submission) => (
                              <UpdatedItem
                                key={submission.rowIndex}
                                submission={submission}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
