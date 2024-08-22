import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

const AuthContext = createContext({
  user: null,
  avatar: null,
  getUser: () => {},
  getAvatar: () => {},
  updateUser: () => {},
  updateAvatar: () => {},
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  async function getUser() {
    const res = await axios.get('/users/me');
    const nextUser = res.data;
    setUser(nextUser);
  }

  async function updateUser({ name, email }) {
    await axios.patch('user/me', { name, email });
  }

  async function getAvatar() {
   const res = await axios.get('/users/me/avatar');
   const nextAvatar = res.data;
   setAvatar(nextAvatar);
  }

  async function updateAvatar({ avatar }) {
    const res = await axios.patch('/users/me/avatar', avatar);
    const nextAvatar = res.data;
    setAvatar(nextAvatar);
  }

  async function login({ email, password }) {
    await axios.post('/users/auth/login', { email, password });
    await getUser();
    await getAvatar();
  }

  async function logout() {
    await axios.delete('/auth/logout');
  }

  useEffect(() => {
    getUser()
    getAvatar()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      avatar,
      updateUser,
      updateAvatar,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider.');
  }
  return context;
}