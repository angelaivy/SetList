import { Routes, Route } from 'react-router'
import './App.css'
import SetList from './components/SetList'
import Events from './components/Events'
import Shows from './components/Shows'
import Artists from './components/Artists'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SetList />}>
          <Route path="events" element={<Events />} />
          <Route path="shows" element={<Shows />} />
          <Route path="artists" element={<Artists />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
