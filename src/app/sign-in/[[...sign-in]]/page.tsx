// Path: src/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <SignIn appearance={{ elements: { formButtonPrimary: 'bg-primary hover:bg-primary/90 text-white' } }} />
    </div>
  );
}