import { Line } from "react-chartjs-2";

export default function MaxTempChart({
  temp_maxChart,
}: {
  temp_maxChart: any;
}) {
  return (
    <Line
      data={temp_maxChart}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Histórico de temperatura máxima",
          },
          legend: { display: false },
        },
      }}
    />
  );
}
