import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { IPatientProfile } from '@/lib/types';
import api from '@/lib/utils';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function PatientProfile() {
  const [patient, setPatient] = useState<IPatientProfile | null>(null);
  const { keycloak } = useKeycloak();

  useEffect(() => {
    async function fetchPatient() {
      try {
        const token = keycloak.token;
        const response = await api.get('/patients/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatient(response.data);
      } catch (error) {
        console.error('Error fetching patient:', error);
        toast.error('Failed to load patient data');
      }
    }

    fetchPatient();
  }, [keycloak.token]);

  if (patient == null) return null;

  return (
    <div className="container p-4 mx-auto">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl">
              {patient.account.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{patient.account.name}</CardTitle>
            <p className="text-muted-foreground">{patient.account.email}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Conditions</h3>
            <div className="flex flex-wrap gap-2">
              {patient.conditions.map((condition, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {condition.name}: {condition.description}
                </Badge>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="mb-2 text-lg font-semibold">Notes</h3>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {patient.notes.map((note, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <p>{note.content}</p>
                  {index < patient.notes.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
