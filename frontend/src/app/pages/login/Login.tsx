
import {useSearchParams} from "react-router-dom"
import UPForm from "../../../components/upform/UPForm"

function Login() {
  const [searchParams] = useSearchParams()
  const redirect= searchParams.get('redirect') || '/'

  return <UPForm method="login" redirect={redirect} />
}

export default Login
