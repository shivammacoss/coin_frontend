import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { 
  Shield,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Key,
  Mail,
  Calendar,
  X,
  Loader2
} from 'lucide-react'

const API_URL = `${import.meta.env.VITE_API_URL}/admin-auth`

const AdminManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer',
    permissions: []
  })
  const [newPassword, setNewPassword] = useState('')

  const roles = ['super_admin', 'manager', 'support', 'finance', 'viewer']
  const permissionsList = ['users', 'accounts', 'trades', 'funds', 'transactions', 'ib', 'copy_trade', 'prop_firm', 'support', 'settings', 'admins']

  const getToken = () => localStorage.getItem('adminToken')

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_URL}/admins`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      if (response.status === 401 || response.status === 403) {
        navigate('/admin')
        return
      }
      const data = await response.json()
      if (response.ok) {
        setAdmins(data.admins || [])
      }
    } catch (err) {
      setError('Failed to fetch admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      setShowAddModal(false)
      setFormData({ name: '', email: '', password: '', role: 'viewer', permissions: [] })
      fetchAdmins()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEditAdmin = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/admins/${selectedAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      setShowEditModal(false)
      setSelectedAdmin(null)
      fetchAdmins()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/admins/${selectedAdmin._id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ password: newPassword })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      setShowPasswordModal(false)
      setNewPassword('')
      setSelectedAdmin(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to delete this admin?')) return
    try {
      const response = await fetch(`${API_URL}/admins/${adminId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      fetchAdmins()
    } catch (err) {
      alert(err.message)
    }
  }

  const openEditModal = (admin) => {
    setSelectedAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions || [],
      isActive: admin.isActive
    })
    setShowEditModal(true)
  }

  const openPasswordModal = (admin) => {
    setSelectedAdmin(admin)
    setNewPassword('')
    setShowPasswordModal(true)
  }

  const togglePermission = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }))
  }

  const formatDate = (date) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleString()
  }

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout title="Admin Management" subtitle="Manage admin users and permissions">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-800 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-500 text-sm mb-1">Total Admins</p>
          <p className="text-white text-2xl font-bold">{admins.length}</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-500 text-sm mb-1">Active</p>
          <p className="text-white text-2xl font-bold">{admins.filter(a => a.isActive).length}</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-500 text-sm mb-1">Super Admins</p>
          <p className="text-white text-2xl font-bold">{admins.filter(a => a.role === 'super_admin').length}</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-500 text-sm mb-1">Roles</p>
          <p className="text-white text-2xl font-bold">{roles.length}</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      )}

      {/* Admin List */}
      <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border-b border-gray-800">
          <h2 className="text-white font-semibold text-lg">Admin Users</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-dark-700 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
              />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Plus size={16} />
              <span>Add Admin</span>
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden p-4 space-y-3">
          {filteredAdmins.map((admin) => (
            <div key={admin._id} className="bg-dark-700 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    admin.role === 'super_admin' ? 'bg-red-500/20' : 'bg-blue-500/20'
                  }`}>
                    <Shield size={18} className={admin.role === 'super_admin' ? 'text-red-500' : 'text-blue-500'} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{admin.name}</p>
                    <p className="text-gray-500 text-sm capitalize">{admin.role.replace('_', ' ')}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  admin.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {admin.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail size={14} />
                  <span>{admin.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Key size={14} />
                  <span>{admin.permissions?.join(', ') || 'None'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={14} />
                  <span>Last login: {formatDate(admin.lastLogin)}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-600">
                <button onClick={() => openEditModal(admin)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-500/20 text-blue-500 rounded-lg text-sm">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => openPasswordModal(admin)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-yellow-500/20 text-yellow-500 rounded-lg text-sm">
                  <Key size={14} /> Password
                </button>
                <button onClick={() => handleDeleteAdmin(admin._id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-500/20 text-red-500 rounded-lg text-sm">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-500 text-sm font-medium py-3 px-4">Admin</th>
                <th className="text-left text-gray-500 text-sm font-medium py-3 px-4">Email</th>
                <th className="text-left text-gray-500 text-sm font-medium py-3 px-4">Role</th>
                <th className="text-left text-gray-500 text-sm font-medium py-3 px-4">Permissions</th>
                <th className="text-left text-gray-500 text-sm font-medium py-3 px-4">Last Login</th>
                <th className="text-left text-gray-500 text-sm font-medium py-3 px-4">Status</th>
                <th className="text-left text-gray-500 text-sm font-medium py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin._id} className="border-b border-gray-800 hover:bg-dark-700/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        admin.role === 'super_admin' ? 'bg-red-500/20' : 'bg-blue-500/20'
                      }`}>
                        <Shield size={18} className={admin.role === 'super_admin' ? 'text-red-500' : 'text-blue-500'} />
                      </div>
                      <span className="text-white font-medium">{admin.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-400">{admin.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                      admin.role === 'super_admin' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">{admin.permissions?.join(', ') || 'None'}</td>
                  <td className="py-4 px-4 text-gray-400">{formatDate(admin.lastLogin)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      admin.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openPasswordModal(admin)} className="p-2 hover:bg-dark-600 rounded-lg transition-colors text-gray-400 hover:text-yellow-500" title="Change Password">
                        <Key size={16} />
                      </button>
                      <button onClick={() => openEditModal(admin)} className="p-2 hover:bg-dark-600 rounded-lg transition-colors text-gray-400 hover:text-blue-500" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteAdmin(admin._id)} className="p-2 hover:bg-dark-600 rounded-lg transition-colors text-gray-400 hover:text-red-500" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Add New Admin</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAdmin} className="p-4 space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Password</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required minLength={6} className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                  {roles.map(r => <option key={r} value={r} className="capitalize">{r.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Permissions</label>
                <div className="flex flex-wrap gap-2">
                  {permissionsList.map(perm => (
                    <button type="button" key={perm} onClick={() => togglePermission(perm)} className={`px-2 py-1 rounded text-xs ${formData.permissions.includes(perm) ? 'bg-red-500 text-white' : 'bg-dark-600 text-gray-400'}`}>
                      {perm.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Admin'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Edit Admin</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditAdmin} className="p-4 space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                  {roles.map(r => <option key={r} value={r} className="capitalize">{r.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Permissions</label>
                <div className="flex flex-wrap gap-2">
                  {permissionsList.map(perm => (
                    <button type="button" key={perm} onClick={() => togglePermission(perm)} className={`px-2 py-1 rounded text-xs ${formData.permissions.includes(perm) ? 'bg-red-500 text-white' : 'bg-dark-600 text-gray-400'}`}>
                      {perm.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4" />
                <label htmlFor="isActive" className="text-gray-400 text-sm">Active</label>
              </div>
              <button type="submit" disabled={saving} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl border border-gray-700 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Change Password for {selectedAdmin.name}</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-4 space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <label className="block text-gray-400 text-sm mb-1">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white" placeholder="Minimum 6 characters" />
              </div>
              <button type="submit" disabled={saving} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:opacity-50">
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminManagement
