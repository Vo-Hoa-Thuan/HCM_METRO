
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder search functionality - in a real app, you would fetch results from an API
    const mockResults = ['Tuyến số 1', 'Bến Thành', 'Suối Tiên', 'Nhà hát Thành phố'];
    const filtered = mockResults.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Tìm kiếm</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Nhập từ khóa tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </div>
        </form>

        {results.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Kết quả tìm kiếm</h2>
            <ul className="space-y-2">
              {results.map((result, index) => (
                <li key={index} className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        ) : searchTerm && (
          <p className="text-muted-foreground">Không tìm thấy kết quả phù hợp.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Search;
