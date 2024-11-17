import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthProvider';
import api from '@/lib/utils';
import { IMessageResponse, IRecipientResponse } from '@/lib/types';

const FormSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: 'Message must be at least 10 characters.',
    })
    .max(350, {
      message: 'Message must not be longer than 350 characters.',
    }),

  recipient: z.string({ required_error: 'Please select a recipient.' }),
});

export default function PatientMessaging() {
  const auth = useAuth();

  const [messages, setMessages] = useState<IMessageResponse[]>([]);
  const [recipients, setRecipients] = useState<IRecipientResponse[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: '',
      recipient: '',
    },
  });

  useEffect(() => {
    async function fetchRecipients() {
      try {
        const response = await api.get('/accounts/recipients');
        setRecipients(response.data);
      } catch (error) {
        console.error('Error fetching recipients:', error);
        toast.error('Failed to load recipients');
      }
    }

    fetchRecipients();
  }, []);

  const selectedRecipient = form.watch('recipient'); // Övervaka recipient-fältet

  useEffect(() => {
    async function fetchMessages() {
      if (!selectedRecipient) return; // Kontrollera att mottagaren är vald

      try {
        const response = await api.get(
          `/messages/${auth.getUser()?.id}/conversation/${+selectedRecipient}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    }

    fetchMessages();
  }, [auth, selectedRecipient]);

  // const [messages] = useState([
  //   {
  //     id: 1,
  //     sender: 'You',
  //     recipient: 'Dr. Smith',
  //     content: 'Hello, I have a question about my medication.',
  //     timestamp: '2023-05-10 09:30',
  //   },
  //   {
  //     id: 2,
  //     sender: 'Dr. Smith',
  //     recipient: 'You',
  //     content: 'Hello! What would you like to know about your medication?',
  //     timestamp: '2023-05-10 10:15',
  //   },
  //   {
  //     id: 3,
  //     sender: 'You',
  //     recipient: 'Dr. Smith',
  //     content: 'Is it safe to take it with food?',
  //     timestamp: '2023-05-10 10:20',
  //   },
  //   {
  //     id: 4,
  //     sender: 'Dr. Smith',
  //     recipient: 'You',
  //     content:
  //       'Yes, it is perfectly safe to take your medication with food. In fact, taking it with a meal can help reduce potential stomach upset.',
  //     timestamp: '2023-05-10 11:05',
  //   },
  // ]);

  async function handleSendMessage(data: z.infer<typeof FormSchema>) {
    console.log(data);
    try {
      const response = await api.post('/messages/send', {
        senderId: auth.getUser()?.id ?? -1,
        recipientId: +data.recipient,
        message: data.content,
      });

      // Update messages in real-time
      setMessages((prev) => [...prev, response.data]);
      form.reset({
        content: '',
        recipient: data.recipient,
      });
      toast.success('Message sent successfully');
    } catch (error) {
      console.log(error);
      toast('Server error');
    }
  }

  return (
    <div className="max-w-6xl p-4 mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>
            Communicate with your healthcare providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-4 mb-4 ${
                  msg.senderId === auth.getUser()?.id ? 'justify-end' : ''
                }`}
              >
                <Avatar>
                  <AvatarFallback>
                    {msg.senderId === auth.getUser()?.id
                      ? 'Y'
                      : msg.senderName[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 max-w-[70%] ${
                    msg.senderId === auth.getUser()?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  <p className="font-semibold">
                    {msg.senderId === auth.getUser()?.id
                      ? 'You'
                      : msg.senderName}
                  </p>
                  <p className="text-sm">{msg.message}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSendMessage)}
              className="w-full space-y-4"
            >
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Send message to:</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {recipients.map((recipient) => (
                            <SelectItem
                              key={recipient.id}
                              value={recipient.id.toString()}
                            >
                              {recipient.name} ({recipient.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your message:</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
