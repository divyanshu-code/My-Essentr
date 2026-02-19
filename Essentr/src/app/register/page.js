'use client'
import Landing from '@/Components/Landing'
import Signup from '@/Components/Signup'
import React, { useState } from 'react'

const page = () => {

   const [count, setcount] = useState(0)

   
  return (
    <>
     { count == 0 ? <Landing nextstep={setcount} /> :  <Signup previousstep={setcount}/>}
    </>
  )
}

export default page

