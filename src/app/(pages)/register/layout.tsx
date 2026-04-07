import Header from "@/app/components/header";

export const metadata = {
  title: "sign up",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
