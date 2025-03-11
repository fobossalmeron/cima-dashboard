import { PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DashboardForm } from '@/components/forms'
import { NewDashboardForm } from '@/types/dashboard'
import { ClientData } from '@/types/api'

export interface NewDashboardDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
  handleSubmit: (data: NewDashboardForm) => void
  clients: ClientData[]
}

export function NewDashboardDialog({
  isDialogOpen,
  setIsDialogOpen,
  handleSubmit,
  clients,
}: NewDashboardDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo dashboard</DialogTitle>
        </DialogHeader>
        <DashboardForm onSubmit={handleSubmit} clients={clients} />
      </DialogContent>
    </Dialog>
  )
}
