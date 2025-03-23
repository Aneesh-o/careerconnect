import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Auth from './pages/Auth'
import AllJobs from './pages/AllJobs'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import FindCandidates from './pages/FindCandidates'
import ProfileDetails from './pages/ProfileDetails'
import Chat from './pages/Chat'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Login' element={<Auth />} />
        <Route path='/Register' element={<Auth insideRegister={true} />} />
        <Route path='/Find-jobs' element={<AllJobs />} />
        <Route path='/Find-candidates' element={<FindCandidates />} />
        <Route path='/Profile' element={<Profile />} />
        <Route path='/Contacts' element={<Contact />} />
        <Route path='/profiledetails/:id' element={<ProfileDetails />} />
        <Route path='/chat/:id' element={<Chat />} />
      </Routes>
    </>
  )
}

export default App
