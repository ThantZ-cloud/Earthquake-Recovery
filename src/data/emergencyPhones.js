// Emergency phone numbers organized by city
// Originally fetched from ThantZ-cloud/emergency-phone-number-for-myanmar
// Update these with real numbers if needed

const emergencyPhones = {
  'Nay Pyi Taw': [
    { name: 'Fire Department', phone: '192' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
    { name: 'Red Cross Myanmar', phone: '067-412012' },
    { name: 'General Hospital (1000-bed)', phone: '067-420023' },
  ],
  'Yangon': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
    { name: 'Yangon General Hospital', phone: '01-256112' },
    { name: 'Red Cross Yangon', phone: '01-383680' },
    { name: 'Emergency Rescue Team', phone: '01-9669977' },
  ],
  'Mandalay': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
    { name: 'Mandalay General Hospital', phone: '02-61137' },
    { name: 'Red Cross Mandalay', phone: '02-61013' },
  ],
  'Taunggyi': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
    { name: 'Shan State Hospital', phone: '081-21222' },
  ],
  'Bago': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
    { name: 'Bago General Hospital', phone: '052-22009' },
  ],
  'Sagaing': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
    { name: 'Sagaing General Hospital', phone: '071-21012' },
  ],
  'Pathein': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
    { name: 'Pathein General Hospital', phone: '042-22113' },
  ],
  'Mawlamyine': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
    { name: 'Mawlamyine Hospital', phone: '057-22350' },
  ],
  'Myitkyina': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
  ],
  'Sittwe': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
    { name: 'Sittwe General Hospital', phone: '043-22789' },
  ],
  'Kalaymyo': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
  ],
  'Chauk': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
  ],
  'Kyaukse': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
  ],
  'Amarapura': [
    { name: 'Fire Department', phone: '191' },
    { name: 'Ambulance', phone: '192' },
    { name: 'Police', phone: '199' },
  ],
};

export const cities = Object.keys(emergencyPhones).sort();

export function getPhonesByCity(city) {
  return emergencyPhones[city] || [];
}

export default emergencyPhones;
