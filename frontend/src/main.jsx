import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthLayout } from './components/index.js'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/SignUp.jsx'
import VideoPage from './pages/VideoPage.jsx'
import Profile from './pages/Profile.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'
import TweetPage from './pages/TweetPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path:"/login",
        element:(
          <AuthLayout authentication={false} >
            <Login />
          </AuthLayout>
        )
      },
      {
        path: "/signup",
        element: (
            <AuthLayout authentication={false}>
                <Signup />
            </AuthLayout>
        ),
      },
      {
        path: "/c/:profile",
        element: (
          <Profile />
        )
      },
      {
        path: "/video/:videoId",
        element: (
          <VideoPage />        
        )
      },
      {
        path: "/playlist/:playlistId",
        element: (
          <PlaylistPage />
        )
      },
      {
        path: "/tweet/:tweetId",
        element: (
          <TweetPage />
        )
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
