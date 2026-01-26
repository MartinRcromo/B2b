import type {Metadata} from 'next';
import { ForgotPasswordForm } from './forgot-password-form';

export const metadata: Metadata = {
    title: 'Recuperar Contraseña',
    description: 'Restablece tu contraseña para recuperar el acceso a tu cuenta.',
};

export default async function ForgotPasswordPage(_props: PageProps<'/forgot-password'>) {
    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
