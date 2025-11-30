"use client";

import Image from "next/image";
import Link from "next/link";
import "./header.scss";

export default function Header() {

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <Link className="header__logo-link" href="/">
            На главную
          </Link>
        </div>
      </div>
    </header>
  )
}