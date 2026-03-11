import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/shared/schemas/auth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function LoginPage() {
  const { loginMutation } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur"
  })

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data, { onSuccess: () => navigate('/groups') });
  };

  return (
    <Layout >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Login to your account</CardTitle>
              <Button asChild variant="link">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {loginMutation.isError && <p>{loginMutation.error.message}</p>}
              <div className="grid gap-2">
                <label>Email
                  <Input type="email" {...register("email")} placeholder="user@example.com" />
                  {errors.email && <p>{errors.email.message}</p>}
                </label>
              </div>
              <div className="grid gap-2">
                <label>Password
                  <Input type="password" {...register("password")} />
                  {errors.password && <p>{errors.password.message}</p>}
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" disabled={loginMutation.isPending} className="w-full">
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Layout >
  );
}
