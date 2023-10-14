import { Line } from "react-chartjs-2";

export default function MinTempChart({
  temp_minChart,
}: {
  temp_minChart: any;
}) {
  return (
    <Line
      data={temp_minChart}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Histórico de temperatura mínima",
          },
          legend: { display: false },
        },
      }}
    />
  );
}
