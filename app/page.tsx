"use client";
import { useState } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import SearchBar from "./SearchBar";
import SearchButton from "./SearchButton";
import MaxTempChart from "./MaxTempChart";
import MinTempChart from "./MinTempChart";
import PrecipChart from "./PrecipChart";

import NoSsr from "./NoSsr";

Chart.register(CategoryScale);

/*
  usar a API open-meteo
  https://api.open-meteo.com/v1/forecast?{parametros de busca}
  usar chart.js para renderizar o histórico de clima dos últimos dias
*/

interface info {
  times: string[];
  temp_len: number;
  temp_cur: number;
  temp_max: number[];
  temp_min: number[];
  precipitation_sum: number[];
}

const CenteredBody = styled.body`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;

  background-color: #c4c4c4;

  font-family: "Fira Code Retina";
`;

const SearchDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const ChartDiv = styled.div`
  width: 1000px;
  height: 500px;

  margin-bottom: 40px;
`;

const StyledSelect = styled.select`
  padding: 8px;
  margin: 20px;
  margin-bottom: 50px;
`;

async function MakeRequest(value: string): Promise<info> {
  // Use open weather API to get coordinates from city
  const open_weather_api_key: string = "9aa6ce3812f80c24068cabf559194696";
  const open_weather_url: string = `http://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${open_weather_api_key}`;
  let response;

  const open_weather_res = await fetch(open_weather_url);
  response = await open_weather_res.json();

  let tempe = response.main.temp - 273;

  const lat: number = response.coord.lat;
  const lon: number = response.coord.lon;

  // Use Open Meteo API to get climate infos
  const open_meteo_url: string = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&past_days=2&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=GMT`;

  const open_meteo_res = await fetch(open_meteo_url);
  response = await open_meteo_res.json();

  let infos: info = {
    times: response.daily.time,
    temp_len: response.daily.temperature_2m_max.length,
    temp_cur: tempe,
    temp_max: response.daily.temperature_2m_max,
    temp_min: response.daily.temperature_2m_min,
    precipitation_sum: response.daily.precipitation_sum,
  };

  return infos;
}

export default function Home() {
  const [value, setValue] = useState("");
  const [temp, setTemp] = useState(0);
  const [chart, setChart] = useState("default");
  const [infos, setInfos]: [info, any] = useState({
    times: [],
    temp_len: 0,
    temp_cur: 0,
    temp_max: [],
    temp_min: [],
    precipitation_sum: [],
  });
  const [temp_minChart, setTemp_minChart] = useState({
    labels: infos.times.map((date) => date),
    datasets: [
      {
        label: "Minimum Temperature",
        data: infos.temp_min.map((data) => data),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [temp_maxChart, setTemp_maxChart] = useState({
    labels: infos.times.map((date) => date),
    datasets: [
      {
        label: "Maximum Temperature",
        data: infos.temp_max.map((data) => data),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [precipitation, setPrecipitation] = useState({
    labels: infos.times.map((date) => date),
    datasets: [
      {
        label: "Precipitation Sum",
        data: infos.precipitation_sum.map((data) => data),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  return (
    <NoSsr>
      <CenteredBody>
        <SearchDiv>
          <SearchBar value={value} setValue={setValue} />
          <SearchButton
            value="Search"
            handleClick={async () => {
              let new_infos: info = await MakeRequest(value);
              let t = new_infos.temp_cur;
              setInfos(new_infos);
              setTemp_minChart({
                labels: infos.times.map((date) => date),
                datasets: [
                  {
                    label: "Minimum Temperature",
                    data: new_infos.temp_min.map((data) => data),
                    backgroundColor: [
                      "rgba(75,192,192,1)",
                      "#ecf0f1",
                      "#50AF95",
                      "#f3ba2f",
                      "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                  },
                ],
              });
              setTemp_maxChart({
                labels: infos.times.map((date) => date),
                datasets: [
                  {
                    label: "Maximum Temperature",
                    data: new_infos.temp_max.map((data) => data),
                    backgroundColor: [
                      "rgba(75,192,192,1)",
                      "#ecf0f1",
                      "#50AF95",
                      "#f3ba2f",
                      "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                  },
                ],
              });
              setPrecipitation({
                labels: infos.times.map((date) => date),
                datasets: [
                  {
                    label: "Precipitation Sum",
                    data: new_infos.precipitation_sum.map((data) => data),
                    backgroundColor: [
                      "rgba(75,192,192,1)",
                      "#ecf0f1",
                      "#50AF95",
                      "#f3ba2f",
                      "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                  },
                ],
              });
              setTemp(Math.round(t));
            }}
          />
        </SearchDiv>
        <h1>{temp}°C</h1>
        <StyledSelect
          value={chart}
          onChange={(s) => {
            setChart(s.target.value);
          }}
        >
          <option value="default" disabled defaultChecked>
            Selecione gráfico dos últimos dias
          </option>
          <option value="max_temp">Temperatura máxima</option>
          <option value="min_temp">Temperatura mínima</option>
          <option value="precip">Precipitação</option>
        </StyledSelect>
        {infos.temp_len > 0 && (
          <ChartDiv>
            {chart === "max_temp" && (
              <MaxTempChart temp_maxChart={temp_maxChart} />
            )}
            {chart === "min_temp" && (
              <MinTempChart temp_minChart={temp_minChart} />
            )}
            {chart === "precip" && (
              <PrecipChart precipitation={precipitation} />
            )}
          </ChartDiv>
        )}
      </CenteredBody>
    </NoSsr>
  );
}
