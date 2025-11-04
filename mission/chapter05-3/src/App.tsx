import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

export default function App() {
  const [user, setUser] = useState<GoogleUser | null>(null);

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      // jwtDecode가 반환하는 타입을 명시적으로 지정
      const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);
      console.log("로그인 성공:", decoded);
      setUser(decoded);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Google 로그인 테스트</h1>

      {!user ? (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log("❌ 로그인 실패")}
        />
      ) : (
        <div>
          <h2>로그인 성공 🎉</h2>
          <img
            src={user.picture}
            alt="profile"
            style={{
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              marginBottom: "10px",
            }}
          />
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <button
            onClick={() => setUser(null)}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#4285F4",
              color: "white",
              cursor: "pointer",
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
