import React, { useState } from "react";
import { PageBase1 } from "@/pages/PageBase1";

interface SecuritySettingsData {
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  googleAuthConnected: boolean;
  phoneVerified: boolean;
  phoneNumber: string;
  emailVerified: boolean;
  email: string;
}

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [googleAuthEnabled, setGoogleAuthEnabled] = useState(true);

  const data: SecuritySettingsData = {
    passwordLastChanged: "22 Dec 2024, 10:30 AM",
    twoFactorEnabled: true,
    googleAuthConnected: true,
    phoneVerified: true,
    phoneNumber: "+81699799974",
    emailVerified: true,
    email: "info@example.com",
  };

  const handleChangePassword = () => {
    alert("Redirect to Change Password modal or page");
  };

  const handleManageDevices = () => {
    alert("Open Device Management");
  };

  const handleViewActivity = () => {
    alert("Open Account Activity Log");
  };

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      alert("Account deactivated.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("This action is permanent. Delete account?")) {
      alert("Account deleted.");
    }
  };

  return (
    <PageBase1
      title="Security Settings"
      description="Manage your account security and access"
      icon="fa fa-shield-alt"
    >
      <div className="p-6 bg-card rounded shadow">
        {/* Password */}
        <div className="bg-white border-b-2 border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <i className="fas fa-key text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-500">
                  Last Changed {data.passwordLastChanged}
                </p>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white border-b-2 border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <i className="fas fa-shield-alt text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Two Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                  Receive codes via SMS or email every time you login
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>

        {/* Google Authentication */}
        <div className="bg-white border-b-2 border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <i className="fab fa-google text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Google Authentication</h3>
                <p className="text-sm text-gray-500">Connect to Google</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                Connected
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={googleAuthEnabled}
                  onChange={(e) => setGoogleAuthEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Phone Number Verification */}
        <div className="bg-white border-b-2 border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <i className="fas fa-phone text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Phone Number Verification</h3>
                <p className="text-sm text-gray-500">
                  Verified Mobile Number: {data.phoneNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">
                <i className="fas fa-check-circle"></i>
              </span>
              <button className="px-3 py-1 bg-teal-600 text-white text-xs font-medium rounded hover:bg-teal-700 transition-colors">
                Change
              </button>
              <button className="px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded hover:bg-gray-900 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Email Verification */}
        <div className="bg-white border-b-2 border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <i className="fas fa-envelope text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email Verification</h3>
                <p className="text-sm text-gray-500">
                  Verified Email: {data.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">
                <i className="fas fa-check-circle"></i>
              </span>
              <button className="px-3 py-1 bg-teal-600 text-white text-xs font-medium rounded hover:bg-teal-700 transition-colors">
                Change
              </button>
              <button className="px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded hover:bg-gray-900 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Device Management */}
        <div className="bg-white border-b-2 border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <i className="fas fa-laptop text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Device Management</h3>
                <p className="text-sm text-gray-500">
                  Manage devices associated with the account
                </p>
              </div>
            </div>
            <button
              onClick={handleManageDevices}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors"
            >
              Manage
            </button>
          </div>
        </div>

        {/* Account Activity */}
        <div className="bg-white border-b-2 border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <i className="fas fa-chart-line text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Account Activity</h3>
                <p className="text-sm text-gray-500">
                  Manage activities associated with the account
                </p>
              </div>
            </div>
            <button
              onClick={handleViewActivity}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors"
            >
              View
            </button>
          </div>
        </div>

        {/* Deactivate Account */}
        <div className="bg-white border-b-2 border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <i className="fas fa-power-off text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Deactivate Account</h3>
                <p className="text-sm text-gray-500">
                  This will shutdown your account. Your account will be reactive when you sign in again
                </p>
              </div>
            </div>
            <button
              onClick={handleDeactivate}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors"
            >
              Deactivate
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-white border-b-2 border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-red-600">
                <i className="fas fa-trash text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-red-600">Delete Account</h3>
                <p className="text-sm text-gray-500">
                  Your account will be permanently deleted
                </p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </PageBase1>
  );
}