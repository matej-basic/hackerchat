import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const SignupForm = props => {
  const [details, setDetails] = useState({email:"", password:""});
  
  const SignUp = async (details) => {
    axios.post('https://hackerchat.apps.lab.okd.local/api/users/signup', details)
      .then(res => {
        setDetails(details);
        props.onChange(details);
      }).catch(err => {
        console.log(err);
      })
  }

    const submitHandler = e => {
        e.preventDefault();
        SignUp(details);
    }
  return (
    <div>
      <form className='login-form' onSubmit={submitHandler}>
            <input type="text" name="email" placeholder="Username" id="email" className="inp" onChange={e => setDetails({...details, email: e.target.value})} value={details.email} /> <br />
            <input type="password" name="password" placeholder="Password" id="password" className="inp" onChange={e => setDetails({...details, password: e.target.value})} value={details.password} /> <br />
            <input type="submit" value="SIGN UP" className='sub-btn' />
        </form>
    </div>
  )
}

export default SignupForm
