import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { AuthExpiredModal } from "@/components/companies/edit/AuthExpiredModal";

const ProtectedRoute = () => {
  const { token, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(!token);

  useEffect(() => {
    setShowAuthModal(!token);
  }, [token]);

  if (!token || showAuthModal) {
    return (
      <AuthExpiredModal
        isOpen={true}
        onClose={() => setShowAuthModal(false)}
        onLogin={login}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
