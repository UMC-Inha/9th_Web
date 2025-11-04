export type UserSigninInformation = {
  email: string;
  password: string;
};

//공통으로 쓸 이메일 정규식 변수로 빼두기->재사용 편함
const emailRegex =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

function validateUser(values: UserSigninInformation) {
  const errors = {
    email: "",
    password: "",
  };

  if (!emailRegex.test(values.email)) {
    errors.email = "올바른 이메일 형식이 아닙니다";
  }

  //비밀번호 8자 20자 사이
  if (!(values.password.length >= 8 && values.password.length <= 20)) {
    errors.password = "비밀번호는 8~20자 사이로 입력해주세요";
  }

  return errors;
}

//로그인 유효성 검사(기존 로그인에서 쓰는 거니까 그대로 export)
function validateSignin(values: UserSigninInformation) {
  return validateUser(values);
}

//이메일만 검사하는 버전 추가
function validateEmailOnly(values: { email: string }) {
  const errors = {
    email: "",
  };

  if (!emailRegex.test(values.email)) {
    errors.email = "올바른 이메일 형식이 아닙니다";
  }
  return errors;
}
export { validateSignin, validateEmailOnly };
