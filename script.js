// 🎵 배경음악 ON/OFF 토글 함수
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

// 📦 커버 이미지 페이드 인
window.addEventListener('load', () => {
  const coverImage = document.querySelector('.cover-img');
  coverImage.classList.add('visible');
});

// 스크롤 애니메이션 개선
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15  // 15% 정도 보일 때 애니메이션 시작
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      // 한 번 보여진 섹션은 다시 관찰하지 않음
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// 모든 페이드인 섹션에 관찰자 등록
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.fade-in-section');
  sections.forEach(section => {
    observer.observe(section);
  });
});

// 페이지 로드 시 현재 보이는 섹션들 체크
window.addEventListener('load', () => {
  const sections = document.querySelectorAll('.fade-in-section');
  sections.forEach(section => {
    if (isElementInViewport(section)) {
      section.classList.add('show');
    }
  });
});

// 뷰포트 내 요소 체크 함수
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// 계좌번호 관련 함수들
function showAccount(type) {
  if (!accounts[type]) {
    alert("계좌 정보를 아직 불러오는 중입니다.");
    return;
  }

  const account = accounts[type];
  showModal(`
    <div class="modal-title">${account.name}</div>
    <div class="account-info">
      <p>${account.bank} ${account.number}</p>
      <p>예금주: ${account.name}</p>
    </div>
    <button class="copy-button" onclick="copyAccount('${account.number}')">복사하기</button>
    <button class="close-button" onclick="closeModal()">닫기</button>
  `);
}

function showAllAccounts() {
  if (!accounts.groom || !accounts.bride) {
    alert("계좌 정보를 아직 불러오는 중입니다.");
    return;
  }

  showModal(`
    <div class="modal-title">계좌번호 전체보기</div>
    <div class="account-info">
      <p><strong>신랑 측</strong></p>
      <p>${accounts.groom.bank} ${accounts.groom.number}</p>
      <p>예금주: ${accounts.groom.name}</p>
    </div>
    <div class="account-info">
      <p><strong>신부 측</strong></p>
      <p>${accounts.bride.bank} ${accounts.bride.number}</p>
      <p>예금주: ${accounts.bride.name}</p>
    </div>
    <button class="close-button" onclick="closeModal()">닫기</button>
  `);
}

function showModal(content) {
  let modal = document.querySelector('.account-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'account-modal';
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <div class="modal-content">
      ${content}
    </div>
  `;
  
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.querySelector('.account-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function copyAccount(account) {
  navigator.clipboard.writeText(account).then(() => {
    alert('계좌번호가 복사되었습니다.');
  });
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
  const modal = document.querySelector('.account-modal');
  if (modal && e.target === modal) {
    closeModal();
  }
});

// 계좌번호 복사 함수
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('계좌번호가 복사되었습니다.');
  });
}

// 계좌번호 토글 함수
function toggleAccount(accountId) {
  // 모든 계좌정보 닫기
  document.querySelectorAll('.account-info').forEach(info => {
    if (info.id !== accountId) {
      info.style.display = 'none';
    }
  });
  
  // 클릭한 계좌정보 토글
  const accountInfo = document.getElementById(accountId);
  if (accountInfo.style.display === 'none') {
    accountInfo.style.display = 'block';
  } else {
    accountInfo.style.display = 'none';
  }
}

async function loadAccounts() {
  try {
    const res = await fetch('https://32fa98d8-ee0f-42bc-9923-0c292ce1e14e-00-268plipv97gu8.pike.replit.dev/account');
    const data = await res.json();
    accounts = data;
    
    // 이름 정보 업데이트
    document.getElementById('groom-parents').textContent = accounts.groom.parents;
    document.getElementById('groom-name').textContent = accounts.groom.name;
    document.getElementById('bride-parents').textContent = accounts.bride.parents;
    document.getElementById('bride-name').textContent = accounts.bride.name;
    
    console.log('계좌 정보가 성공적으로 로드되었습니다:', accounts);
  } catch (e) {
    console.error("계좌 정보를 불러오지 못했습니다", e);
  }
}

// 페이지 로드 시 계좌 정보 불러오기
document.addEventListener('DOMContentLoaded', () => {
  loadAccounts();
});

// 계좌번호 복사 기능
document.querySelectorAll('.copy-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const accountNumber = button.getAttribute('data-account');
    try {
      await navigator.clipboard.writeText(accountNumber);
      
      // 토스트 메시지 표시
      const toast = document.getElementById('toast-message');
      toast.classList.add('show');
      
      // 3초 후 토스트 메시지 숨김
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    } catch (err) {
      alert('계좌번호 복사에 실패했습니다.');
    }
  });
});

// 아코디언 기능
document.querySelectorAll('.accordion-btn').forEach(button => {
  button.addEventListener('click', () => {
    const content = button.nextElementSibling;
    button.classList.toggle('active');
    
    if (button.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      content.style.maxHeight = 0;
    }
  });
});

// 공유하기 링크 복사 함수
function copyShareLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    // 토스트 메시지 표시
    const toast = document.getElementById('share-toast-message');
    toast.classList.add('show');
    
    // 3초 후 토스트 메시지 숨김
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }).catch(() => {
    alert('링크 복사에 실패했습니다.');
  });
}

