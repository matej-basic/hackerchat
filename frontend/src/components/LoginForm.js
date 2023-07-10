import React, { useState } from 'react'
import axios from 'axios';

const LoginForm = props => {

  const [details, setDetails] = useState({email:"", password:""});

  const LogIn = async (details) => {
    axios.post('https://hackerchat.apps.lab.okd.local/api/users/signin', details)
      .then(res => {
        setDetails(details);
        props.onChange(details);
      }).catch(err => {
        console.log(err);
      })
  }
    const submitHandler = e => {
        e.preventDefault();
        LogIn(details);
    }
  return (
    <div>
      <form className='login-form' onSubmit={submitHandler}>
            <input type="text" name="email" placeholder="Username" id="email" className="inp" onChange={e => setDetails({...details, email: e.target.value})} value={details.email} /> <br />
            <input type="password" name="password" placeholder="Password" id="password" className="inp" onChange={e => setDetails({...details, password: e.target.value})} value={details.password} /> <br />
            <input type="submit" value="LOGIN" className='sub-btn' />
        </form>
    </div>
  )
}

export default LoginForm
