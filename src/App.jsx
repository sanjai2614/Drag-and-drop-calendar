import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Calender from './calender/Calender'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Calender/>}/>
    </Routes>
  )
}

export default App