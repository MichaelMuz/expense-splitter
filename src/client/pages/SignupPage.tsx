import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/shared/schemas/auth';
import { z } from 'zod';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const signupFormSchema = signupSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, { message: "Passwords must match", path: ["confirmPassword"] });
type SignupForm = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const { signupMutation } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupFormSchema),
    mode: "onBlur"
  })

  const onSubmit = (data: SignupForm) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData, { onSuccess: () => navigate('/groups') });
  };

  return (
    <Layout >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sign up</CardTitle>
              <Button asChild variant="link">
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {signupMutation.isError && <p>{signupMutation.error.message}</p>}
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

              <div className="grid gap-2">
                <label>Confirm password
                  <Input type="password" {...register("confirmPassword")} />
                  {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" disabled={signupMutation.isPending} className="w-full">
              {signupMutation.isPending ? 'Signing up...' : 'Sign up'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Layout >
  );
}
