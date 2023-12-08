import { createResource, createSignal } from 'solid-js'
import { useNavigate, A } from '@solidjs/router'
import { ofetch } from 'ofetch'

const [username, setUsername] = createSignal('')
const [password, setPassword] = createSignal('')
const [message, setMessage] = createSignal(' ')

const signIn = async () => {
  const res = await ofetch('/api/login', {
    method: 'POST',
    body: { uname: username(), psw: password() }
  })
  return res
}

function Login () {
  console.log('login component')
  const navigate = useNavigate()

  
  const authenticate = async () => {
    const res = await signIn()
    if (res?.success === true) {
     
      console.log("is authenticated")
      navigate('/diary')
    } else {
      setMessage('login failed')
    }
  }

  const checkEnter=(e)=>{
    if (e.key == 'Enter')
      authenticate()
  }

  return (
    <div class='container'>
      <label for='uname'>
        <b>Username</b>
      </label>
      <input
        type='text'
        placeholder='Enter Username'
        name='uname'
        required
        onchange={e => {
          setUsername(e.target.value)
        }}
        oninput={e => {
          setMessage(' ')
        }}
      />

      <label for='psw'>
        <b>Password</b>
      </label>

      <input
        type='password'
        placeholder='Enter Password'
        name='psw'
        required
        onchange={e => {
          setPassword(e.target.value)
        }}
        oninput={e => {
          
          setMessage(' ')
        }}
        on:keyup={(e)=>checkEnter(e)}
      />
      <p style='min-height: 28px; color: red'>{message()} </p>

      <button onclick={() => authenticate()}>Sign In</button>

      <p>
        got invetation code? click
        <A href='/register'> Here </A>
        to create an account.
      </p>
    </div>
  )
}
export default Login
