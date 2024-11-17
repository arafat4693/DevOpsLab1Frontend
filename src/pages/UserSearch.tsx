
import { useEffect, useState } from 'react';
import api from '@/lib/utils';
import { CurrentUser } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {Table, TableBody, TableHead, TableHeader, TableRow, TableCell
} from '@/components/ui/table';

interface Patient {
  id: string;
  securityNumber: string;
  name: string;
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    async function fetchPatients() {
      try {

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser) as CurrentUser;
          if (user.role !== 'doctor') {
            return;
          }
        }

        // If the user is not logged in, don't fetch patients
        if (!api.defaults.headers['Authorization']) {
          return;
        }
        const response = await api.get('/journal/patients');
        setPatients(response.data.patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }

    fetchPatients();
  }, []);

  return (
  <div>
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search patients..."
      />
      <Button
          onClick={async () => {
            const query = (document.querySelector('input[type="text"]') as HTMLInputElement).value;
            try {
              const response = await api.get(`/journal/patients?search=${query}`);
              setPatients(response.data.patients);
            } catch (error) {
              console.error('Error searching patients:', error);
            }
          }}
        >
          Search
        </Button>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell><a href={`/${patient.id}`}>{patient.name}</a></TableCell>
            <TableCell>{patient.securityNumber}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  );
}