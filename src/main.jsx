import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";


import MovieCardDetail from "./components/MovieCardDetail.jsx";
import NotFoundPage from "./components/NotFound.jsx";

const router = createBrowserRouter([{
    path: '/',
    element: <App/>,
},
    {
        path: '/movies/:id',
        element: <MovieCardDetail/>,
    },
    {
        path:'*',
        element:<NotFoundPage/>,
    }

])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
)
