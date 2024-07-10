import { Navbar } from '@/common/components/Navbar';

export const CoreLayout = ({ children }) => {
  return (
    <div className="h-screen-safe relative flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
