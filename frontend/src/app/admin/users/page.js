'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Shield, User, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      _id: 'usr_admin',
      name: 'Admin',
      email: 'admin@ishop.com',
      role: 'admin',
      phone: '+1 0231 4554 452',
      createdAt: '2026-01-15T00:00:00Z',
    },
    {
      _id: 'usr_mark',
      name: 'Mark Cole',
      email: 'swoo@gmail.com',
      role: 'user',
      phone: '+1 0231 4554 452',
      createdAt: '2026-02-10T00:00:00Z',
    },
    {
      _id: 'usr_sarah',
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      role: 'user',
      phone: '+1 555 234 5678',
      createdAt: '2026-03-01T00:00:00Z',
    }
  ]);

  useEffect(() => {
    apiFetch('/api/auth/users')
      .then(res => {
        if (res.users && res.users.length > 0) setUsers(res.users);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">User Accounts</h1>
        <span className="text-xs text-gray-500 font-semibold">Total Users: {users.length}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">NAME</th>
                <th className="py-4 px-6">EMAIL</th>
                <th className="py-4 px-6">PHONE</th>
                <th className="py-4 px-6">ROLE</th>
                <th className="py-4 px-6 text-right">JOINED DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {u.email}
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-mono text-[11px]">
                    {u.phone || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      u.role === 'admin' ? 'bg-indigo-50 text-admin-primary' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-400 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
