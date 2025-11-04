import { useCallback, useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const getData = useCallback(async () => {
    try {
      const response = await getMyInfo();
      setData(response);
      console.log(response);
    } catch (error) {
      //API 호출 실패 시 처리
      console.error("내 정보 조회 실패:", error);
      //에러 시 사용자에게 알림 등을 줄 수 있습니다.
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]); //getData를 의존성 배열에 포함

  if (!data) {
    return <div>내 정보를 불러오는 중...</div>;
  }

  //console.log(data.data.name);//렌더링 부분에서만 사용하도록 변경
  return <div>안녕하세요, **{data.data.name}**님!</div>;
};

export default MyPage;
