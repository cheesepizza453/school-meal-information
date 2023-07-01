import { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import subTitle1 from "./img/search_title1.png";
import subTitle2 from "./img/search_title2.png";
import btnText1 from "./img/search_btn1.png";
import btnText2 from "./img/searh_btn2.png";

function SchoolInfo() {
  const [schoolData, setSchoolData] = useState([]);
  const [areaSelected, setAreaSelected] = useState("");
  const [schoolSelected, setSchoolSelected] = useState("");
  const [schoolNameInput, setSchoolNameInput] = useState("");
  const [searchSchoolBtnClicked, setSearchSchoolBtnClicked] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [numberOfSchools, setNumberOfSchools] = useState("0");
  const [startDate, setStartDate] = useState(new Date());
  const [searchDateString, setSearchDateString] = useState();
  const schoolCode = [
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

  const handleAreaSelect = (e) => {
    setAreaSelected(e.target.value);
  };

  const handleSchoolSelect = (e) => {
    setSchoolSelected(e.target.value);
  };

  const handleInput = (e) => {
    setSchoolNameInput(e.target.value);
  };

  const handleAreaSearchButton = (e) => {
    axios
      .get(
        `https://open.neis.go.kr/hub/schoolInfo?KEY=${process.env.REACT_APP_API_KEY}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${areaSelected}&SCHUL_NM=${schoolNameInput}`
      )
      .then((response) => {
        const schoolInfo = response.data.schoolInfo[1].row;
        setNumberOfSchools(schoolInfo.length);
        setSchoolData(schoolInfo);
      })
      .catch((error) => {
        console.log(error);
      });

    schoolNameInput.length > 0 && setSearchSchoolBtnClicked(true);
  };

  const handleSchoolSearchButton = () => {
    axios
      .get(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${process.env.REACT_APP_API_KEY}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=B10&SD_SCHUL_CODE=1&SD_SCHUL_CODE=${schoolSelected}&MLSV_YMD=${searchDateString}`
      )
      .then((response) => {
        response.data.hasOwnProperty("mealServiceDietInfo")
          ? setMainData(response.data.mealServiceDietInfo[1].row)
          : setMainData("검색 결과가 없습니다");
      })
      .catch((error) => {
        console.log(error);
        setMainData("검색 결과가 없습니다.");
      });
  };

  const dateToString = (date) => {
    return date.getFullYear().toString().slice(2, 4) + (date.getMonth() + 1).toString().padStart(2, "0");
  };

  useEffect(() => {
    setSearchDateString(dateToString(startDate));
  }, [startDate]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[1280px]">
        <div className="flex flex-col items-center rounded-50 p-120 bg-[#f2f2f2]">
          <h2 className="mb-60">
            <img src={subTitle1} alt="지역과 학교를 검색해주세요" />
          </h2>
          <div className="flex">
            <select
              className="w-200 h-60 px-10 py-4 mr-10 rounded-10 border-solid border-[4px] border-gray-600"
              name="job"
              onChange={handleAreaSelect}
              value={areaSelected}
            >
              <option>지역을 선택해주세요.</option>
              {schoolCode.map((item) => {
                const cityName = Object.keys(item)[0];
                const code = item[cityName];

                return <option value={code}>{cityName}</option>;
              })}
            </select>
            <input
              className="w-400 h-60 px-15 py-4 mr-10 rounded-10 border-solid border-[4px] border-gray-600"
              onChange={handleInput}
              placeholder="학교명을 입력해주세요"
            />
            <button
              className="flex items-center justify-center w-200 h-60 px-20 py-10 bg-[#f0541e] text-white rounded-10 border-solid border-[4px] border-gray-600"
              onClick={handleAreaSearchButton}
            >
              <img src={btnText1} alt="학교 검색" />
            </button>
          </div>
          {/* 학교 검색 */}
          {searchSchoolBtnClicked && schoolNameInput.length > 0 ? (
            <div className="mt-60 ">
              {numberOfSchools > 0 ? (
                <div className="flex items-center">
                  {/* <p className="w-200 text-20 text-right pr-20">
                    검색결과 <span className="font-bold">{numberOfSchools}</span>
                  </p> */}
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
                </div>
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </div>
          ) : searchSchoolBtnClicked && schoolNameInput.length === 0 ? (
            <p>학교명을 입력해주세요.</p>
          ) : null}
        </div>

        <div className="flex flex-col items-center mt-150 p-120 bg-[#f2f2f2] rounded-50">
          <h2 className="mb-60">
            <img src={subTitle2} alt="날짜를 선택해 주세요" />
          </h2>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy-MM" />
        </div>

        {/* 검색 버튼 */}
        <div className="flex justify-center items-center my-100 ">
          <button
            className="flex items-center justify-center w-200 h-60 px-20 py-10 bg-[#f0541e] text-white rounded-10 border-solid border-[4px] border-gray-600"
            onClick={handleSchoolSearchButton}
          >
            <img src={btnText2} alt="급식 검색하기" />
          </button>
        </div>

        {/* 급식정보 */}
        <div className="flex flex-wrap justify-center">
          {typeof mainData === "object"
            ? mainData.map((item) => (
                <div className="rounded-10 bg-orange-100 py-20 px-20 m-10">
                  <p className="rounded-60 bg-orange-400 px-10 py-5 text-center text-white font-bold mb-15 min-w-200 text-16">
                    {item.MLSV_FROM_YMD}
                  </p>
                  <p className="leading-[1.6] text-14" key={item.id}>
                    {parse(item.DDISH_NM.replace(/\([^)]+\)/g, ""))}
                  </p>
                </div>
              ))
            : typeof mainData === "string" && <p className="mb-200">{mainData}</p>}
        </div>
      </div>
    </div>
  );
}
export default SchoolInfo;
