"use client";

import { AuthFormLayout } from "../ui/auth-form-layout";
import { AuthFields } from "../ui/fields";
import { SubmitButton } from "../ui/submit-button";
import { BottomLink } from "../ui/bottom-link";
import { ErrorMessage } from "../ui/error-message";
import { useActionState } from "@/shared/lib/react";
import { signUpAction, SignUpFormState } from "../actions/sign-up";

export  function SignUpForm() {
    const [formState, action, isPending] = useActionState(signUpAction, {} as SignUpFormState);

    return (
        <AuthFormLayout
            title="Sign Up"
            description="Create your account to get started"
            action={action}
            fields={<AuthFields {...formState}/>}
            actions={<SubmitButton isPending={isPending}>Sign Up</SubmitButton>}
            error={<ErrorMessage error={formState.errors?._errors}/>}
            link={<BottomLink
                linkText="Sign in"
                text="Already have an account?"
                url="/sign-in"
            />}
        />
    );
}