import { Route, Routes, Navigate } from "react-router"; // Make sure to import from 'react-router-dom'
import Providers from "./providers";
import Jobs from "./components/jobs/Jobs";
import Layout from "./components/layout";
import { LoginForm } from "./components/auth/Login";
import Messages from "./components/messages/Messages";
import Conversation from "./components/messages/Conversation";

export default function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/login" element={<LoginForm />} />

        <Route path="/" element={<Navigate replace to="/jobs" />} />

        <Route path="/" element={<Layout />}>
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/messages">
            <Route index element={<Messages />} />
            <Route path=":messageid" element={<Conversation />} />
          </Route>

          <Route path="*" element={<Navigate replace to="/jobs" />} />
        </Route>
      </Routes>
    </Providers>
  );
}
