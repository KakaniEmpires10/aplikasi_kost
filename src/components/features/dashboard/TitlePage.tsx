import React from 'react'

const TitlePage = ({ children }: Readonly<{ children: React.ReactNode}>) => {
  return (
      <h2 className="text-xl font-bold">{ children }</h2>
  )
}

export default TitlePage