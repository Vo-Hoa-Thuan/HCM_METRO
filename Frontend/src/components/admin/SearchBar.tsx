
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { motion } from '@/components/ui/motion';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 h-10 bg-white/80 backdrop-blur border-muted focus-visible:ring-accent"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
          <Filter className="h-4 w-4" /> Lọc
        </Button>
        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" /> Sắp xếp
        </Button>
        <Button className="flex items-center gap-2 ml-auto sm:ml-0">
          <Plus className="h-4 w-4" /> Thêm mới
        </Button>
      </div>
    </motion.div>
  );
};

export default SearchBar;
