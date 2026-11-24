import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";

// Public site
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import News from "./pages/News";
import Involved from "./pages/Involved";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import Legal from "./pages/Legal";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

// Focus Areas
import FocusAreaBiodiversity from "./pages/FocusAreaBiodiversity";
import FocusAreaEnvironment from "./pages/FocusAreaEnvironment";
import FocusAreaClimate from "./pages/FocusAreaClimate";
import FocusAreaAgriculture from "./pages/FocusAreaAgriculture";
import FocusAreaOneHealth from "./pages/FocusAreaOneHealth";
import FocusAreaWildlife from "./pages/FocusAreaWildlife";
import FocusAreaForest from "./pages/FocusAreaForest";
import FocusAreaEducation from "./pages/FocusAreaEducation";
import FocusAreaCommunity from "./pages/FocusAreaCommunity";
import FocusAreaResearch from "./pages/FocusAreaResearch";

// News articles
import NewsArticle from "./pages/NewsArticle";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProjectsEdit from "./pages/admin/AdminProjectsEdit";
import AdminNews from "./pages/admin/AdminNews";
import AdminNewsEdit from "./pages/admin/AdminNewsEdit";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminTeamEdit from "./pages/admin/AdminTeamEdit";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminVolunteers from "./pages/admin/AdminVolunteers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminFocusAreas from "./pages/admin/AdminFocusAreas";
import AdminFocusAreaEdit from "./pages/admin/AdminFocusAreaEdit";
import AdminActivityLogs from "./pages/admin/AdminActivityLogs";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminPages from "./pages/admin/AdminPages";
import AdminPageContentEdit from "./pages/admin/AdminPageContentEdit";

function PublicLayout() {
  return (
    <>
      <Header />
      <ScrollToTopButton />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/news" element={<News />} />
          {/* La page Équipe a été fusionnée dans « À propos » */}
          <Route path="/team" element={<Navigate to="/about" replace />} />
          <Route path="/involved" element={<Involved />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/focus/biodiversite" element={<FocusAreaBiodiversity />} />
          <Route path="/focus/environnement" element={<FocusAreaEnvironment />} />
          <Route path="/focus/climat" element={<FocusAreaClimate />} />
          <Route path="/focus/agriculture" element={<FocusAreaAgriculture />} />
          <Route path="/focus/one-health" element={<FocusAreaOneHealth />} />
          <Route path="/focus/faune" element={<FocusAreaWildlife />} />
          <Route path="/focus/forets" element={<FocusAreaForest />} />
          <Route path="/focus/education" element={<FocusAreaEducation />} />
          <Route path="/focus/communautes" element={<FocusAreaCommunity />} />
          <Route path="/focus/recherche" element={<FocusAreaResearch />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route
        path="/*"
        element={
          <AdminLayout>
            <Routes>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/projets" element={<AdminProjects />} />
              <Route path="/projets/nouveau" element={<AdminProjectsEdit create />} />
              <Route path="/projets/:id" element={<AdminProjectsEdit />} />
              <Route path="/actualites" element={<AdminNews />} />
              <Route path="/actualites/nouveau" element={<AdminNewsEdit create />} />
              <Route path="/actualites/:id" element={<AdminNewsEdit />} />
              <Route path="/equipe" element={<AdminTeam />} />
              <Route path="/equipe/nouveau" element={<AdminTeamEdit create />} />
              <Route path="/equipe/:id" element={<AdminTeamEdit />} />
              <Route path="/messages" element={<AdminMessages />} />
              <Route path="/benevoles" element={<AdminVolunteers />} />
              <Route path="/parametres" element={<AdminSettings />} />
              <Route path="/domaines" element={<AdminFocusAreas />} />
              <Route path="/domaines/nouveau" element={<AdminFocusAreaEdit create />} />
              <Route path="/domaines/:id" element={<AdminFocusAreaEdit />} />
              <Route path="/activite" element={<AdminActivityLogs />} />
              <Route path="/profil" element={<AdminProfile />} />              <Route path="/pages" element={<AdminPages />} />
              <Route path="/pages/:pageId" element={<AdminPageContentEdit />} />            </Routes>
          </AdminLayout>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/administrateur/*" element={<AdminRoutes />} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </>
  );
}
