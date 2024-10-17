import React, { useState } from 'react';
import { Patient, Specialty } from '../types';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdmitPatientProps {
  onAdmit: (patient: Omit<Patient, 'id'>) => Promise<Patient>;
}

const AdmitPatient: React.FC<AdmitPatientProps> = ({ onAdmit }) => {
  const [name, setName] = useState('');
  const [mrn, setMRN] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [diagnosis, setDiagnosis] = useState('');
  const [specialty, setSpecialty] = useState<Specialty>('General Internal Medicine');
  const [assignedDoctor, setAssignedDoctor] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [admissionTime, setAdmissionTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    const newPatient: Omit<Patient, 'id'> = {
      name,
      mrn,
      age: parseInt(age),
      gender,
      diagnosis,
      admissionDate: `${admissionDate}T${admissionTime}:00`,
      status: 'Active', // Explicitly set status to 'Active'
      specialty,
      assignedDoctor: assignedDoctor || undefined,
    };
    
    try {
      console.log('Submitting patient:', newPatient);
      const addedPatient = await onAdmit(newPatient);
      console.log('Patient admitted successfully:', addedPatient);
      navigate('/specialties');
    } catch (error: any) {
      console.error('Error admitting patient:', error);
      setError(`An error occurred while admitting the patient: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <UserPlus className="mr-2" />
        Admit New Patient
      </h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Form fields remain the same */}
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          {isSubmitting ? 'Admitting...' : 'Admit Patient'}
        </button>
      </form>
    </div>
  );
};

export default AdmitPatient;