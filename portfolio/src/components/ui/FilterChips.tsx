interface FilterOption {
  label: string
  value: string
  count?: number
}

interface FilterChipsProps {
  activeValue: string
  label: string
  onChange: (value: string) => void
  options: FilterOption[]
}

export function FilterChips({ activeValue, label, onChange, options }: FilterChipsProps) {
  return (
    <div aria-label={label} className="filter-list" role="toolbar">
      {options.map((option) => (
        <button
          aria-pressed={activeValue === option.value}
          className={['filter-chip', activeValue === option.value ? 'is-active' : '']
            .filter(Boolean)
            .join(' ')}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          <span>{option.label}</span>
          {typeof option.count === 'number' ? (
            <span aria-hidden="true" className="filter-chip__count">
              {option.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  )
}
