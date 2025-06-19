'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import AuthButtons from '@/components/AuthButtons'
import WhatsNewModal from '@/components/WhatsNewModal'
import { ownerNav, infoNav, mainNav } from '@/lib/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const linkClass = (href: string) =>
    `px-3 py-1 ${pathname === href ? 'underline font-semibold' : ''}`

  return (
    <nav className="border-b bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-gray-900 dark:text-white">
          RentAPrint
        </Link>
        <div className="hidden sm:flex items-center gap-4">
          {mainNav.map(n => (
            <Link key={n.href} href={n.href} className={linkClass(n.href)}>
              {n.label}
            </Link>
          ))}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="px-3 py-1">Owner</DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white dark:bg-gray-800 shadow rounded p-2">
              {ownerNav.map(n => (
                <DropdownMenu.Item key={n.href} asChild>
                  <Link href={n.href} className={linkClass(n.href)}>
                    {n.label}
                  </Link>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="px-3 py-1">Info</DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white dark:bg-gray-800 shadow rounded p-2">
              {infoNav.map(n => (
                <DropdownMenu.Item key={n.href} asChild>
                  <Link href={n.href} className={linkClass(n.href)}>
                    {n.label}
                  </Link>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <WhatsNewModal />
          <ThemeToggle />
          <AuthButtons />
        </div>
        <div className="sm:hidden">
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button aria-label="Open menu">
                <Menu />
              </button>
            </Dialog.Trigger>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-0 left-0 w-64 h-full bg-gray-100 dark:bg-gray-900 p-4 flex flex-col gap-2">
              {[...mainNav, ...ownerNav, ...infoNav].map(n => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={linkClass(n.href)}>
                  {n.label}
                </Link>
              ))}
              <div className="mt-auto flex gap-2">
                <ThemeToggle />
                <AuthButtons />
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
    </nav>
  )
}
