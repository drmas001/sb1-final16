import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Patient } from '../types';
import { UserMinus } from 'lucide-react';

interface DischargePatientProps {
  patients: Patient[];
  onDischarge: (patientId: string, dischargeNotes: string) => Promise<Patient>;
}

const DischargePatient: React.FC<DischargePatientProps> = ({ patients, onDischarge }) => {
  const [dischargeNotes, setDischargeNotes] = useState('');
  const [isDischarging, setIsDischarging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return <div className="text-center mt-8">Patient not found</div>;
  }

  const handleDischarge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsDischarging(true);
    setError(null);
    try {
      await onDischarge(id, dischargeNotes);
      navigate('/'); // Navigate to home screen after successful discharge
    } catch (error: any) {
      console.error('Error discharging patient:', error);
      setError(`An error occurred while discharging the patient: ${error.message}`);
    } finally {
      setIsDischarging(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <UserMinus className="mr-2" />
        Discharge Patient
      </h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        {/* Patient information display remains the same */}
      </div>
      <form onSubmit={handleDischarge} className="space-y-4">
        <div>
          <label htmlFor="dischargeNotes" className="block text-sm font-medium text-gray-700">Discharge Notes</label>
          <textarea
            id="dischargeNotes"
            value={dischargeNotes}
            onChange={(e) => setDischargeNotes(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={4}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={isDischarging}
        >
          {isDischarging ? 'Discharging...' : 'Discharge Patient'}
        </button>
      </form>
    </div>
  );
};

export default DischargePatient;