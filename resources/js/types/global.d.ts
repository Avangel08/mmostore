import { PageProps as InertiaPageProps } from '@inertiajs/core'

// Custom user type
interface User {
  id: number
  name: string
}

// Mở rộng PageProps của Inertia
declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps {
    subdomain: string
    user: User | null
    isAuthenticated: boolean
  }
}