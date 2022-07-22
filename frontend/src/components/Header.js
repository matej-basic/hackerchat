import React from 'react'
import axios from 'axios'

const Header = props => {
    const submitHandler = async () => {
        axios.post('https://hackerchat.ml/api/users/signout', {})
        .then(res => {
            console.log(res.data);
            props.onChange(null);
        }).catch(err => {
            console.log(err);
        })
    }

  return (
    <div className='header-container'>
        <div className='hello-button'>SIGNED IN AS: {props.user.email}</div>
        <div className='sign-out-button' onClick={() => submitHandler()}>SIGN OUT</div>
    </div>
  )
}

export default Header
