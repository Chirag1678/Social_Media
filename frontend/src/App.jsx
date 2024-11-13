import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="bg-black w-full h-screen text-white">
      <Outlet />
    </div>
  )
}

export default App