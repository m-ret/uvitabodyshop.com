'use client'

import { useRef, useState } from 'react'
import { business, displayContact } from '@/data/business'

type ServiceSlug =
  | 'enderezado'
  | 'pintura-completa'
  | 'retoques-pintura'
  | 'reparacion-golpes'
  | 'instalacion-accesorios'
  | 'otro'

interface FormState {
  name: string
  phone: string
  email: string
  service: ServiceSlug | ''
  vehicle: string
  description: string
}

type FieldError = Partial<Record<keyof FormState | 'form', string>>

type SubmitStatus = 'idle' | 'submitting' | 'error'

const INITIAL: FormState = {
  name: '',
  phone: '',
  email: '',
  service: '',
  vehicle: '',
  description: '',
}

const SERVICE_OPTIONS: { value: ServiceSlug; label: string }[] = [
  { value: 'enderezado', label: 'Enderezado y colisión' },
  { value: 'pintura-completa', label: 'Pintura completa' },
  { value: 'retoques-pintura', label: 'Retoques de pintura' },
  { value: 'reparacion-golpes', label: 'Reparación de golpes' },
  { value: 'instalacion-accesorios', label: 'Instalación de accesorios' },
  { value: 'otro', label: 'Otro / consulta' },
]

function validate(state: FormState): FieldError {
  const errors: FieldError = {}
  if (state.name.trim().length < 2) {
    errors.name = 'Ingresá tu nombre.'
  } else if (state.name.length > 80) {
    errors.name = 'El nombre es demasiado largo.'
  }
  if (state.phone.replace(/\D/g, '').length < 6) {
    errors.phone = 'Teléfono inválido.'
  }
  if (state.email && !/.+@.+\..+/.test(state.email)) {
    errors.email = 'Correo inválido.'
  }
  if (!state.service) {
    errors.service = 'Elegí un servicio.'
  }
  if (state.description.trim().length < 10) {
    errors.description = 'Contanos un poco más (mínimo 10 caracteres).'
  } else if (state.description.length > 2000) {
    errors.description = 'Descripción demasiado larga.'
  }
  if (state.vehicle && state.vehicle.length > 120) {
    errors.vehicle = 'Vehículo demasiado largo.'
  }
  return errors
}

interface QuoteFormProps {
  /** Optional hook — Unit 11 wires analytics here. */
  onEvent?: (event: string, props?: Record<string, unknown>) => void
}

export default function QuoteForm({ onEvent }: QuoteFormProps = {}) {
  const { whatsapp } = displayContact()
  const [state, setState] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<FieldError>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const serviceRef = useRef<HTMLSelectElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const update =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setState((prev) => ({ ...prev, [key]: e.target.value as FormState[K] }))
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }))
      }
    }

  const focusFirstInvalid = (fieldErrors: FieldError) => {
    if (fieldErrors.name) nameRef.current?.focus()
    else if (fieldErrors.phone) phoneRef.current?.focus()
    else if (fieldErrors.service) serviceRef.current?.focus()
    else if (fieldErrors.description) descriptionRef.current?.focus()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'submitting') return

    const fieldErrors = validate(state)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      focusFirstInvalid(fieldErrors)
      const firstInvalid = Object.keys(fieldErrors)[0]
      onEvent?.('quote_error', { reason: 'validation', field: firstInvalid })
      return
    }

    setErrors({})
    setStatus('submitting')
    onEvent?.('quote_submit', { service: state.service })

    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name.trim(),
          phone: state.phone.trim(),
          email: state.email.trim() || undefined,
          service: state.service,
          vehicle: state.vehicle.trim() || undefined,
          description: state.description.trim(),
          preferredLanguage: 'es',
        }),
      })

      if (res.status === 429) {
        setStatus('error')
        setErrors({
          form: 'Recibimos muchas solicitudes. Probá de nuevo en un momento o escribinos por WhatsApp.',
        })
        onEvent?.('quote_error', { reason: 'rate_limit', status: 429 })
        return
      }

      const data: { ok: boolean; message?: string; contactUrl?: string } =
        await res.json().catch(() => ({ ok: false }))

      if (!res.ok || !data.ok) {
        setStatus('error')
        setErrors({
          form:
            data.message ??
            'No pudimos enviar la solicitud. Probá de nuevo o escribinos por WhatsApp.',
        })
        onEvent?.('quote_error', { reason: 'server', status: res.status })
        return
      }

      if (data.contactUrl) {
        window.location.assign(data.contactUrl)
        return
      }

      setState(INITIAL)
      setStatus('idle')
    } catch {
      setStatus('error')
      setErrors({
        form: 'No pudimos enviar la solicitud. Revisá tu conexión o escribinos por WhatsApp.',
      })
      onEvent?.('quote_error', { reason: 'network' })
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      <Field
        id="quote-name"
        label="Nombre"
        error={errors.name}
        required
      >
        <input
          ref={nameRef}
          type="text"
          id="quote-name"
          name="name"
          autoComplete="name"
          value={state.name}
          onChange={update('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'quote-name-error' : undefined}
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-foreground text-sm placeholder:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus:border-accent transition-colors"
          placeholder="Tu nombre"
          disabled={isSubmitting}
        />
      </Field>

      <Field
        id="quote-phone"
        label="Teléfono / WhatsApp"
        error={errors.phone}
        required
      >
        <input
          ref={phoneRef}
          type="tel"
          id="quote-phone"
          name="phone"
          autoComplete="tel"
          value={state.phone}
          onChange={update('phone')}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'quote-phone-error' : undefined}
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-foreground text-sm placeholder:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus:border-accent transition-colors"
          placeholder="+506 8769 9927"
          disabled={isSubmitting}
        />
      </Field>

      <Field
        id="quote-email"
        label="Correo (opcional)"
        error={errors.email}
      >
        <input
          type="email"
          id="quote-email"
          name="email"
          autoComplete="email"
          value={state.email}
          onChange={update('email')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'quote-email-error' : undefined}
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-foreground text-sm placeholder:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus:border-accent transition-colors"
          placeholder="tucorreo@ejemplo.com"
          disabled={isSubmitting}
        />
      </Field>

      <Field
        id="quote-service"
        label="Servicio"
        error={errors.service}
        required
      >
        <select
          ref={serviceRef}
          id="quote-service"
          name="service"
          value={state.service}
          onChange={update('service')}
          aria-invalid={Boolean(errors.service)}
          aria-describedby={errors.service ? 'quote-service-error' : undefined}
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-foreground text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus:border-accent transition-colors"
          disabled={isSubmitting}
        >
          <option value="">Elegí un servicio</option>
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="quote-vehicle" label="Vehículo (opcional)" error={errors.vehicle}>
        <input
          type="text"
          id="quote-vehicle"
          name="vehicle"
          value={state.vehicle}
          onChange={update('vehicle')}
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-foreground text-sm placeholder:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus:border-accent transition-colors"
          placeholder="Marca, modelo, año"
          disabled={isSubmitting}
        />
      </Field>

      <Field
        id="quote-description"
        label="Descripción del trabajo"
        error={errors.description}
        required
      >
        <textarea
          ref={descriptionRef}
          id="quote-description"
          name="description"
          rows={4}
          value={state.description}
          onChange={update('description')}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? 'quote-description-error' : undefined
          }
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-foreground text-sm placeholder:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus:border-accent transition-colors resize-none"
          placeholder="Contanos qué necesitás arreglar o pintar."
          disabled={isSubmitting}
        />
      </Field>

      {errors.form && (
        <div
          role="alert"
          className="border border-accent/60 bg-accent/10 px-4 py-3 text-sm text-zinc-100"
        >
          <p>{errors.form}</p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-mono text-[11px] tracking-[0.25em] uppercase text-accent hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Escribir directo por WhatsApp →
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-accent text-white text-sm font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando…' : 'Enviar solicitud'}
      </button>

      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600">
        Atendemos en horario {business.hours.display.toLowerCase()}
      </p>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-xs tracking-[0.15em] uppercase text-zinc-500 mb-2"
      >
        {label}
        {required && <span className="text-accent ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 font-mono text-[11px] tracking-[0.1em] uppercase text-accent"
        >
          {error}
        </p>
      )}
    </div>
  )
}
