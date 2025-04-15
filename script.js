// 🎵 배경음악 ON/OFF 토글 함수 + 방명록 저장 기능 포함
let isMuted = true;

function toggleBGM() {
  const audio = document.getElementById('bgm');
  const icon = document.getElementById('bgmIcon');
  isMuted = !isMuted;
  audio.muted = isMuted;
  if (!isMuted) {
    audio.play().catch(() => {
      alert("브라우저에서 음악 자동재생이 차단되었습니다.");
    });
  }
  icon.textContent = isMuted ? "🔇" : "🔊";
}

// ✉️ 방명록 저장 함수
async function saveMessage(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const isPrivate = document.getElementById('private')?.checked || false;

  if (!name || !message) {
    alert("이름과 메시지를 모두 입력해주세요.");
    return;
  }

  const now = new Date();
  const dateString = now.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  const payload = {
    name,
    message,
    private: isPrivate,
    date: dateString
  };

  try {
    const response = await fetch("https://guestbook-api.jawon222.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const li = document.createElement('li');

      if (isPrivate) {
        li.innerHTML = `<strong>${name}</strong>의 비밀글입니다 🔒`;
      } else {
        li.innerHTML = `<strong>${name}</strong> (${dateString}): ${message}`;
      }

      document.getElementById('messages').appendChild(li);
      document.getElementById('name').value = '';
      document.getElementById('message').value = '';
      document.getElementById('private').checked = false;

      alert("축하 메시지가 저장되었어요! 🎉");
    } else {
      alert("메시지 저장에 실패했습니다 😢");
    }
  } catch (err) {
    console.error("전송 중 오류 발생:", err);
    alert("오류가 발생했어요. 인터넷 연결을 확인해주세요.");
  }
}

// 📦 커버 이미지 페이드 인
window.addEventListener('load', () => {
  const coverImage = document.querySelector('.cover-img');
  coverImage.classList.add('visible');
});

// 📦 페이지 섹션 등장 애니메이션
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.1
});

// 모든 .fade-in-section 클래스에 적용
<script>
  window.addEventListener('load', () => {
    // 커버 이미지 페이드 인
    const coverImage = document.querySelector('.cover-img');
    if (coverImage) {
      coverImage.classList.add('visible');
    }

    // 각 섹션 등장 애니메이션
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, {
      threshold: 0.1
    });

    // observer 연결 (로드 후 실행!)
    document.querySelectorAll('.fade-in-section').forEach(section => {
      observer.observe(section);
    });
  });
</script>

