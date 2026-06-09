import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Dashboard from "./pages/Dashboard";
import type { Screen } from "./types";

function App() {
  const [screen, setScreen] = useState<Screen>("landing");

  if (screen === "login") {
    return (
      <LoginPage
        onLoginSuccess={() => setScreen("dashboard")}
        onBack={() => setScreen("landing")}
        onSignup={() => setScreen("signup")}
      />
    );
  }

  if (screen === "signup") {
    return (
      <SignupPage
        onSignupSuccess={() => setScreen("login")}
        onBack={() => setScreen("landing")}
      />
    );
  }

  if (screen === "dashboard") {
    return <Dashboard onLogout={() => setScreen("landing")} />;
  }

  return (
    <LandingPage
      onLogin={() => setScreen("login")}
      onSignup={() => setScreen("signup")}
    />
  );
}

export default App;
