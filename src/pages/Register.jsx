import { createResource, createSignal } from 'solid-js'
import { useNavigate, A } from '@solidjs/router'
import { ofetch } from 'ofetch'
const [username, setUsername] = createSignal('')
const [password, setPassword] = createSignal('')
const [passwordRep, setPasswordRep] = createSignal('')
const [invetationCode, setInvetationCode] = createSignal('')
const [message, setMessage] = createSignal(' ')
const [valid, setValid] = createSignal(false)

const signUp = async () => {
  const res = await ofetch('/api/register', {
    method: 'POST',
    body: {
      uname: username(),
      psw: password(),
      invetationCode: invetationCode()
    }
  })
  return res
}

const checkPassword = e => {
  setPasswordRep(e.target.value)
  console.log(passwordRep())
  if (password() != passwordRep()) {
    setMessage(
      'repeated password is different ' + password() + ' ' + passwordRep()
    )
    setValid(false)
  } else {
    setMessage('')
    setValid(true)
  }
}

function Register () {
  const navigate = useNavigate()

  const register = async () => {
    if (valid()) {
      const res = await signUp()
      if (res?.success === true) {
        sessionStorage.setItem('token', res.token)
        sessionStorage.setItem('username', res.username)
        //navigate('/home')
        window.location.href = '/home'
      } else {
        console.log(res)
        setMessage(res.message)
        setUsername('')
        setPassword('')
        setPasswordRep('')
      }
    } else {
      setMessage('something is not right')
    }
  }

  return (
    <div class='container'>
      <label for='invetation-code'>
        <b>Invetation Code</b>
      </label>
      <input
        type='text'
        placeholder='Enter Invetation Code'
        name='invetation'
        required
        onchange={e => {
          setInvetationCode(e.target.value)
        }}
        oninput={e => {
          setMessage(' ')
        }}
      />

      <label for='newuname'>
        <b>Username</b>
      </label>
      <input
        type='text'
        value={username()}
        placeholder='Enter Username'
        name='newuname'
        autocomplete='do-not-autofill'
        required
        onchange={e => {
          setUsername(e.target.value)
        }}
        oninput={e => {
          setMessage(' ')
        }}
      />

      <label for='newpsw'>
        <b>Password</b>
      </label>

      <input
        type='password'
        placeholder='Enter Password'
        autocomplete='do-not-autofill'
        value={password()}
        name='newpsw'
        required
        onchange={e => {
          setPassword(e.target.value)
        }}
        oninput={e => {
          setMessage(' ')
        }}
      />

      <label for='pswrep'>
        <b>Repeat Password</b>
      </label>

      <input
        type='password'
        placeholder='Repeat Password'
        value={passwordRep()}
        autocomplete='do-not-autofill'
        name='pswrep'
        required
        oninput={e => {
          setMessage(' ')
          checkPassword(e)
        }}
      />

      <p style='min-height: 28px; color: red'>{message()} </p>

      <button onclick={() => register()}>Sign In</button>
      <p>
        back to
        <A href='/login'> Login</A>.
      </p>
    </div>
  )
}
export default Register
