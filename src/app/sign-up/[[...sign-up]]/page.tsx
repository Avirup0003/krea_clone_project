// Path: src/app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <SignUp appearance={{ elements: { formButtonPrimary: 'bg-primary hover:bg-primary/90 text-white' } }} />
    </div>
  );
}