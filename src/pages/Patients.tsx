'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import api from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { useKeycloak } from '@react-keycloak/web';

// Zod schemas for form validation
const noteSchema = z.object({
  note: z.string().min(1, 'Note is required'),
});

const diagnosisSchema = z.object({
  name: z.string().min(1, 'Diagnosis name is required'),
  description: z.string().min(1, 'Description is required'),
});

type Patient = {
  id: number;
  accountId: number;
  name: string;
  email: string;
};

type NoteFormValues = z.infer<typeof noteSchema>;
type DiagnosisFormValues = z.infer<typeof diagnosisSchema>;

export default function Patients() {
  const auth = useAuth();
  const { keycloak } = useKeycloak();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPatients() {
      try {
        const token = keycloak.token;
        const response = await api.get('/patients/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
      }
    }

    fetchPatients();
  }, [keycloak.token]);

  const noteForm = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { note: '' },
  });

  const diagnosisForm = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: { name: '', description: '' },
  });

  const onNoteSubmit = async (data: NoteFormValues) => {
    if (!selectedPatient) return;

    console.log('Note submitted:', data);

    try {
      const token = keycloak.token;
      const response = await api.post(
        '/notes/create',
        {
          patientId: selectedPatient.id,
          noteContent: data.note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data);
      setIsNoteModalOpen(false);
      noteForm.reset();
    } catch (error) {
      console.error('Error submitting note:', error);
      toast.error('Failed to submit note');
    }
  };

  const onDiagnosisSubmit = async (data: DiagnosisFormValues) => {
    if (!selectedPatient) return;

    console.log('Diagnosis submitted:', data);

    try {
      const token = keycloak.token;
      const response = await api.post(
        '/conditions/create',
        {
          patientId: selectedPatient.id,
          diagnosisName: data.name,
          diagnosisDesc: data.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data);
      setIsDiagnosisModalOpen(false);
      diagnosisForm.reset();
    } catch (error) {
      console.error('Error submitting diagnosis:', error);
      toast.error('Failed to submit diagnosis');
    }
  };

  return (
    <div className="container py-10 mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.email}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedPatient(patient);
                        setIsNoteModalOpen(true);
                      }}
                    >
                      Add Note
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedPatient(patient);
                        setIsDiagnosisModalOpen(true);
                      }}
                    >
                      Add Diagnosis
                    </DropdownMenuItem>
                    {auth.getUser()?.role === 'DOCTOR' ? (
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/patient/${patient.accountId}`)
                        }
                      >
                        View Details
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note for {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              Add a new note for the patient's record.
            </DialogDescription>
          </DialogHeader>
          <Form {...noteForm}>
            <form
              onSubmit={noteForm.handleSubmit(onNoteSubmit)}
              className="space-y-8"
            >
              <FormField
                control={noteForm.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter note here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Note</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDiagnosisModalOpen}
        onOpenChange={setIsDiagnosisModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Diagnosis for {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              Add a new diagnosis to the patient's record.
            </DialogDescription>
          </DialogHeader>
          <Form {...diagnosisForm}>
            <form
              onSubmit={diagnosisForm.handleSubmit(onDiagnosisSubmit)}
              className="space-y-8"
            >
              <FormField
                control={diagnosisForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter diagnosis name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={diagnosisForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter diagnosis description..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Diagnosis</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
