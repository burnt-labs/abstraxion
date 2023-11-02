# abstraxion

The `abstraxion` library is an account abstraction solution tailored for the XION chain. It offers a clean and streamlined way to create abstract accounts, sign transactions, integrating seamlessly with [graz](https://github.com/graz-sh/graz), to additionally provide traditional cosmos wallet functionalities.

## Installation

_Coming Soon_

## Basic Usage

First, wrap your app in the `AbstraxionProvider` at the top level

```
"use client";
import { AbstraxionProvider } from "abstraxion";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AbstraxionProvider>{children}</AbstraxionProvider>
      </body>
    </html>
  );
}


```

Then, import the `abstraxion` modal in your react/next project and trigger however you'd like, for example:

```
"use client";
import { Abstraxion } from "abstraxion";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Abstraxion onClose={() => setIsOpen(false)} isOpen={isOpen} />
      <button onClick={() => setIsOpen(true)}>Click here</button>
    </div>
  );
}

```

Feel free to consult the documentation for more advanced usage and configuration.

Please check back regularly for updates and feel free to report any issues. Thank you for using `Chrge` by Burnt Labs!
