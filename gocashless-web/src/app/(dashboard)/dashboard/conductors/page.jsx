"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search, Key, DollarSign } from "lucide-react";
import Link from 'next/link';
import { conductorService } from "@/lib/api/conductorService";
import Modal from "@/components/Modal";
import DashboardLayout from "../../../../components/layout/DashboardLayout";

const ConductorCard = ({ conductor, onEdit, onDelete, onResetPassword }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 flex flex-col justify-between`}>
      <div>
        <h3 className="text-lg font-bold">{conductor.firstName} {conductor.lastName}</h3>
        <p className="text-gray-600">{conductor.email}</p>
        <p className="text-gray-600">{conductor.phoneNumber}</p>
      </div>
      <div className="flex justify-end items-center mt-4">
        <Link href={`/dashboard/conductors/${conductor.id}/transactions`} className="text-blue-500 hover:text-blue-700 mr-4">
          <DollarSign size={20} />
        </Link>
        <button onClick={() => onResetPassword(conductor)} className="text-yellow-500 hover:text-yellow-700 mr-4">
          <Key size={20} />
        </button>
        <button onClick={() => onEdit(conductor)} className="text-green-500 hover:text-green-700 mr-4">
          <Edit size={20} />
        </button>
        <button onClick={() => onDelete(conductor.id)} className="text-red-500 hover:text-red-700">
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

const ConductorsPage = () => {
  const [conductors, setConductors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedConductor, setSelectedConductor] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchConductors = async () => {
    try {
      setIsLoading(true);
      const data = await conductorService.getConductors();
      setConductors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConductors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddConductor = async (e) => {
    e.preventDefault();
    try {
      const newConductor = await conductorService.createConductor(formData);
      setConductors([...conductors, newConductor]);
      setFormData({ username: "", email: "", phoneNumber: "", firstName: "", lastName: "" });
      setIsAddModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (conductor) => {
    setSelectedConductor(conductor);
    setFormData({
      email: conductor.email,
      phoneNumber: conductor.phoneNumber,
      firstName: conductor.firstName,
      lastName: conductor.lastName,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateConductor = async (e) => {
    e.preventDefault();
    try {
      const updatedConductor = await conductorService.updateConductor(selectedConductor.id, formData);
      setConductors(conductors.map(c => c.id === selectedConductor.id ? updatedConductor : c));
      setFormData({ username: "", email: "", phoneNumber: "", firstName: "", lastName: "" });
      setSelectedConductor(null);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    // Note: Backend does not support deleting users yet.
    if (window.confirm("Are you sure you want to delete this conductor? This action is not yet supported by the backend.")) {
      // try {
      //   await conductorService.deleteConductor(id);
      //   setConductors(conductors.filter(c => c.id !== id));
      // } catch (err) {
      //   setError(err.message);
      // }
    }
  };

  const openResetModal = (conductor) => {
    setSelectedConductor(conductor);
    setIsResetModalOpen(true);
  };

  const handleResetPasswordConfirm = async () => {
    try {
      await conductorService.resetPassword(selectedConductor.id);
      setIsResetModalOpen(false);
      setSelectedConductor(null);
      // Optionally, show a success message
      alert("Password has been reset to 'gocashless'.");
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredConductors = conductors.filter(c =>
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold">Conductors</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search conductors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 w-64 rounded-lg border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <Plus size={20} className="mr-2" />
            Add New Conductor
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConductors.map((conductor) => (
          <ConductorCard key={conductor.id} conductor={conductor} onEdit={handleEdit} onDelete={handleDelete} onResetPassword={openResetModal} />
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Conductor</h2>
        <form onSubmit={handleAddConductor}>
          {/* Add form fields for conductor */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">First Name</label>
            <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Last Name</label>
            <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Username</label>
            <input name="username" value={formData.username} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Conductor</h2>
        <form onSubmit={handleUpdateConductor}>
          {/* Edit form fields */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">First Name</label>
            <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Last Name</label>
            <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Update
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <p>Are you sure you want to reset the password for <strong>{selectedConductor?.firstName} {selectedConductor?.lastName}</strong>?</p>
        <p className="text-sm text-gray-600 mt-2">The password will be reset to the default: <strong>gocashless</strong>.</p>
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

export default ConductorsPage;