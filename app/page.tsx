import Atmosphere from '../components/Atmosphere';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Background & Animations */}
      <Atmosphere />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center">
         {/* Temporary placeholder to verify the background is rendering */}
         <h1 className="text-black/80 font-serif text-2xl tracking-widest mt-10">
           For You
         </h1>
      </div>
    </main>
  );
}