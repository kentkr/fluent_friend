import './BuyMeCoffee.css'
import { BiCoffee } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";

export default function BuyMeCoffee() {
  return (
    <a
      className="buy-button"
      target="_blank"
      href="https://buymeacoffee.com/kyle.kent321"
    >
      <FaHeart className='buy-heart'/>
      <BiCoffee />
    </a>
  );
}
