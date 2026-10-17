import SignedHeader from "@/components/SignedHeader";

const SignedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background min-h-screen">
      {/* <Sidebar /> */}
      {/* <div className="pl-56"> */}
        <SignedHeader />
        <main className="min-h-[calc(100vh-3.5rem)] p-6">{children}</main>
      {/* </div> */}
    </div>
  );
};

export default SignedLayout;
