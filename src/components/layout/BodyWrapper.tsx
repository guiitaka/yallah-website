'use client'

import { usePathname } from 'next/navigation'

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isTenantPage = pathname?.includes('/tenant')

    return (
        <body data-pathname={pathname} className={isTenantPage ? 'tenant-page' : ''}>
            {children}
        </body>
    )
} 