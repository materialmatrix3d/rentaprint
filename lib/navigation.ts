export interface NavItem {
  href: string
  label: string
}

export const ownerNav: NavItem[] = [
  { href: '/owner', label: 'Owner Panel' },
  { href: '/my-printers', label: 'My Printers' },
  { href: '/bookings', label: 'Bookings' },
  { href: '/earnings', label: 'Earnings' },
]

export const infoNav: NavItem[] = [
  { href: '/patch-notes', label: 'Patch Notes' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/faq', label: 'FAQ' },
]

export const mainNav: NavItem[] = [
  { href: '/printers', label: 'Printers' },
  { href: '/compare', label: 'Compare' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/profile', label: 'Profile' },
]
