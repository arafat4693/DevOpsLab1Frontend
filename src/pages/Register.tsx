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
import { useAuth } from '@/context/AuthProvider';

const formSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(2, { message: 'Must be 2 or more characters long' })
    .max(15, { message: 'Must be 15 or fewer characters long' }),
  password: z
    .string()
    .min(4, { message: 'Must be 4 or more characters long' })
    .max(15, { message: 'Must be 15 or fewer characters long' }),
});

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const isLoggedIn = auth.userIsAuthenticated();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const response = await api.post('/auth/signup', {
        email: values.email,
        password: values.password,
        name: values.name,
      });
      toast(response.data);
      navigate('/login', { replace: true });
    } catch (error) {
      console.log(error);
      // @ts-ignore
      toast('Sign up failed: ' + error.message);
    }
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <Card className="w-[450px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <Button className="w-full">Register</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <span className="font-semibold cursor-pointer text-main-color hover:underline">
              <Link to="/login">Login</Link>
            </span>{' '}
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
