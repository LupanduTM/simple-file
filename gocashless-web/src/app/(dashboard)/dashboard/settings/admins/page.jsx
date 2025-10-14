
"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Search, Key } from "lucide-react";
import { adminService } from "@/lib/api/adminService";
import Modal from "@/components/Modal";
import DashboardLayout from "@/components/layout/DashboardLayout";

const AdminRow = ({ admin, onStatusChange, onResetPassword }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">{admin.firstName} {admin.lastName}</td>
      <td className="py-3 px-4">{admin.email}</td>
      <td className="py-3 px-4">{admin.phoneNumber}</td>
      <td className="py-3 px-4">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {admin.status}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <button onClick={() => onStatusChange(admin)} className="text-blue-500 hover:text-blue-700">
          <Edit size={20} />
        </button>
        <button onClick={() => onResetPassword(admin)} className="text-yellow-500 hover:text-yellow-700 ml-2">
          <Key size={20} />
        </button>
      </td>
    </tr>
  );
};

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [addFormData, setAddFormData] = useState({ username: "", password: "", email: "", phoneNumber: "", firstName: "", lastName: "" });
  const [statusFormData, setStatusFormData] = useState({ status: '' });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({ ...addFormData, [name]: value });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const newAdmin = await adminService.createAdmin(addFormData);
      setAdmins([...admins, newAdmin]);
      setAddFormData({ username: "", password: "", email: "", phoneNumber: "", firstName: "", lastName: "" });
      setIsAddModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const openStatusModal = (admin) => {
    setSelectedAdmin(admin);
    setStatusFormData({ status: admin.status });
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedAdmin = await adminService.updateAdminStatus(selectedAdmin.id, statusFormData.status);
      setAdmins(admins.map(a => a.id === selectedAdmin.id ? updatedAdmin : a));
      setIsStatusModalOpen(false);
      setSelectedAdmin(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const openResetModal = (admin) => {
    setSelectedAdmin(admin);
    setIsResetModalOpen(true);
  };

  const handleResetPasswordConfirm = async () => {
    try {
      await adminService.resetPassword(selectedAdmin.id);
      setIsResetModalOpen(false);
      setSelectedAdmin(null);
      alert("Password has been reset. An email has been sent to the admin with the new credentials.");
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredAdmins = admins.filter(a =>
    (a.firstName + ' ' + a.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div>Error: {error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 w-64 rounded-lg border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <Plus size={20} className="mr-2" />
            Add New Admin
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <AdminRow key={admin.id} admin={admin} onStatusChange={openStatusModal} onResetPassword={openResetModal} />
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
        <form onSubmit={handleAddAdmin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">First Name</label>
            <input name="firstName" value={addFormData.firstName} onChange={handleAddFormChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Last Name</label>
            <input name="lastName" value={addFormData.lastName} onChange={handleAddFormChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Username</label>
            <input name="username" value={addFormData.username} onChange={handleAddFormChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input type="password" name="password" value={addFormData.password} onChange={handleAddFormChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input type="email" name="email" value={addFormData.email} onChange={handleAddFormChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
            <input name="phoneNumber" value={addFormData.phoneNumber} onChange={handleAddFormChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Change Admin Status</h2>
        <form onSubmit={handleStatusUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Status for {selectedAdmin?.firstName}</label>
            <select name="status" value={statusFormData.status} onChange={(e) => setStatusFormData({ status: e.target.value })} className="w-full p-2 border rounded">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Status</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <p>Are you sure you want to reset the password for <strong>{selectedAdmin?.firstName} {selectedAdmin?.lastName}</strong>?</p>
        <p className="text-sm text-gray-600 mt-2">A new, randomly generated password will be sent to the admin's email address.</p>
        <div className="flex justify-end mt-6">
          <button onClick={() => setIsResetModalOpen(false)} className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={handleResetPasswordConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Confirm & Reset
          </button>
        </div>
      </Modal>

    </DashboardLayout>
  );
};

export default AdminsPage;
