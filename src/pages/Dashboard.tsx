
import { useEffect, useState } from 'react';
import api from '@/lib/utils';

interface Patient {
  id: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  securityNumber: string;
  familyName: string;
  givenName: string;
  telecom: string;
  gender: string;
  birthDate: string;
  maritalStatus: string;
  language: string;
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    async function fetchPatients() {
      try {
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
      <h1>Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Given Name</th>
            <th>Family Name</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Postal Code</th>
            <th>Country</th>
            <th>Telecom</th>
            <th>Gender</th>
            <th>Birth Date</th>
            <th>Marital Status</th>
            <th>Language</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.givenName}</td>
              <td>{patient.familyName}</td>
              <td>{patient.address}</td>
              <td>{patient.city}</td>
              <td>{patient.state}</td>
              <td>{patient.postalCode}</td>
              <td>{patient.country}</td>
              <td>{patient.telecom}</td>
              <td>{patient.gender}</td>
              <td>{new Date(patient.birthDate).toLocaleDateString()}</td>
              <td>{patient.maritalStatus}</td>
              <td>{patient.language}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}