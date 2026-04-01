import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';
import { mockUsers } from '../../data/mockData';
import { Check, X, Search } from 'lucide-react';

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const nextFilter = searchParams.get('filter') || 'all';
    setFilter(nextFilter);
  }, [searchParams]);

  const updateFilter = (nextFilter) => {
    setFilter(nextFilter);
    setSearchParams(nextFilter === 'all' ? {} : { filter: nextFilter });
  };

  const handleVerify = (userId, approved) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, is_verified: approved, is_active: approved }
        : u
    ));
    toast.success(approved ? 'Influencer verified successfully!' : 'Influencer rejected');
  };

  const filteredUsers = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">User Management</h1>
          <p className="text-lg font-body text-muted-foreground">Manage platform users and verifications</p>
        </div>

        <div className="p-8">
          {/* Filters */}
          <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'producer', 'influencer'].map((f) => (
                  <button
                    key={f}
                    onClick={() => updateFilter(f)}
                    className={`px-6 py-2 rounded-full font-body font-semibold text-sm uppercase transition-all ${
                      filter === f
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="text-left py-4 px-6 font-body font-semibold text-on-surface uppercase text-sm">Name</th>
                  <th className="text-left py-4 px-6 font-body font-semibold text-on-surface uppercase text-sm">Email</th>
                  <th className="text-left py-4 px-6 font-body font-semibold text-on-surface uppercase text-sm">Role</th>
                  <th className="text-left py-4 px-6 font-body font-semibold text-on-surface uppercase text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-body font-semibold text-on-surface uppercase text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-body font-semibold">{user.name}</p>
                      {user.role === 'influencer' && user.instagram_handle && (
                        <p className="text-sm font-mono text-muted-foreground">{user.instagram_handle}</p>
                      )}
                    </td>
                    <td className="py-4 px-6 font-body text-muted-foreground">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase bg-surface-container-high">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {user.role === 'influencer' ? (
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono uppercase w-fit ${
                            user.is_verified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          }`}>
                            {user.is_verified ? 'Verified' : 'Pending'}
                          </span>
                          {user.follower_count && (
                            <span className="text-sm font-mono text-muted-foreground">
                              {user.follower_count.toLocaleString()} followers
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono uppercase ${
                          user.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {user.role === 'influencer' && !user.is_verified && (
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleVerify(user.id, true)}
                            data-testid={`verify-${user.id}`}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleVerify(user.id, false)}
                            data-testid={`reject-${user.id}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
