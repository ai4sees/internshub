import {jwtDecode} from 'jwt-decode';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token'); // Or sessionStorage
  if (!token) return null;
  
  try {
    const decodedToken = jwtDecode(token);
    // console.log(decodedToken);
    return decodedToken.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default getUserIdFromToken;