import { FC,ReactNode } from "react"
import  Head from "next/head"

import { ShieldCheckIcon } from "@heroicons/react/24/outline"

type Title= {
    title: string;
    children: ReactNode;
}


const Layout: FC<Title> = ( { children, title="Todo app"}) => {
    return (
    <div  className="flex min-h-screen flex-col items-center justify-center font-mono text-gray-800">
        <Head>
            <title>{title}</title>
        </Head>
        <header></header>
        <main  className="flex w-screen flex-1 flex-col items-center justify-center">
            {children}
        </main>
        <footer  className="flex h-12 w-full items-center justify-center border-t">
            <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
        </footer>
    </div>
    )
}

export default Layout
