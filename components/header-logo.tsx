import Image from "next/image";
import Link from "next/link";

import React from "react";

const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="hidden items-center lg:flex">
        <Image height={28} width={28} alt="Logo" src={"/Logo.svg"} />
        <p className="font-semibold text-white text-2xl ml-2.5">Finance</p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
