import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/shared/schemas/auth';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ErrorMessage } from '../components/ui/form-error';

const signupFormSchema = signupSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords must match',
    path: ['confirmPassword'],
  });
type SignupForm = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const { signupMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: SignupForm) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData, { onSuccess: () => navigate('/groups') });
  };

  return (
    <Layout>
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
              <ErrorMessage error={signupMutation.error} />
              <div className="grid gap-2">
                <label>
                  Email
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="user@example.com"
                  />
                  <ErrorMessage error={errors.email} />
                </label>
              </div>
              <div className="grid gap-2">
                <label>
                  Password
                  <Input type="password" {...register('password')} />
                  <ErrorMessage error={errors.password} />
                </label>
              </div>

              <div className="grid gap-2">
                <label>
                  Confirm password
                  <Input type="password" {...register('confirmPassword')} />
                  <ErrorMessage error={errors.confirmPassword} />
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full"
            >
              {signupMutation.isPending ? 'Signing up...' : 'Sign up'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Layout>
  );
}
