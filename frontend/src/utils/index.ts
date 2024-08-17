import { DecodedToken } from "@/types";
import { jwtDecode } from "jwt-decode";

export const validateToken = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      return false; // Token is expired
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const GetAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
};

export const format24HourTime = (dateString: string): string => {
  const date = new Date(dateString + "Z");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString + "Z");

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'

  const formattedDate = `${day}/${month}/${year} . ${String(hours).padStart(
    2,
    "0"
  )}:${minutes} ${ampm}`;

  return formattedDate;
};

export const formatchartDate = (dateString: string) => {
  const date = new Date(dateString + "Z");

  // Define month names
  const monthNames = [
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
  ];

  // Get the month and day from the date object
  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}`;
};

export const formatChartData = (data: any[], color: string) => {
  const chartData = {
    labels: [],
    datasets: [
      {
        label: "Conversations",
        data: [],
        borderColor: "#219EBC",
        borderWidth: 2,
        pointRadius: 0,
        lineTension: 0.5,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  const formattedData = JSON.parse(JSON.stringify(chartData));

  data.forEach((obj: any) => {
    const [key, value] = Object.entries(obj)[0];
    if (key.length === 10) {
      formattedData.labels.push(formatchartDate(key));
    } else {
      formattedData.labels.push(formatHour(parseInt(key)));
    }
    formattedData.datasets[0].data.push(value);
  });

  formattedData.datasets[0].borderColor = color;

  return formattedData;
};

export const formatDataForRecharts = (data: { [key: string]: number }[]) => {
  return data.map((entry) => {
    const key = Object.keys(entry)[0];
    const value = entry[key];

    return {
      key: key.length === 10 ? formatchartDate(key) : formatHour(parseInt(key)),
      value,
    };
  });
};

export const formatHour = (hour: number) => {
  if (hour < 0 || hour > 23) {
    throw new Error("Hour must be between 0 and 23");
  }
  const formattedHour = String(hour).padStart(2, "0");
  return `${formattedHour}:00`;
};

export const formatSeconds = (seconds: number) => {
  seconds = Math.floor(seconds);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const formatFileSize = (bytes: number): string => {
  const sizeInKB = bytes / 1024;
  const sizeInMB = sizeInKB / 1024;

  if (sizeInMB >= 1) {
    return `${sizeInMB.toFixed(1)} MB`;
  } else {
    return `${sizeInKB.toFixed(1)} KB`;
  }
};

export const linkifyString = (text: string) => {
  if (!text) return text;

  const urlRegex = /((https?:\/\/)|(www\.))[^\s<]+/gi;

  const replacedText = text.replace(urlRegex, (url) => {
    let href = url;
    // Add http:// if URL doesn't start with http:// or https://
    if (!url.match(/^https?:\/\//i)) {
      href = "http://" + url;
    }
    return `<a class="text-url" href="${href}" target="_blank">${url}</a>`;
  });

  const spanTaggedText = `<span>${replacedText}</span>`;

  return spanTaggedText;
};

export const highlightText = (text: string, search: string) => {
  const regex = new RegExp(search, "gi");
  return text.replace(
    regex,
    (match) => `<span class="text-highlight">${match}</span>`
  );
};

export const toQueryString = (params: Record<string, any>): string => {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
};
