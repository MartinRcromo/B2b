'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setCustomerForOrder, SetCustomerForOrderResult } from '../actions';

interface ContactStepProps {
  onComplete: () => void;
}

interface ContactFormData {
  emailAddress: string;
  firstName: string;
  lastName: string;
}

function getErrorMessage(error: SetCustomerForOrderResult) {
  if (error.success) return null;

  switch (error.errorCode) {
    case 'EMAIL_CONFLICT':
      return (
        <>
          Ya existe una cuenta con este email.{' '}
          <Link href="/sign-in?redirectTo=/checkout" className="underline hover:no-underline">
            Iniciar sesión
          </Link>{' '}
          para continuar.
        </>
      );
    case 'GUEST_CHECKOUT_DISABLED':
      return 'La compra como invitado no está habilitada. Por favor inicia sesión o crea una cuenta.';
    case 'NO_ACTIVE_ORDER':
      return (
        <>
          Tu carrito está vacío.{' '}
          <Link href="/" className="underline hover:no-underline">
            Seguir comprando
          </Link>
        </>
      );
    default:
      return error.message;
  }
}

export default function ContactStep({ onComplete }: ContactStepProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SetCustomerForOrderResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await setCustomerForOrder(data);

      if (result.success) {
        router.refresh();
        onComplete();
      } else {
        setError(result);
      }
    } catch (err) {
      console.error('Error setting customer:', err);
      setError({ success: false, errorCode: 'UNKNOWN', message: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/sign-in?redirectTo=/checkout" className="text-primary underline hover:no-underline">
          Iniciar sesión
        </Link>
      </p>

      {error && !error.success && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field className="col-span-2">
              <FieldLabel htmlFor="emailAddress">Correo electrónico *</FieldLabel>
              <Input
                id="emailAddress"
                type="email"
                {...register('emailAddress', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
              />
              <FieldError>{errors.emailAddress?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="firstName">Nombre *</FieldLabel>
              <Input
                id="firstName"
                {...register('firstName', { required: 'El nombre es requerido' })}
              />
              <FieldError>{errors.firstName?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName">Apellido *</FieldLabel>
              <Input
                id="lastName"
                {...register('lastName', { required: 'El apellido es requerido' })}
              />
              <FieldError>{errors.lastName?.message}</FieldError>
            </Field>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continuar
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
