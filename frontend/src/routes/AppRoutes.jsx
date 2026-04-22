import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import DsaTopicPage from '../pages/DsaTopicPage'
import InterviewTopicPage from '../pages/InterviewTopicPage'
import FullStackRoadmapPage from '../pages/FullStackRoadmapPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import RequireAuth from './RequireAuth'
import GuestOnly from './GuestOnly'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route element={<RequireAuth />}>
          <Route path="dsa" element={<DsaTopicPage />} />
          <Route path="os" element={<InterviewTopicPage topicId="os" />} />
          <Route path="cn" element={<InterviewTopicPage topicId="cn" />} />
          <Route path="dbms" element={<InterviewTopicPage topicId="dbms" />} />
          <Route path="full-stack" element={<FullStackRoadmapPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
