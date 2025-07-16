import React, { useState, useMemo } from "react";
import {
  useAdminClients,
  useUpdateClient,
} from "../../../Hooks/admin/adminDashboard/adminDashboardHook";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import ClientsCard from "../../../Components/Features/AdminCard/Clients/ClientsCard";
import EditClientsCard from "../../../Components/Features/AdminCard/Clients/EditClientsCard";
import { Modal } from "../../../Components/Ui";

function ClientPage() {
  const { data: clientsData, isLoading, isError, error } = useAdminClients();
  const { mutate: updateClient } = useUpdateClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingClient, setEditingClient] = useState(null);
  const itemsPerPage = 9;

  const clients = useMemo(
    () => clientsData?.data?.clients || [],
    [clientsData]
  );

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const name = client.fullName || client.name || "";
      const email = client.email || "";
      const status = client.status || "active";
      const address = client.address ? JSON.stringify(client.address) : "";

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (value) => setCurrentPage(value);

  const handleEditClient = (client) => {
    console.log("Client data being edited:", client);
    setEditingClient(client);
  };
  const handleUpdateClient = async (clientId, updateData) => {
    try {
      console.log("Handling update for client:", clientId);
      await updateClient({
        clientId,
        updateData,
      });
      setEditingClient(null);
    } catch (error) {
      console.error("Failed to update client:", error);
      throw error;
    }
  };

  const handleDeleteClient = (client) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${
          client.fullName || client.name || "this client"
        }?`
      )
    ) {
      console.log("Deleting client:", client);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          Error loading clients: {error.message || "Unknown error occurred"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-[#101418] dark:text-gray-200 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <h1 className="text-[32px] font-bold leading-tight min-w-72">
          All Clients List
        </h1>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      {filteredClients.length === 0 ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {clients.length === 0
              ? "No clients available"
              : "No clients found matching your criteria"}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-[#d4dbe2] dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {[
                    "Full Name",
                    "Email",
                    "Phone",
                    "Role",
                    "Address",
                    "Profile",
                    "Status",
                    "Email Verification",
                    "Phone Verification",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedClients.map((client) => (
                  <ClientsCard
                    key={client.id || client._id}
                    client={{
                      id: client.id || client._id,
                      fullName:
                        client.fullName || client.name || "Unknown Client",
                      email: client.email || "No email",
                      phone: client.phone || "No phone",
                      role: client.role || "client",
                      profileImage: client.profileImage || client.avatar || "",
                      status: client.status || "active",
                      isEmailVerified: client.isEmailVerified || false,
                      address: client.address || {},
                      isPhoneVerified: client.isPhoneVerified || false,
                    }}
                    onEdit={handleEditClient}
                    onDelete={handleDeleteClient}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === page
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900"
                          : "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}>
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Edit Client Modal */}
      <Modal
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        title="Edit Client"
        className="max-w-2xl">
        {editingClient && (
          <EditClientsCard
            client={editingClient}
            onClose={() => setEditingClient(null)}
            onUpdate={handleUpdateClient}
          />
        )}
      </Modal>
    </div>
  );
}

export default ClientPage;
