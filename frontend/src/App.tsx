import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { SessionProvider, useSession } from "./lib/session-context";
import LandingPage from "./pages/LandingPage";
import CreateSessionPage from "./pages/CreateSessionPage";
import AddPlayersPage from "./pages/AddPlayersPage";
import WaitingPage from "./pages/WaitingPage";
import QuestionApprovalPage from "./pages/QuestionApprovalPage";
import StancePage from "./pages/StancePage";
import SpeakingPage from "./pages/SpeakingPage";
import VotingPage from "./pages/VotingPage";
import ResultsPage from "./pages/ResultsPage";
import AdminQuestionsPage from "./pages/AdminQuestionsPage";
import Button from "./components/Button";

function Layout({ children }: { children: React.ReactNode }) {
  const { error, loading, resetFlow, session } = useSession();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface text-white">
      <div className="sticky top-0 z-30 border-b border-white/10 bg-surface/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="text-lg font-semibold tracking-tight text-white">
            اقنعني
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            {location.pathname !== "/" ? (
              <Link to="/" className="text-sm text-white/70 transition hover:text-white">
                العودة للرئيسية
              </Link>
            ) : null}
            {session ? (
              <Button type="button" variant="secondary" onClick={resetFlow} className="hidden sm:inline-flex">
                إنهاء الجلسة
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      {error ? (
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="glass-panel border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        </div>
      ) : null}
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/70 text-sm font-medium animate-pulse">
            جاري التحميل...
          </p>
        </div>
      ) : null}
      <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 sm:pb-16 sm:pt-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { adminSecret } = useParams<{ adminSecret?: string }>();
  const expectedSecret = "aqnaeni-secret";

  if (adminSecret !== expectedSecret) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { session } = useSession();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/create" element={<CreateSessionPage />} />
      <Route
        path="/players"
        element={session ? <AddPlayersPage /> : <Navigate to="/create" replace />}
      />
      <Route
        path="/waiting"
        element={session ? <WaitingPage /> : <Navigate to="/create" replace />}
      />
      <Route
        path="/approval"
        element={session ? <QuestionApprovalPage /> : <Navigate to="/create" replace />}
      />
      <Route
        path="/stance"
        element={session ? <StancePage /> : <Navigate to="/create" replace />}
      />
      <Route
        path="/speaking"
        element={session ? <SpeakingPage /> : <Navigate to="/create" replace />}
      />
      <Route
        path="/vote"
        element={session ? <VotingPage /> : <Navigate to="/create" replace />}
      />
      <Route
        path="/results"
        element={session ? <ResultsPage /> : <Navigate to="/create" replace />}
      />
      <Route
        path="/speaking"
        element={session ? <SpeakingPage /> : <Navigate to="/create" replace />}
      />
      <Route
        path="/admin/:adminSecret"
        element={
          <AdminGuard>
            <AdminQuestionsPage />
          </AdminGuard>
        }
      />
      <Route path="*" element={<div className="glass-panel p-10 text-center text-white">أوه! الصفحة اختفت — حاول العودة للرئيسية</div>} />
    </Routes>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </SessionProvider>
  );
}
