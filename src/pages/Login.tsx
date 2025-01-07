import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/lib/utils';
import { CurrentUser } from '@/lib/types';
import { useAuth } from '@/context/AuthProvider';
import { useKeycloak } from '@react-keycloak/web';

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: 'Must be 4 or more characters long' })
    .max(15, { message: 'Must be 15 or fewer characters long' }),
});

export default function Login() {
  const auth = useAuth();
  const isLoggedIn = auth.userIsAuthenticated();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'demo@gmail.com',
      password: 'demo',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const response = await api.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      const { id, email, name, role, token } = response.data;

      const authenticatedUser: CurrentUser = { id, email, name, role, token };

      auth.userLogin(authenticatedUser);

      keycloak.login({
        redirectUri: 'https://labfr.app.cloud.cbh.kth.se',
      });

      // toast('Successfully logged in');

      // navigate('/', { replace: true });
    } catch (error) {
      console.log(error);
      toast('Invalid credentials');
    }
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <Card className="w-[450px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="m@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full">Log In</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <span className="font-semibold cursor-pointer text-main-color hover:underline">
              <Link to="/register">Register</Link>
            </span>{' '}
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
