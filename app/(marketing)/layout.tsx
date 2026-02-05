import Header from "@/_components/header/header";


const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full bg-neutral-50 text-neutral-800'>
        <Header />
        {children}
    </div>
  )
}

export default layout