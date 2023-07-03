import { useEffect, useState, useRef, forwardRef } from "react";
import axios from "axios";
import parse from "html-react-parser";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import subTitle1 from "./img/search_title1.png";
import subTitle2 from "./img/search_title2.png";
import btnText1 from "./img/search_btn1.png";
import btnText2 from "./img/searh_btn2.png";

function SchoolInfo() {
  const selectCityRef = useRef(null);
  const selectSchoolRef = useRef(null);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cityNameCode, setCityNameCode] = useState("");
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [schoolNameCode, setSchoolNameCode] = useState("");
  const [schoolNameInput, setSchoolNameInput] = useState("");
  const [searchSchoolBtnClicked, setSearchSchoolBtnClicked] = useState(false);
  const [schoolData, setSchoolData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [numberOfSchools, setNumberOfSchools] = useState(0);
  const [mainData, setMainData] = useState([]);
  const [searchDateString, setSearchDateString] = useState();
  const cityCode = [
    { 서울특별시: "B10" },
    { 부산광역시: "C10" },
    { 대구광역시: "D10" },
    { 인천광역시: "E10" },
    { 광주광역시: "F10" },
    { 대전광역시: "G10" },
    { 울산광역시: "H10" },
    { 세종특별자치시: "I10" },
    { 경기도: "J10" },
    { 강원특별자치도: "K10" },
    { 충청북도: "M10" },
    { 충청남도: "N10" },
    { 전라북도: "P10" },
    { 전라남도: "Q10" },
    { 경상북도: "R10" },
    { 경상남도: "S10" },
    { 제주특별자치도: "T10" },
  ];

  useEffect(() => {
    setSearchDateString(dateToString(startDate));
  }, [startDate]);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleToggleCityDropdown = () => {
    setIsCityOpen(!isCityOpen);
  };

  const handleToggleSchoolDropdown = () => {
    setIsSchoolOpen(!isSchoolOpen);
  };

  const handleOutsideClick = (event) => {
    if (selectCityRef.current && !selectCityRef.current.contains(event.target)) {
      setIsCityOpen(false);
    }
    if (selectSchoolRef.current && !selectSchoolRef.current.contains(event.target)) {
      setIsSchoolOpen(false);
    }
  };

  const handleCitySelect = (cityName, code) => {
    setCityName(cityName);
    setCityNameCode(code);
    setIsCityOpen(false);
  };

  const handleSchoolSelect = (schoolName, schoolcode) => {
    setSchoolName(schoolName);
    setSchoolNameCode(schoolcode);
    setIsSchoolOpen(false);
  };

  const handleInput = (e) => {
    setSchoolNameInput(e.target.value);
  };

  const handleCitySearchButton = () => {
    cityName.length === 0 || schoolNameInput.length === 0
      ? alert("지역 또는 학교명을 입력해주세요.")
      : axios
          .get(
            `https://open.neis.go.kr/hub/schoolInfo?KEY=${process.env.REACT_APP_API_KEY}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${cityNameCode}&SCHUL_NM=${schoolNameInput}`
          )
          .then((response) => {
            const checkIncludeSchoolName = response.data.hasOwnProperty("schoolInfo")
              ? response.data.schoolInfo[1].row.filter((item) => {
                  return item.SCHUL_NM.includes(schoolNameInput);
                })
              : "";
            setNumberOfSchools(checkIncludeSchoolName.length);
            setSchoolData(checkIncludeSchoolName.length === 0 ? [] : checkIncludeSchoolName);
          })
          .catch((error) => {
            console.log(`error : ${error}`);
          });

    cityName !== "" && schoolNameInput.length !== 0 && setSearchSchoolBtnClicked(true);
    // cityName === "" && setSearchSchoolBtnClicked(false);
    // schoolNameInput.length === 0 && setSearchSchoolBtnClicked(false);
  };

  const handleSchoolSearchButton = () => {
    axios
      .get(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${process.env.REACT_APP_API_KEY}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=B10&SD_SCHUL_CODE=${schoolNameCode}&MLSV_YMD=${searchDateString}`
      )
      .then((response) => {
        response.data.hasOwnProperty("mealServiceDietInfo") && setMainData(response.data.mealServiceDietInfo[1].row);
      })
      .catch((error) => {
        console.log(error);
        setMainData("검색 결과가 없습니다.");
      });
  };

  const dateToString = (date) => {
    return date.getFullYear().toString().slice(2, 4) + (date.getMonth() + 1).toString().padStart(2, "0");
  };

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className="w-200 h-60 text-20 rounded-10 border-solid border-[4px] border-gray-600 bg-white"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </button>
  ));

  return (
    <div className="flex flex-col items-center">
      <div className="w-[1280px]">
        <div className="flex flex-col items-center rounded-50 p-120 bg-[#f2f2f2]">
          <h2 className="mb-60">
            <img src={subTitle1} alt="지역과 학교를 검색해주세요" />
          </h2>
          {/* 지역 선택 셀렉트박스 */}
          <div className="flex">
            <div className={`relative custom-select ${isCityOpen ? "open" : ""}`} ref={selectCityRef}>
              <div
                className="flex justify-start items-center w-200 h-60 px-10 py-4 mr-10 bg-white rounded-10 border-solid border-[4px] border-gray-600"
                onClick={handleToggleCityDropdown}
              >
                {cityName || "지역을 선택해주세요."}
              </div>
              {isCityOpen && (
                <ul className="absolute top-[50px] left-0 w-[calc(100%-10px)] h-300 bg-white mt-10 p-30 rounded-10 overflow-y-scroll  border-solid border-[4px] border-gray-[#f2f2f2] z-10">
                  {cityCode.map((item) => {
                    const cityName = Object.keys(item)[0];
                    const cityNameCode = item[cityName];

                    return (
                      <li
                        key={cityNameCode}
                        className="py-8 cursor-pointer hover:text-[#f0541e]"
                        onClick={() => handleCitySelect(cityName, cityNameCode)}
                      >
                        {cityName}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* 학교명 입력 인풋 */}
            <input
              className="w-400 h-60 px-15 py-4 mr-10 rounded-10 border-solid border-[4px] border-gray-600"
              onChange={handleInput}
              placeholder="학교명을 입력해주세요"
            />
            {/* 학교명 검색 버튼 */}
            <button
              className="flex items-center justify-center w-200 h-60 px-20 py-10 bg-[#f0541e] hover:bg-[#f0241e] text-white rounded-10 border-solid border-[4px] border-gray-600"
              onClick={handleCitySearchButton}
            >
              <img src={btnText1} alt="학교 검색" />
            </button>
          </div>
          {/* 학교 검색 결과 */}
          <div className="mt-60 ">
            <div className="flex items-center">
              {/* {searchSchoolBtnClicked && typeof schoolData === "object" && (
                <select
                  className="w-820 h-60 ml-8 rounded-10 border-solid border-[4px] border-gray-600"
                  name="job"
                  onChange={handleSchoolSelect}
                  value={schoolSelected}
                >
                  <option value="">{`학교를 선택해주세요.(${numberOfSchools})`}</option>
                  {schoolData.map((item) => {
                    return <option value={item.SD_SCHUL_CODE}>{item.SCHUL_NM}</option>;
                  })}
                </select>
              )} */}

              {/*  */}
              {searchSchoolBtnClicked && typeof schoolData === "object" && (
                <div className={`relative custom-select ${isSchoolOpen ? "open" : ""}`} ref={selectSchoolRef}>
                  <div
                    className="flex justify-start items-center w-800 h-60 px-10 py-4 mr-10 bg-white rounded-10 border-solid border-[4px] border-gray-600"
                    onClick={handleToggleSchoolDropdown}
                  >
                    {schoolData && !schoolName
                      ? `학교를 선택해주세요.(${numberOfSchools})`
                      : schoolNameCode && schoolName && schoolName}
                  </div>
                  {isSchoolOpen && (
                    <ul className="absolute top-[50px] left-0 w-[calc(100%-10px)] h-300 bg-white mt-10 p-30 rounded-10 overflow-y-scroll border-solid border-[4px] border-gray-[#f2f2f2] z-10">
                      {schoolData.map((item) => {
                        const schoolName = item.SCHUL_NM;
                        const schoolNameCode = item.SD_SCHUL_CODE;

                        return (
                          <li
                            key={schoolNameCode}
                            className="py-8 cursor-pointer hover:text-[#f0541e]"
                            onClick={() => handleSchoolSelect(schoolName, schoolNameCode)}
                          >
                            {schoolName}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
              {/*  */}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-150 p-120 bg-[#f2f2f2] rounded-50">
          <h2 className="mb-60">
            <img src={subTitle2} alt="날짜를 선택해 주세요" />
          </h2>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM"
            customInput={<CustomDateInput />}
          />
        </div>

        {/* 검색 버튼 */}
        <div className="flex justify-center items-center my-100 ">
          <button
            className="flex items-center justify-center w-200 h-60 px-20 py-10 bg-[#f0541e] hover:bg-[#ff341e] text-white rounded-10 border-solid border-[4px] border-gray-600"
            onClick={handleSchoolSearchButton}
          >
            <img src={btnText2} alt="급식 검색하기" />
          </button>
        </div>

        {/* 급식정보 */}
        <div className="flex flex-wrap justify-center">
          {typeof mainData === "object"
            ? mainData.map((item, index) => (
                <div key={index} className="min-w-240 rounded-50 bg-[#f2f2f2] hover:bg-[#eee]  py-30 px-30 mx-10 mb-40">
                  <p className="rounded-60 bg-white px-10 py-5 text-center font-bold mb-15 text-16">
                    {item.MLSV_FROM_YMD}
                  </p>
                  <p className="leading-[1.6] text-14" key={item.id}>
                    {parse(item.DDISH_NM.replace(/\([^)]+\)/g, ""))}
                  </p>
                </div>
              ))
            : typeof mainData === "string" && <p className="mb-200">{`${mainData}`}</p>}
        </div>
      </div>
    </div>
  );
}
export default SchoolInfo;
