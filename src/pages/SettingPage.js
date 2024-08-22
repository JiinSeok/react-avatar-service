import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Label from '../components/Label';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './SettingPage.module.css';
import {useAuth} from "../contexts/AuthProvider";

function SettingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth()
  const [values, setValues] = useState({
    name: user.name,
    email: user.email,
  });


  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { name, email } = values;
    await updateUser({ name, email });
    navigate('/me');
  }

  return (
    <>
      <h1 className={styles.Heading}>프로필 편집</h1>
      <form onSubmit={handleSubmit}>
        <Label className={styles.Label} htmlFor="name">
          이름
        </Label>
        <Input
          id="name"
          className={styles.Input}
          name="name"
          type="text"
          placeholder="이름"
          value={values.name}
          onChange={handleChange}
        />
        <Label className={styles.Label} htmlFor="email">
          이메일
        </Label>
        <Input
          id="email"
          className={styles.Input}
          name="email"
          type="email"
          placeholder="이메일"
          value={values.email}
          onChange={handleChange}
        />
        <Button className={styles.Button}>적용하기</Button>
      </form>
    </>
  );
}

export default SettingPage;
