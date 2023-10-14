import { Line } from "react-chartjs-2";

export default function PrecipChart({ precipitation }: { precipitation: any }) {
  return (
    <Line
      data={precipitation}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Histórico de precipitação",
          },
          legend: { display: false },
        },
      }}
    />
  );
}
