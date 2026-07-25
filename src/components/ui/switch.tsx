"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full outline-none transition-all duration-300 ease-in-out",
        "focus-visible:ring-2 focus-visible:ring-green-400/50 focus-visible:ring-offset-2",
        "data-disabled:cursor-not-allowed data-disabled:opacity-40",
        // ON: green with glow + inset shadow
        "data-checked:bg-green-500",
        // OFF: dark gray with inset shadow
        "data-unchecked:bg-slate-500",
        "data-[size=default]:h-8 data-[size=default]:w-[3.75rem] data-[size=default]:p-1",
        "data-[size=sm]:h-6 data-[size=sm]:w-11 data-[size=sm]:p-0.5",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none relative flex items-center justify-center rounded-full transition-transform duration-300 ease-in-out",
          // Thumb: white/light with raised shadow
          "bg-gradient-to-b from-white to-slate-100",
          "shadow-[0_3px_8px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.9)]",
          "group-data-[size=default]/switch:size-6",
          "group-data-[size=sm]/switch:size-5",
          "group-data-[size=default]/switch:data-checked:translate-x-[1.75rem]",
          "group-data-[size=default]/switch:data-unchecked:translate-x-0",
          "group-data-[size=sm]/switch:data-checked:translate-x-5",
          "group-data-[size=sm]/switch:data-unchecked:translate-x-0",
        )}
      >
        {/* Grip lines */}
        <span className="flex gap-[2.5px]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="block w-px rounded-full bg-slate-400/60 group-data-[size=default]/switch:h-3 group-data-[size=sm]/switch:h-2.5"
            />
          ))}
        </span>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
