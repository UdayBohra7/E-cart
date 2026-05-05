import { Button, Spinner } from "@/components/Elements";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

interface Props {
  loading: boolean;
  newUsers: number;
}

export const TotalCustomer = ({ loading, newUsers }: Props) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    series: [0],
    options: {
      chart: {
        height: 350,
        type: "radialBar" as "radialBar",
        offsetY: -10,
      },
      colors: ['#EB9AA8'],
      plotOptions: {
        radialBar: {
          startAngle: -135,

          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: "16px",
              color: undefined,
              offsetY: 120,
            },
            value: {
              offsetY: 76,
              fontSize: "22px",
              color: undefined,
              formatter: function (val: number) {
                return val + "%";
              },
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "#EB9AA8",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 4,
      },
      labels: ["New Users"],
    },
  });

  useEffect(() => {
    if (newUsers) {
      setState(pre => ({
        ...pre,
        series: [Number(newUsers)]
      }))
    }
  }, [loading, newUsers])

  return (
    <div>
      <div id="chart">
        {loading ?
          <div className="flex justify-center items-center">
            <Spinner size="lg" />
          </div>
          :
          <ReactApexChart
            options={state.options as any}
            series={state.series as any}
            type="radialBar"
            height={350}
          />
        }
      </div>
      <div id="html-dist"></div>
      <Button className="w-100" onClick={() => navigate('/admin/users')}>View Details</Button>
    </div>
  );
};
