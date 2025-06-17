import './BuyMeCoffee.css'
import { BiCoffee } from "react-icons/bi";

export default function BuyMeCoffee() {
  return (
    <a
      className="buyButton"
      target="_blank"
      href="https://buymeacoffee.com/kyle.kent321"
    >
      <BiCoffee />
      <span className="coffeeButtonText">Buy me a coffee</span>
    </a>
  );
}
