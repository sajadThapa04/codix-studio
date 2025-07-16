import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const ClientsCard = ({ client, onEdit, onDelete }) => {
  const {
    fullName,
    email,
    phone,
    role,
    profileImage,
    status,
    isEmailVerified,
    isPhoneVerified,
    address = {}, // Default to empty object if not provided
  } = client;

  const [imgError, setImgError] = React.useState(false);

  // Status colors for light and dark mode
  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400",
    inactive:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400",
    pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400",
    banned: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400",
  };

  // Get first initial for profile image fallback
  const getInitial = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const shouldShowInitial = (image) =>
    !image || typeof image !== "string" || image.trim().length === 0;

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return "No address";

    const { street, city, state, country, postalCode } = addr;
    const parts = [];
    if (street) parts.push(street);
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (postalCode) parts.push(postalCode);
    if (country) parts.push(country);

    return parts.length > 0 ? parts.join(", ") : "No address";
  };

  return (
    <tr className="border-t border-t-[#d4dbe2] dark:border-t-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="h-[72px] px-4 py-2 w-[300px] text-[#101418] dark:text-gray-200 text-sm font-normal leading-normal">
        {fullName}
      </td>
      <td className="h-[72px] px-4 py-2 w-[300px] text-[#5c728a] dark:text-gray-400 text-sm font-normal leading-normal">
        {email}
      </td>
      <td className="h-[72px] px-4 py-2 w-[200px] text-[#5c728a] dark:text-gray-400 text-sm font-normal leading-normal">
        {phone}
      </td>
      <td className="h-[72px] px-4 py-2 w-[200px] text-[#5c728a] dark:text-gray-400 text-sm font-normal leading-normal">
        {role}
      </td>
      <td className="h-[72px] px-4 py-2 w-[300px] text-[#5c728a] dark:text-gray-400 text-sm font-normal leading-normal">
        {formatAddress(address)}
      </td>
      <td className="h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
        {shouldShowInitial(profileImage) || imgError ? (
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-300 text-sm font-semibold">
              {getInitial(fullName)}
            </span>
          </div>
        ) : (
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={profileImage}
            alt="" // Image decorative, so empty alt
            onError={() => setImgError(true)}
          />
        )}
      </td>

      <td className="h-[72px] px-4 py-2 w-40 text-sm font-normal leading-normal">
        <button
          className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 text-sm font-medium leading-normal w-full ${
            statusColors[status] || statusColors.active
          }`}>
          <span className="truncate">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </button>
      </td>

      <td className="h-[72px] px-4 py-2 w-40 text-sm font-normal leading-normal">
        <button
          className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 text-sm font-medium leading-normal w-full ${
            isEmailVerified
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400"
          }`}>
          <span className="truncate">
            {isEmailVerified ? "Verified" : "Unverified"}
          </span>
        </button>
      </td>

      <td className="h-[72px] px-4 py-2 w-40 text-sm font-normal leading-normal">
        <button
          className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 text-sm font-medium leading-normal w-full ${
            isPhoneVerified
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400"
          }`}>
          <span className="truncate">
            {isPhoneVerified ? "Verified" : "Unverified"}
          </span>
        </button>
      </td>

      {/* Action Buttons */}
      <td className="h-[72px] px-4 py-2 w-40 text-sm font-normal leading-normal">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(client)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md"
            title="Edit">
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(client)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
            title="Delete">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

ClientsCard.defaultProps = {
  client: {
    fullName: "Alice Smith",
    email: "alice@example.com",
    phone: "+1 (555) 987-6543",
    role: "Manager",
    profileImage: null,
    status: "pending",
    isEmailVerified: false,
    isPhoneVerified: true,
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10001",
    },
  },
  onEdit: () => {},
  onDelete: () => {},
};

export default ClientsCard;
