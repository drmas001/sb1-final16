const { v4: uuidv4 } = require('uuid');

// In-memory database (replace with a proper database in production)
let patients = [];
let notes = [];

exports.handler = async (event, context) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '');
  const method = event.httpMethod;

  try {
    switch (true) {
      case method === 'GET' && path === '/patients':
        return {
          statusCode: 200,
          body: JSON.stringify(patients),
        };

      case method === 'POST' && path === '/patients':
        const newPatient = JSON.parse(event.body);
        newPatient.id = uuidv4();
        newPatient.status = 'Active';
        patients.push(newPatient);
        return {
          statusCode: 201,
          body: JSON.stringify(newPatient),
        };

      case method === 'PUT' && path.match(/^\/patients\/[\w-]+$/):
        const updatePatientId = path.split('/')[2];
        const updates = JSON.parse(event.body);
        const patientToUpdateIndex = patients.findIndex(p => p.id === updatePatientId);
        if (patientToUpdateIndex !== -1) {
          patients[patientToUpdateIndex] = { ...patients[patientToUpdateIndex], ...updates };
          return {
            statusCode: 200,
            body: JSON.stringify(patients[patientToUpdateIndex]),
          };
        }
        return { statusCode: 404, body: 'Patient not found' };

      case method === 'GET' && path.match(/^\/patients\/[\w-]+\/notes$/):
        const patientId = path.split('/')[2];
        const patientNotes = notes.filter(n => n.patientId === patientId);
        return {
          statusCode: 200,
          body: JSON.stringify(patientNotes),
        };

      case method === 'POST' && path === '/notes':
        const newNote = JSON.parse(event.body);
        newNote.id = uuidv4();
        notes.push(newNote);
        return {
          statusCode: 201,
          body: JSON.stringify(newNote),
        };

      case method === 'POST' && path.match(/^\/patients\/[\w-]+\/discharge$/):
        const dischargePatientId = path.split('/')[2];
        const { dischargeNotes } = JSON.parse(event.body);
        const patientIndex = patients.findIndex(p => p.id === dischargePatientId);
        if (patientIndex !== -1) {
          patients[patientIndex] = {
            ...patients[patientIndex],
            status: 'Discharged',
            dischargeDate: new Date().toISOString()
          };
          notes.push({
            id: uuidv4(),
            patientId: dischargePatientId,
            date: new Date().toISOString(),
            note: `Discharge notes: ${dischargeNotes}`,
            user: 'System'
          });
          return {
            statusCode: 200,
            body: JSON.stringify(patients[patientIndex]),
          };
        }
        return { statusCode: 404, body: 'Patient not found' };

      default:
        return { statusCode: 404, body: 'Not Found' };
    }
  } catch (error) {
    console.error('Error in API:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};