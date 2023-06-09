import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";

export function AnonymousSignIn() {
  const anonymousSignIn = () => {
    signInAnonymously(auth);
  };

  return (
    <button className="sign-in-button" onClick={anonymousSignIn}>
      <p>サインインせず使う</p>
    </button>
  );
}
