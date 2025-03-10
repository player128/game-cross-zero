"use client";

import { AuthFormLayout } from "../ui/auth-form-layout";
import { AuthFields } from "../ui/fields";
import { SubmitButton } from "../ui/submit-button";
import { BottomLink } from "../ui/bottom-link";
import { ErrorMessage } from "../ui/error-message";
import { signInAction, SignInFormState } from "../actions/sing-in";
import { useActionState } from "@/shared/lib/react";

export  function SignInForm() {
    const [formState, action, isPending] = useActionState(signInAction, {} as SignInFormState);

    return (
        <AuthFormLayout
            title="Sign In"
            description="Wellcome back! Please sign in to your account"
            action={action}
            fields={<AuthFields {...formState}/>}
            actions={<SubmitButton isPending={isPending}>Sign Up</SubmitButton>}
            error={<ErrorMessage error={formState.errors?._errors}/>}
            link={<BottomLink
                linkText="Sign Up"
                text="Don't have an account?"
                url="/sign-up"
            />}
        />
    );
}