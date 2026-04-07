import Image from "next/image";

export function LoginPageBrand() {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-border/70 bg-muted/40 shadow-sm">
        <Image
          src="/icon.svg"
          alt="TaskFlow"
          width={40}
          height={40}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      <span className="text-2xl font-bold tracking-tight text-foreground">
        TaskFlow
      </span>
    </div>
  );
}
