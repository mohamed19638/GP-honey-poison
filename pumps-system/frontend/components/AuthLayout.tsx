"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-blue-900 text-white flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-6">Pump State Monitor</h1>

        <p className="text-lg text-center max-w-md">
          Real-time Pump Status & Analytics
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100">
        {children}
      </div>
    </div>
  );
}