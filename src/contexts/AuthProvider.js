import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const AuthContext = createContext({
  user: null,
  avatar: null,
  handleLogin: () => {},
  handleLogout: () => {},
  updateUser: () => {},
  updateAvatar: () => {},
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

  async function getAvatar() {
    try {
      const res = await axios.get('/users/me/avatar');
      const nextAvatar = res.data;
      setAvatar(nextAvatar);
    } catch (error) {
      throw new Error('아바타를 불러올 수 없습니다.');
    }
  }

  async function handleLogin({ email, password }) {
    try {
      await axios.post('/auth/login', { email, password });
      await getUser();
      await getAvatar();
    } catch (error) {
      throw new Error('로그인에 실패했습니다.');
    }
  }

  async function handleLogout() {
    try {
      await axios.delete('/auth/logout');
    } catch (error) {
      throw new Error(error.response.data);
    }
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

  async function updateAvatar(avatar) {
    try {
      const res = await axios.patch('/users/me/avatar', avatar);
      const nextAvatar = res.data;
      setAvatar(nextAvatar);
    } catch (error) {
      throw new Error('아바타를 수정할 수 없습니다.')
    }
  }

  useEffect(() => {
    if(user){
      getUser().then()
      getAvatar().then()
    }
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      avatar,
      handleLogin,
      handleLogout,
      updateUser,
      updateAvatar,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(required) { // 커스텀 훅 만들기
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider.');
  }

  useEffect(() => {
    if (required && !context.user) {
      navigate('/login')
    }
  }, [context.user, navigate, required]);
  return context;
}