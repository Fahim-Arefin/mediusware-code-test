import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalComponent from "./DetailsModal";

const AllContacts = () => {
  // State to manage the visibility of modals
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const [searchedData, setSearchedData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);

  const [showAllContactsModal, setShowAllContactsModal] = useState(true);
  const [detailsModal, setDetailsModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const [page, setPage] = useState(1);

  const [totalData, setTotalData] = useState(0);

  const [totalPage, setTotalPage] = useState(0);

  const [onlyEvenContacts, setOnlyEvenContacts] = useState(false);

  const navigate = useNavigate();

  const mountComp = useRef(0);
  const scrollRef = useRef(450);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://contact.mediusware.com/api/contacts/?page=${page}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "X-CSRFToken":
                "wb7n1TfuiJOG1xHKF41NW9G4gBFYtSRKgL7ZbL20IavalozMp9IggCMyFY31sfDS",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const newData = data.results;
          if (page === 1) {
            setData(newData);
            setFilteredData(newData);
            setTotalData(data.count);
            setTotalPage(Math.ceil(data.count / newData.length));
          } else {
            mountComp.current = 1;
            setData((prevData) => [...prevData, ...newData]);
            setFilteredData((prevData) => [...prevData, ...newData]);
          }

          if (onlyEvenContacts) {
            setFilteredData((recentData) => {
              const evenData = recentData.filter((item) => {
                if (parseInt(item.phone[item.phone.length - 1]) % 2 === 0) {
                  return item;
                } else {
                  return;
                }
              });
              return evenData;
            });
          }
        } else {
          // Handle error scenarios, e.g., log or display an error message
          console.error(
            "Error fetching data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    if (onlyEvenContacts) {
      const evenData = data.filter((item) => {
        if (parseInt(item.phone[item.phone.length - 1]) % 2 === 0) {
          return item;
        } else {
          return;
        }
      });
      setFilteredData(evenData);
    } else {
      setFilteredData([...data]);
    }
  }, [onlyEvenContacts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://contact.mediusware.com/api/contacts/?search=${searchTerm}&page_size=${totalData}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "X-CSRFToken":
                "wb7n1TfuiJOG1xHKF41NW9G4gBFYtSRKgL7ZbL20IavalozMp9IggCMyFY31sfDS",
            },
          }
        );
        if (response.ok) {
          const searchedData = await response.json();
          const newData = searchedData.results;
          if (searchTerm.length > 0) {
            setSearchedData(newData);
          } else {
            setSearchedData([]);
          }
        } else {
          // Handle error scenarios, e.g., log or display an error message
          console.error(
            "Error fetching data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm]);

  console.log("DATA", data);
  console.log("Filtered DATA", filteredData);
  console.log("Searched DATA", searchedData);
  console.log(onlyEvenContacts);
  console.log(searchTerm);

  // Scroll listener function
  const handleScroll = (event) => {
    const target = event.target;
    const threshold = 50;
    console.log("--------------------------------------");
    console.log("Scroll height", target.scrollHeight);
    console.log("Scroll Top", target.scrollTop);
    console.log("clientHeight", target.clientHeight);
    console.log("After minus", target.scrollHeight - target.scrollTop);
    console.log("ref", scrollRef.current);
    console.log("--------------------------------------");
    // Check if the user has reached the bottom of the modal
    if (
      target.scrollHeight - target.scrollTop <=
      target.clientHeight + threshold
    ) {
      console.log(`User reached the bottom of the modal.`);
      // Implement additional logic if needed
      console.log("Total Page", totalPage);
      if (page < totalPage) {
        setPage(page + 1);
        scrollRef.current = scrollRef.current + 450;
      }
    }
  };

  const handleShow = () => setDetailsModal(true);
  const handleClose = () => setDetailsModal(false);

  const handleButtonClick = (item) => {
    setModalData(item);
    handleShow();
  };

  return (
    <div className="container">
      {/* All Contacts Modal */}
      <div
        className={`modal fade ${showAllContactsModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{
          display: showAllContactsModal ? "block" : "none",
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">All Contacts</h5>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{
                  width: "160px",
                }}
              >
                <input
                  value={onlyEvenContacts}
                  onChange={() => setOnlyEvenContacts(!onlyEvenContacts)}
                  type="checkbox"
                  name="even"
                  id="even"
                />
                <h6 className="mt-1">Even numbers only</h6>
              </div>
            </div>
            <div className=" modal-header d-flex justify-content-center">
              <input
                className="px-2 rounded-1"
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="search"
              />
            </div>
            <div
              onScroll={handleScroll}
              className="modal-body"
              style={{ height: "350px" }}
            >
              {/* Modal content for All Contacts goes here */}
              {searchTerm.length > 0 ? (
                searchedData.length !== 0 ? (
                  searchedData.map((item, i) => (
                    <ul key={i}>
                      <li
                        style={{ cursor: "pointer" }}
                        onClick={() => handleButtonClick(item)}
                      >
                        {item.phone}
                      </li>
                    </ul>
                  ))
                ) : (
                  <>
                    {loading || <span className="mt-5">No Data Matched !</span>}
                  </>
                )
              ) : (
                filteredData.map((item, i) => (
                  <ul key={i}>
                    <li
                      style={{ cursor: "pointer" }}
                      onClick={() => handleButtonClick(item)}
                    >
                      {item.phone}
                    </li>
                  </ul>
                ))
              )}
              {/* {filteredData.map((item, i) => (
                <ul key={i}>
                  <li>{item.phone}</li>
                </ul>
              ))} */}

              {loading && <p className="my-4">loading...</p>}
            </div>
            <div className="modal-footer">
              {/* Add additional buttons here as needed */}
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#46139f", color: "#ffffff" }}
              >
                All Contacts
              </button>
              <button
                onClick={() => {
                  setShowAllContactsModal(false);
                  navigate("/problem-2/us-contacts");
                }}
                type="button"
                className="btn"
                style={{ backgroundColor: "#ff7f50", color: "#ffffff" }}
              >
                US Contacts
              </button>
              <button
                type="button"
                className="btn rounded-1"
                style={{ border: "1px solid #46139f" }}
                onClick={() => {
                  setShowAllContactsModal(false);
                  navigate("/problem-2");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <ModalComponent
        showModal={detailsModal}
        handleClose={handleClose}
        modalData={modalData}
      />
    </div>
  );
};

export default AllContacts;
