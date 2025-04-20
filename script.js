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

// 꽃잎 애니메이션
function createPetals() {
  const petalCount = 15;
  const colors = ['#ffb6c1', '#ffc0cb', '#ffd1dc', '#ffd8e1'];

  for (let i = 0; i < petalCount; i++) {
    setTimeout(() => {
      const petal = document.createElement('div');
      petal.style.cssText = `
        position: fixed;
        width: ${Math.random() * 15 + 10}px;
        height: ${Math.random() * 15 + 10}px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        opacity: 0.8;
        left: ${Math.random() * window.innerWidth}px;
        top: -20px;
        animation: falling ${Math.random() * 3 + 2}s linear infinite;
        animation-delay: ${Math.random() * 2}s;
      `;
      
      document.body.appendChild(petal);
      
      petal.addEventListener('animationend', () => {
        petal.remove();
      });
    }, i * 200);
  }
}

// 페이지 로드 시 꽃잎 생성 시작
document.addEventListener('DOMContentLoaded', () => {
  createPetals();
  setInterval(createPetals, 5000);
});

const API_URL = 'https://guestbook-api.your-worker.workers.dev/api';





async function loadWeddingMovie() {
  const url = 'https://mxeutdzqttlomveevcgr.supabase.co';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ZXV0ZHpxdHRsb212ZWV2Y2dyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTA4NTYzNSwiZXhwIjoyMDYwNjYxNjM1fQ.o1qHHGqPnwjQBIF0HmM6REKFttcg5w3AVvJxuA9Nji0'; // 네 실제 키 넣기

  const supabase = window.supabase.createClient(url, key);

  const { data, error } = await supabase
    .from('wedding_movie')
    .select('content')
    .eq('id', 1)
    .single();

  if (error || !data?.content) {
    console.error('영상 로딩 실패 ❌:',








// 방명록 관련 전역 변수
let messages = [];
let currentEditId = null;
const ADMIN_PASSWORD = 'admin1234'; // 관리자 비밀번호

// 전역 변수 선언 (하드코딩된 계좌 정보 제거)
let accounts = {};

// 메시지 제출 함수
async function submitMessage() {
  const nameInput = document.getElementById('name');
  const passwordInput = document.getElementById('password');
  const messageInput = document.getElementById('message');

  const newMessage = {
    id: Date.now(),
    name: nameInput.value,
    password: passwordInput.value,
    message: messageInput.value,
    date: new Date().toISOString()
  };

  messages.unshift(newMessage);
  saveMessages();
  renderMessages();
  
  // 입력 필드 초기화
  nameInput.value = '';
  passwordInput.value = '';
  messageInput.value = '';
}

// 메시지 렌더링 함수
function renderMessages() {
  const container = document.getElementById('messages');
  container.innerHTML = messages.slice(0, 3).map(msg => `
    <div class="message-item" data-id="${msg.id}">
      <div class="message-header">
        <span class="message-name">${msg.name}</span>
        <span class="message-date">${formatDate(msg.date)}</span>
      </div>
      <p class="message-content">${msg.message}</p>
      <div class="message-actions">
        <button class="edit-button" onclick="showEditModal(${msg.id})">✏️</button>
        <button class="delete-button" onclick="deleteMessage(${msg.id})">×</button>
      </div>
    </div>
  `).join('');
}

// 수정 모달 표시
function showEditModal(id) {
  const message = messages.find(m => m.id === id);
  if (!message) return;

  const password = prompt('비밀번호를 입력하세요:');
  if (password !== message.password) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  currentEditId = id;
  const modal = document.getElementById('editModal');
  const messageInput = document.getElementById('editMessage');
  messageInput.value = message.message;
  modal.style.display = 'block';
}

// 메시지 수정
function updateMessage() {
  const messageInput = document.getElementById('editMessage');
  const message = messages.find(m => m.id === currentEditId);
  if (!message) return;

  message.message = messageInput.value;
  message.date = new Date().toISOString();
  
  saveMessages();
  renderMessages();
  closeEditModal();
}

// 메시지 삭제
function deleteMessage(id) {
  const password = prompt('관리자 비밀번호를 입력하세요:');
  if (password !== ADMIN_PASSWORD) {
    alert('관리자 비밀번호가 일치하지 않습니다.');
    return;
  }

  messages = messages.filter(m => m.id !== id);
  saveMessages();
  renderMessages();
}

// 수정 모달 닫기
function closeEditModal() {
  const modal = document.getElementById('editModal');
  modal.style.display = 'none';
  currentEditId = null;
}

// 날짜 포맷 함수
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 로컬 스토리지에 메시지 저장
function saveMessages() {
  localStorage.setItem('guestbookMessages', JSON.stringify(messages));
}

// 초기 로드
document.addEventListener('DOMContentLoaded', () => {
  const savedMessages = localStorage.getItem('guestbookMessages');
  if (savedMessages) {
    messages = JSON.parse(savedMessages);
    renderMessages();
  }
});

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
  const modal = document.getElementById('editModal');
  if (event.target === modal) {
    closeEditModal();
  }
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

// 좋아요 카운트 상태 관리
let likeCount = parseInt(localStorage.getItem('likeCount') || '0');
const likeButton = document.querySelector('.like-button');
const likeCountDisplay = document.querySelector('.like-count');

// 초기 카운트 표시
likeCountDisplay.textContent = likeCount;
if (likeCount > 0) {
  likeButton.classList.add('liked');
}

// 하트 버튼 클릭 이벤트
likeButton.addEventListener('click', async () => {
  // 카운트 증가 및 저장
  likeCount++;
  likeCountDisplay.textContent = likeCount;
  localStorage.setItem('likeCount', likeCount.toString());
  likeButton.classList.add('liked');
  
  // 컨페티 효과
  const confettiColors = ['#EC746F', '#ff9a9e', '#fad0c4', '#ffd1ff'];
  const confettiConfig = {
    particleCount: 50,
    spread: 70,
    origin: { y: 0.9 },
    colors: confettiColors,
    ticks: 200,
    shapes: ['circle', 'square'],
    gravity: 1.2,
    scalar: 1.2,
    disableForReducedMotion: true
  };

  // 양쪽에서 터지는 이펙트
  confetti({
    ...confettiConfig,
    angle: 60,
    origin: { x: 0.3, y: 0.9 }
  });
  confetti({
    ...confettiConfig,
    angle: 120,
    origin: { x: 0.7, y: 0.9 }
  });

  // 아이콘 애니메이션 생성
  createFloatingIcons();
});

// 떠다니는 아이콘 생성 함수
function createFloatingIcons() {
  const icons = ['❤️', '💝', '💖', '✨', '💫', '🎉'];
  const container = document.body;
  
  icons.forEach((icon, index) => {
    const element = document.createElement('div');
    element.className = 'floating-icon';
    element.textContent = icon;
    
    // 각 아이콘마다 다른 시작 위치와 애니메이션
    const randomX = 45 + (Math.random() * 10);
    const randomDelay = index * 100;
    
    element.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: ${randomX}%;
      font-size: 1.5rem;
      pointer-events: none;
      z-index: 1000;
      opacity: 0;
      animation: float-up 1.5s ease-out ${randomDelay}ms forwards;
    `;
    
    container.appendChild(element);
    setTimeout(() => element.remove(), 2000);
  });
}

// 떠다니는 아이콘 애니메이션 CSS
const floatingAnimation = document.createElement('style');
floatingAnimation.textContent = `
  @keyframes float-up {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateY(-150px) rotate(${Math.random() * 360}deg);
      opacity: 0;
    }
  }

  .floating-icon {
    transition: all 0.3s ease-out;
  }
`;
document.head.appendChild(floatingAnimation);

// 공유 버튼 클릭 이벤트
document.querySelector('.share-button').addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert('링크가 복사되었습니다!');
  });
});

// 위로가기 버튼 클릭 이벤트
document.querySelector('.top-button').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

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
  // 기존 DOMContentLoaded 이벤트 핸들러 내용...
});

