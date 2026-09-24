import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import UserLayout from '../layouts/UserLayout.jsx'
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage.jsx'
import AdminCategoryDetailPage from '../pages/admin/AdminCategoryDetailPage.jsx'
import AdminCategoryFormPage from '../pages/admin/AdminCategoryFormPage.jsx'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx'
import AdminLoginPage from '../pages/admin/AdminLoginPage.jsx'
import AdminTransactionDetailPage from '../pages/admin/AdminTransactionDetailPage.jsx'
import AdminTransactionsPage from '../pages/admin/AdminTransactionsPage.jsx'
import AdminUserDetailPage from '../pages/admin/AdminUserDetailPage.jsx'
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx'
import AdminVideoDetailPage from '../pages/admin/AdminVideoDetailPage.jsx'
import AdminVideoFormPage from '../pages/admin/AdminVideoFormPage.jsx'
import AdminVideosPage from '../pages/admin/AdminVideosPage.jsx'
import CategoriesPage from '../pages/user/CategoriesPage.jsx'
import CategoryDetailPage from '../pages/user/CategoryDetailPage.jsx'
import CheckoutPage from '../pages/user/CheckoutPage.jsx'
import HomePage from '../pages/user/HomePage.jsx'
import NotFoundPage from '../pages/user/NotFoundPage.jsx'
import PaymentSuccessPage from '../pages/user/PaymentSuccessPage.jsx'
import SearchPage from '../pages/user/SearchPage.jsx'
import VideoDetailPage from '../pages/user/VideoDetailPage.jsx'
import VideosPage from '../pages/user/VideosPage.jsx'
import WatchPage from '../pages/user/WatchPage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="videos" element={<AdminVideosPage />} />
        <Route path="videos/nouveau" element={<AdminVideoFormPage />} />
        <Route path="videos/:id" element={<AdminVideoDetailPage />} />
        <Route path="videos/:id/modifier" element={<AdminVideoFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="categories/nouveau" element={<AdminCategoryFormPage />} />
        <Route path="categories/:id" element={<AdminCategoryDetailPage />} />
        <Route path="categories/:id/modifier" element={<AdminCategoryFormPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:id" element={<AdminUserDetailPage />} />
        <Route path="transactions" element={<AdminTransactionsPage />} />
        <Route path="transactions/:id" element={<AdminTransactionDetailPage />} />
      </Route>

      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:slug" element={<CategoryDetailPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/videos/:id" element={<VideoDetailPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/recherche" element={<SearchPage />} />
        <Route path="/checkout/:videoId" element={<CheckoutPage />} />
        <Route path="/checkout/:videoId/succes" element={<PaymentSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
