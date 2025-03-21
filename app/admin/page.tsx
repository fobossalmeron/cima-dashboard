import { Suspense } from 'react'
import { AdminHeader } from '@/components/headers'
import AdminPageContent from './page-content'

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminHeader />
      <AdminPageContent />
    </Suspense>
  )
}
