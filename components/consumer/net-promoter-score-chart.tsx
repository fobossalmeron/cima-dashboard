"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { NPSVote } from "@/types/NPSVote";
import { Badge } from "@/components/ui/badge";

// Datos de ejemplo para uso cuando no se proporcionan datos
const defaultVotesData: NPSVote[] = [
  { decile: 10, votes: 254 },
  { decile: 9, votes: 187 },
  { decile: 8, votes: 53 },
  { decile: 7, votes: 31 },
  { decile: 6, votes: 22 },
  { decile: 5, votes: 4 },
  { decile: 4, votes: 3 },
  { decile: 3, votes: 1 },
  { decile: 2, votes: 2 },
  { decile: 1, votes: 20 },
  { decile: 0, votes: 16 },
];

// Definimos las props del componente
interface NetPromoterScoreChartProps {
  votesData?: NPSVote[];
}

// Función para determinar el color según la puntuación
const getBarColor = (decile: number): string => {
  if (decile >= 9) {
    return "hsl(142, 76%, 36%)"; // Verde para promotores (9-10)
  } else if (decile >= 7) {
    return "hsl(38, 92%, 50%)"; // Amarillo para pasivos (7-8)
  } else {
    return "hsl(0, 84%, 60%)"; // Rojo para detractores (0-6)
  }
};

// Datos para la leyenda
const legendItems = [
  { value: "Promotores", color: "hsl(142, 76%, 36%)" },
  { value: "Pasivos", color: "hsl(38, 92%, 50%)" },
  { value: "Detractores", color: "hsl(0, 84%, 60%)" },
];

export function NetPromoterScoreChart({
  votesData = defaultVotesData,
}: NetPromoterScoreChartProps) {
  // Calcular el total de votos
  const totalVotes = votesData.reduce((acc, item) => acc + item.votes, 0);

  // Convertir votos a porcentajes para visualización
  const dataWithPercentages = votesData.map((item) => ({
    decile: item.decile,
    votes: item.votes,
    porcentaje:
      totalVotes > 0
        ? parseFloat(((item.votes / totalVotes) * 100).toFixed(1))
        : 0,
  }));

  const promotores = votesData
    .filter((item) => item.decile >= 9)
    .reduce((acc, item) => acc + item.votes, 0);

  const pasivos = votesData
    .filter((item) => item.decile >= 7 && item.decile <= 8)
    .reduce((acc, item) => acc + item.votes, 0);

  const detractores = votesData
    .filter((item) => item.decile <= 6)
    .reduce((acc, item) => acc + item.votes, 0);

  const total = promotores + pasivos + detractores;

  const porcentajePromotores = total > 0 ? (promotores / total) * 100 : 0;
  const porcentajePasivos = total > 0 ? (pasivos / total) * 100 : 0;
  const porcentajeDetractores = total > 0 ? (detractores / total) * 100 : 0;

  // Calcular el NPS real
  const npsReal = porcentajePromotores - porcentajeDetractores;

  return (
    <Card>
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2">
          Net Promoter Score{" "}
          <Badge
            className={`rounded-sm text-white font-medium text-sm ${
              npsReal < 0
                ? "bg-[hsl(0,84%,60%)]"
                : npsReal >= 0 && npsReal < 30
                ? "bg-[hsl(38,92%,50%)]"
                : "bg-[hsl(142,76%,36%)]"
            }`}
          >
            {npsReal.toFixed(0)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dataWithPercentages}
            margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="decile"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => value.toString()}
            />
            <YAxis
              style={{ fontSize: "12px" }}
              domain={[0, "dataMax"]}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const entry = dataWithPercentages.find(
                    (item) => item.decile === label
                  );
                  return (
                    <div className="bg-white p-3 border rounded-lg shadow-sm">
                      <p>Votos: {entry?.votes.toLocaleString()}</p>
                      <p>Porcentaje: {entry?.porcentaje}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="votes" name="Votos">
              {dataWithPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.decile)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center items-center gap-2 mt-4 text-sm">
          <div className="flex items-center">
            <span
              className="inline-block min-w-[14px] w-[14px] h-[14px] rounded-full mr-2"
              style={{ backgroundColor: legendItems[0].color }}
            />
            <span style={{ color: legendItems[0].color }}>
              {`${legendItems[0].value} (${porcentajePromotores.toFixed(0)}%)`}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className="inline-block min-w-[14px] w-[14px] h-[14px] rounded-full mr-2"
              style={{ backgroundColor: legendItems[1].color }}
            />
            <span style={{ color: legendItems[1].color }}>
              {`${legendItems[1].value} (${porcentajePasivos.toFixed(0)}%)`}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className="inline-block min-w-[14px] w-[14px] h-[14px] rounded-full mr-2"
              style={{ backgroundColor: legendItems[2].color }}
            />
            <span style={{ color: legendItems[2].color }}>
              {`${legendItems[2].value} (${porcentajeDetractores.toFixed(0)}%)`}
            </span>
          </div>
        </div>{" "}
      </CardContent>
    </Card>
  );
}
