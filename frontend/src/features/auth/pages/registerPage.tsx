import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RegisterForm } from "../components/registerForm";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Title */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Nordic Marketplace
              </h1>
            </Link>
            <p className="mt-4 text-gray-600 text-lg">Create your account</p>
          </div>

          {/* Reusable RegisterForm */}
          <RegisterForm
            onSuccess={() => setTimeout(() => navigate("/login"), 1500)}
          />

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-gray-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
