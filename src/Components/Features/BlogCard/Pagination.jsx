import { motion } from "framer-motion";
const Pagination = ({ currentPage, totalPages, onPageChange, darkMode }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border transition-colors ${
            darkMode
              ? "border-gray-700 hover:bg-gray-700 disabled:opacity-50 text-gray-300"
              : "border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700"
          }`}>
          Previous
        </motion.button>

        {getPageNumbers().map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md transition-colors ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : darkMode
                ? "border border-gray-700 hover:bg-gray-700 text-gray-300"
                : "border border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}>
            {page}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border transition-colors ${
            darkMode
              ? "border-gray-700 hover:bg-gray-700 disabled:opacity-50 text-gray-300"
              : "border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700"
          }`}>
          Next
        </motion.button>
      </nav>
    </div>
  );
};

export default Pagination;
