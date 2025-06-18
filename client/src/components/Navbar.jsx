// src/components/Navbar.jsx
export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm w-full py-4 px-8">
      <ul className="flex justify-end gap-6 text-purple-700 font-medium text-lg">
        <li className="hover:text-purple-900 cursor-pointer">Home</li>
        <li className="hover:text-purple-900 cursor-pointer">How to Play</li>
        <li className="hover:text-purple-900 cursor-pointer">Contact</li>
      </ul>
    </nav>
  );
}
