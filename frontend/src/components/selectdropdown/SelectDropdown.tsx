import { FaChevronDown } from "react-icons/fa";
import { ReactElement, useState} from "react";
import { SelectDropdownProps, SelectObj } from './SelectDropdown.d'
import {languages} from "../../features/journal/lt/lt";

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
    <div className="relative p-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="select-button"
      >
        {icon}
        <span>{display}</span>
        <FaChevronDown size={10} />
      </button>
      {isOpen && (
        <div className="dropdown-div">
          {inputList.map((value: any) => (
            <button
              key={value}
              onClick={() => {
                onSelect(value)
                setIsOpen(false);
              }}
              className="dropdown-item"
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
