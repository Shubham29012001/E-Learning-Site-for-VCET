import React, { Component } from "react";
import axios from "../../../../ApiServices/axiosUrl";
import Alert from "../../../../Auth/Forms/alert";
import AuthServices from "../../../../ApiServices/auth.service";
import Layout from "../../../Layout/Layout";
import { Redirect } from "react-router-dom";
import CourseTitle from "../../HomePage/CourseTitle";
import { Pie } from "react-chartjs-2";
import "../CSS/Teacher.css";
import Loader from "react-loader-spinner";
import { Chart as chartJS, ArcElement, Tooltip, Legend } from "chart.js";
import GridTable from "@nadavshaar/react-grid-table";

const Username = ({
  tableManager,
  value,
  field,
  data,
  column,
  colIndex,
  rowIndex,
}) => {
  return (
    <div
      className="rgt-cell-inner"
      style={{ display: "flex", alignItems: "center", overflow: "hidden" }}
    >
      <span className="rgt-text-truncate" style={{ marginLeft: 5 }}>
        {value}
      </span>
    </div>
  );
};

const columns = [
  {
    id: 1,
    field: "username",
    label: "Username",
    cellRenderer: Username,
  },
  {
    id: 2,
    field: "email",
    label: "Email",
  },
  {
    id: 3,
    field: "progress",
    label: "Progress ",
  },
];

chartJS.register(ArcElement, Tooltip, Legend);
class TeacherStats extends Component {
  state = {
    ongoingInformation: null,
    completedUsers: null,
    row: [],
  };

  componentDidMount() {
    AuthServices.getCourseStats(this.props.location.aboutProps.Courseid)
      .then((response) => {
        console.log("Course Stats Details", response);
        this.setState({
          ongoingInformation: response.data.data.statsInformation[1],
          completedUsers: response.data.data.statsInformation[0],
        });
        this.setState({ row: response.data.data.tableInformation });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let welcomeMessage = (
      <h3 className="CategoriesTitle CourseStatsTitle">
        {" "}
        {`${this.props.location.aboutProps.Title} Course Stats`}
      </h3>
    );

    const chartstate = {
      labels: ["Completed", "Ongoing"],
      datasets: [
        {
          label: "Course Stats",
          backgroundColor: ["#5018FF", "#171717d8"],
          hoverBackgroundColor: ["#B21F00", "#175000"],
          data: [this.state.ongoingInformation, this.state.completedUsers],
        },
      ],
    };

    let chartdata = (
      <Loader
        type="Puff"
        color="#2D81F7"
        height={50}
        width={50}
        className="TeacherEdit"
      />
    );

    chartdata = (
      <>
        <div>
          <Pie
            data={chartstate}
            options={{
              title: {
                display: true,
                text: "Course Stats",
                fontSize: 20,
              },
              legend: {
                display: true,
                position: "right",
              },
            }}
          />
        </div>
      </>
    );

    return (
      <Layout>
        <div className="container-fluid-main">
          {welcomeMessage}
          <br />
          {chartdata}
          <br />
          <div className="gridTable">
            <GridTable columns={columns} rows={this.state.row} />
          </div>
        </div>
      </Layout>
    );
  }
}

export default TeacherStats;
