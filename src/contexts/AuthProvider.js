import {createContext, useContext, useEffect, useState} from "react";
import axios from "../lib/axios";

const AuthContext = createContext({
  user: null,
  avatar: null,
  updateUser: () => {},
  updateAvatar: () => {},
  handleLogin: () => {},
  handleLogout: () => {},
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  async function getUser() {
    try {
      const res = await axios.get('/users/me');
      const nextUser = res.data;
      setUser(nextUser);
    } catch (error) {
      throw new Error('사용자 정보를 불러올 수 없습니다.');
    }
  }

  async function updateUser({ name, email }) {
    const res = await axios.patch('/user/me', { name, email });
    const nextUser = res.data;
    setUser(nextUser);
  }

  async function getAvatar() {
    try {
      const res = await axios.get('/users/me/avatar');
      const nextAvatar = res.data;
      setAvatar(nextAvatar);
    } catch (error) {
      throw new Error('아바타를 불러올 수 없습니다.');
    }
  }

  async function updateAvatar(avatar) {
    const res = await axios.patch('/users/me/avatar', avatar);
    const nextAvatar = res.data;
    setAvatar(nextAvatar);
  }

  async function handleLogin({ email, password }) {
    await axios.post('/auth/login', { email, password });
    await getUser();
    await getAvatar();
  }

  async function handleLogout() {
    await axios.delete('/auth/logout');
  }

  useEffect(() => {
    if(user){
      getUser()
      getAvatar()
    }

  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      avatar,
      updateUser,
      updateAvatar,
      handleLogin,
      handleLogout,
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