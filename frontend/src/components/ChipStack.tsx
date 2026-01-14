interface ChipType {
  value: number;
  color: string;
  stripeColor?: string;
  edgeColor?: string;
}

const CHIP_TYPES: ChipType[] = [
  {
    value: 100,
    color: "#2563eb", // blue
    stripeColor: "#ffffff",
    edgeColor: "#1e40af",
  },
  {
    value: 25,
    color: "#16a34a", // green
    stripeColor: "#ffffff",
    edgeColor: "#166534",
  },
  {
    value: 500,
    color: "#8b5cf6",
    stripeColor: "#ffffff",
    edgeColor: "#5b21b6",
  },
  {
    value: 1000,
    color: "#facc15",
    stripeColor: "#ffffff",
    edgeColor: "#b45309",
  },
  {
    value: 5000,
    color: "#ec4899",
    stripeColor: "#ffffff",
    edgeColor: "#9d174d",
  },
  {
    value: 10000,
    color: "#ef4444", // red
    stripeColor: "#ffffff",
    edgeColor: "#991b1b",
  },
  {
    value: 50000,
    color: "#0f172a", // black
    stripeColor: "#ffffff",
    edgeColor: "#020617",
  },
  {
    value: 100000,
    color: "#fbbf24", // Amber-400 (Extremely bright, glowing gold)
    stripeColor: "#ffffff", // Pure white (provides the sharpest contrast/shine)
    edgeColor: "#92400e", // Rich brown (keeps it looking 3D)
  },
];

interface Props {
  pot: number;
  maxStacksPerRow?: number;
  showAmount?: boolean;
}

const CHIPS_PER_STACK = 5;

const ChipStack = ({ pot, maxStacksPerRow = 8, showAmount = true }: Props) => {
  let remaining = pot;
  const stacks: ChipType[][] = [];

  const sortedChipTypes = [...CHIP_TYPES].sort((a, b) => b.value - a.value);

  for (const chipType of sortedChipTypes) {
    const count = Math.floor(remaining / chipType.value);
    remaining = remaining % chipType.value;

    for (let i = 0; i < count; i += CHIPS_PER_STACK) {
      stacks.push(
        chipTypeArray(chipType, Math.min(CHIPS_PER_STACK, count - i))
      );
    }
  }

  function chipTypeArray(chip: ChipType, length: number): ChipType[] {
    return Array.from({ length }, () => chip);
  }

  const formatChipValue = (value: number) => {
    if (value < 1000) return value.toString();
    return Number.isInteger(value / 1000)
      ? `${value / 1000}k`
      : `${(value / 1000).toFixed(1)}k`;
  };

  const rows: ChipType[][][] = [];
  for (let i = 0; i < stacks.length; i += maxStacksPerRow) {
    rows.push(stacks.slice(i, i + maxStacksPerRow));
  }

  const scale = stacks.length > 8 ? 0.8 : stacks.length > 12 ? 0.6 : 1;

  return (
    <div className="relative flex flex-col items-center">
      {rows.map((rowStacks, rowIndex) => (
        <div key={rowIndex} className="flex space-x-1 mb-1">
          {rowStacks.map((stackChips, stackIndex) => (
            <div
              key={stackIndex}
              className="relative w-[30px] h-[25px]"
              style={{ transform: `scale(${scale})` }}
            >
              {stackChips.map((chip, i) => (
                <div
                  key={i}
                  className="absolute chip-3d rounded-full"
                  style={
                    {
                      bottom: i * 5,
                      transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)`,
                      "--main-color": chip.color,
                      "--stripe-color": chip.stripeColor || "#ffffff",
                      "--edge-dark": chip.edgeColor || "#1e40af",
                    } as React.CSSProperties
                  }
                >
                  <span className="chip-value">
                    {formatChipValue(chip.value)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      {pot > 0 && showAmount && (
        <p className="mb-1 font-bold text-white">{pot}$</p>
      )}
    </div>
  );
};

export default ChipStack;
