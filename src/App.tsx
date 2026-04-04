import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Upload from './pages/Upload.tsx'
import SelectColumn from './pages/SelectColumn.tsx'
import Search from './pages/Search.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/select-column" element={<SelectColumn />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
