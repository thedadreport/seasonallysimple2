'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Bell, Trash2, Save, ArrowLeft, Key, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session, status, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          emailNotifications,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordChange(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await signOut({ callbackUrl: '/' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete account' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50/30 to-amber-50/40 flex items-center justify-center">
        <div className="text-center">
          <SettingsIcon className="h-8 w-8 animate-spin text-stone-600 mx-auto mb-4" />
          <p className="text-stone-600 font-light">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50/30 to-amber-50/40 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-stone-600 hover:text-stone-800 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="font-light">Back to Home</span>
          </Link>
          <h1 className="text-3xl font-serif font-light text-stone-700 mb-2 italic">Account Settings</h1>
          <p className="text-stone-600 font-light">Manage your profile and account preferences</p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="font-light">{message.text}</p>
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-white/80 rounded-3xl border border-stone-100/50 p-8 shadow-sm mb-6">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-stone-600 mr-3" />
            <h2 className="text-xl font-serif font-light text-stone-700 italic">Profile Information</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-light"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg font-light text-stone-500"
                placeholder="Your email"
              />
              <p className="text-xs text-stone-500 mt-1 font-light">Email cannot be changed</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-4 w-4 text-stone-600 focus:ring-stone-500 border-stone-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 text-sm text-stone-700 font-light">
                Receive email notifications for meal planning tips
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center px-6 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors font-light ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Change (Only for users with passwords) */}
        {session?.user?.email && (
          <div className="bg-white/80 rounded-3xl border border-stone-100/50 p-8 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Key className="h-6 w-6 text-stone-600 mr-3" />
                <h2 className="text-xl font-serif font-light text-stone-700 italic">Password</h2>
              </div>
              {!showPasswordChange && (
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 border border-stone-200 rounded-lg hover:border-stone-300 transition-colors font-light"
                >
                  Change Password
                </button>
              )}
            </div>

            {showPasswordChange && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-light"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors font-light ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setMessage(null);
                    }}
                    className="px-6 py-3 text-stone-600 border border-stone-200 rounded-lg hover:border-stone-300 transition-colors font-light"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Account Actions */}
        <div className="bg-white/80 rounded-3xl border border-stone-100/50 p-8 shadow-sm">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-stone-600 mr-3" />
            <h2 className="text-xl font-serif font-light text-stone-700 italic">Account Actions</h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex items-center px-6 py-3 text-stone-600 border border-stone-200 rounded-lg hover:border-stone-300 hover:bg-stone-50 transition-colors font-light"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Sign Out
            </button>

            <div className="border-t border-stone-200 pt-4">
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className={`inline-flex items-center px-6 py-3 text-red-600 border border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors font-light ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </button>
              <p className="text-xs text-stone-500 mt-2 font-light">
                This action cannot be undone. All your recipes and meal plans will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}