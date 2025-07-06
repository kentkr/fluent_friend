import { FaChevronDown } from "react-icons/fa";
import { ReactElement, useState} from "react";
import { SelectDropdownProps, SelectObj } from './SelectDropdown.d'
import {languages} from "../../features/journal/lt/lt";
import './SelectDropdown.css'

// TODO: cleanup - i couldn't loop through a map bc no internet
// so figure out a better way to manage language tool values
const SelectDropdown = ({ 
  icon, 
  onSelect,
  currentSelection,
  inputList,
}: 
  SelectDropdownProps
): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  let display = 'Auto'
  if (currentSelection === null) {
    display = 'None'
  } else {
    for (let language of languages) {
      if (language.longCode === currentSelection) {
        display = language.name
        break
      }
    }
  }

  return (
    <div className="the-select-dropdown-div">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="select-dropdown-button"
      >
        {icon}
        <span>{display}</span>
        <FaChevronDown size={10} />
      </button>
      {isOpen && (
        <div className="select-dropdown-div">
          {inputList.map((value: any) => (
            <button
              key={value}
              onClick={() => {
                onSelect(value)
                setIsOpen(false);
              }}
              className="select-dropdown-item"
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectDropdown
