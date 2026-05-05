import { Spinner } from "@/components/Elements";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ChartData } from "../../apis/types/chart-data";


interface Props {
  loading: boolean;
  chartData?: ChartData;
  duration: string;
  setDuration: (v: string) => void;
}
export const RevenueChart = ({ loading, chartData, duration, setDuration }: Props) => {
  const [state, setState] = React.useState({
    series: [{
      name: 'Total Revenue:',
      type: 'column',
      data: [0]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line' as 'line',
      },
      colors: ['#EB9AA8', '#22C55E40'],
      stroke: {
        width: [0, 4]
      },
      title: {
        text: 'Chart data'
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: [''],
      yaxis: [{
        title: {
          text: 'Revenue Amount',
        },
      },]
    },


  });

  useEffect(() => {
    setState(pre => ({
      ...pre,
      series: [{
        name: 'Total Revenue:',
        type: 'area',
        data: chartData?.data || [0]
      }],
      options: {
        ...pre.options,
        labels: chartData?.labels || []
      }
    }));
  }, [loading, chartData])

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <select
          className="form-select w-auto"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="1w">1 Week</option>
          <option value="6m">6 Months</option>
          <option value="1y">1 Year</option>
        </select>
      </div>
      <div id="chart">
        {loading ?
          <div className="flex justify-center items-center">
            <Spinner size="lg" />
          </div>
          :
          <ReactApexChart options={state.options as any} series={state.series as any} type="line" height={350} />
        }
      </div>
      <div id="html-dist"></div>
    </div>
  );
}