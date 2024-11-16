
import { useEffect, useState } from 'react';
import api from '@/lib/utils';
import { CurrentUser } from '@/lib/types';
import { useParams } from 'react-router-dom';

import {Table, TableBody, TableHead, TableHeader, TableRow, TableCell
} from '@/components/ui/table';

interface condition {
  diagnosis: string
  doctor: string;
  date: string;
}

interface note {
  note: string;
  doctor: string;
  date: string;
}

export default function Dashboard() {
  const { id } = useParams();
  const [condition, setCondition] = useState<condition[]>([]);
  const [note, setNote] = useState<note[]>([]);

  useEffect(() => {

    const user = localStorage.getItem('user');
    if (!user) {
      return;
    }
    
    let id2 = id;
    if ( id === undefined) {
      id2 = (JSON.parse(user) as CurrentUser).id.toString();
    }
    
    async function fetchConditions() {
      try {
        if (!api.defaults.headers['Authorization']) {
          return;
        }
        const response = await api.get('/journal/Conditions/' + id2);
        setCondition(response.data.patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
    
    async function fetchNotes() {
      try {
        if (!api.defaults.headers['Authorization']) {
          return;
        }
        const response = await api.get('/journal/Notes/' + id2);
        setNote(response.data.patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }

    fetchConditions();
    fetchNotes();
  }, []);

  return (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div>
      <h2>Notes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {note.map((note, index) => (
            <TableRow key={index + "note"}>
              <TableCell>{note.doctor}</TableCell>
              <TableCell>{note.date}</TableCell>
              <TableCell>{note.note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <div>
      <h2>Conditions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {condition.map((condition, index) => (
            <TableRow key={index + "condition"}>
              <TableCell>{condition.diagnosis}</TableCell>
              <TableCell>{condition.doctor}</TableCell>
              <TableCell>{condition.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
  );
}