import Image from "next/image";

export default function Home() {
  return (
    <div>
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-ink">
        <Image
          src="/hero-jewelry.jpg"
          alt="Close-up of layered vintage turquoise, coral, and silver jewelry stacked on two wrists"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          <Image
            src="/logo-white.png"
            alt="Xclusive"
            width={1220}
            height={645}
            priority
            className="h-32 w-auto sm:h-48 lg:h-64"
          />
          <p className="mt-6 font-display text-xl italic text-cream sm:text-2xl">
            Passed on, not put away
          </p>
        </div>
      </section>
    </div>
  );
}
