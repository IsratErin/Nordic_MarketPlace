import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { registerUser } from "../store/authThunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  User as UserIcon,
  MapPin,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    address: "",
  });
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    const result = await dispatch(
      registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
        address: formData.address || undefined,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      if (onSuccess) onSuccess();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (success) {
    return (
      <div className="w-full text-center space-y-6 bg-white p-12 rounded-lg shadow-sm border border-gray-200">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome aboard!
          </h2>
          <p className="text-gray-600 text-lg">
            Your account has been created successfully
          </p>
        </div>
        <div className="pt-4">
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email address *
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="pl-10 h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full name
        </Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="pl-10 h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
          Address
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            className="pl-10 h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            placeholder="Enter your address "
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password *
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="pl-10 h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirm password *
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="pl-10 h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Error Message */}
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
          {formError || error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors mt-6"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creating account...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            Create account
            <ArrowRight className="ml-2 h-5 w-5" />
          </span>
        )}
      </Button>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center pt-2">
        By creating an account, you agree to our{" "}
        <a href="/terms" className="underline hover:text-gray-900">
          Terms & Conditions
        </a>
      </p>
    </form>
  );
}
