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
import { SkippedItem } from './skipped-item'

interface SyncResultsProps {
  results: ValidationResult
  onClose: () => void
}

export function SyncResults({ results, onClose }: SyncResultsProps) {
  const totalValid = results.validSubmissions.length
  const totalInvalid = results.invalidSubmissions.length
  const totalSkipped = results.skippedSubmissions.length
  const total = totalValid + totalInvalid + totalSkipped

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
                    <span className="text-sm font-medium">{totalSkipped}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Registros Válidos */}
                  <Card className="border-green-200">
                    <CardHeader className="border-b bg-green-50/50">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-lg">
                          Registros Válidos ({totalValid})
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ScrollArea className="h-[300px]">
                        {results.validSubmissions.map((submission, index) => (
                          <SyncItem
                            key={index}
                            index={index}
                            submission={submission}
                          />
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Registros con Errores */}
                  <Card className="border-red-200">
                    <CardHeader className="border-b bg-red-50/50">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <CardTitle className="text-lg">
                          Registros con Errores ({totalInvalid})
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ScrollArea className="h-[300px]">
                        {results.invalidSubmissions.map((submission) => (
                          <ErrorItem
                            key={submission.rowIndex}
                            error={submission}
                          />
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  {/* Registros Saltados */}
                  <Card className="border-yellow-200">
                    <CardHeader className="border-b bg-yellow-50/50">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <CardTitle className="text-lg">
                          Registros Saltados ({totalSkipped})
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ScrollArea className="h-[300px]">
                        {results.skippedSubmissions.map((submission) => (
                          <SkippedItem
                            key={submission.rowIndex}
                            submission={submission}
                          />
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
