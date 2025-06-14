
import {useSearchParams} from "react-router-dom"
import UPForm from "../../../components/upform/UPForm"

function Login() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  return <UPForm method="login" redirect={redirectTo} />
}

export default Login
