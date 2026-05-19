import React from "react";
import ReactApexChart from "react-apexcharts";

interface SalesReportProps {
    series: {
        name: string;
        data: number[];
    }[];
    categories: string[];
}

export const SalesReport: React.FC<SalesReportProps> = ({ series, categories }) => {
    const options = {
        chart: {
            height: 350,
            type: 'area'
        },
        colors: ['#6366f1', '#818CF8'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: categories
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        },
    };

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="area" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
}
