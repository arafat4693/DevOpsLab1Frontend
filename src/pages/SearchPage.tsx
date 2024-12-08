import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/utils';
import { toast } from 'sonner';

type SearchResult = {
  id: number;
  accountId: number;
  name: string;
  email: string;
  role: string;
};

const endPoints = {
  patientName: '/patient-search/by-name?name=',
  patientEmail: '/patient-search/by-email?email=',
  condition: '/patient-search/by-condition?condition=',
  staffName: '/practitioner-search/by-name?name=',
};

type srcType = 'patientName' | 'patientEmail' | 'condition' | 'staffName';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<srcType>('patientName');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setIsLoading(true);
    try {
      const results = await api.get(endPoints[searchType] + searchTerm);
      setSearchResults(results.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      toast.error('Failed to load search data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container p-4 mx-auto space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select
          value={searchType}
          onValueChange={(v: srcType) => setSearchType(v)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patientName">Patient Name</SelectItem>
            <SelectItem value="patientEmail">Patient Email</SelectItem>
            <SelectItem value="condition">Condition</SelectItem>
            <SelectItem value="staffName">Staff Name</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : <Search className="w-4 h-4" />}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchResults.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.name}</TableCell>
                <TableCell>{result.email}</TableCell>
                <TableCell>{result.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {searchResults.length === 0 && searchTerm && !isLoading && (
        <p className="text-center text-muted-foreground">No results found.</p>
      )}
    </div>
  );
}
