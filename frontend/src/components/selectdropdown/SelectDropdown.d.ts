export interface SelectObj {
  value: string | null
  label: string
}

export interface SelectDropdownProps {
  icon: React.ReactNode
  onSelect: (selection: string) => void
  currentSelection: string
  inputList: string[]
}
