"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  LogOut,
  Settings,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getUserInitials } from "@/lib/utils";

interface User {
  name: string;
  email: string;
  userType: string;
}

interface UserInfoProps {
  user: User;
  onLogout: () => void;
  onClose?: () => void;
  variant?: "desktop" | "mobile";
  className?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({
  user,
  onLogout,
  onClose,
  variant = "desktop",
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAction = (action: () => void) => {
    action();
    if (onClose) {
      onClose();
    }
  };

  if (variant === "desktop") {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        {/* Initials Button */}
        <Button
          variant="ghost"
          onClick={toggleExpanded}
          className="relative h-10 w-10 rounded-full hover:bg-gray-50"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>

        {/* Dropdown Content */}
        {isExpanded && (
          <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {/* User Details */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {user.email}
                </p>
                <p className="text-xs leading-none text-gray-500 capitalize">
                  {user.userType}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-none"
                onClick={() => handleAction(() => {})}
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span>My Properties</span>
              </Button>
              <div className="border-t border-gray-100 my-1" />
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-none"
                onClick={() => handleAction(onLogout)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile variant
  return (
    <div ref={dropdownRef} className={`space-y-3 ${className}`}>
      {/* User Info Header */}
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-gray-800">
              {user.name}
            </div>
            <div className="text-sm font-medium text-gray-500">
              {user.email}
            </div>
            <div className="text-sm font-medium text-gray-500 capitalize">
              {user.userType}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={toggleExpanded}
          className="p-1 h-8 w-8"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>

      {/* Expandable Menu Items */}
      {isExpanded && (
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => handleAction(() => {})}
          >
            <Building2 className="mr-2 h-4 w-4" />
            My Properties
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => handleAction(onLogout)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
