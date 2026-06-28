import { useState } from "react"
import LogoGeosoftsolutions from "../assets/smc.png"
import ChangeFirstPassword from "../components/login/ChangeFirstPassword"
import LoginComponent from "../components/login/Login"

function Login() {
    
  const [isFirstTime, setFirstTime] = useState<Boolean>(false);
  const [userEmail, setUserEmail] = useState<String>("");

  return (
    <div className="h-[100vh] w-full rounded-lg bg-azulito shadow-xl">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="h-[calc(82vh)] w-[35vw] rounded-lg border-gray-700 bg-white shadow-xl">
          <div className="space-y-4 p-6 sm:p-4 md:space-y-4">
            <img
              className="mx-auto h-auto w-[220px]"
              src={LogoGeosoftsolutions}
              alt="logo"
            />

            {isFirstTime ? (
              <ChangeFirstPassword
                userEmail={userEmail}
              />
            ) : (
              <LoginComponent
                setFirstTime={setFirstTime}
                setUserEmail={setUserEmail}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
