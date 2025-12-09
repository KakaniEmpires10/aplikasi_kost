"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "../auth.constant"
import { z } from "zod"
import { LoaderCircle, Save } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import toast from "react-hot-toast"

const SignInForm = ({ tab }: { tab?: boolean }) => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard",
      }, {
        onSuccess() {
          form.reset()
          toast.success("Login successful!")
        },
        onError(ctx) {
          toast.error("Login failed: " + ctx.error.message)
        },
      })
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="me@gmail.com"
                  tabIndex={tab ? -1 : 0}
                  type="email"
                  {...field} />
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
                <PasswordInput tabIndex={tab ? -1 : 0} placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          disabled={form.formState.isSubmitting}
          aria-disabled={form.formState.isSubmitting}
          className="w-full" 
          tabIndex={tab ? -1 : 0} 
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Save />
          )}
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default SignInForm