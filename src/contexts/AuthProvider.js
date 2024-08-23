import {createContext, useContext, useEffect, useState} from "react";
import axios from "../lib/axios";

const AuthContext = createContext({
  user: null,
  avatar: null,
  createUser: () => {},
  updateUser: () => {},
  updateAvatar: () => {},
  handleLogin: () => {},
  handleLogout: () => {},
});

export function AuthProvider({ children }) {
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

  async function createUser({ name, email, password }) {
    await axios.post('/users', { name, email, password });
  }

  async function updateUser({ name, email }) {
    try {
      const res = await axios.patch('/user/me', { name, email });
      const nextUser = res.data;
      setUser(nextUser);
    } catch (error) {
      throw new Error('사용자 정보를 수정할 수 없습니다.');
    }

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
    try {
      const res = await axios.patch('/users/me/avatar', avatar);
      const nextAvatar = res.data;
      setAvatar(nextAvatar);
    } catch (error) {
      throw new Error('아바타를 수정할 수 없습니다.')
    }

  }

  async function handleLogin({ email, password }) {
    try {
      await axios.post('/auth/login', { email, password });
      await getUser();
      await getAvatar();
    } catch (error) {
      throw new Error(error.response.data);
    }
  }

  async function handleLogout() {
    await axios.delete('/auth/logout');
  }

  useEffect(() => {
    if(user){
      getUser().then()
      getAvatar().then()
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      avatar,
      createUser,
      updateUser,
      updateAvatar,
      handleLogin,
      handleLogout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { // 커스텀 훅 만들기
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider.');
  }
  return context;
}