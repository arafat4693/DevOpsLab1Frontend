import { useEffect, useState } from 'react';
import api from '@/lib/utils';
import { CurrentUser } from '@/lib/types';
import { useParams } from 'react-router-dom';

import { Card, CardHeader,  CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {Table, TableBody, TableHead, TableHeader, TableRow, TableCell
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

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
  const [patient, setPatient] = useState<CurrentUser>();
  // const [condition] = useState<condition[]>([]);
  // const [note] = useState<note[]>([]);
  // const [patient] = useState<CurrentUser>();

  
  const [newNote, setNewNote] = useState('');
  const [newCondition, setNewCondition] = useState('');
  
  async function fetchConditions(id2: string) {
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
  
  async function fetchNotes(id2: string) {
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

  const handleAddNote = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') as string) as CurrentUser;
      const id2 = user.id.toString();
      await api.post('/journal/Notes/' + id2, {
        patientId: id2,
        note: newNote,
        doctor: user.name,
        date: new Date().toISOString(),
      });
      setNewNote('');
      fetchNotes(id2);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleAddCondition = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') as string) as CurrentUser;
      const id2 = user.id.toString();
      await api.post('/journal/Condition/' + id2, {
        patientId: id2,
        note: newCondition,
        doctor: user.name,
        date: new Date().toISOString(),
      });
      setNewCondition('');
      fetchConditions(id2);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-constant-condition
    if (1+1 == 2){
      return;
    }
    console.log('useEffect triggered');

    let user = localStorage.getItem('user');
    if (!user) {
      // return;
      // add default user
      user = JSON.stringify({id: 1, role: 'doctor', token: '1234'});
    }

    let id2 = id;
    if ( id2 === undefined) {
      id2 = (JSON.parse(user) as CurrentUser).id.toString();
    }

    async function fetchPatient() {
      try {
        if (!api.defaults.headers['Authorization']) {
          return;
        }
        const response = await api.get('/journal/patient/' + id2);
        setPatient(response.data.patient);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }

    fetchConditions(id2);
    fetchNotes(id2);
    fetchPatient();
  }, []);

  return (
  <div>
    {/* a title with the name of the patient */}
    <h1>{patient?.name}</h1>
    {/* a table with the notes and conditions of the patient */}

    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <div>
        <h2>Notes</h2>
        {((JSON.parse(localStorage.getItem('user') as string) as CurrentUser)?.role === 'DOCTOR' || (JSON.parse(localStorage.getItem('user') as string) as CurrentUser)?.role === 'STAFF') && (
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Add note</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Textarea placeholder="Note" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleAddNote}>Add</Button>
            </CardFooter>
          </Card>
        )}

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
        {((JSON.parse(localStorage.getItem('user') as string) as CurrentUser)?.role === 'DOCTOR') && (
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Add Condition</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Textarea placeholder="Condition" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleAddCondition}>Add</Button>
            </CardFooter>
          </Card>
        )}
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
  </div>
  );
}