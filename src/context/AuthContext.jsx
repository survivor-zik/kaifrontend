// import { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authAPI } from '../api/auth';
// import { Toaster, toast } from 'sonner';
// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       setIsAuthenticated(false);

//       setTimeout(() => {
//         toast.error("Authentication required!")   
//       }, 3000);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const { valid } = await authAPI.verifyToken(token);
//       setIsAuthenticated(valid);
//     } catch (error) {
//       setIsAuthenticated(false);
//       localStorage.removeItem('token');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const login = async (credentials) => {
//     try {
//       const result = await authAPI.login(credentials);
//       if (result.success) {
//         toast.success("Login successful!")     
//         setTimeout(() => {
//           setIsAuthenticated(true);
//           navigate('/apikeys');
//         }, 2000);
//       }
//       return result;
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.message || 'Login failed'
//       };
//     }
//   };

//   const logout = () => {
//     authAPI.logout();
//     setIsAuthenticated(false);
//     navigate('/login');
//   };

//   return (
//     <AuthContext.Provider value={{
//       isAuthenticated,
//       isLoading,
//       error,
//       login,
//       logout
//     }}>
//       {children}
//       <Toaster visibleToasts={1} richColors position='bottom-center'/>
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };


import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  
  
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); 
    setIsLoading(false);
  };



  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const result = await authAPI.login(credentials);
      if (result.success) {
        toast.success("Login successful!");
        setIsAuthenticated(true);
        navigate('/apikeys');
      }
      return result;
    } catch (error) {
      const errorMessage = error?.message || 'Login failed';
      toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    localStorage.clear();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      error,
      login,
      logout
    }}>
      {children}
      <Toaster richColors position="bottom-center" />
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}