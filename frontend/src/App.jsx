import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import LinksPage from "./pages/link";
import CreateLink from './pages/createlink'; 
import RedirectPage from "./pages/redirect";
import Analytics from "./pages/analyse";
import Settings from "./pages/settings";

// ProtectedRoute component
// const ProtectedRoute = ({ children }) => {
//   const token = sessionStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/" />;  
//   }

//   return children; 
// };

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/create-link" element={<CreateLink />} />
        <Route path="/redirect/:id" element={<RedirectPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings /> }/> 
      </Routes>
    </Router>
  );
};

export default App;


