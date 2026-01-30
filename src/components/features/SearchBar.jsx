import { Search, MapPin } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  return (
    <div className="flex gap-2 py-6 border-b">
      <div className="flex items-center flex-1 border rounded-lg px-4 py-3 gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Find your perfect job"
          className="flex-1 outline-none bg-transparent"
        />
      </div>
      <div className="flex items-center flex-1 border rounded-lg px-4 py-3 gap-3">
        <MapPin className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="City, State, or 'remote'"
          className="flex-1 outline-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default SearchBar;
