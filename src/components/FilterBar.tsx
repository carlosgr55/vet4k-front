import { Input, Select } from './ui'

export interface FilterSelect {
  label: string
  value: string
  onChange: (value: string) => void
  /** Options; the "all" entry is added automatically. */
  options: { value: string; label: string }[]
  allLabel?: string
}

interface Props {
  search: string
  onSearch: (value: string) => void
  placeholder?: string
  selects?: FilterSelect[]
  /** Number of results after filtering, shown on the right. */
  count?: number
}

export function FilterBar({ search, onSearch, placeholder = 'Buscar…', selects = [], count }: Props) {
  const hasFilters = search.trim() !== '' || selects.some((s) => s.value !== '')

  function clearAll() {
    onSearch('')
    selects.forEach((s) => s.onChange(''))
  }

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <div className="relative min-w-56 flex-1">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 4 4" strokeLinecap="round" />
        </svg>
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
          aria-label="Buscar"
        />
      </div>

      {selects.map((s) => (
        <label key={s.label} className="flex flex-col gap-1 text-xs font-medium text-brand-500">
          {s.label}
          <Select value={s.value} onChange={(e) => s.onChange(e.target.value)} className="min-w-40">
            <option value="">{s.allLabel ?? 'Todos'}</option>
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </label>
      ))}

      <div className="ml-auto flex items-center gap-3 pb-2">
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Limpiar
          </button>
        )}
        {count != null && (
          <span className="text-sm text-brand-400">
            {count} resultado{count === 1 ? '' : 's'}
          </span>
        )}
      </div>
    </div>
  )
}
