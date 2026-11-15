import AuthForm from "../components/AuthForm";
import { AuthLayout } from "./Login";

export default function Register({
  onSubmit,
  onSwitch,
  error,
  busy,
}) {
  return (
    <AuthLayout>
      <AuthForm
        mode="register"
        onSubmit={onSubmit}
        onSwitch={onSwitch}
        error={error}
        busy={busy}
      />
    </AuthLayout>
  );
}
