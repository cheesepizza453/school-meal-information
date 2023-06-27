import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import parse from "html-react-parser";

function SchoolInfo() {
  const [schoolData, setSchoolData] = useState([]);
  const [areaSelected, setAreaSelected] = useState("");
  const [schoolSelected, setSchoolSelected] = useState("");
  const [schoolNameInput, setSchoolNameInput] = useState("");
  const [mainData, setMainData] = useState([]);
  const [numberOfSchools, setNumberOfSchools] = useState("0");

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
        setNumberOfSchools(response.data.schoolInfo[1].row.length);
        setSchoolData(response.data.schoolInfo[1].row);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSchoolSearchButton = () => {
    axios
      .get(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${process.env.REACT_APP_API_KEY}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=B10&SD_SCHUL_CODE=1&SD_SCHUL_CODE=${schoolSelected}&MLSV_YMD=2306`
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

  return (
    <div>
      <p>지역 및 학교 검색</p>
      <div>
        <select name="job" onChange={handleAreaSelect} value={areaSelected}>
          <option value="">지역을 선택해주세요.</option>
          {schoolCode.map((item) => {
            const cityName = Object.keys(item)[0];
            const code = item[cityName];

            return <option value={code}>{cityName}</option>;
          })}
        </select>
      </div>
      <div>
        <input onChange={handleInput} />
      </div>
      <div>
        <button onClick={handleAreaSearchButton}>학교 검색하기</button>
      </div>
      {/* 학교 검색 */}
      <p>학교 선택</p>
      <div>
        <select name="job" onChange={handleSchoolSelect} value={schoolSelected}>
          <option value="">{`학교를 선택해주세요.(${numberOfSchools})`}</option>
          {schoolData.map((item) => {
            return <option value={item.SD_SCHUL_CODE}>{item.SCHUL_NM}</option>;
          })}
        </select>
      </div>
      {/* 검색 버튼 */}
      <div>
        <button onClick={handleSchoolSearchButton}>급식 검색하기</button>
      </div>

      {/* 급식정보 */}
      {typeof mainData === "object"
        ? mainData.map((item) => <p key={item.id}>{parse(item.DDISH_NM.replace(/\([^)]+\)/g, ""))}</p>)
        : typeof mainData === "string" && <p>{mainData}</p>}
    </div>
  );
}
export default SchoolInfo;
