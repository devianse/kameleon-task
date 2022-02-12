import React, { useEffect, useState } from "react";
import classes from "./Dashboard.module.css";
import vector from "../files/vector.png";
const Dashboard = () => {
  const [data, setData] = useState();
  const [siteData, setSiteData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [input, setInput] = useState("");
  const [sort, setSort] = useState(true);

  const fetchData = async () => {
    const response = await fetch("http://localhost:3100/tests");
    const dataResponse = await response.json();
    setData([...dataResponse]);
    setFilteredData([...dataResponse]);
  };
  const fetchSiteData = async () => {
    const response = await fetch("http://localhost:3100/sites");
    const dataResponse = await response.json();
    setSiteData(dataResponse);
  };

  useEffect(() => {
    fetchData();
    fetchSiteData();
  }, []);

  useEffect(() => {
    if (data && siteData)
      data.map((item) => {
        const url = siteData.find((el) => el.id === item.siteId).url;
        item["siteUrl"] = url
          .replace("https://", "")
          .replace("http://", "")
          .replace("www.", "");
      });
  }, [data, siteData]);

  useEffect(() => {
    if (input) {
      setFilteredData(
        data.filter((item) => item.name.toLowerCase().includes(input))
      );
    } else {
      setFilteredData(data);
    }
  }, [input, data]);

  const changeHandler = (e) => {
    setInput(e.target.value.toLowerCase());
  };

  const sortHandler = (val) => {
    if (sort) {
      setFilteredData(
        filteredData.sort((a, b) => {
          return a[val] > b[val] ? 1 : -1;
        })
      );
      setSort((prevState) => !prevState);
    } else {
      setFilteredData(
        filteredData.sort((a, b) => {
          return a[val] < b[val] ? 1 : -1;
        })
      );
      setSort((prevState) => !prevState);
    }
  };

  const changeStatusHandler = () => {
    const statusArr = ["ONLINE", "PAUSED", "STOPPED", "DRAFT"];
    if (sort) {
      setFilteredData(
        filteredData.sort((a, b) => {
          return statusArr.indexOf(a["status"]) < statusArr.indexOf(b["status"])
            ? 1
            : -1;
        })
      );
      setSort((prevState) => !prevState);
    } else {
      setFilteredData(
        filteredData.sort((a, b) => {
          return statusArr.indexOf(a["status"]) > statusArr.indexOf(b["status"])
            ? 1
            : -1;
        })
      );
      setSort((prevState) => !prevState);
    }
  };

  return (
    <React.Fragment>
      <section className={classes.header}>
        <div>
          <h1>Dashboard</h1>
          <div className={classes.search}>
            <div className={classes.vector}>
              <img src={vector} alt="loop" />
            </div>
            <div className={classes.input}>
              <input
                type="text"
                placeholder="What test are you looking for?"
                onChange={changeHandler}
                value={input}></input>
            </div>
            <div className={classes.test}>
              <p>{filteredData && `${filteredData.length} tests`}</p>
            </div>
          </div>
        </div>
      </section>
      {data &&
        siteData &&
        data.filter((item) => item.name.toLowerCase().includes(input)).length >
          0 && (
          <section>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th onClick={() => sortHandler("name")}>Name</th>
                  <th onClick={() => sortHandler("type")}>Type</th>
                  <th onClick={() => changeStatusHandler()}>Status</th>
                  <th onClick={() => sortHandler("siteUrl")}>Site</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, i) => (
                  <tr key={i} className={classes.item}>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>
                      <p>{item.status}</p>
                    </td>
                    <td>{item.siteUrl}</td>
                    <td>
                      <button>
                        {item.status === "DRAFT" ? "Finalize" : "Results"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      {data &&
        data.filter((item) => item.name.toLowerCase().includes(input))
          .length === 0 &&
        input && (
          <section>
            <h1>Your search Did not match any results</h1>
            <button onClick={() => setInput("")}>Reset</button>
          </section>
        )}
    </React.Fragment>
  );
};

export default Dashboard;
