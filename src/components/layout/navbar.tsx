"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout, getProfile } from "@/lib/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import UserInfo from "@/components/ui/user-info";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                PSM
              </h1>
            </Link>
          </div>

          {/* Center section - Navigation links */}
          <div className="hidden md:flex justify-center items-center space-x-8 w-full">
            <Link
              href="#"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Buy
            </Link>
            <Link
              href="#"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Sell
            </Link>
            <Link
              href="#"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right section - Auth buttons/user menu */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated && user ? (
              <UserInfo user={user} onLogout={handleLogout} variant="desktop" />
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/login")}
                  disabled={loading}
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors rounded-full hover:bg-gray-50"
                >
                  {loading ? "Loading..." : "Sign In"}
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all shadow-sm"
                >
                  {loading ? "Loading..." : "Get Started"}
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-50"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-100">
            {/* Navigation Links */}
            <div className="space-y-1">
              <Link
                href="#"
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                Buy
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                Sell
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </div>

            {/* Authentication Section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated && user ? (
                <UserInfo
                  user={user}
                  onLogout={handleLogout}
                  onClose={closeMobileMenu}
                  variant="mobile"
                />
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      router.push("/login");
                      closeMobileMenu();
                    }}
                    disabled={loading}
                    className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {loading ? "Loading..." : "Sign In"}
                  </Button>
                  <Button
                    onClick={() => {
                      router.push("/register");
                      closeMobileMenu();
                    }}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                  >
                    {loading ? "Loading..." : "Get Started"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
