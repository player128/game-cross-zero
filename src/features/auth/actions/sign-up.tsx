'use server';

import { createUser, sessionServise } from "@/entities/user/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export type SignUpFormState = {
    formData?: FormData,
    errors?: {
        login?: string,
        password?: string,
        _errors?: string,
    }
}

const FormDataSchema = z.object({
    login: z.string().min(3),
    password: z.string().min(3),
});

export const signUpAction = async (state: unknown, formData: FormData): Promise<SignUpFormState> => {
    const data = Object.fromEntries(formData.entries());
    const result = FormDataSchema.safeParse(data);

    if (!result.success) {
        const formatedErrors = result.error.format();

        return {
            formData,
            errors: {
                login: formatedErrors.login?._errors.join(', '),
                password: formatedErrors.password?._errors.join(', '),
                _errors: formatedErrors._errors.join(', '),
            }
        };
    }

    const createUserResult = await createUser(result.data);

    if (createUserResult.type === 'right') {
        await sessionServise.addSession(createUserResult.value);
        redirect('/');
    }

    const errors = {
        'user-login-exists' : 'Пользователь с таким ником существует',
    }[createUserResult.error];

    return {
        formData,
        errors: {
            _errors: errors,
        }
    };
}