export const districtsByState = {
  'Kerala': [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
    'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
    'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod',
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Tirunelveli', 'Vellore', 'Erode', 'Thoothukudi', 'Dindigul',
    'Thanjavur', 'Ranipet', 'Sivaganga', 'Virudhunagar', 'Namakkal',
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
    'Rajahmundry', 'Tirupati', 'Kakinada', 'Anantapur', 'Vizianagaram',
    'Eluru', 'Ongole', 'Kadapa', 'Srikakulam',
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam',
    'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet',
    'Siddipet', 'Jagtial', 'Mancherial', 'Medak',
  ],
};

export const allStates = Object.keys(districtsByState);

/** Returns districts for one state, or all districts if state is empty/null */
export const getDistricts = (state) =>
  state ? (districtsByState[state] || []) : Object.values(districtsByState).flat().sort();
