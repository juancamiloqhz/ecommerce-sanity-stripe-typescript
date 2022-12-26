import Head from 'next/head'
import React from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='layout'>
      <Head>
        <title>Juan Camilo Store</title>
        <meta name="description" content="Juan Camilo Store - Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Navbar />
      </header>
      <main className='main-container'>
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Layout