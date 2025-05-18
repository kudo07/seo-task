// src/components/Filters.jsx
function Filters({ keywordFilter, onKeywordChange }) {
  return (
    <div className="mb-4 flex justify-center align-middle item min-screen min-w-screen">
      <input
        type="text"
        placeholder="Filter by keyword..."
        value={keywordFilter}
        onChange={(e) => onKeywordChange(e.target.value)}
        className="p-2 border rounded w-full sm:w-72 mb-10"
      />
    </div>
  );
}

export default Filters;
