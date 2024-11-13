import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: 'Message must be at least 10 characters.',
    })
    .max(350, {
      message: 'Message must not be longer than 350 characters.',
    }),
});

export default function StaffMessaging() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: '',
    },
  });

  const [activePatient, setActivePatient] = useState('John Doe');
  const [messages] = useState({
    'John Doe': [
      {
        id: 1,
        sender: 'John Doe',
        content: 'Hello, I have a question about my medication.',
        timestamp: '2023-05-10 09:30',
      },
      {
        id: 2,
        sender: 'Dr. Smith',
        content:
          'Hello John! What would you like to know about your medication?',
        timestamp: '2023-05-10 10:15',
      },
      {
        id: 3,
        sender: 'John Doe',
        content: 'Is it safe to take it with food?',
        timestamp: '2023-05-10 10:20',
      },
    ],
    'Jane Smith': [
      {
        id: 1,
        sender: 'Jane Smith',
        content:
          'Hi, I am experiencing some side effects from my new prescription.',
        timestamp: '2023-05-11 14:00',
      },
    ],
    'Bob Johnson': [
      {
        id: 1,
        sender: 'Bob Johnson',
        content: 'When will my test results be ready?',
        timestamp: '2023-05-12 11:45',
      },
    ],
  });

  function handleSendMessage(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Patient Messages</CardTitle>
          <CardDescription>
            View and respond to patient messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[630px]">
            <div className="w-1/3 border-r pr-4">
              <Label>Select Patient</Label>
              <Select value={activePatient} onValueChange={setActivePatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(messages).map((patient) => (
                    <SelectItem key={patient} value={patient}>
                      {patient}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ScrollArea className="h-[500px] mt-4">
                {Object.entries(messages).map(([patient, msgs]) => (
                  <div key={patient} className="mb-4">
                    <h3 className="font-semibold">{patient}</h3>
                    <p className="text-sm text-gray-500">
                      {msgs[msgs.length - 1].content.substring(0, 50)}...
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="w-2/3 pl-4">
              <ScrollArea className="h-[500px] pr-4">
                {/* @ts-expect-error */}
                {messages[activePatient].map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-4 mb-4 ${
                      message.sender === 'Dr. Smith' ? 'justify-end' : ''
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback>{message.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 max-w-[70%] ${
                        message.sender === 'Dr. Smith'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      <p className="font-semibold">{message.sender}</p>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSendMessage)}
                  className="w-full space-y-4"
                >
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Type your response here"
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
