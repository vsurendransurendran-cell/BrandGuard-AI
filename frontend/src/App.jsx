
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NewSubmission from "./pages/NewSubmission";
import Submissions from "./pages/Submissions";
import SubmissionDetails from "./pages/SubmissionDetails";
import Reviews from "./pages/Reviews";
import Guidelines from "./pages/Guidelines";
function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/submissions"
            element={<Submissions />}
          />
          <Route path="/reviews" element={<Reviews />} />

          <Route
            path="/submissions/new"
            element={<NewSubmission />}
          />

          <Route
            path="/submissions/:id"
            element={<SubmissionDetails />}
          />
          <Route path="/guidelines" element={<Guidelines />} />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
