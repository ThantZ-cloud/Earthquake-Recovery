// Searchable content index for the entire website
// Each entry maps to a page/section users can search for

const siteSearchData = [
  // Map & Earthquake Data
  { title: 'Live Earthquake Map', keywords: ['map', 'live', 'earthquake', 'tracking', 'USGS', 'seismic'], section: 'Home', path: '/' },
  { title: 'Tectonic Plates', keywords: ['plates', 'tectonic', 'boundaries', 'faults', 'crust', 'ring of fire'], section: 'Home', path: '/' },
  { title: 'Magnitude Scale', keywords: ['magnitude', 'richter', 'moment magnitude', 'scale', 'measure'], section: 'Home', path: '/' },

  // Safety
  { title: 'Drop, Cover, Hold On', keywords: ['drop', 'cover', 'hold on', 'safety', 'earthquake safety', 'during earthquake'], section: 'Home', path: '/' },
  { title: 'Emergency Kit', keywords: ['emergency kit', 'preparedness', 'supplies', 'first aid', 'water', 'food'], section: 'Home', path: '/' },
  { title: 'Evacuation Guide', keywords: ['evacuation', 'escape', 'exit', 'emergency exit', 'shelter'], section: 'Home', path: '/' },
  { title: 'If Inside During Earthquake', keywords: ['inside', 'building', 'indoors', 'table', 'desk', 'stay inside'], section: 'Home', path: '/' },
  { title: 'If Outside During Earthquake', keywords: ['outside', 'open area', 'outdoors', 'street', 'buildings'], section: 'Home', path: '/' },
  { title: 'If in a Vehicle', keywords: ['car', 'vehicle', 'driving', 'bridge', 'parking'], section: 'Home', path: '/' },
  { title: 'Near the Coast', keywords: ['coast', 'tsunami', 'higher ground', 'beach', 'ocean'], section: 'Home', path: '/' },
  { title: 'After an Earthquake', keywords: ['after', 'aftershock', 'injuries', 'PTSD', 'turn off gas', 'utilities'], section: 'Home', path: '/' },

  // Recovery
  { title: 'Search & Rescue', keywords: ['rescue', 'search', 'first 72 hours', 'trapped'], section: 'Recovery', path: '/recovery' },
  { title: 'Emergency Medical Aid', keywords: ['medical', 'hospital', 'field hospital', 'injuries', 'disease'], section: 'Recovery', path: '/recovery' },
  { title: 'Shelter & Food', keywords: ['shelter', 'food', 'water', 'temporary shelter', 'displaced'], section: 'Recovery', path: '/recovery' },
  { title: 'Debris Removal', keywords: ['debris', 'rubble', 'clearing', 'cleanup'], section: 'Recovery', path: '/recovery' },
  { title: 'Psychosocial Support', keywords: ['mental health', 'counseling', 'trauma', 'psychosocial', 'support'], section: 'Recovery', path: '/recovery' },
  { title: 'Rebuilding Infrastructure', keywords: ['rebuild', 'infrastructure', 'roads', 'bridges', 'schools'], section: 'Recovery', path: '/recovery' },
  { title: 'Economic Recovery', keywords: ['economic', 'livelihood', 'business', 'jobs', 'grants'], section: 'Recovery', path: '/recovery' },
  { title: 'Community Preparedness', keywords: ['preparedness', 'early warning', 'drills', 'community'], section: 'Recovery', path: '/recovery' },

  // Historical Earthquakes
  { title: '1960 Valdivia Earthquake', keywords: ['valdivia', 'chile', '1960', 'largest', '9.5', 'tsunami'], section: 'History', path: '/history' },
  { title: '1964 Alaska Earthquake', keywords: ['alaska', '1964', 'good friday', '9.2', 'anchorage'], section: 'History', path: '/history' },
  { title: '2004 Indian Ocean Earthquake', keywords: ['indian ocean', '2004', 'sumatra', '9.2', 'tsunami', '230000'], section: 'History', path: '/history' },
  { title: '2011 Japan Earthquake', keywords: ['japan', '2011', 'tohoku', '9.1', 'fukushima', 'nuclear'], section: 'History', path: '/history' },
  { title: 'Bago Earthquake', keywords: ['bago', 'pegu', 'myanmar', '1930', '7.3'], section: 'History', path: '/history' },
  { title: 'Sagaing-Mandalay Earthquake', keywords: ['sagaing', 'mandalay', 'myanmar', '1946', '7.8', 'fault'], section: 'History', path: '/history' },
  { title: 'Ava Earthquake', keywords: ['ava', 'innwa', 'myanmar', '1839', '8.3', 'ancient capital'], section: 'History', path: '/history' },
  { title: '1952 Severo-Kurilsk Earthquake', keywords: ['russia', '1952', 'kurilsk', '9.0', 'tsunami', '18 meters'], section: 'History', path: '/history' },
  { title: '2010 Maule Earthquake', keywords: ['maule', 'chile', '2010', '8.8', 'tsunami warning', '53 countries'], section: 'History', path: '/history' },

  // Quiz
  { title: 'Earthquake Knowledge Quiz', keywords: ['quiz', 'test', 'knowledge', 'questions', 'learn'], section: 'Quiz', path: '/quiz' },

  // Donate
  { title: 'Donate', keywords: ['donate', 'donation', 'bitcoin', 'ethereum', 'paypal', 'KBZ pay', 'wave pay', 'support'], section: 'Donate', path: '/donate' },

  // Tsunami
  { title: 'Tsunami Information', keywords: ['tsunami', 'waves', 'coastal flooding', 'tsunami safety', 'tsunami warning'], section: 'Home', path: '/' },
  { title: 'Volcano Information', keywords: ['volcano', 'eruption', 'lava', 'ashfall', 'lahars', 'pyroclastic'], section: 'Home', path: '/' },

  // Earthquake Science
  { title: 'How Earthquakes Happen', keywords: ['how', 'tectonic plates', 'stress', 'fault', 'seismic waves', 'crust'], section: 'Home', path: '/' },
  { title: 'Seismic Zones', keywords: ['seismic zone', 'ring of fire', 'alpine himalayan', 'plate boundaries', 'intraplate'], section: 'Home', path: '/' },
  { title: 'Seismograph', keywords: ['seismograph', 'measurement', 'instrument', 'recording', 'waves'], section: 'Home', path: '/' },
  { title: 'Mercalli Intensity Scale', keywords: ['intensity', 'mercally', 'MMI', 'damage', 'effects', 'observed'], section: 'Home', path: '/' },
];

export default siteSearchData;
