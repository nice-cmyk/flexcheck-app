import { Link } from 'react-router-dom'

export default function TopNav() {
  return (
    <div className="relative z-10 flex justify-between items-center px-4 sm:px-6 lg:px-14 py-4 lg:py-5 border-b border-white/[0.06] gap-3">
      <Link to="/" className="font-display font-bold text-base lg:text-lg text-white flex-none">
        FlexCheck
      </Link>
      <div className="hidden md:flex gap-8 text-white/50 text-sm">
        <a href="#features">Features</a>
        <a href="#examples">Examples</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="flex gap-2 sm:gap-4 items-center flex-none">
        <Link to="/login" className="text-white/70 text-xs sm:text-sm whitespace-nowrap">
          Log in
        </Link>
        <Link
          to="/signup"
          className="bg-primary rounded-lg text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 