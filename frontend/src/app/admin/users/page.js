'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Shield, User, Trash2, Search, Plus, X, Check, RefreshCw, 
  Mail, Phone, Calendar, UserCheck, UserX, AlertCircle 
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
  });
  const [creating, setCreating] = useState(false);

  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [notification, setNotification] = useState({ type: '', message: '' });

  const notify = (message, type = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 3500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/users');
      if (res && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.warn('Could not load users via API:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await apiFetch(`/api/auth/users/${targetUser._id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: nextRole }),
      });
      if (res && res.success) {
        setUsers(prev => prev.map(u => u._id === targetUser._id ? { ...u, role: nextRole } : u));
        notify(`User ${targetUser.name} role changed to ${nextRole.toUpperCase()}`);
      } else {
        notify('Failed to update role', 'error');
      }
    } catch (err) {
      notify(err.message || 'Error updating user role', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/auth/users/${deleteConfirmUser._id}`, {
        method: 'DELETE',
      });
      setUsers(prev => prev.filter(u => u._id !== deleteConfirmUser._id));
      notify(`User ${deleteConfirmUser.name} deleted successfully`);
      setDeleteConfirmUser(null);
    } catch (err) {
      notify(err.message || 'Error deleting user', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email || !addForm.password) {
      notify('Please fill all required fields', 'error');
      return;
    }

    setCreating(true);
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(addForm),
      });

      if (res && res.user) {
        // If role should be admin, update it
        if (addForm.role === 'admin') {
          await apiFetch(`/api/auth/users/${res.user._id}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role: 'admin' }),
          }).catch(() => {});
          res.user.role = 'admin';
        }

        setUsers(prev => [res.user, ...prev]);
        notify(`New user ${res.user.name} created successfully!`);
        setShowAddModal(false);
        setAddForm({ name: '', email: '', password: '', role: 'user', phone: '' });
      } else {
        notify(res?.message || 'Failed to create user', 'error');
      }
    } catch (err) {
      notify(err.message || 'Failed to create user', 'error');
    } finally {
      setCreating(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u._id && u._id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = 
      roleFilter === 'ALL' ||
      (roleFilter === 'ADMIN' && u.role === 'admin') ||
      (roleFilter === 'USER' && u.role === 'user');

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in slide-in-from-top-4 ${
          notification.type === 'error' 
            ? 'bg-rose-50 border-rose-200 text-rose-800' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          ) : (
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          )}
          <span className="text-xs font-bold">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">User Accounts</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage customer profiles, admin access, and security</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-gray-600 transition-colors shadow-sm"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-admin-primary' : ''}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-admin-primary hover:bg-admin-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New User</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search + Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 focus:border-admin-primary focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs outline-none transition-colors"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-gray-200/60 overflow-x-auto">
          {['ALL', 'USER', 'ADMIN'].map((rf) => (
            <button
              key={rf}
              onClick={() => setRoleFilter(rf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                roleFilter === rf
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-gray-500 hover:text-slate-900'
              }`}
            >
              {rf === 'ALL' ? `All (${users.length})` : rf === 'USER' ? 'Customers' : 'Administrators'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">USER</th>
                <th className="py-4 px-6">EMAIL</th>
                <th className="py-4 px-6">PHONE</th>
                <th className="py-4 px-6">ROLE</th>
                <th className="py-4 px-6">JOINED</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-xs">
                    {loading ? 'Loading user accounts...' : 'No users found matching your criteria.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                          u.role === 'admin' 
                            ? 'bg-indigo-100 text-admin-primary border border-indigo-200' 
                            : 'bg-slate-100 text-slate-700 border border-gray-200'
                        }`}>
                          {u.name ? u.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name || 'Anonymous User'}</p>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {u._id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-500 font-mono text-[11px]">
                      {u.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{u.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300">Not provided</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          u.role === 'admin' 
                            ? 'bg-indigo-50 text-admin-primary border border-indigo-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {u.role === 'admin' ? (
                            <Shield className="w-3 h-3 text-admin-primary" />
                          ) : (
                            <User className="w-3 h-3 text-emerald-600" />
                          )}
                          <span>{u.role.toUpperCase()}</span>
                        </span>

                        <button
                          onClick={() => handleToggleRole(u)}
                          className="text-[10px] font-bold text-gray-400 hover:text-admin-primary underline transition-colors"
                          title={`Switch to ${u.role === 'admin' ? 'user' : 'admin'}`}
                        >
                          Make {u.role === 'admin' ? 'User' : 'Admin'}
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-300" />
                        <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setDeleteConfirmUser(u)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors inline-block"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-900">Create New Account</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-gray-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={addForm.name}
                  onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-admin-primary focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={addForm.email}
                  onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-admin-primary focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={addForm.password}
                  onChange={(e) => setAddForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-admin-primary focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 555 123 4567"
                    value={addForm.phone}
                    onChange={(e) => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-admin-primary focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Role</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-admin-primary focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium"
                  >
                    <option value="user">Customer (User)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-admin-primary hover:bg-admin-hover text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-sm w-full p-6 shadow-2xl relative space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete User Account</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to permanently delete <strong className="text-slate-800">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})?
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}