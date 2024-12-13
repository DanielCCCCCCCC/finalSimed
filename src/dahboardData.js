export let mobileappdesignSeries = [80],
  mobileappdesignOptions = {
    chart: {
      height: 50,
      width: 80,
      type: "radialBar",
    },
    colors: ["rgba(var(--primary-rgb))"],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "40%",
          background: "transparent",
          dropShadow: {
            enabled: false,
            top: 0,
            left: 0,
            blur: 3,
            opacity: 0.5,
          },
        },
        track: {
          show: true,
          startAngle: 48,
          endAngle: 360,
          background: "rgba(0,0,0,.2)",
        },
        dataLabels: {
          show: false,
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Status"],
  },
  webappRedesignSeries = [70],
  webappRedesignOptions = {
    chart: {
      height: 50,
      width: 80,
      type: "radialBar",
    },
    colors: ["rgba(var(--primary-rgb))"],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "40%",
          background: "transparent",
          dropShadow: {
            enabled: false,
            top: 0,
            left: 0,
            blur: 3,
            opacity: 0.5,
          },
        },
        track: {
          show: true,
          startAngle: 48,
          endAngle: 360,
          background: "rgba(0,0,0,.2)",
        },
        dataLabels: {
          show: false,
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Status"],
  },
  todayTaskChartOptions = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        offsetX: 0,
        offsetY: 0,
        hollow: {
          size: "60%",
          background: "transparent",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            offsetY: 5,
            fontSize: "16px",
            fontWeight: 600,
          },
        },
      },
    },
    colors: ["rgba(var(--primary-rgb))"],
    legend: {
      show: false,
      floating: true,
      fontSize: "56px",
      position: "left",
      offsetX: 160,
      offsetY: 1,
      labels: {
        useSeriesColors: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  },
  todayTaskSeries = [50],
  projectData = [
    {
      name: "Total Budget",
      data: [20, 38, 38, 72, 55, 63, 43, 76, 55, 80, 40, 80],
    },
    {
      name: "Amount Used",
      data: [85, 65, 75, 38, 85, 35, 62, 40, 40, 64, 50, 89],
    },
  ],
  projectOptions = {
    chart: {
      height: 320,
      type: "line",
      zoom: {
        enabled: false,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.1,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      offsetX: -15,
      fontWeight: "bold",
    },
    stroke: {
      curve: "smooth",
      width: "3",
      dashArray: [0, 5],
    },
    grid: {
      borderColor: "#f2f6f7",
    },
    colors: ["rgba(var(--primary-rgb))", "rgba(var(--primary-rgb),0.3)"],
    yaxis: {
      title: {
        text: "",
        style: {
          color: "#adb5be",
          fontSize: "14px",
          fontFamily: "poppins, sans-serif",
          fontWeight: 600,
          cssClass: "apexcharts-yaxis-label",
        },
      },
    },
    xaxis: {
      type: "month",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
        color: "rgba(119, 119, 142, 0.05)",
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: "rgba(119, 119, 142, 0.05)",
        width: 6,
        offsetX: 0,
        offsetY: 0,
      },
      labels: {
        rotate: -90,
      },
    },
  },
  webDesignType = "bar",
  webDesignData = [
    {
      name: "Total Projects",
      data: [44, 42, 57, 86, 58, 55, 70],
    },
    {
      name: "On Going",
      data: [-34, -22, -37, -56, -21, -35, -60],
    },
  ],
  webDesignOptions = {
    chart: {
      stacked: true,
      type: "bar",
      height: 175,
    },
    grid: {
      show: false,
      borderColor: "#f2f6f7",
    },
    colors: ["#e9e9e9", "rgba(var(--primary-rgb))"],
    plotOptions: {
      bar: {
        columnWidth: "15%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
        colors: {
          ranges: [
            {
              from: -100,
              to: -46,
              color: "rgba(var(--primary-rgb))",
            },
            {
              from: -45,
              to: 0,
              color: "rgba(var(--primary-rgb))",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
      position: "top",
    },
    yaxis: {
      Show: false,
      labels: {
        show: false,
      },
    },
    xaxis: {
      show: false,
      type: "day",
      categories: ["Jan", "Feeeb", "Mar", "Apr", "May", "Jun", "Jul"],
      axisBorder: {
        show: false,
        color: "rgba(119, 119, 142, 0.05)",
        offsetX: 0,
        offsetY: 0,
      },
    },
  };
