import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
} from '@chakra-ui/react'
import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// Custom theme for Chakra UI
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ config })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SEO SaaS Platform',
  description: 'Platform SEO berbasis AI dengan tools untuk scanning, keyword heat map, dan citation management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </ChakraProvider>
      </body>
    </html>
  )
} 