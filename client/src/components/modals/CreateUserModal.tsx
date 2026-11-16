import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';
import { UserRole } from '@/types/user.types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student' as UserRole,
    status: 'active' as 'active' | 'inactive' | 'suspended',
    avatar: '',
    billingAddress: '',
    payoutMethod: '',
    payoutDetails: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form after successful submission
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'student',
      status: 'active',
      avatar: '',
      billingAddress: '',
      payoutMethod: '',
      payoutDetails: '',
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-surface-card p-6 text-left align-middle shadow-xl transition-all border border-border-subtle">
                <div className="flex justify-between items-center mb-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-on-surface"
                  >
                    Add New User
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Info */}
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-on-surface-variant">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-border-subtle rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-surface-bg text-on-surface"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-on-surface-variant">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border-subtle rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-surface-bg text-on-surface"
                        placeholder="Doe"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-bold text-on-surface-variant">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border-subtle rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-surface-bg text-on-surface"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-bold text-on-surface-variant">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border-subtle rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-surface-bg text-on-surface"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-bold text-on-surface-variant">
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.value as UserRole,
                          })
                        }
                        className="w-full px-4 py-2 border border-border-subtle rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-surface-bg text-on-surface"
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-bold text-on-surface-variant">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as
                              | 'active'
                              | 'inactive'
                              | 'suspended',
                          })
                        }
                        className="w-full px-4 py-2 border border-border-subtle rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-surface-bg text-on-surface"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-bold text-on-surface-variant">
                        Avatar URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.avatar}
                        onChange={(e) =>
                          setFormData({ ...formData, avatar: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border-subtle rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-surface-bg text-on-surface"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-sm font-bold text-on-surface-variant">
                      Billing Address (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.billingAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingAddress: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border-subtle rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-surface-bg text-on-surface"
                      placeholder="123 Education St, NY 10001"
                    />
                  </div>

                  {formData.role === 'instructor' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border-subtle mt-4">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-on-surface-variant">
                          Payout Method
                        </label>
                        <select
                          value={formData.payoutMethod}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              payoutMethod: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-border-subtle rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-surface-bg text-on-surface"
                        >
                          <option value="">Select Method</option>
                          <option value="paypal">PayPal</option>
                          <option value="stripe">Stripe / Bank Transfer</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-on-surface-variant">
                          Payout Details
                        </label>
                        <input
                          type="text"
                          value={formData.payoutDetails}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              payoutDetails: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-border-subtle rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-surface-bg text-on-surface"
                          placeholder="Email or Bank Account info"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-secondary text-white text-sm font-bold rounded-xl hover:bg-secondary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                    >
                      {isLoading ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
