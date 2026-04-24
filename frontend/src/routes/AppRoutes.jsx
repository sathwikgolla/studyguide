import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import DsaTopicPage from '../pages/DsaTopicPage'
import InterviewTopicPage from '../pages/InterviewTopicPage'
import FullStackRoadmapPage from '../pages/FullStackRoadmapPage'
import AdditionalModulePage from '../pages/AdditionalModulePage'
import AnalyticsPage from '../pages/AnalyticsPage'
import FavoritesPage from '../pages/FavoritesPage'
import SmartFeaturesPage from '../pages/SmartFeaturesPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import PricingPage from '../pages/PricingPage'
import MockInterviewPage from '../pages/MockInterviewPage'
import RequireAuth from './RequireAuth'
import GuestOnly from './GuestOnly'
import RequirePremium from './RequirePremium'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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
          <Route path="aptitude" element={<AdditionalModulePage moduleId="aptitude" />} />
          <Route
            path="logical-reasoning"
            element={<AdditionalModulePage moduleId="logical-reasoning" />}
          />
          <Route path="system-design" element={<AdditionalModulePage moduleId="system-design" />} />
          <Route path="devops-cloud" element={<AdditionalModulePage moduleId="devops-cloud" />} />
          <Route path="hr-behavioral" element={<AdditionalModulePage moduleId="hr-behavioral" />} />
          <Route path="testing-qa" element={<AdditionalModulePage moduleId="testing-qa" />} />
          <Route path="design-patterns" element={<AdditionalModulePage moduleId="design-patterns" />} />
          <Route
            path="mobile-development"
            element={<AdditionalModulePage moduleId="mobile-development" />}
          />
          <Route path="web3-blockchain" element={<AdditionalModulePage moduleId="web3-blockchain" />} />
          <Route
            path="core-cs-fundamentals"
            element={<AdditionalModulePage moduleId="core-cs-fundamentals" />}
          />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="smart-features" element={<SmartFeaturesPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route element={<RequirePremium />}>
            <Route path="mock-interview" element={<MockInterviewPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
