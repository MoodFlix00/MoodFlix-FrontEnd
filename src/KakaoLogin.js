import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KakaoLogin = ({ onLogin }) => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('당신의_카카오_자바스크립트_KEY'); // 실제 키로 교체
    }
  }, []);

  const handleLogin = () => {
    if (!window.Kakao) return;

    window.Kakao.Auth.login({
      scope: 'profile_nickname,account_email',
      success: function (authObj) {
        const kakaoToken = authObj.access_token;

        // 카카오 토큰 → 백엔드에 전달 → JWT 받기
        axios
          .post('http://localhost:8080/auth/kakao', { accessToken: kakaoToken })
          .then((res) => {
            const jwt = res.data.token;
            const user = res.data.user;

            localStorage.setItem('jwt', jwt);
            onLogin(user);
          })
          .catch((err) => {
            console.error('백엔드 오류:', err);
          });
      },
      fail: function (err) {
        console.error('카카오 로그인 실패:', err);
      },
    });
  };

  return (
    <button onClick={handleLogin} style={styles.kakaoButton}>
      <img
        src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
        alt="카카오 로그인"
        style={styles.icon}
      />
      카카오로 로그인
    </button>
  );
};

const styles = {
  kakaoButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FEE500',
    padding: '10px 15px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    margin: '20px auto',
  },
  icon: {
    width: '20px',
  },
};

export default KakaoLogin;