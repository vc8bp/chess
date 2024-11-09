import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Game from './components/Game'
import StartGame from './components/StartGameScreen/StartGame'

function App() {
  const [time, setTime] = useState(null)

  return (
    <div className='container'>
      {time === null ? <StartGame setTime={setTime} /> :  <Game time={time}/>}
    </div>
  )
}

export default App
